const fs = require("fs");
const hsk = require('cedict/hsk');


const loadData = () => {
  return Promise.resolve(require("cedict"));
};

const init = async () => {
  const data = await loadData();
  console.log(data[1010]);
  console.log(data[1010].definitions);

  const wordList = {};
  data.map(wordData => {
    const word = {};
    word.word = wordData.simplified || wordData.traditional;
    word.reading =
      (wordData.definitions && wordData.definitions[0].pinyin) || "";
    word.meaning =
      (wordData.definitions &&
        wordData.definitions[0].translations.join(", ")) ||
      "";
    wordList[word.word] = word;
  });

  const json = JSON.stringify(wordList);

  fs.writeFile("./data/wordDict.json", json, "utf8", () => {});

  hsk.map((list,i) => {
    const hskWords = list.map(word => wordList[word]);
    fs.writeFile(`./data/hsk-${i + 1}.json`, JSON.stringify(hskWords), "utf8", () => {});
  })
};

init();
