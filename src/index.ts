import React from 'react';
import EventEmitter from 'eventemitter3';

const registry = new Map();

function getGlobalRegistry() {
  return registry;
}

class BaseOutletError extends Error {}
class OutletNotFoundError extends BaseOutletError {}

const Evt = {
  update: 'update',
};

export type valueChangeListener<T> = (arg?: T) => void;
export type unregisterOutlet = () => void;
export type initialValueGetter<T> = () => T;
export type nextValueGetter<T> = (currValue?: T) => T | Promise<T>;

export interface Outlet<T> {
  register: (handler: valueChangeListener<T>) => unregisterOutlet;
  update: (value?: T | nextValueGetter<T>) => void;
  getValue: () => T | undefined;
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
  initialValue?: T | initialValueGetter<T>,
  options?: OutletOptions,
): Outlet<T> {
  let refCnt = 0;
  let innerValue: T | undefined;

  if (typeof initialValue === 'function') {
    innerValue = (initialValue as initialValueGetter<T>)();
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

  function update(value?: T | nextValueGetter<T>) {
    if (typeof value === 'function') {
      const resp = (value as nextValueGetter<T>)(innerValue);
      if ("then" in resp) {
        resp.then((nextValue: any) => {
          innerValue = nextValue;
          ee.emit(Evt.update, innerValue);
        });
      } else {
        innerValue = resp;
        ee.emit(Evt.update, innerValue);
      }
    } else {
      innerValue = value;
      return ee.emit(Evt.update, innerValue);
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

function getOutlet<T>(
  key: any,
  initialValue?: T,
  options?: OutletOptions,
): Outlet<T> {
  if (!registry.has(key)) {
    registry.set(key, Outlet(new EventEmitter(), key, initialValue, options));
  }
  return registry.get(key);
}

function hasOutlet(key: any): boolean {
  return registry.has(key);
}

function removeOutlet(key: any) {
  registry.delete(key);
}

function useOutlet<T>(key: any, initialValue?: T, options?: OutletOptions) {
  const outlet = getOutlet<T>(key, initialValue, options);
  const [value, setValue] = React.useState(outlet.getValue());

  React.useEffect(() => {
    const unregister = outlet.register(setValue);
    return unregister;
  }, [outlet]);

  return [value, outlet.update];
}

function useOutletSetter(key: any) {
  const setValue = React.useCallback((value) => {
    if (!hasOutlet(key)) {
      throw new OutletNotFoundError();
    }

    getOutlet(key).update(value);
  }, []);

  return setValue;
}

function useNewOutlet<T>(key: any, initialValue?: T, options?: OutletOptions) {
  const initRef = React.useRef<boolean>(false);

  // do this in render path directly, otherwise we might miss the initial value for our outlet
  if (!initRef.current) {
    getOutlet(key, initialValue, options || {autoDelete: false});
    initRef.current = true;
  }

  React.useEffect(() => {
    return () => {
      removeOutlet(key);
    };
  }, []);
}

export {
  useOutlet,
  useNewOutlet,
  useOutletSetter,
  getOutlet,
  hasOutlet,
  removeOutlet,
  getGlobalRegistry,
};
