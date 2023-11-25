import { parentPort } from 'worker_threads';

function fib(n: number) {
  if (n < 2) {
    return n;
  }
  return fib(n - 1) + fib(n - 2);
}

parentPort.on('message', ({ n: numberToBeCalculated, id: uniqueRequestId }) => {
  const result = fib(numberToBeCalculated);
  parentPort.postMessage({
    result,
    id: uniqueRequestId,
  });
});

module.exports = (n: number) => fib(n);
