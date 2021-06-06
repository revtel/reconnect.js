---
sidebar_position: 2
---

# React Hook API

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
