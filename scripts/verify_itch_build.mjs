import { access, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
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

async function assertFile(relativePath) {
  const filePath = path.join(buildDir, relativePath)
  try {
    await access(filePath)
  } catch (_error) {
    throw new Error(`Missing required build file: ${path.relative(rootDir, filePath)}`)
  }
  console.log(`ok ${path.relative(rootDir, filePath)}`)
}

function assertNotContains(content, needle, label) {
  if (content.includes(needle)) {
    throw new Error(`${label} still contains ${needle}`)
  }
  console.log(`ok ${label} does not contain ${needle}`)
}

for (const fileName of requiredFiles) {
  await assertFile(fileName)
}

const indexHtml = await readFile(path.join(buildDir, "index.html"), "utf8")
const hackLabHtml = await readFile(path.join(buildDir, "hack_lab.html"), "utf8")

assertNotContains(indexHtml, "/static/", "public_build/itch/index.html")
assertNotContains(hackLabHtml, "/static/", "public_build/itch/hack_lab.html")
assertNotContains(hackLabHtml, 'href="/"', "public_build/itch/hack_lab.html")

console.log("itch build verification passed")
