const fs = require("fs").promises;
const getWordFreq = require("./create-freq-list.js");

const loadData = () => {
  return Promise.resolve(require("cedict"));
};

// https://stackoverflow.com/questions/6913512/how-to-sort-an-array-of-objects-by-multiple-fields
const fieldSorter = fields => (a, b) =>
  fields
    .map(o => {
      let dir = 1;
      if (o[0] === "-") {
        dir = -1;
        o = o.substring(1);
      }
      return a[o] > b[o] ? dir : a[o] < b[o] ? -dir : 0;
    })
    .reduce((p, n) => (p ? p : n), 0);

const init = async () => {
  const data = await loadData();
  const wordFreq = await getWordFreq();
  const wordDict = {};

  const wordList = data
    .map(wordData => {
      const word = {};
      word.word = wordData.simplified || wordData.traditional;
      // it seems like the last definition is the most accurate.
      const def = wordData.definitions && wordData.definitions[wordData.definitions.length - 1];
      if (!def) return null;

      word.reading = def.pinyin || "";

      // always use last definitions has they will be the most common case
      word.meaning = def.translations.join(", ") || "";
      word.freq = Number(wordFreq[word.word] || 0);
      word.hsk = wordData.hsk || 7;

      wordDict[word.word] = word;
      return word;
    })
    .filter(a => a)
    .sort(fieldSorter(["hsk", "-freq"]));

  await fs.writeFile("./data/wordDictList.json", JSON.stringify(wordList), "utf8");
  await fs.writeFile("./data/wordDict.json", JSON.stringify(wordDict), "utf8");
};

init();
