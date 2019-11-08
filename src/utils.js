
function setIntervalImmediately(someFunc, interval) {
  someFunc();
  return setInterval(someFunc, interval);
}

module.exports = {
  setIntervalImmediately
}
