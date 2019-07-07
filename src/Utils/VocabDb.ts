import Dexie from 'dexie';


export interface VocabWord {
  id?: string;
  word: string;
  wordPinyin: string;
  meaning: string;
  sentences: {
    sentence: string;
    pinyin: string;
  }[];
}

export class VocabDb extends Dexie {
  vocab:  Dexie.Table<VocabWord, string>;

  constructor() {
    super('VocabDb');
    this.version(1).stores({
      vocab: '++id,word,wordPinyin,meaning'
    });
  }

}