# Middle Emitter

Event Emitter + Middleware for node js.

## Installation

Using yarn: 

```
yarn add middlemitter
``` 
Using npm:

```
npm install middlemitter
```

##  Usage

```
import { MiddlEmitter } from './../build';

const emitter = new MiddlEmitter();
```

```
// add listener on test event
emitter.on('test', (a,b,c) => {
  console.log('>>', a, b, c);
});

// add listener on test event with priority 10
emitter.on('test', (a,b,c) => {
  console.log('>>', a, b, c);
}, 10);



```