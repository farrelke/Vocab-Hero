import { bulkAddVocabWords } from "./IndexdbUtils";


export interface LegacyVocabWord {
  word: string;
  wordPinyin: string;
  meaning: string;
  sentences?: {
    sentence: string;
    pinyin: string;
  }[];
}

export async function getLegacyVocabWords(): Promise<LegacyVocabWord[]> {
  return new Promise<LegacyVocabWord[]>(resolve => {
    if (!window.chrome) return;
    chrome.storage.local.get(["words"], result => resolve(result.words));
  });
}

/*
const testWords = [{
  word: "冲突",
  wordPinyin: "chōng tū",
  meaning: "conflict",
  sentences: [{
    sentence: "怎么解决代码冲突的问题？",
    pinyin: "Zěnme jiě jué dàimǎ chōngtū de wèntí？"
  }]
},
  {
    word: "冲突",
    wordPinyin: "chōng tū",
    meaning: "conflict",
  }];

export async function setVocabWords(words: LegacyVocabWord[]) {
  return new Promise(resolve => {
    if (!window.chrome) return;
    chrome.storage.local.set({ words: words }, resolve);
  });
}
export async function fakeLegacyUser() {
  await setVocabWords(testWords);
}


export async function upgradeLegacyUsers() {
  if (window.localStorage.getItem("legacyWordsChecked")) return ;
  const legacyWords = await this.getLegacyVocabWords();
  if (legacyWords) {
    const newFormatWords = legacyWords.map(word => ({
      word: word.word || '',
      reading: word.wordPinyin || '',
      meaning: word.meaning || '',
      sentences: word.sentences ? word.sentences.map(sen => ({
        sentence: sen.sentence || '',
        reading: sen.pinyin || ''
      })) : []
    }));
    await bulkAddVocabWords(newFormatWords);
    chrome.storage.local.clear();
  }
  window.localStorage.setItem("legacyWordsChecked", "true");
}
*/
