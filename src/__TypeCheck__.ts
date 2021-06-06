import {useNewOutlet, useOutlet, useOutletSetter} from './index';

// this function is absolutely NON-SENSE
// because it's only used to verify the type definition in IDE
function useTypeCheck() {
  useNewOutlet<number>('my-outlet', () => 100);
  const [value, setValue] = useOutlet<number>('my-outlet');
  const udpateInt = useOutletSetter<number>('my-outlet');

  function testSetter() {
    setValue(value + 1);
  }

  function testSetterWithCallback() {
    setValue((oldValue) => {
      return oldValue + 1;
    });
  }

  function testUpdateInt() {
    udpateInt(100);
  }

  function testUpdateIntCb() {
    udpateInt((value) => {
      return value + 3;
    });
  }

  return {
    testSetter,
    testSetterWithCallback,
    testUpdateInt,
    testUpdateIntCb,
  };
}

export default useTypeCheck;
