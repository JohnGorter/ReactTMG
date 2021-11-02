# React TypeScript


---
### React TypeScript
TypeScript is a programming language developed by Microsoft

> It is a typed superset of JavaScript, and includes its own compiler

TypeScript can catch errors and bugs at build time, before your app goes live

---
### Usage
To use TypeScript, you need to
- add TypeScript as a dependency to your project
- configure the TypeScript compiler options
- use the right file extensions
- add definitions for libraries you use

Let’s go over these in detail.

---
### Using TypeScript with Create React App
Create React App supports TypeScript out of the box

To create a new project with TypeScript support, run:
```
npx create-react-app my-app --template typescript
```

You can also add it to an existing Create React App project

---
### Adding TypeScript to a Project
It all begins with running one command in your terminal.

If you use Yarn, run
```
yarn add --dev typescript
```
If you use npm, run
```
npm install --save-dev typescript
```

---
### Adding TypeScript to a Project
add tsc to the “scripts” section in our package.json:
```
{
  // ...
  "scripts": {
    "build": "tsc",
    // ...
  },
  // ...
}
```

---
### Configure the TypeScript Compiler
create a tsconfig.json

If you use Yarn, run
```
yarn run tsc --init
```
If you use npm, run
```
npx tsc --init
```

---
### Arrange the source and output dirs

Firstly, let’s arrange our project structure like this. We’ll place all our source code in the src directory
```
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```

Next, we’ll tell the compiler where our source code is and where the output should go.
```
// tsconfig.json
{
  "compilerOptions": {
    // ...
    "rootDir": "src",
    "outDir": "build"
    // ...
  },
}
```

Now when we run our build script the compiler will output the generated javascript to the build folder

---
### Exclude the build dir

Add the build folder to your .gitignore

---
### File extensions
In TypeScript we have 2 file extensions
- .ts is the default file extension 
- .tsx is a special extension used for files which contain JSX

---
### Running TypeScript
Start the transpile
```
yarn build
```
If you use npm, run
```
npm run build
```
If you see no output, it means that it completed successfully!

---
### Type Definitions
To be able to show errors and hints from other packages
- the compiler relies on declaration files

A declaration file provides all the type information about a library

---
### Type Definitions
There are two main ways to get declarations for a library
- bundled 
  - The library bundles its own declaration file
  - to check if a library has bundled types, look for an index.d.ts file in the project
- DefinitelyTyped 
  - a huge repository of declarations for libraries that don’t bundle a declaration file
  
---
### Type Definitions
React doesn’t bundle its own declaration file
- get it from DefinitelyTyped

To do so enter this command
```
yarn add --dev @types/react
```
npm
```
npm i --save-dev @types/react
```

---
### Local Declarations
Sometimes the package that you want to use doesn’t bundle declarations nor is it available on DefinitelyTyped

In that case, we can have a local declaration file
- create a declarations.d.ts file in the root of your source directory

---
### Local Declarations, example
A simple declaration could look like this
```
declare module 'querystring' {
  export function stringify(val: object): string
  export function parse(val: string): object
}
```

You are now ready to code

<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Using TypeScript

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Using TypeScript