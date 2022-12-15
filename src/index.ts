import React from 'react';
import EventEmitter from 'eventemitter3';
import * as Utils from './Utils';

const registry = new Map();

export type initialValueOrGetter<T> = T | (() => T);
export type nextValueOrGetter<T> = T | ((currValue: T) => T | Promise<T>);
export type valueChangeListener<T> = (value: T) => void;
export type unregisterOutlet = () => void;

/**
 * An outlet let producers or consumers to publish or subscribe value changes.
 */
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

  /**
   * Get the subscribers count for this outlet
   */
  getRefCnt: () => number;
}

/**
 * The options used to create an outlet.
 */
export interface OutletOptions {
  /**
   * Used to indicate whether reconnect.js should automatically remove the outlet
   * when the number of subscribers down to 0.
   */
  autoDelete?: boolean;
}

const defaultOutletOptions: OutletOptions = {
  autoDelete: true,
};

const warningMessage = `Normally it's because your outlets have been updated with hot-reload. You might need to reload your app.`;


class nullOutlet {
  key: string;

  constructor(key: string) {
    this.key = key;
  }

  register (handler: valueChangeListener<any>) {
    console.error(
      `[reconnect.js]: ${this.key} NullOutlet.register() shouldn't be called.\n${warningMessage}`,
    );
    return () => 0;
  };
  update (value: nextValueOrGetter<any>) {
    console.error(
      `[reconnect.js]: ${this.key} NullOutlet.update() shouldn't be called.\n${warningMessage}`,
    );
  };

  getValue (){
    console.error(
      `[reconnect.js]: ${this.key} NullOutlet.getValue() shouldn't be called.\n${warningMessage}`,
    );
  };

  getRefCnt() {
    console.error(
      `[reconnect.js]: ${this.key}NullOutlet.getRefCnt() shouldn't be called.\n${warningMessage}`,
    );
    return 0;
  };
}

const NullOutlet: any = (key: string) => new nullOutlet(key);

/**
 * Test if the outlet is NullOutlet singleton.
 *
 * Normally applications don't need to call this API.
 *
 * @param outlet
 * @returns a boolean value to indicate whether the outlet is the same object as NullOutlet.
 */
function isNull(outlet: Outlet<any>): boolean {
  return Object.is(NullOutlet, outlet);
}

function Outlet<T>(
  ee: EventEmitter,
  key: any,
  initialValue: initialValueOrGetter<T>,
  options?: OutletOptions,
): Outlet<T> {
  const Evt = {
    update: 'update',
  };

  let refCnt = 0;
  let innerValue: T;

  // https://github.com/microsoft/TypeScript/issues/37663
  if (initialValue instanceof Function) {
    innerValue = initialValue();
  } else {
    innerValue = initialValue;
  }

  if (options === undefined) {
    options = defaultOutletOptions;
  } else {
    options = {
      ...defaultOutletOptions,
      ...options,
    };
  }

  function register(handler: valueChangeListener<T>): unregisterOutlet {
    refCnt++;

    function onChange(value: T): void {
      handler(value);
    }

    ee.on(Evt.update, onChange);

    return () => {
      refCnt--;
      ee.off(Evt.update, onChange);

      if (refCnt === 0) {
        if (options?.autoDelete) {
          registry.delete(key);
        }
      }
    };
  }

  function update(value: nextValueOrGetter<T>) {
    // https://github.com/microsoft/TypeScript/issues/37663
    if (value instanceof Function) {
      const resp = value(innerValue);
      if (Utils.isPromise(resp)) {
        (resp as Promise<T>).then((nextValue: any) => {
          innerValue = nextValue;
          ee.emit(Evt.update, innerValue);
        });
      } else {
        innerValue = resp as T;
        ee.emit(Evt.update, innerValue);
      }
    } else {
      innerValue = value as T;
      ee.emit(Evt.update, innerValue);
    }
  }

  function getValue() {
    return innerValue;
  }

  function getRefCnt() {
    return refCnt;
  }

  return {
    register,
    update,
    getValue,
    getRefCnt,
  };
}

/**
 * Get or create an outlet using given key.
 *
 * This method first search global registry to see if the key has a corresponding outlet,
 * if so returns it. Otherwise it will create a new outlet and set to global registry,
 * then returns it.
 *
 * @param key
 * @param initialValue
 * @param options
 * @returns The created or existing outlet with given key
 */
function getNewOutlet<T>(
  key: any,
  initialValue: initialValueOrGetter<T>,
  options?: OutletOptions,
): Outlet<T> {
  if (registry.has(key)) {
    return registry.get(key);
  }

  const newOutlet = Outlet(new EventEmitter(), key, initialValue, options);
  registry.set(key, newOutlet);
  return newOutlet;
}

/**
 * Create an outlet using given key, this is the shortcut for getNewOutlet() with autoDelete as false
 *
 * @param key
 * @param initialValue
 * @returns The created or existing outlet with given key
 */
