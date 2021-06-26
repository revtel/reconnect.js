import React from 'react';
import {
  useOutlet,
  useOutletSetter,
  useOutletDeclaration,
  getGlobalRegistry,
} from 'reconnect.js';

function App() {
  useOutletDeclaration('add', 0);
  return (
    <div style={{padding: 10, backgroundColor: 'pink'}}>
      <Value />
      <ActionBar />
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
