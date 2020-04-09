const hsk = require("cedict/hsk");
const dict = require("./wordDict.json");
const fs = require("fs").promises;

const toJson = wordList => JSON.stringify(wordList, null, "\t");

const createHskList = async level => {
  const hskWords = hsk[level - 1]
    .map(word => {
      const dictWord = dict[word];
      if (!dictWord) {
        console.error(`Could not find data for ${word}`);
      }
      return dictWord;
    })
    .filter(a => a);
  await fs.writeFile(`./data/hsk-${level}.json`, toJson(hskWords), "utf8");
  console.log(`Hsk List ${level} has been generated with ${hskWords.length} words`);
};

const createAllHskLists = async () => {
  for (let level = 1; level <= 6; level++) {
    await createHskList(level);
  }
};

createAllHskLists().then(() => {});
