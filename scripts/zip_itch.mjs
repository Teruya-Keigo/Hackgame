import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { deflateRawSync } from "node:zlib"

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const buildDir = path.join(rootDir, "public_build", "itch")
const zipPath = path.join(rootDir, "public_build", "security-game-itch-v0.1.0.zip")

const crcTable = new Uint32Array(256)
for (let index = 0; index < 256; index += 1) {
  let value = index
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
  }
  crcTable[index] = value >>> 0
}

function crc32(bytes) {
  let crc = 0xffffffff
  for (const byte of bytes) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function dosDateTime(date) {
  const safeDate = date.getFullYear() < 1980 ? new Date("1980-01-01T00:00:00Z") : date
  const time =
    (safeDate.getHours() << 11) |
    (safeDate.getMinutes() << 5) |
    Math.floor(safeDate.getSeconds() / 2)
  const dosDate =
    ((safeDate.getFullYear() - 1980) << 9) |
    ((safeDate.getMonth() + 1) << 5) |
    safeDate.getDate()
  return { time, date: dosDate }
}

async function listFiles(dir, baseDir = dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const filePath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await listFiles(filePath, baseDir)))
      continue
    }
    if (entry.isFile()) {
      files.push({
        absolutePath: filePath,
        zipName: path.relative(baseDir, filePath).split(path.sep).join("/"),
      })
    }
  }
  return files
}

function localFileHeader(entry) {
  const name = Buffer.from(entry.zipName)
  const header = Buffer.alloc(30)
  header.writeUInt32LE(0x04034b50, 0)
  header.writeUInt16LE(20, 4)
  header.writeUInt16LE(0, 6)
  header.writeUInt16LE(8, 8)
  header.writeUInt16LE(entry.dosTime, 10)
  header.writeUInt16LE(entry.dosDate, 12)
  header.writeUInt32LE(entry.crc, 14)
  header.writeUInt32LE(entry.compressed.length, 18)
  header.writeUInt32LE(entry.uncompressed.length, 22)
  header.writeUInt16LE(name.length, 26)
  header.writeUInt16LE(0, 28)
  return Buffer.concat([header, name])
}

function centralDirectoryHeader(entry) {
  const name = Buffer.from(entry.zipName)
  const header = Buffer.alloc(46)
  header.writeUInt32LE(0x02014b50, 0)
  header.writeUInt16LE(20, 4)
  header.writeUInt16LE(20, 6)
  header.writeUInt16LE(0, 8)
  header.writeUInt16LE(8, 10)
  header.writeUInt16LE(entry.dosTime, 12)
  header.writeUInt16LE(entry.dosDate, 14)
  header.writeUInt32LE(entry.crc, 16)
  header.writeUInt32LE(entry.compressed.length, 20)
  header.writeUInt32LE(entry.uncompressed.length, 24)
  header.writeUInt16LE(name.length, 28)
  header.writeUInt16LE(0, 30)
  header.writeUInt16LE(0, 32)
  header.writeUInt16LE(0, 34)
  header.writeUInt16LE(0, 36)
  header.writeUInt32LE(0o100644 * 0x10000, 38)
  header.writeUInt32LE(entry.localOffset, 42)
  return Buffer.concat([header, name])
}

function endOfCentralDirectory(entryCount, centralSize, centralOffset) {
  const header = Buffer.alloc(22)
  header.writeUInt32LE(0x06054b50, 0)
  header.writeUInt16LE(0, 4)
  header.writeUInt16LE(0, 6)
  header.writeUInt16LE(entryCount, 8)
  header.writeUInt16LE(entryCount, 10)
  header.writeUInt32LE(centralSize, 12)
  header.writeUInt32LE(centralOffset, 16)
  header.writeUInt16LE(0, 20)
  return header
}

const files = (await listFiles(buildDir)).sort((left, right) => left.zipName.localeCompare(right.zipName))
if (!files.some((file) => file.zipName === "index.html")) {
  throw new Error("Cannot create itch zip: index.html is missing at build root")
}

const entries = []
let localOffset = 0
for (const file of files) {
  const uncompressed = await readFile(file.absolutePath)
  const fileStat = await stat(file.absolutePath)
  const compressed = deflateRawSync(uncompressed, { level: 9 })
  const { time, date } = dosDateTime(fileStat.mtime)
  const entry = {
    ...file,
    uncompressed,
    compressed,
    crc: crc32(uncompressed),
    dosTime: time,
    dosDate: date,
    localOffset,
  }
  const localHeader = localFileHeader(entry)
  localOffset += localHeader.length + compressed.length
  entries.push(entry)
}

const localParts = entries.flatMap((entry) => [localFileHeader(entry), entry.compressed])
const centralParts = entries.map((entry) => centralDirectoryHeader(entry))
const centralOffset = localParts.reduce((sum, part) => sum + part.length, 0)
const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0)
const eocd = endOfCentralDirectory(entries.length, centralSize, centralOffset)

await mkdir(path.dirname(zipPath), { recursive: true })
await writeFile(zipPath, Buffer.concat([...localParts, ...centralParts, eocd]))

console.log(`zip ${path.relative(rootDir, zipPath)}`)
for (const entry of entries) {
  console.log(`zip-entry ${entry.zipName}`)
}
