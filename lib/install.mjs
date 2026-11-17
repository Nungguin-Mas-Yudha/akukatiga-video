// Copying the bundled template into a project. Two files are merged rather than overwritten:
// package.json (so an existing project keeps its name and dependencies) and .gitignore (so nothing
// the project already ignores starts showing up).

import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs"
import { join } from "node:path"

const MERGE_JSON = new Set(["package.json"])
const APPEND_LINES = new Set([".gitignore"])
// npm strips a file named .gitignore from the tarball, so the template carries it as "gitignore"
// and the installer writes it back under its real name.
const RENAMED = new Map([["gitignore", ".gitignore"]])

export function isVacant(dir) {
  if (!existsSync(dir)) return true
  return readdirSync(dir).every((name) => name === ".git" || name === ".DS_Store")
}

export function installTemplate({ template, target, force = false }) {
  mkdirSync(target, { recursive: true })
  const handled = []

  for (const name of readdirSync(template)) {
    const destName = RENAMED.get(name) ?? name
    const from = join(template, name)
    const to = join(target, destName)

    if (MERGE_JSON.has(destName) && existsSync(to)) {
      mergePackageJson(from, to)
      handled.push(`${destName} (merged)`)
      continue
    }
    if (APPEND_LINES.has(destName) && existsSync(to)) {
      appendMissingLines(from, to)
      handled.push(`${destName} (appended)`)
      continue
    }
    if (existsSync(to) && !force) {
      throw new Error(`${to} already exists (use --force to overwrite)`)
    }

    cpSync(from, to, { recursive: true, force: true })
    handled.push(destName)
  }

  return handled
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"))
}

function mergePackageJson(from, to) {
  const template = readJson(from)
  const project = readJson(to)

  project.scripts = { ...(template.scripts ?? {}), ...(project.scripts ?? {}) }
  for (const field of ["dependencies", "devDependencies"]) {
    if (template[field] === undefined) continue
    project[field] = { ...template[field], ...(project[field] ?? {}) }
  }
  for (const field of ["type", "engines"]) {
    if (project[field] === undefined) project[field] = template[field]
  }

  writeFileSync(to, `${JSON.stringify(project, null, 2)}\n`)
}

function appendMissingLines(from, to) {
  const existing = new Set(readFileSync(to, "utf8").split("\n"))
  const missing = readFileSync(from, "utf8")
    .split("\n")
    .filter((line) => line.trim() !== "" && !existing.has(line))
  if (missing.length === 0) return

  const current = readFileSync(to, "utf8")
  const separator = current.endsWith("\n") || current === "" ? "" : "\n"
  writeFileSync(to, `${current}${separator}${missing.join("\n")}\n`)
}
