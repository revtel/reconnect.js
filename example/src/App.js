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
  useOutletDeclaration('root', {
    first: {
      second: 3,
    },
    other: 0,
  });

  return (
    <div style={{padding: 10}}>
      <Value />
      <ActionBar />
      <NestedValue />
      <IncNestedValue />
      <IncOtherNestedValue />
    </div>
  );
}

function useNestedValue() {
  const selector = React.useCallback((state) => state.first.second, []);
  const value = useOutletSelector('root', selector);
  return value;
  /*
  const [value] = useOutlet('root');
  return value.first.second;
  */
}

function IncOtherNestedValue() {
  const [value, setValue] = useOutlet('root');

  return (
    <div>
      <button
        onClick={() => {
          setValue((prev) => {
            return {
              ...prev,
              other: prev.other + 1,
            };
          });
        }}>
        Inc other nested value
      </button>
    </div>
  );
}

function IncNestedValue() {
  const [value, setValue] = useOutlet('root');

  return (
    <div>
      <button
        onClick={() => {
          setValue((prev) => {
            prev.first.second = prev.first.second + 1;
            return prev;
            /*
            return {
              first: {
                second: prev.first.second + 1,
              },
            };
            */
          });
        }}>
        Inc nested value
      </button>
    </div>
  );
}

function NestedValue() {
  const value = useNestedValue();

  console.log('NestedValue component rendered');

  return <div>Nested value: {value}</div>;
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
