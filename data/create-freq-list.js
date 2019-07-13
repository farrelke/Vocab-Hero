const { once } = require('events');
const { createReadStream } = require('fs');
const { createInterface } = require('readline');



module.exports = async function getWordFreq() {
  const freq = {};
  try {
    const rl = createInterface({
      input: createReadStream("./imported-data/SUBTLEX-CH-WF.csv"),
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      const cells = line.split(",");
      freq[cells[0]] = cells[1];
    });

    await once(rl, 'close');
    console.log('File processed.');
  } catch (err) {
    console.error(err);
  }

  return freq;
};