---
sidebar_position: 1
---

# Introduction

## Install

`npm i reconnect.js`

> You can use it in your React Native, or even pure NodeJS projects as well!

## What Is It?

**Reconnect.js** is the library to help you manage share states between **sibling** or **deeply nested** React Components.

## Why Do I Need This?

### Case 1: Share States Between Sibling Components

React can pass state into child components easily. But if you'd like to share states between sibling components, normally you will have to:
- create the state in your parent component
- pass the value down as props into child components
- pass the setter function down as props into child components if child components need to modify them

### Case 2: Share States Between Deeply Nested Components

When things come to deeply nested components, it's getting worse. 

If you'd like to share states between some deeply nested components, you normally has two options:
- Use `React Context`. Not that trivial, the rough steps looks like this:
  - Create a context via `React.createContext()`
  - Create `Provider` component, wrap the `Context.Provider` 
  - Put the state you'd like to share into the created `Provider`
  - Export your context instance. For the components who'd like to access the shared state, import it and call `useContext`.
  - BTW, if you'd like to modify the state from child components, normally you will need to create a separated Context!
- Or, you might choose to use another `state management library` such as `Redux`, that brings another layers of complexity.

## That's why you might want to use Reconnect.js!

Let's see a quick demo:

```javascript
import React from 'react';
import {useOutlet} from 'reconnect.js';

function App() {
  useOutlet('add', 0); // <-- create an outlet called 'add', with initial value 0

  return (
    <div style={{padding: 10}}>
      <Value />
      <div>
        <Add />
        <Sub />
      </div>
    </div>
  );
}

function Value() {
  const [value] = useOutlet('add'); // <-- access the value from the outlet
  return <h1>{value}</h1>;
}

function Add() {
  const [value, setValue] = useOutlet('add'); // <-- access both the value and modifier from the outlet
  return <button onClick={() => setValue(value + 1)}>+1</button>;
}

function Sub() {
  const [value, setValue] = useOutlet('add'); // <-- access both the value and modifier from the outlet
  return <button onClick={() => setValue(value - 1)}>-1</button>;
}

export default App;
```


