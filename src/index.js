import React from 'react';
import EventEmitter from 'eventemitter3';

const registry = new Map();

const Evt = {
  update: 'update',
};

function EmitterProxy(ee, initialValue) {
  let innerValue =
    typeof initialValue === 'function' ? initialValue() : initialValue;

  return {
    register: (handler) => {
      return ee.on(Evt.update, handler);
    },

    unregister: (handler) => {
      return ee.off(Evt.update, handler);
    },

    update: (value) => {
      innerValue = value;
      return ee.emit(Evt.update, value);
    },

    getValue: () => {
      return innerValue;
    },
  };
}

function getProxy(key, initialValue) {
  if (!registry.has(key)) {
    registry.set(key, EmitterProxy(new EventEmitter(), initialValue));
  }
  return registry.get(key);
}

function useRevent(name, initialValue) {
  const eeProxy = getProxy(name, initialValue);
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
