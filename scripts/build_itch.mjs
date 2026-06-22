import { access, copyFile, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const staticDir = path.join(rootDir, "static")
const buildDir = path.join(rootDir, "public_build", "itch")

const requiredFiles = [
  "index.html",
  "app.js",
  "stage_core.mjs",
  "styles.css",
  "hack_lab.html",
  "hack_lab.js",
  "hack_lab.css",
]

const textExtensions = new Set([".html", ".js", ".mjs", ".css"])

async function assertExists(filePath) {
  try {
    await access(filePath)
  } catch (_error) {
    throw new Error(`Missing required source file: ${path.relative(rootDir, filePath)}`)
  }
}

async function copyDirectory(sourceDir, destinationDir) {
  await mkdir(destinationDir, { recursive: true })
  const entries = await readdir(sourceDir, { withFileTypes: true })
  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name)
    const destinationPath = path.join(destinationDir, entry.name)
    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destinationPath)
      continue
    }
    if (entry.isFile()) {
      await copyFile(sourcePath, destinationPath)
      console.log(`copy ${path.relative(rootDir, sourcePath)} -> ${path.relative(rootDir, destinationPath)}`)
    }
  }
}

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const filePath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await listFiles(filePath)))
    } else if (entry.isFile()) {
      files.push(filePath)
    }
  }
  return files
}

function transformHtml(content, relativePath) {
  const transformations = []
  let next = content.replace(/\/static\/([^"')\s<>]+)/g, (match, assetPath) => {
    const replacement = `./${assetPath}`
    transformations.push(`${relativePath}: ${match} -> ${replacement}`)
    return replacement
  })

  next = next.replace(/href=(["'])\/\1/g, (_match, quote) => {
    const replacement = `href=${quote}./index.html${quote}`
    transformations.push(`${relativePath}: href=${quote}/${quote} -> ${replacement}`)
    return replacement
  })

  return { content: next, transformations }
}

async function transformHtmlFiles() {
  const files = await listFiles(buildDir)
  const htmlFiles = files.filter((filePath) => path.extname(filePath) === ".html")
  for (const htmlFile of htmlFiles) {
    const relativePath = path.relative(buildDir, htmlFile)
    const original = await readFile(htmlFile, "utf8")
    const transformed = transformHtml(original, relativePath)
    if (transformed.content !== original) {
      await writeFile(htmlFile, transformed.content)
    }
    for (const line of transformed.transformations) {
      console.log(`transform ${line}`)
    }
  }
}

async function assertNoStaticReferences() {
  const files = await listFiles(buildDir)
  const offenders = []
  for (const filePath of files) {
    if (!textExtensions.has(path.extname(filePath))) continue
    const content = await readFile(filePath, "utf8")
    if (content.includes("/static/")) {
      offenders.push(path.relative(buildDir, filePath))
    }
  }
  if (offenders.length) {
    throw new Error(`Public build still contains /static/ references: ${offenders.join(", ")}`)
  }
}

async function assertRequiredBuildFiles() {
  for (const fileName of requiredFiles) {
    const filePath = path.join(buildDir, fileName)
    const fileStat = await stat(filePath).catch(() => null)
    if (!fileStat?.isFile()) {
      throw new Error(`Missing required build file: ${path.relative(rootDir, filePath)}`)
    }
  }
}

for (const fileName of requiredFiles) {
  await assertExists(path.join(staticDir, fileName))
}

await rm(buildDir, { recursive: true, force: true })
await mkdir(buildDir, { recursive: true })
await copyDirectory(staticDir, buildDir)
await transformHtmlFiles()
await assertRequiredBuildFiles()
await assertNoStaticReferences()

console.log(`itch build ready: ${path.relative(rootDir, buildDir)}`)
