import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen} from '@testing-library/react';
import {useOutlet, hasOutlet, getOutlet, removeOutlet} from '../lib/index';

describe('Reconnect.js', () => {
  test('useOutlet() can send values to sibling elements', () => {
    function ChildA() {
      const [value] = useOutlet('test-sibling');

      return <div>{value}</div>;
    }

    function ChildB() {
      const [value] = useOutlet('test-sibling');

      return <label>{value}</label>;
    }

    function Root() {
      useOutlet('test-sibling', 'sibling-value');

      return (
        <div>
          <ChildA />
          <ChildB />
        </div>
      );
    }

    render(<Root />);

    const elemList = screen.getAllByText('sibling-value');
    expect(elemList.length).toBe(2);
  });

  test('useOutlet() can send values to nested elements', () => {
    function ChildA() {
      return (
        <div>
          <ChildB />
        </div>
      );
    }

    function ChildB() {
      const [value] = useOutlet('test-nested');

      return <label>{value}</label>;
    }

    function Root() {
      useOutlet('test-nested', 'nested-value');

      return (
        <div>
          <ChildA />
        </div>
      );
    }

    render(<Root />);

    const elemList = screen.getAllByText('nested-value');
    expect(elemList.length).toBe(1);
  });

  test('should clean-up proxy objects after component unmounted', () => {
    expect(hasOutlet('test-sibling')).toBe(false);
    expect(hasOutlet('test-nested')).toBe(false);
  });

  test('can pass OutletOptions into useOutlet()', () => {
    function Root() {
      useOutlet('persist', 'persist', {autoDelete: false});
      return null;
    }

    render(<Root />);
  });

  test('proxy with {autoDelete: false} will persist after component unmount', () => {
    expect(hasOutlet('persist')).toBe(true);
  });

  test('getOutlet() and removeOutlet()', () => {
    getOutlet('static', 'static');
    expect(getOutlet('static').getValue()).toEqual('static');
    expect(hasOutlet('static')).toBe(true);
    removeOutlet('static');
    expect(hasOutlet('static')).toBe(false);
  });
});
