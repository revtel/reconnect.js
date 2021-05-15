# Reconnect.js 

The easiest way to share states between **sibling** or **deeply nested** React Components!

## Install

`npm i reconnect.js`

## Example

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

## API

```typescript
export declare type valueChangeListener = (arg: any) => void;
export interface Outlet {
    register: (handler: valueChangeListener) => void;
    unregister: (handler: valueChangeListener) => void;
    update: (value: any) => void;
    getValue: () => any;
}
export interface OutletOptions {
    autoDelete?: boolean;
}
declare function getOutlet(key: any, initialValue?: any, options?: OutletOptions): Outlet;
declare function hasOutlet(key: any): boolean;
declare function removeOutlet(key: any): void;
declare function useOutlet(key: any, initialValue?: any, options?: OutletOptions): any[];
export { useOutlet, getOutlet, hasOutlet, removeOutlet };
```
