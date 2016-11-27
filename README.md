# npm-package-bin
Manipulated 'bin' section of package.json which npm uses for cli scripts

So much about the configuration of a node js application is stored in npm's package.json file found in every project. There is quite reasonable support for managing the dependencies record in the package.json, and some of the author information can be configured using `npm init` or if you are an npm ninja, you can even configure appropriate defaults for some elements in the package.json. However other parts of package.json are neglected by the npm tool set, one of which is the section for command line tools. 

I write command line tools sufficiently often, that I really wanted a tool which I could call from the command line or a bath file to help configure my project for command line tools. In the package.json file you can specify one or many commands which will be included in the path when you use npm link as a developer or npm install -g when installing from the main npm repository. These are handled by the bin element (link here to package.json documentation)

The purpose of this tool is to add, list and remove items from the bin section of the package.json file. 

# Installation

          npm install -g npm-package-bin

# Usage

Change to the directory where you have your project package.json first. 

## Add a command to the package.json file

        npm-bin add foo foobar.js -o package.json

This will add command foo to the package.json file, which should call the scripts foobar when run. 

* The script should have the magic *sha-bang* comment at the top of the script.

        #!/usr/bin/env node
* If you don't specify a script, then npm-bin will use the script specified in the "main" element of the package.json file
* If you don't specify the command it will use the project name from the "name" element of package.json
* You won't see any changes to what's available on the command line until you either reinstall the package globally or use *npm link* 
* If you have not saved your defaults and you don't specify and output directory, then the updates file will be saved to package.json.new
* You may add more than one command definition.

## Remove a command from the package.json file

        npm-bin rm foo -o package.json

This will remove command foo's definition from the package.json file. 

* If you don't specify a script, then npm-bin will use the script specified in the "main" element of the package.json file
* You won't see any changes to what's available on the command line until you either reinstall the package globally or use *npm link* 
* If you have not saved your defaults and you don't specify and output directory, then the updates file will be saved to package.json.new

## Review commands available for this package

        npm-bin ls  
    
list all the available commands

### Setting defaults

This tool allows you to save your defaults in you local users directory. For example

    npm-bin -o package.json --save-settings

will save the default output file as package.json (it's package.json.new when you first install the application)

### Getting help

        npm-bin --help

should return the tool's built in help

        CLI tool to edit bin section of npm package.json

        Usage
            $ foo <add|rm|ls> command [script]

        Options
            --input, -i package file to read (default, package.json)
            --output, -o  newfile to write (default, package.json.new)

### Finding the version you have installed

    npm-bin --version

will return the tool's current version

        0.0.6
 
