#!usr/bin/env node

'use strict'

// console.log(process.argv);
// console.log(process.argv.slice(2));

let path = require('path');
let fs = require('fs');
let util = require('util')
let getStdin = require('get-stdin')

// Use minimist to read and have more control over arguments. It returns object which contains arguments.
let args = require('minimist')(process.argv.slice(2), { // This 2nd argument lets have more control over guesses that minimist make.
  boolean: ['help', 'in'],  // help will be always treated as boolean, whether you pass something or not
  string: ['file']    // file will be treated as string
})
// console.log(args)
// { _: [ '2nd arg' ], help: false, hello: 'first arg' } If there is anything minimist cannot figure out, it's inside _

let BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname);

if(args.help) {
  printHelp();
} else if(args.in || args._.includes('-')) {
  getStdin().then(processFile).catch(error);
}
else if (args.file) {
  fs.readFile(path.join(BASE_PATH, args.file), function onContents(err, contents) {
    if(err) {
      error(err.toString())
    } else {
     processFile(contents.toString())
    }
  })
} else {
  error('Error', true)
}

function processFile(contents) {
  contents = contens.toUpperCase();
  process.stdout.write(contents);
}

function error(msg, includeHelp=false) {
  console.log(msg);
  if(includeHelp) {
    console.log("");
    printHelp();
  }
}

// ***************
function printHelp() {
  console.log("ex1 usage:");
  console.log("   ex1.js --file={FILENAME}");
  console.log("");
  console.log("--help                 print this help");
  console.log("--file={FILENAME}      process the file");
  console.log("--in, -                process stdin")
  console.log("");
}