#!usr/bin/env node

'use strict'

let path = require('path');
let fs = require('fs');
let util = require('util')
// let getStdin = require('get-stdin')
let Transform = require('stream').Transform;
let zlib = require('zlib');

let args = require('minimist')(process.argv.slice(2), {
  boolean: ['help', 'in', 'out', 'compress', 'uncompress'],
  string: ['file']
})

let BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname);
let OUTFILE = path.join(BASE_PATH, 'out.txt')

if(args.help) {
  printHelp();
} else if(args.in || args._.includes('-')) {
  processFile(process.stdin)  // Now processFile is handling a stream i.e, process.stdin
}
else if (args.file) {
  let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
  processFile(stream);
} else {
  error('Error', true)
}

function processFile(inStream) {
  let outStream = inStream;

  if(args.uncompress) {
    let gunzipStream = zlib.createGunzip();
    outStream = outStream.pipe(gunzipStream);
  }

  let upperStream = new Transform({
    transform(chunk, enc, cb) { // enc - encoding
      this.push(chunk.toString().toUpperCase()) // chunk is in binary format.
      cb(); // cb or next function to move on when our transformation is done.
    }
  })

  outStream = outStream.pipe(upperStream);

  if(args.compress) {
    let gzipStream = zlib.createGzip();
    outStream = outStream.pipe(gzipStream);
    OUTFILE = `${OUTFILE}.gz`
  }

  let targetStream;
  if(args.out) {
    targetStream = process.stdout
  } else {
    targetStream = fs.createWriteStream(OUTFILE)
  }
  outStream.pipe(targetStream);
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
  console.log("ex2 usage:");
  console.log("   ex2.js --file={FILENAME}");
  console.log("");
  console.log("--help                 print this help");
  console.log("--file={FILENAME}      process the file");
  console.log("--in, -                process stdin");
  console.log("--out                  print to stdout");
  console.log("--compress             gzip the output");
  console.log("--uncompress           un-gzip the input");
  console.log("");
}


/*
    node ex2.js --file=lorem.txt --out --compress
    node ex2.js --file=lorem.txt --compress

    node ex2.js --file=out.txt.gz --uncompress --out
    node ex2.js --file=out.txt.gz --uncompress
*/