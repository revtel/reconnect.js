import React from 'react';
import './App.css';
import {useOutlet, useNewOutlet, useOutletSetter} from 'reconnect.js';

function Add() {
  const [value, setValue] = useOutlet('add');
  return <button onClick={() => setValue(value + 1)}>+1</button>;
}

function Sub() {
  const [value, setValue] = useOutlet('add');
  return <button onClick={() => setValue(value - 1)}>-1</button>;
}

function Reset() {
  const setValue = useOutletSetter('add');
  return <button onClick={() => setValue(0)}>RESET</button>;
}

function Value() {
  const [value] = useOutlet('add');
  return <h1>{value}</h1>;
}

function App() {
  useNewOutlet('add', 0);

  return (
    <div style={{padding: 10}}>
      <Value />
      <div>
        <Add />
        <Sub />
        <Reset />
      </div>
    </div>
  );
}

export default App;
