const fs = require("fs");
const hsk = require("cedict/hsk");
const getWordFreq = require("./create-freq-list.js");

const loadData = () => {
  return Promise.resolve(require("cedict"));
};

// https://stackoverflow.com/questions/6913512/how-to-sort-an-array-of-objects-by-multiple-fields
const fieldSorter = (fields) => (a, b) => fields.map(o => {
  let dir = 1;
  if (o[0] === '-') { dir = -1; o=o.substring(1); }
  return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
}).reduce((p, n) => p ? p : n, 0);


const init = async () => {
  const data = await loadData();
  console.log(data[1010]);
  console.log(data[1010].definitions);
  const wordFreq = await getWordFreq();

  const wordList = data.map(wordData => {
    const word = {};
    word.word = wordData.simplified || wordData.traditional;
    word.reading =
      (wordData.definitions && wordData.definitions[0].pinyin) || "";
    word.meaning =
      (wordData.definitions &&
        wordData.definitions[0].translations.join(", ")) ||
      "";
    word.freq = Number(wordFreq[word.word] || 0);
    word.hsk = wordData.hsk || 7;
    return word;
  }).sort(fieldSorter(['hsk', '-freq']));

  const json = JSON.stringify(wordList);

  fs.writeFile("./data/wordDictList.json", json, "utf8", () => {});
};

init();
