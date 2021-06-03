import React from 'react';
import EventEmitter from 'eventemitter3';
import * as Utils from './Utils';

class BaseOutletError extends Error {}
class OutletNotFoundError extends BaseOutletError {}

const registry = new Map();

export type initialValueOrGetter<T> = T | (() => T);
export type nextValueOrGetter<T> = T | ((currValue: T) => T | Promise<T>);
export type valueChangeListener<T> = (value: T) => void;
export type unregisterOutlet = () => void;

export interface Outlet<T> {
  register: (handler: valueChangeListener<T>) => unregisterOutlet;
  update: (value: nextValueOrGetter<T>) => void;
  getValue: () => T;
}

export interface OutletOptions {
  autoDelete?: boolean;
}

const defaultOutletOptions: OutletOptions = {
  autoDelete: true,
};

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

  return {
    register,
    update,
    getValue,
  };
}

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

function getOutlet<T>(key: any): Outlet<T> {
  if (!registry.has(key)) {
    throw new OutletNotFoundError();
  }
  return registry.get(key);
}

function hasOutlet(key: any): boolean {
  return registry.has(key);
}

function removeOutlet(key: any) {
  registry.delete(key);
}

function useNewOutlet<T>(key: any, initialValue: initialValueOrGetter<T>) {
  const initRef = React.useRef<boolean>(false);

  // do this in render path directly, otherwise we might miss the initial value for our outlet
  if (!initRef.current) {
    getNewOutlet(key, initialValue, {autoDelete: false});
    initRef.current = true;
  }

  React.useEffect(() => {
    return () => {
      removeOutlet(key);
    };
  }, []);
}

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
    const unregister = outlet.register(setValue as valueChangeListener<T>);
    return unregister;
  }, [outlet]);

  return [value, outlet.update];
}

function useOutletSetter(key: any) {
  const setValue = React.useCallback((value) => {
    if (!hasOutlet(key)) {
      throw new OutletNotFoundError();
    }

    registry.get(key).update(value);
  }, []);

  return setValue;
}

function getGlobalRegistry() {
  return registry;
}

export {
  // primitives
  getNewOutlet,
  getOutlet,
  hasOutlet,
  removeOutlet,
  // react hooks
  useNewOutlet,
  useOutlet,
  useOutletSetter,
  // errors
  BaseOutletError,
  OutletNotFoundError,
  // administration
  getGlobalRegistry,
};
