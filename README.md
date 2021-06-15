<p align="center">
  <h1 align="center">Reconnect.js</h1>
  <h2 align="center">Easily share states between <b>sibling</b> or <b>nested</b> React Components</h2>
</p>

[![npm version](https://img.shields.io/npm/v/reconnect.js.svg?style=flat)](https://www.npmjs.com/package/reconnect.js)

## Install

`npm i reconnect.js`

## Example

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

## React Hook API

### useOutlet

Use `value` and `setter` for an outlet. It might create new outlet if `initialValue` is passed. The signature is just like `React.useState`.

- The `key` can be anything, not limited to a `string`.
- The `initialValue` can be a callback function, which returns the actual value.
- If the `initialValue` is passed, **Reconnect.js** allows creating new outlet by calling `getNewOutlet()`. Otherwise, it calls `getOutlet()` to retrieve existing one.
- The `setter` returned from this API can also accept a callback as input. And if so, it will call it to retrieve the actual value.
- The `options` can be used to control advanced behavior for the outlet object. Normally we won't need to pass it. You can see `getNewOutlet` API for more detail about the `options`.

#### Signature

```typescript
declare function useOutlet<T>(
  key: any,
  initialValue?: initialValueOrGetter<T>,
  options?: OutletOptions,
): [T, (value: nextValueOrGetter<T>) => void];
```

#### Example

Use a new outlet:

```javascript
function Add() {
  const [value, setValue] = useOutlet('add', 0);
  return <button onClick={() => setValue(value + 1)}>+1</button>;
}
```

Use an already existed outlet:

```javascript
function Add() {
  const [value, setValue] = useOutlet('add');
  return <button onClick={() => setValue(value + 1)}>+1</button>;
}
```

### useOutletSetter

Use `setter` for an outlet. When your component only need the setter rather than the value backed by the outlet, use this API to avoid your component from re-rendering due to the value changes.

#### Signature

```typescript
declare function useOutletSetter<T>(
  key: any,
): (value: nextValueOrGetter<T>) => void;
```

#### Example

```javascript
function ResetValue() {
  const setValue = useOutletSetter('add');
  return <button onClick={() => setValue(0)}>RESET</button>;
}
```

### useOutletDeclaration

Declare an outlet without using its value and setter. If the outlet doesn't exist yet, create it.

It's useful when you want to declare an outlet for your child components, but the root component itself doesn't need either value and setter, so when the value is changed, the root component won't re-render.

#### Signature

```typescript
declare function useOutletDeclaration<T>(
  key: any,
  initialValue: initialValueOrGetter<T>,
): void;
```

#### Example

```javascript
function App() {
  useOutletDeclaration('add', 0);

  return (
    <div style={{padding: 10}}>
      <Value />
      <Add />
    </div>
  );
}

function Add() {
  const [value, setValue] = useOutlet('add');
  return <button onClick={() => setValue(value + 1)}>+1</button>;
}

function Value() {
  const [value] = useOutlet('add');
  return <h1>{value}</h1>;
}
```

## Primitive API

### Outlet

An outlet let producers or consumers to publish or subscribe value changes.

#### Signature

```typescript
export interface Outlet<T> {
  /**
   * Subscribe to value changes.
   *
   * @param handler - The value change listener function
   * @returns A function to unregister the value change
   */
  register: (handler: valueChangeListener<T>) => unregisterOutlet;
  /**
   * Change the value backed by this outlet and publish to all subscribers.
   *
   * @param value - The value you'd like to change or a callback function to produce the value.
   */
  update: (value: nextValueOrGetter<T>) => void;
  /**
   * Get the value backed by this outlet
   */
  getValue: () => T;
}
```

### getNewOutlet

Get or create an outlet using given key.

This method first search global registry to see if the key has a corresponding outlet, if so returns it. Otherwise it will create a new outlet and set to global registry, then returns it.

- The `initialValue` can be a callback function, which returns the actual value.
- The `options` has a property `autoDelete`, which indicates whether `Reconnect.js` should automatically remove the outlet when the number of subscribers down to 0. The default value is `true`, but when you create outlets explicitly by calling `getNewOutlet`, you should set it to false.

#### Signature

```typescript
export interface OutletOptions {
  autoDelete?: boolean;
}

declare function getNewOutlet<T>(
  key: any,
  initialValue: initialValueOrGetter<T>,
  options?: OutletOptions,
): Outlet<T>;
```

#### Example

```javascript
const ValueOutlet = getNewOutlet('value', 0, {autoDelete: false});

if (typeof window !== undefined) {
  // so you can call it from browser's inspector
  window.addOne = () => {
    ValueOutlet.update(ValueOutlet.getValue() + 1);
  };
}

function App() {
  return (
    <div style={{padding: 10}}>
      <Value />
    </div>
  );
}

function Value() {
  const [value] = useOutlet('value');
  return <h1>{value}</h1>;
}
```

### getOutlet

Get an existing outlet. If not found, throws an `OutletNotFoundError`

#### Signature

```typescript
declare function getOutlet<T>(key: any): Outlet<T>;
```

### hasOutlet

Check if the outlet already exists.

#### Signature

```typescript
declare function hasOutlet(key: any): boolean;
```

### removeOutlet

Force remove the outlet from global registry.

#### Signature

```typescript
declare function removeOutlet(key: any): void;
```

## Contribution

More than welcome
