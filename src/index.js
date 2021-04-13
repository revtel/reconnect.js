import React from 'react';
import EventEmitter from 'eventemitter3';

const registry = {};

class EmitterProxy {
  constructor(ee) {
    this.ee = ee;
  }

  on(name, handler) {
    return this.ee.on(name, handler);
  }

  off(name, handler) {
    return this.ee.off(name, handler);
  }

  emit(name, event) {
    return this.ee.emit(name, event);
  }
}

function getEmitter(name) {
  if (!registry[name]) {
    const ee = new EventEmitter();
    registry[name] = new EmitterProxy(ee);
  }
  return registry[name];
}

function useRevent(name, initialValue) {
  const [value, setValue] = React.useState(initialValue);
  const ee = getEmitter(name);

  const updater = React.useCallback(
    (nextValue) => {
      ee.emit(name, nextValue);
    },
    [ee, name],
  );

  React.useEffect(() => {
    ee.on(name, setValue);

    return () => {
      ee.off(name, setValue);
    };
  }, [ee, name]);

  return [value, updater];
}

export {useRevent, getEmitter};
