#!/usr/bin/env node

var fs  = require('fs'),
    dot = require('dot'),
    cmd = require('commander'),
    templates = {},
    dirRe;

cmd.version('0.0.1')
  .usage('dot-module')
  .option('-d, --dir [value]', 'Templates directory <path>', "./")
  .option('-o, --output [value]', 'Output file <path>', "templates.js")
  .option('-g, --global [value]', 'variable to hold the compiled script', "window.JST")
  .parse(process.argv);

if (!cmd.dir){
  console.log("The templates directory dir is required. -h for help");
}
else {
  dirRe = new RegExp('^' + cmd.dir);

  walk(cmd.dir);
  fs.writeFile(cmd.output, buildModule(templates));
}



function walk(dir) {
  var files;

  files = fs.readdirSync(dir);
  files.forEach(function (filename) {
    var stats = fs.statSync(dir + filename);

    if (stats.isDirectory()) {
      filename = dir + filename + '/';
      walk(filename);
    }

    if (!isJST(filename))
      return;

    readFile(filename, dir, fs.readFileSync(dir + filename));
  });
}

function readFile (filename, dir, data) {
  var name = filename.split('.').slice(0, -1).join('.'),
      compiled = dot.template(data).toString().replace(/^function anonymous/, 'function ');

  name = dir.replace(dirRe, '') + name;
  templates[name] = compiled;
}

function isJST(name) {
  if (!~name.indexOf('.'))
    return false;

  return name.split('.').slice(-1)[0].toLowerCase() === 'jst';
}

function buildModule() {
  var content = [],
      str, n;

  for (n in templates)
    content.push('"' + n + '": ' + templates[n]);

  return cmd.global + ' = {' +
    content.join(',') +
  '};';
}
