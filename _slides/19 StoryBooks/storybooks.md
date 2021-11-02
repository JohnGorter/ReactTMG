# React StoryBooks

---
### React Storybooks
Motivation:
- multiple projects with the same design system 
- reusable components across multiple projects

a shared component library that can be published and consumed directly by all your projects

Another benefit is that you can develop UI components easily in isolation and render their different states directly

---
### React Storybooks
We need the following steps:
- setup up the project
- install Storybook
- add stories and setting up the file structure
- compile the Library using Rollup
- publish and comsume the library

---
### Setting up the project
Dont use create-react-app, which is better suited for web applications

- create a new folder with whatever name you want 
- run yarn init and git init, respectively
- run yarn add --dev react react-dom @types/react typescript

Since react requires that we need to have a single copy of react-dom, we will be adding it as a peerDependency so that our package always uses the installing client's version. Add the following snippet to your package.json.

```
"devDependencies": {
    "react": "^16.8.0",
    "react-dom": "^16.8.0"
 },
```

---
### Setting up the project
As one last step for setting up the project, let's also add a tsconfig for compiling our TypeScript. Create a file called tsconfig.json in the root and add the following to it.

```
{
    "compilerOptions": {
      "target": "es5",
      "outDir": "lib",
      "lib": [
        "dom",
        "dom.iterable",
        "esnext"
      ],
      "declaration": true,
      "declarationDir": "lib",
      "allowJs": true,
      "skipLibCheck": true,
      "esModuleInterop": true,
      "allowSyntheticDefaultImports": true,
      "strict": true,
      "forceConsistentCasingInFileNames": true,
      "module": "esnext",
      "moduleResolution": "node",
      "resolveJsonModule": true,
      "isolatedModules": true,
      "noEmit": true,
      "jsx": "react"
    },
    "include": [
      "src"
    ],
    "exclude": [
        "node_modules",
        "lib"
    ]
  }
```

---
### Installing Storybook
Now that we have the React boilerplate ready we can now install Storybook, run the following command in the root folder to add Storybook to your project

```
npx sb init
```

This command will install all the core devDependencies, add scripts, setup some configuration files, and create example stories for you to get you up and running with Storybook

---
### Run the StoryBook
You can now run yarn storybook and that should boot up Storybook for you with the examples they created for you

- delete the stories folder


---
### Add stories and setting up the file structure
Now open the .storybook/main.js file. This file controls the behavior of your Storybook server by specifying the configuration for your stories.

Update the stories key in the file to this 
```
"stories": [
    "../src/**/*.stories.tsx"
 ],
```


---
### Adding stories and setting up the file structure
Now that we have the Storybook setup, start creating components and writing stories

But first of all what are stories anyways?

> A story captures the rendered state of a UI component. Developers write multiple stories per component that describe all the “interesting” states a component can support

In short, Stories let you render the different states of your UI component and lets you play with the different states with something called Storybook Controls


---
### Adding stories and setting up the file structure
Let's create a demo component to check out how stories work and how you can make the most out of it.

Our file structure would look something like this 
```
.storybook/
  main.js
	preview.js
.gitignore
package.json
rollup.config.js
tsconfig.json
src/
	components/
	  MyAwesomeComponent/
	    MyAwesomeComponent.tsx
	    MyAwesomeComponent.css
	    MyAwesomeComponent.stories.tsx
		  index.ts
  index.ts
```

We will be using the same button component that Storybook gave us with the demo earlier for demonstrating

---
### Adding stories and setting up the file structure
Create a folder src/components/Button and paste the Button.tsx, button.css, and index.ts files in it.

Lets add some stories
- create src/components/Button/Button.stories.tsx

Now add the following default export to it 
```
import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import Button, { ButtonProps } from "./Button";

export default {
  title: "Components/Button",
  component: Button,
} as Meta;
```

The default export in a story defines the meta information that will be used by Storybook and its addons

---
### Adding stories and setting up the file structure
To define a Story you need to create named exports in the file, so for example we can create a story for the primary button type like this.

```
export const PrimaryButton = () => <Button label="Hello world" primary />;
```

---
### Templates in StoryBook
To simplify writing multiple stories, Storybook provides an option to create stories by defining a master template and reusing that template for each story. 

So in our case, the stories for Primary and Secondary type buttons can be created like this

```
import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { Story } from "@storybook/react";
import { Button, ButtonProps } from "./Button";

export default {
  title: "Components/Button",
  component: Button,
} as Meta;

// Create a master template for mapping args to render the Button component
const Template: Story<ButtonProps> = (args) => <Button {...args} />;

// Reuse that template for creating different stories
export const Primary = Template.bind({});
Primary.args = { label: "Primary 😃", size: "large" };

export const Secondary = Template.bind({});
Secondary.args = { ...Primary.args, primary: false, label: "Secondary 😇" };
```

