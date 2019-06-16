const fs = require("fs");

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
    word.pinyin =
      (wordData.definitions && wordData.definitions[0].pinyin) || "";
    word.translation =
      (wordData.definitions &&
        wordData.definitions[0].translations.join("\n")) ||
      "";
    wordList[word.word] = word;
  });

  fs.writeFile("./data/wordDict.json", json, "utf8", () => {});
};

init();