function createOutlet<T>(
  key: any,
  initialValue: initialValueOrGetter<T>,
): Outlet<T> {
  if (registry.has(key)) {
    return registry.get(key);
  }

  const newOutlet = Outlet(new EventEmitter(), key, initialValue, {
    autoDelete: false,
  });
  registry.set(key, newOutlet);
  return newOutlet;
}

/**
 * Get an existing outlet. If not found, return the `NullOutlet` singleton.
 *
 * @param key
 * @returns The existing outlet
 */
function getOutlet<T>(key: any): Outlet<T> {
  if (!registry.has(key)) {
    return NullOutlet(key);
  }
  return registry.get(key);
}

/**
 * Check if the outlet already exists.
 *
 * @param key
 * @returns A boolean value indicates is the outlet exists
 */
function hasOutlet(key: any): boolean {
  return registry.has(key);
}

/**
 * Force remove the outlet from global registry.
 *
 * @param key
 */
function removeOutlet(key: any, force?: boolean) {
  const outlet = registry.get(key);
  if (outlet) {
    if (outlet.getRefCnt() === 0) {
      registry.delete(key);
    } else if (force) {
      registry.delete(key);
    }
  }
}

/**
 * [React Hook] use value and setter for an outlet. It might create new outlet if initialValue is passed,
 *
 * If the initialValue is passed, allow creating new outlet by calling getNewOutlet.
 * Otherwise, call getOutlet to retrieve existing one.
 *
 * @param key
 * @param initialValue
 * @param options
 * @returns An array with 2 elements: value and setter for the outlet, just like React.useState.
 */
function useOutlet<T>(
  key: any,
  initialValue?: initialValueOrGetter<T>,
  options?: OutletOptions,
): [T, (value: nextValueOrGetter<T>) => void] {
  const outlet = React.useRef(
    initialValue === undefined
      ? getOutlet<T>(key)
      : getNewOutlet<T>(key, initialValue, options),
  ).current;
  const [value, setValue] = React.useState(outlet.getValue());

  React.useEffect(() => {
    // Hook register and unregister to component mount and unmount.
    // By subscribing to outlet, when the outlet value changed, the internal value also changed
    // because the `setValue` is called, so out component will re-render.
    const unregister = outlet.register(setValue as valueChangeListener<T>);
    return unregister;
  }, [outlet]);

  return [value, outlet.update];
}

/**
 * [React Hook] use setter for the outlet.
 *
 * @param key
 * @returns The setter for the outlet
 */
function useOutletSetter<T>(key: any): (value: nextValueOrGetter<T>) => void {
  const setValue = React.useCallback((value) => {
    getOutlet(key).update(value);
  }, []);

  return setValue;
}

/**
 * [React Hook] declare an outlet without using its value and setter. If the outlet doesn't exist yet, create it.
 *
 * Use this hook to declare an outlet in the root component, when:
 * - the child components need a shared outlet
 * - but the root itself doesn't need either value and setter
 * So when the value is changed, the root component won't re-render.
 *
 * @param key
 * @param initialValue
 */
function useOutletDeclaration<T>(
  key: any,
  initialValue: initialValueOrGetter<T>,
) {
  const initRef = React.useRef<boolean>(false);

  // do this in render path directly, otherwise we might miss the initial value for our outlet
  if (!initRef.current) {
    getNewOutlet(key, initialValue, {autoDelete: false});
    initRef.current = true;
  }

  React.useEffect(() => {
    return () => {
      removeOutlet(key, true);
    };
  }, []);
}

/**
 * [React Hook] use partial value inside the whole outlet value with a selector function.
 *
 * The selector should be wrapped inside a React.useCallback() function.
 *
 * @param key
 * @param selector
 */
function useOutletSelector<T, U>(key: any, selector: (state: T) => U): U {
  const outlet = React.useRef(getOutlet<T>(key)).current;
  const [selectedValue, setSelectedValue] = React.useState(
    selector(outlet.getValue()),
  );

  React.useEffect(() => {
    const unregister = outlet.register((prevValue) => {
      const nextSelectedValue = selector(prevValue);
      if (nextSelectedValue !== selectedValue) {
        setSelectedValue(nextSelectedValue);
      }
    });
    return unregister;
  }, [outlet, selectedValue, selector]);

  return selectedValue;
}

// Just for backward capatibility to allow clients using the old function name `useNewOutlet`
// instead of the new one `useOutletDeclaration`
const useNewOutlet = useOutletDeclaration;

function getGlobalRegistry() {
  return registry;
}

export {
  // primitives
  getNewOutlet,
  getOutlet,
  hasOutlet,
  removeOutlet,
  createOutlet,
  // react hooks
  useOutlet,
  useOutletSetter,
  useOutletDeclaration,
  useOutletSelector,
  useNewOutlet,
  // administration
  getGlobalRegistry,
  // null
  isNull,
};