---
### Adding stories and setting up the file structure
If you haven't already, you can restart the Storybook server by rerunning yarn storybook, and you should see the following.

---
### Initial Story Setup
Notice that Storybook automatically generated the controls, according to the component props, for us. 

- react-docgen-typescript
 - infers the argTypes for a component 

---
### Adding custom controls
Apart from using auto-generated controls, you can also define custom controls for some or all props using the argTypes key

For example, let's define a custom color picker for the backgroundColor prop, replace the default export in the stories file with this 

```
export default {
  title: "Components/Button",
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;
```
---
### Specifying layout
The current story preview also looks a bit weird with the button in one corner of the preview 

As one last step, add the layout: 'centered' key to the .storybook/preview.js file 

This file lets you control how your story is rendered in the Storybook.



---
### Compiling the Library using Rollup
Now that you know how to build components with Storybook, it's time to move to the next step, which is compiling our library so that our end applications can consume it

For this case, lets use Rollup

Rollup is best suited for bundling libraries, whereas webpack is suited for apps


---
### Compiling the Library using Rollup
First, we would need to create an entry file that would export all the components for our component library

- create src/index.ts

since our component library only has one component right now, it would look something like this 
```
import Button from "./components/Button";

export { Button };
```
---
### Compiling the Library using Rollup
Install Rollup

```
yarn add --dev rollup rollup-plugin-typescript2 @rollup/plugin-commonjs @rollup/plugin-node-resolve rollup-plugin-peer-deps-external rollup-plugin-postcss postcss
```

---
### A bit of background in Modules
Now before we add the rollup config, there are a few types of JavaScript modules that you should be aware of 

- CommonJS - This module format is most commonly used with Node using the require function. 
- ESM - This is the modern module format that we normally use in our React applications in which modules are defined using a variety of import and export statements
- UMD - This module format is not as popular these days, it is required when the user requires our module using a script tag

So we would want to support both ESM and CommonJS modules for our component library so that all kinds of support tools can use it in the end application that relies on either of the module types

---
### Configure Rollup

package.json allows adding the entry points for both ESM and CommonJS modules via the module and main key, respectively

Add the following to keys to your package.json 
```
{ 
  ...
  "main": "lib/index.js",
  "module": "lib/index.esm.js",
  "types": "lib/index.d.ts",
  ...
}
```

The types key would point to the static types generated for your library via Rollup, which would help with IntelliSense in code editors like VSCode

---
### Configure Rollup
Its time to add the Rollup config file now

- create a file called rollup.config.js in the root folder and add the following to it

```
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";

const packageJson = require("./package.json");

export default {
  input: "src/index.ts",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true
    },
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
    postcss({
        extensions: ['.css']
    })
  ]
};
```

---
### Rollup plugins used
We are using the following plugins

- rollup-plugin-peer-deps-external 
    - This plugin avoids us from bundling the peerDependencies (react and react-dom in our case) in the final bundle as these will be provided by our consumer application
- @rollup/plugin-node-resolve 
    - This plugin includes the third-party external dependencies into our final bundle (we don't have any dependencies for this tutorial, but you'll definitely need them as your library grows).
- @rollup/plugin-commonjs 
    - This plugin enables the conversion to CJS so that they can be included in the final bundle

---
### Rollup plugins used
- rollup-plugin-typescript2 
    - This plugin compiles the TypeScript code to JavaScript for our final bundle and generates the type declarations for the types key in package.json
- rollup-plugin-postcss    
    - This plugin helps include the CSS that we created as separate files in our final bundle. It does this by generating minified CSS from the *.css files and includes them via the <head> tag wherever used in our components


---
### Rollup setup
Now as one last step let's add the script to build our component library, add the following script to your package.json file 
```
{
 ...
 "scripts": {
    ...
    "build": "rollup -c"
 },
 ...
}
```
run yarn build from your terminal and you should be able to see the lib folder created

---
### Publishing and consuming the library
To publishing the library to NPM 

 
```
run npm publish.
```

Once published, you should be able to import your component from your library in the consumer application just like this 

```
import { Button } from "my-awesome-component-library";
```


---
### Private StoryBooks

Place the library folder in your monorepo and add it to your workspaces array to the package.json in the root folder

```
// package.json
{
  ... 
	"workspaces": [
			...
			"my-awesome-component-library"
	],
	...	
}
```
Then you can directly access it from any other package in your workspace by just adding it as an dependency

```
// my-awesome-frontend/package.json
{
  ... 
	"dependencies": {
			...
			"my-awesome-component-library": 1.0.0,
			...
	},
	...	
}
```
