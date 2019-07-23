export const debounce = (() => {
  let timeout: NodeJS.Timer = {} as NodeJS.Timer;
  return (func: () => void, delay: number) => {
    clearTimeout(timeout);
    timeout = setTimeout(func, delay);
  }
})();
