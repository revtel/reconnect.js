import React from 'react';
import EventEmitter from 'eventemitter3';

const registry = new Map();

const Evt = {
  update: 'update',
};

export type valueChangeListener = (arg: any) => void;

export interface Outlet {
  register: (handler: valueChangeListener) => void;
  unregister: (handler: valueChangeListener) => void;
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

  return {
    register: (handler: valueChangeListener) => {
      refCnt++;
      return ee.on(Evt.update, handler);
    },

    unregister: (handler: valueChangeListener) => {
      refCnt--;
      ee.off(Evt.update, handler);

      if (refCnt === 0) {
        if (options?.autoDelete) {
          registry.delete(key);
        }
      }
    },

    update: (value: any) => {
      innerValue = value;
      return ee.emit(Evt.update, value);
    },

    getValue: () => {
      return innerValue;
    },
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
    outlet.register(setValue);

    return () => {
      outlet.unregister(setValue);
    };
  }, [outlet]);

  return [value, outlet.update];
}

export {useOutlet, getOutlet, hasOutlet, removeOutlet};
