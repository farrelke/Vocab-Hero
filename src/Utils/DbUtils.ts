import { getJsonFile } from "./FetchUtils";
import * as FlexSearch from "flexsearch";

export interface WordDef {
  word: string;
  reading: string;
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
function setChromeStorage(
  key: string,
  value: any,
  onlyExtension = false
): Promise<void> {
  return new Promise(resolve => {
    const hasChromeStorage =
      window.chrome && chrome.storage && chrome.storage.local;
    if (hasChromeStorage) {
      chrome.storage.local.set({ [key]: value }, resolve);
    } else if (!onlyExtension) {
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
      field: ["word", "reading", "simplePinyin", "meaning"]
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
    const reading = word.reading.replace(" ", "");
    const simplePinyin = reading.replace(/[0-9]/g, "");
    return { ...word, reading, simplePinyin };
  });
  dictIndex.add(words);

  // noinspection JSIgnoredPromiseFromCall
  setChromeStorage("dictIndex", dictIndex.export(), true);

  return dictIndex;
}

export enum Language {
  Chinese = "Chinese",
  Japanese = "Japanese"
}
export const Languages = Object.keys(Language);

export type UserPreferences = {
  language: Language;
  voiceURI: string;
};

let preferences: UserPreferences;

export const getUserPreferences = () => {
  if (preferences) return preferences;
  preferences = JSON.parse(localStorage.getItem("userPreferences")) || {
    language: Language.Chinese,
    voiceURI: "Google\u00A0普通话（中国大陆）" // unicode space is different from ascii space :(
  };
  return preferences;
};

export const setUserPreferences = (userPreferences: UserPreferences) => {
  preferences = userPreferences;
  localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
};