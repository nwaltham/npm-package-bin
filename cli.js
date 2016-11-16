#!/usr/bin/env node

/* jshint node:true */
/* jshint esversion:6 */
/* eslint no-mixed-spaces-and-tabs: ["error", "smart-tabs"] */

'use strict';

var fs = require('fs');
const woofwoof = require('woofwoof');
const promise = require('bluebird');
promise.promisifyAll(require('fs'));

const cli = woofwoof(`
    Usage
      $ foo <add|rm|ls> command [script]
 
    Options
      --input, -i package file to read (default, package.json)
      --output, -o  newfile to write (default, package.json.new)
 
`, {
	alias: {
		o: 'output',
		i: 'input'
	},
	default: {
		output: 'package.json.new',
		input: 'package.json'
	}
});

function normalize(data) {
	var bin = data.bin || {};
	var newcmd = data.name;
	if (typeof bin === 'string' || bin instanceof String) {
		var v = bin;
		bin = {};
		bin[newcmd] = v;
	}
	return bin;
}

function npmBinAdd(data) {
	var bin = normalize(data);
	var newfile = cli.input[2] || data.main;
	var newcmd = cli.input[1] || data.name;

	return fs.accessAsync(newfile, fs.F_OK).then(() => {
		bin[newcmd] = newfile;
		data.bin = bin;
		return data;
	});
}

function isEmptyObject(obj) {
	return !Object.keys(obj).length;
}

function npmBinRm(data) {
	var bin = normalize(data);
	var newcmd = cli.input[1] || data.name;
	delete bin[newcmd];
	if (isEmptyObject(bin)) {
		delete data.bin;
	} else {
		data.bin = bin;
	}

	return data;
}

function npmBinLs(data) {
	var o = normalize(data);
	Object.keys(o).forEach(function (key) {
		var val = o[key];
		console.log(' ' + key + ' : ' + val);
	});
	process.exit(0);
}

function npmBin(data) {
	switch (cli.input[0]) {
		case 'add':
			return npmBinAdd(data);
		case 'rm':
			return npmBinRm(data);
		case 'ls':
			return npmBinLs(data);
		default:
			return promise.reject('use --help for information on how to use this tool');
	}
}

function prettyPrint(data) {
	return JSON.stringify(data, null, 4);
}

function savePackage(data) {
	return fs.writeFileAsync(cli.flags.output, data);
}

fs.readFileAsync(cli.flags.input).then(JSON.parse).then(npmBin).then(prettyPrint).then(savePackage).catch(console.log);
