<p align="center">
  <img alt="react" src="./images/react-icon.png" width="300">
</p>
<p align="center">
  <h1 align="center">Reconnect.js</h1>
  <h2 align="center">The library for helping you to share states between <b>sibling</b> or <b>nested</b> React Components</h2>
</p>

[![npm version](https://img.shields.io/npm/v/reconnect.js.svg?style=flat)](https://www.npmjs.com/package/reconnect.js)

## Install

`npm i reconnect.js`

## Example

```javascript
import React from 'react';
import {useOutlet, useOutletSetter, useOutletDeclaration} from 'reconnect.js';

function App() {
  useOutletDeclaration('add', 0); // <-- declare a new outlet with initial value. No Context. No Provider.

  return (
    <div style={{padding: 10}}>
      <Value />
      <div>
        <Add />
        <Sub />
        <Reset />
      </div>
    </div>
  );
}

function Add() {
  const [value, setValue] = useOutlet('add'); // <-- use your outlet just like "useState"!
  return <button onClick={() => setValue(value + 1)}>+1</button>;
}

function Sub() {
  const [_, setValue] = useOutlet('add');
  return (
    <button
      onClick={() => {
        setValue((value) => value - 1); // <-- also support callback-style setter
      }}>
      -1
    </button>
  );
}

function Reset() {
  const setValue = useOutletSetter('add'); // <-- use setter only, so your component won't re-render when the value changed
  return <button onClick={() => setValue(0)}>RESET</button>;
}

function Value() {
  const [value] = useOutlet('add'); // <-- use value only, the simplest case
  return <h1>{value}</h1>;
}

export default App;
```

## Documentation

Visit [doc](https://revtel.github.io/reconnect.js) for more

## Contribution

More than welcome
