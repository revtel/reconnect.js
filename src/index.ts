import React from 'react';
import EventEmitter from 'eventemitter3';

const registry = new Map();

class BaseOutletError extends Error {}
class OutletNotFoundError extends BaseOutletError {}

const Evt = {
  update: 'update',
};

export type valueChangeListener = (arg: any) => void;
export type unregisterOutlet = () => void;

export interface Outlet {
  register: (handler: valueChangeListener) => unregisterOutlet;
  update: (value: any) => void;
  getValue: () => any;
}

export interface OutletOptions {
  autoDelete?: boolean;
}

const defaultOutletOptions: OutletOptions = {
  autoDelete: true,
};

function Outlet(
  ee: EventEmitter,
  key: any,
  initialValue?: any,
  options?: OutletOptions,
): Outlet {
  let refCnt = 0;
  let innerValue =
    typeof initialValue === 'function' ? initialValue() : initialValue;

  if (options === undefined) {
    options = defaultOutletOptions;
  } else {
    options = {
      ...defaultOutletOptions,
      ...options,
    };
  }

  function register(handler: valueChangeListener): unregisterOutlet {
    refCnt++;

    function onChange(value: any): void {
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

  function update(value: any) {
    innerValue = value;
    return ee.emit(Evt.update, value);
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

function getOutlet(
  key: any,
  initialValue?: any,
  options?: OutletOptions,
): Outlet {
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

function useOutlet(key: any, initialValue?: any, options?: OutletOptions) {
  const outlet = getOutlet(key, initialValue, options);
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

function useNewOutlet(key: any, initialValue?: any, options?: OutletOptions) {
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
};
