const notifier = require('node-notifier');
const open = require('open')

function openLink(url) {
  open(url);
}

function sendNotification(summary, description) {
  notifier.notify({
    title: summary,
    message: description,
    sound: true, // Only Notification Center or Windows Toasters
    wait: false
  });
}

function setIntervalImmediately(someFunc, interval) {
  someFunc();
  return setInterval(someFunc, interval);
}

module.exports = {
  openLink,
  sendNotification,
  setIntervalImmediately
}
