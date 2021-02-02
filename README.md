# ToyRobotSimulator
Is a simulation of a toy robot moving on a square tabletop,
of dimensions 5 units x 5 units.

## How to install
To install the required dependencies.
```
npm i
```

## To build the application
Before you can run the application, it first needs to get build, by running the following command, it will build the project. This requires you to install the dependencies first.

```
npm run build
```

## Supported arguments and commands
```
node ./build --help

Usage: build [options]

Options:
  -i, --input <file>  Input file
  -h, --help          display help for command
```

### Simple Usage
```
npm start
```
or
```
node ./build
```

### Load the commands file on start
Given that you current working directory is at the root folder of the project.
```
npm run start:commands
```
or
```
node ./build -i commands.txt
```

