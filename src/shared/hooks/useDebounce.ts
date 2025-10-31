const useDebounce = (func: Function, delay: number) => {
  let timeout: any;
  return (...args: any[]) => {
    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

export default useDebounce;
