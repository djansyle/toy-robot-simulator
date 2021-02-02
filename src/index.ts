/* eslint-disable no-console */
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import readlineSync from 'readline-sync';
import CommandProcessor from './classes/command-processor';
import OperationError from './classes/operation-error';

const program = new Command();
program.option('-i, --input <file>', 'Input file');
program.parse(process.argv);

const inputFile = program.opts().input;
const commandProcessor = new CommandProcessor();
commandProcessor.on('data', (message) => console.log('Output:', message));

function tryProcess(line: string) {
  try {
    commandProcessor.process(line);
  } catch (e) {
    if (e instanceof OperationError) {
      return;
    }

    throw e;
  }
}

if (inputFile) {
  const lines = fs
    .readFileSync(path.join(process.cwd(), inputFile))
    .toString()
    .split('\n')
    .map((line) => line.trim());

  lines.forEach((line) => {
    console.log(line);
    tryProcess(line);
  });
}

// eslint-disable-next-line no-constant-condition
while (true) {
  const line = readlineSync.question('');
  tryProcess(line.trim());
}
