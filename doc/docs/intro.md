---
sidebar_position: 1
---

# Introduction

## Install

`npm i reconnect.js`

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
  - BTW, if you'd like to modify the state from child components, normally you will need to create a separated Context and Provider. So you will have to iterate through above steps again.
- Or, you might choose to use another `state management library` such as `Redux`, that brings another layers of complexity. These libraries are awesome, but sometimes you just want things to be simpler.

## That's why you might want to use Reconnect.js!

Let's see a quick demo:

```javascript
import React from 'react';
import {useOutlet, useOutletSetter, useOutletDeclaration} from 'reconnect.js';

function App() {
  useOutletDeclaration('add', 0);
  return (
    <div style={{padding: 10}}>
      <Value />
      <ActionBar />
    </div>
  );
}

function Value() {
  const [value] = useOutlet('add');
  return <h1>{value}</h1>;
}

function ActionBar(props) {
  return (
    <div>
      <Add />
      <Sub />
      <Reset />
    </div>
  );
}

function Add() {
  const [value, setValue] = useOutlet('add');
  return <button onClick={() => setValue(value + 1)}>+1</button>;
}

function Sub() {
  const [_, setValue] = useOutlet('add');
  return <button onClick={() => setValue((value) => value - 1)}>-1</button>;
}

function Reset() {
  const setValue = useOutletSetter('add');
  return <button onClick={() => setValue(0)}>RESET</button>;
}

export default App;
```

As you can see, the value backed by the `add` outlet can be shared between:

- Sibling components like `Add` and `Sub`.
- Nested components like `Value` and the children `Add` and `Sub` inside `ActionBar`.

It just works without extra configurations!
