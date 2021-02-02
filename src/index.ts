import { Command } from 'commander';

const program = new Command();

program.option('-i, --input <file>', 'Input file');

program.parse(process.argv);

if (program.opts().input) {
  console.log(program.opts());
}
