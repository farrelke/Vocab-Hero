import Dexie from "dexie";
import { stopWords } from "./StopWords";
import { ImageAuthor } from "../Unsplash";


// Generate word tokens from sentences so we can allow the user to
// search by the english meaning. We first remove any punctuation and then remove any stop words
const punctuationRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
export const getWordTokens = (text: string): string[] => {
  const tokens = text
    .replace(punctuationRE, "")
    .toLowerCase()
    .split(" ");
  return tokens.filter(t => t && !stopWords[t]);
};

export interface VocabWord {
  id?: string;
  word: string;
  reading: string;
  meaning: string;
  sentences: {
    sentence: string;
    reading: string;
  }[];
  imageUrl?: string;
  imageAuthor?: ImageAuthor;
  audio?: Blob
}

export interface WordDef {
  id?: string;
  word: string;
  reading: string;
  meaning: string;
  sentences?: {
    sentence: string;
    reading: string;
  }[];

  // for indexing
  readingNoSpaces?: string;
  readingSimple?: string;
  meaningWords?: string[];
  freq: number;
  hsk: number;
}

export class VocabDb extends Dexie {
  vocab: Dexie.Table<VocabWord, string>;
  dict: Dexie.Table<WordDef, string>;

  constructor() {
    super("VocabDb");

    // when saving words to the database we store them using for tone marks
    // so the user will be able to search with the correct tones
    this.version(3).stores({
      vocab: "++id,word",
      dict:
        "++id, word, readingNoSpaces, readingSimple, *meaningWords, freq, hsk"
    });

    this.vocab = this.table("vocab");
    this.dict = this.table("dict");

    this.dict.hook("creating", (primKey, wordDef) => {
      const reading = wordDef.reading || (wordDef as any).wordPinyin || "";
      wordDef.reading = reading;
      wordDef.readingNoSpaces = reading.replace(/ /g, "");
      wordDef.readingSimple = wordDef.readingNoSpaces!.replace(/[0-9]/g, "");
      wordDef.meaningWords = getWordTokens(wordDef.meaning);
      wordDef.sentences = [];
    });
  }
}
