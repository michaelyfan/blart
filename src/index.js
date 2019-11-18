/*
Some requirements:
never stop retrying. if fail (ex. internet loss), just keep retrying
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const notifier = require('node-notifier');
const { 
  setIntervalImmediately
} = require('./utils');

const INTERVAL = 30000; // half a min
const URL = 'https://oscar.gatech.edu/pls/bprod/bwckschd.p_disp_detail_sched?term_in=202002&crn_in=31568';
let data = null;

function getClassNumbers() {
  return axios(URL).then(res => {
    const html = res.data;
    const $ = cheerio.load(html);

    const elems = $('.dddefault');
    return {
      seatsCapacity: $(elems[1]).html(),
      seatsActual: $(elems[2]).html(),
      seatsRemaining: $(elems[3]).html(),
      waitlistCapacity: $(elems[4]).html(),
      waitlistActual: $(elems[5]).html(),
      waitlistRemaining: $(elems[6]).html()
    };
  });
  
}

function checkSite() {
  getClassNumbers().then((res) => {
    let changed = false;
    Object.entries(res).forEach(([key, val]) => {
      if (data[key] !== val) {
        console.log(`(${new Date()}) | ${key} | ${val}`)
        changed = true;
        // send email, or do something that results in notification, then...
        data[key] = val;

        notifier.notify({
          title: 'Something on OSCAR changed!',
          message: 'Check the console, and check buzzport!',
          sound: true, // Only Notification Center or Windows Toasters
          wait: false
        });
      }
    });
    if (!changed) {
      // console.log('No updates detected.')
    }
  }).catch((err) => {
    console.log(`(${new Date()}) Error happened:`, err, '\n\n');
  });
}

async function main(resumeFile, config) {
  // initial data
  data = await getClassNumbers();

  setIntervalImmediately(checkSite, INTERVAL);
  // setIntervalImmediately(checkSite, 1500);
}

main();
