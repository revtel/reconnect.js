import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {act, render, screen} from '@testing-library/react';
import {
  useNewOutlet,
  useOutlet,
  hasOutlet,
  getNewOutlet,
  getOutlet,
  removeOutlet,
} from '../lib/index';

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
      useNewOutlet('test-sibling', 'sibling-value');

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
      useNewOutlet('test-nested', 'nested-value');

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

  test('getOutlet() and removeOutlet()', () => {
    getNewOutlet('static', 'static');
    expect(getOutlet('static').getValue()).toEqual('static');
    expect(hasOutlet('static')).toBe(true);
    removeOutlet('static');
    expect(hasOutlet('static')).toBe(false);
  });

  test('components who call useOutlet() hook will be rendered when the outlet value changed', () => {
    function Child() {
      const [value] = useOutlet('test-useOutlet');
      return <div>{value}</div>;
    }

    function Root() {
      const renderCntRef = React.useRef(0);

      useNewOutlet('test-useOutlet', '');

      renderCntRef.current += 1;

      return (
        <div>
          Root
          <section>{renderCntRef.current}</section>
          <Child />
        </div>
      );
    }

    render(<Root />);

    act(() => {
      getOutlet('test-useOutlet').update('changed');
    });

    expect(!!screen.findByText('changed')).toBe(true);
  });
});
