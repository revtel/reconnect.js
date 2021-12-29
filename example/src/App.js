import React from 'react';
import {
  useOutlet,
  useOutletSetter,
  useOutletDeclaration,
  useOutletSelector,
  getGlobalRegistry,
} from 'reconnect.js';

function App() {
  useOutletDeclaration('add', 0);
  useOutletDeclaration('nested', {
    inner: {
      count: 0,
    },
  });

  return (
    <div style={{padding: 10}}>
      <h2>useOutlet</h2>
      <Value />
      <ActionBar />
      <hr />
      <h3>useOutletSelector</h3>
      <InnerCount />
      <IncInnerCount />
      <Touch />
    </div>
  );
}

function InnerCount() {
  const selector = React.useCallback((state) => state.inner.count, []);
  const innerCount = useOutletSelector('nested', selector);
  console.log('rendered');
  return <div>{innerCount}</div>;
}

function IncInnerCount() {
  const setState = useOutletSetter('nested');

  return (
    <div>
      <button
        onClick={() => {
          setState((prev) => ({
            ...prev,
            inner: {
              count: prev.inner.count + 1,
            },
          }));
        }}>
        Inner Value++
      </button>
    </div>
  );
}

function Touch() {
  const [value, setValue] = useOutlet('nested');

  return (
    <div>
      <button
        onClick={() => {
          setValue({
            ...value,
          });
        }}>
        Touch
      </button>
    </div>
  );
}

function Value() {
  const [value] = useOutlet('add');
  return <h1>{value}</h1>;
}

function ActionBar(props) {
  return (
    <div>
      <Add />
      <Sub />
      <Reset />
    </div>
  );
}

function Add() {
  const [value, setValue] = useOutlet('add');
  return <button onClick={() => setValue(value + 1)}>+1</button>;
}

function Sub() {
  const [_, setValue] = useOutlet('add');
  return <button onClick={() => setValue((value) => value - 1)}>-1</button>;
}

function Reset() {
  const setValue = useOutletSetter('add');
  return <button onClick={() => setValue(0)}>RESET</button>;
}

if (typeof window !== undefined) {
  window.outlets = getGlobalRegistry();
}

export default App;
