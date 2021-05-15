import React from 'react';
import './App.css';
import {useOutlet} from 'reconnect.js';

function Add() {
  const [value, setValue] = useOutlet('add');
  return <button onClick={() => setValue(value + 1)}>+1</button>;
}

function Sub() {
  const [value, setValue] = useOutlet('add');
  return <button onClick={() => setValue(value - 1)}>-1</button>;
}

function Value() {
  const [value] = useOutlet('add');
  return <h1>{value}</h1>;
}

function App() {
  useOutlet('add', 0);

  return (
    <div style={{padding: 10}}>
      <Value />
      <div>
        <Add />
        <Sub />
      </div>
    </div>
  );
}

export default App;
