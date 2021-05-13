import React from 'react';
import './App.css';
import {useRevent} from 'reconnect.js';

function Add() {
  const [value, setValue] = useRevent('add');
  return <button onClick={() => setValue(value + 1)}>+1</button>;
}

function Sub() {
  const [value, setValue] = useRevent('add');
  return <button onClick={() => setValue(value - 1)}>-1</button>;
}

function Value() {
  const [value] = useRevent('add');
  return <h1>{value}</h1>;
}

function App() {
  useRevent('add', 0);

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
