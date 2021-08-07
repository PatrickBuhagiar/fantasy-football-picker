import program from 'commander-plus'


program
    .option('-d --default', 'default run', true)
    .parse(process.argv)

const isDefault = program.default

if (isDefault) {
  console.log("default")
} else {
  console.log("not default")
}
