# Reconnect.js

The easiest way to share states between **sibling** or **nested** React Components!

## Install

`npm i reconnect.js`

## Example

```javascript
import React from 'react';
import './App.css';
import {useOutlet, useNewOutlet, useOutletSetter} from 'reconnect.js';

function App() {
  useNewOutlet('add', 0); // <-- declare a new outlet with initial value. No Context. No Provider.

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

## API

```typescript
export declare type initialValueOrGetter<T> = T | (() => T);
export declare type nextValueOrGetter<T> = T | ((currValue: T) => T | Promise<T>);
export declare type valueChangeListener<T> = (value: T) => void;
export declare type unregisterOutlet = () => void;
export interface Outlet<T> {
    register: (handler: valueChangeListener<T>) => unregisterOutlet;
    update: (value: nextValueOrGetter<T>) => void;
    getValue: () => T;
}
export interface OutletOptions {
    autoDelete?: boolean;
}
declare function getNewOutlet<T>(key: any, initialValue: initialValueOrGetter<T>, options?: OutletOptions): Outlet<T>;
declare function getOutlet<T>(key: any): Outlet<T>;
declare function hasOutlet(key: any): boolean;
declare function removeOutlet(key: any): void;
declare function useNewOutlet<T>(key: any, initialValue: initialValueOrGetter<T>): void;
declare function useOutlet<T>(key: any, initialValue?: initialValueOrGetter<T>, options?: OutletOptions): [T, (value: nextValueOrGetter<T>) => void];
declare function useOutletSetter(key: any): (value: any) => void;
declare function getGlobalRegistry(): Map<any, any>;
```
