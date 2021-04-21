import React from 'react';
import EventEmitter from 'eventemitter3';

const registry = new Map();

const Evt = {
  update: 'update',
};

function EmitterProxy(ee) {
  return {
    onUpdate: (handler) => {
      return ee.on(Evt.update, handler);
    },

    offUpdate: (handler) => {
      return ee.off(Evt.update, handler);
    },

    update: (value) => {
      return ee.emit(Evt.update, value);
    },
  };
}

function getProxy(key) {
  if (!registry.has(key)) {
    registry.set(key, EmitterProxy(new EventEmitter()));
  }
  return registry.get(key);
}

function useRevent(name, initialValue) {
  const [value, setValue] = React.useState(initialValue);
  const eeProxy = getProxy(name);

  React.useEffect(() => {
    eeProxy.onUpdate(setValue);

    return () => {
      eeProxy.offUpdate(setValue);
    };
  }, [eeProxy]);

  return [value, eeProxy.update];
}

export {useRevent, getProxy};
