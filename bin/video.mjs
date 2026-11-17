#!/usr/bin/env node
// @akukatiga/video — installs the channel toolkit (engine, skills, example folder) into a project,
// and starts a new video from videos/example. Everything it writes comes from ./template, which is
// assembled from this repository at publish time.

import { spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { parseArgs, UsageError } from "../lib/args.mjs"
import { installTemplate, isVacant } from "../lib/install.mjs"
import { createVideo } from "../lib/new-video.mjs"

const HERE = dirname(fileURLToPath(import.meta.url))
const PACKAGE = JSON.parse(readFileSync(join(HERE, "..", "package.json"), "utf8"))
const TEMPLATE = join(HERE, "..", "template")

const HELP = `@akukatiga/video ${PACKAGE.version}

Usage
  npx @akukatiga/video --install [dir]       install the toolkit into dir (default: current folder)
  npx @akukatiga/video --new <slug> [dir]    create videos/<slug> from videos/example
  npx @akukatiga/video --help
  npx @akukatiga/video --version

Flags
  --dir <path>   target project, same as giving it as a positional path
  --no-deps      skip "npm install" after --install
  --force        write into a folder that is not empty

What --install writes
  README.md, .gitignore, package.json, package-lock.json, remotion.config.ts, tsconfig.json,
  vite.config.ts, index.html, src/, engine/, scripts/, .agents/skills/, videos/example/
`

function main() {
  let opts
  try {
    opts = parseArgs(process.argv.slice(2))
  } catch (error) {
    if (error instanceof UsageError) fail(error.message, true)
    throw error
  }

  if (opts.version) {
    console.log(PACKAGE.version)
    return
  }
  if (opts.help || (!opts.install && opts.new === undefined)) {
    console.log(HELP)
    return
  }

  const where = resolve(opts.dir ?? opts.positional[0] ?? process.cwd())

  if (opts.install) {
    if (!isVacant(where) && !opts.force) {
      fail(`${where} is not empty (use --force to write into it)`)
    }
    const written = installTemplate({ template: TEMPLATE, target: where, force: opts.force })
    console.log(`Installed @akukatiga/video ${PACKAGE.version} into ${where}`)
    console.log(`  ${written.join(", ")}`)

    if (opts.deps) {
      console.log("\nInstalling dependencies with npm...")
      const npm = spawnSync("npm", ["install"], { cwd: where, stdio: "inherit", shell: process.platform === "win32" })
      if (npm.status !== 0) fail("npm install failed; run it yourself to see the full output")
    }

    console.log(`\nNext:
  cd ${where}
  npx @akukatiga/video --new my-video
  npm run studio -- my-video`)
    return
  }

  const slug = opts.new
  try {
    const dest = createVideo({ root: where, slug })
    console.log(`Created ${dest}`)
    console.log(`\nNext:
  put the narration in ${join(dest, "plans", "script.txt")}
  npm run studio -- ${slug}`)
  } catch (error) {
    fail(error.message)
  }
}

function fail(message, withHelp = false) {
  console.error(`error: ${message}`)
  if (withHelp) console.error(`\n${HELP}`)
  process.exit(1)
}

main()
