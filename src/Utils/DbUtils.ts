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
  [word: string]: WordDef
}


function getChromeStorage<T>(key: string): Promise<T> {
  return new Promise<T>(resolve => {
    chrome.storage.local.get([key], result => resolve(result[key]));
  });
}
function setChromeStorage(key: string, value: any): Promise<void> {
  return new Promise(resolve => {
    chrome.storage.local.set({ [key]: value }, resolve);
  });
}

function getJsonFile<T>(url: string): Promise<T> {
  return fetch(url).then(response => {
    return response.json();
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
  //  wordDict = await getChromeStorage<WordDefDict>("wordDict");
    if (wordDict) return wordDict;

    wordDict = await getJsonFile<WordDefDict>(
      "https://raw.githubusercontent.com/farrelke/chinese-vocab/master/data/wordDict.json"
    );

    // noinspection JSIgnoredPromiseFromCall
    setChromeStorage("wordDict", wordDict);

    return wordDict;
  } catch (e) {
    return {};
  }
}
