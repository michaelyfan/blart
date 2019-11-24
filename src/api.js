const axios = require('axios');
const cheerio = require('cheerio');

function getClassNumbers(url) {
  return axios(url).then(res => {
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

module.exports = {
  getClassNumbers,
};
