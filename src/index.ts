import React from 'react';
import EventEmitter from 'eventemitter3';

const registry = new Map();

const Evt = {
  update: 'update',
};

type valueChangeListener = (arg: any) => void;

function EmitterProxy(ee: EventEmitter, initialValue?: any) {
  let innerValue =
    typeof initialValue === 'function' ? initialValue() : initialValue;

  return {
    register: (handler: valueChangeListener) => {
      return ee.on(Evt.update, handler);
    },

    unregister: (handler: valueChangeListener) => {
      return ee.off(Evt.update, handler);
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

function getProxy(key: any, initialValue?: any) {
  if (!registry.has(key)) {
    registry.set(key, EmitterProxy(new EventEmitter(), initialValue));
  }
  return registry.get(key);
}

function useRevent(key: any, initialValue?: any) {
  const eeProxy = getProxy(key, initialValue);
  const [value, setValue] = React.useState(eeProxy.getValue());

  React.useEffect(() => {
    eeProxy.register(setValue);

    return () => {
      eeProxy.unregister(setValue);
    };
  }, [eeProxy]);

  return [value, eeProxy.update];
}

export {useRevent, getProxy};
