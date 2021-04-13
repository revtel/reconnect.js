import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen} from '@testing-library/react';
import {useRevent} from '../src/index';

function TestComp() {
  const [value] = useRevent('TestComp', 'hello');

  return <div>{value}</div>;
}

describe('TestComp', () => {
  test('renders TestComp component', () => {
    render(<TestComp />);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
});
