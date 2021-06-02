import {useNewOutlet, useOutlet} from './index';

// this function is absolutely NON-SENSE
// because it's only used to verify the type definition in IDE
function useTypeCheck() {
  useNewOutlet<number>('my-outlet', () => 100);
  const [value, setValue] = useOutlet<number>('my-outlet');

  function testSetter() {
    setValue(value + 1);
  }

  function testSetterWithCallback() {
    setValue((oldValue) => {
      return oldValue + 1;
    });
  }

  return {
    testSetter,
    testSetterWithCallback,
  };
}

export default useTypeCheck;
