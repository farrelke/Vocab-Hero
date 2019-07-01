import { getJsonFile } from "./FetchUtils";
import * as FlexSearch from "flexsearch";

export interface VocabWord {
  word: string;
  wordPinyin: string;
  meaning: string;
  sentences: {
    sentence: string;
    pinyin: string;
  }[];
}

export interface WordDef {
  word: string;
  wordPinyin: string;
  meaning: string;
}

export interface WordDefDict {
  [word: string]: WordDef;
}

function getChromeStorage<T>(key: string): Promise<T> {
  return new Promise<T>(resolve => {
    const hasChromeStorage =
      window.chrome && chrome.storage && chrome.storage.local;
    if (hasChromeStorage) {
      chrome.storage.local.get([key], result => resolve(result[key]));
    } else {
      try {
        resolve(JSON.parse(localStorage.getItem(key)));
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    }
  });
}
function setChromeStorage(key: string, value: any, onlyExtension = false): Promise<void> {
  return new Promise(resolve => {
    const hasChromeStorage =
      window.chrome && chrome.storage && chrome.storage.local;
    if (hasChromeStorage) {
      chrome.storage.local.set({ [key]: value }, resolve);
    } else if(!onlyExtension) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        resolve();
      } catch (e) {
        console.log(e);
        resolve();
      }
    } else {
      resolve();
    }
  });
}

export async function getVocabWords(): Promise<VocabWord[]> {
  return getChromeStorage<VocabWord[]>("words");
}

export async function setVocabWords(words: VocabWord[]) {
  return setChromeStorage("words", words);
}

let wordDict: WordDefDict;

export async function getWordDict(): Promise<WordDefDict> {
  try {
    if (wordDict) return wordDict;
    wordDict = await getChromeStorage<WordDefDict>("wordDict");
    if (wordDict) return wordDict;

    wordDict = await getJsonFile<WordDefDict>(
      "https://raw.githubusercontent.com/farrelke/chinese-vocab/master/data/wordDict.json"
    );

    // noinspection JSIgnoredPromiseFromCall
    setChromeStorage("wordDict", wordDict, true);

    return wordDict;
  } catch (e) {
    return {};
  }
}

let dictIndex: any;
export async function getDictIndex(): Promise<any> {
  if (dictIndex) return dictIndex;

  dictIndex = new FlexSearch({
    doc: {
      id: "word",
      field: ["word", "wordPinyin", "simplePinyin", "meaning"]
    }
  });

  const dictIndexData = await getChromeStorage<WordDefDict>("dictIndex");
  if (dictIndexData) {
    try {
      dictIndex.import(dictIndexData);
      return dictIndex;
    } catch (e) {}
  }

  const wordDict = await getWordDict();
  const words = Object.keys(wordDict).map(key => {
    let word = wordDict[key];
    const wordPinyin = word.wordPinyin.replace(" ", "");
    const simplePinyin = wordPinyin.replace(/[0-9]/g, "");
    return { ...word, wordPinyin, simplePinyin };
  });
  dictIndex.add(words);

  // noinspection JSIgnoredPromiseFromCall
  setChromeStorage("dictIndex", dictIndex.export(), true);

  return dictIndex;
}
