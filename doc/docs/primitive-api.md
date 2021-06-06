---
sidebar_position: 3
---

# Primitive API

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
