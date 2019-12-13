const { getClassNumbers } = require('./api');
const {
  openLink,
  sendNotification
} = require('./utils');

const URL = 'https://oscar.gatech.edu/pls/bprod/bwckschd.p_disp_detail_sched?term_in=202002&crn_in=31568';
const INTERVAL = 30000; // half a min
let classData = null;
const keyNameMap = {
  seatsCapacity: 'Class capacity',
  seatsActual: 'Number of class seats taken',
  seatsRemaining: 'Number of class seats remaining',
  waitlistCapacity: 'Waitlist capacity',
  waitlistActual: 'Number of waitlist spots taken',
  waitlistRemaining: 'Number of waitlist spots remaining',
};

function getHelpText() {
  const options = {
    h: 'display this help text',
    s: 'display current class seat numbers',
    o: 'open the OSCAR page for this class',
    e: 'exit blart'
  };
  const output = `usage: input these keys into the console.\n${Object.entries(options).map(([k, v]) => `${k}: ${v}`).join('\n')}`;
  return output;
}

function getSeatText() {
  const output = Object.entries(classData).map(([key, val]) => {
    return `${keyNameMap[key]}: ${val}`;
  }).join('\n');
  return output;
}

function updateSeats(checkForChange) {
  return getClassNumbers(URL).then((newRes) => {
    if (checkForChange && classData != null) {
      const changedKeys = Object.keys(newRes).filter((key) => classData[key] !== newRes[key]);
      if (changedKeys.length > 0) {
        console.log(`[${new Date()}] Keys changed: `);
        changedKeys.forEach((key) => {
          console.log(`${keyNameMap[key]}: changed from ${classData[key]} to ${newRes[key]}`);
        });
        console.log('\n');
        sendNotification(
          'Something on OSCAR changed!',
          'Check the console, and check buzzport!'
        );
      }
    }
    classData = newRes;
  });
}

async function main() {
  try {
    console.log(`Welcome to Blart!\nBlart is set to check for seat changes every ${Math.round(INTERVAL / 1000)} seconds.`);
    console.log(getHelpText() + '\n');
    await updateSeats();
    console.log(getSeatText() + '\n');

    setInterval(() => { updateSeats(true) }, INTERVAL);

    process.stdin.setRawMode(true);
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', async (key) => {
      if (key === 'h') {
        console.log(getHelpText() + '\n');
      } else if (key === 's') {
        await updateSeats(true);
        console.log(getSeatText() + '\n');
      } else if (key === 'o') {
        openLink(URL);
      } else if (key === 'e') {
        process.exit(0);
      }
    });
  } catch (e) {
    console.error('An error happened:', e);
  }
}

main();
