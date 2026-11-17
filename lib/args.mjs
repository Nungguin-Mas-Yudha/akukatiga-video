// Argument parsing for the @akukatiga/video CLI. No dependencies: npx should start in one step.

export class UsageError extends Error {}

export function parseArgs(argv) {
  const opts = {
    install: false,
    new: undefined,
    dir: undefined,
    force: false,
    deps: true,
    help: false,
    version: false,
    positional: [],
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    const take = (name) => {
      const value = argv[i + 1]
      if (value === undefined || value.startsWith("-")) throw new UsageError(`${name} needs a value`)
      i += 1
      return value
    }

    if (arg === "--install") opts.install = true
    else if (arg === "--new") opts.new = take("--new")
    else if (arg === "--dir") opts.dir = take("--dir")
    else if (arg === "--force" || arg === "-f") opts.force = true
    else if (arg === "--no-deps") opts.deps = false
    else if (arg === "--help" || arg === "-h") opts.help = true
    else if (arg === "--version" || arg === "-v") opts.version = true
    else if (arg.startsWith("-")) throw new UsageError(`unknown flag: ${arg}`)
    else opts.positional.push(arg)
  }

  return opts
}
