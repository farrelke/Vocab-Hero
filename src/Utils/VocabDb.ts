import Dexie from "dexie";
import * as lunr from "lunr";

const index: any = lunr(function () {
  this.pipeline.after(lunr.stopWordFilter, function (token) {
    // text processing in here
    return token;
  })
});

const getTokenStream = text => index.pipeline.run(lunr.tokenizer(text));

export interface VocabWord {
  id?: string;
  word: string;
  reading: string;
  meaning: string;
  sentences: {
    sentence: string;
    reading: string;
  }[];
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
  meaningWords?: string;
}

export class VocabDb extends Dexie {
  vocab: Dexie.Table<VocabWord, string>;
  dict: Dexie.Table<WordDef, string>;

  constructor() {
    super("VocabDb");
    this.version(3).stores({
      vocab: "++id,word",
      dict: "++id, word, readingNoSpaces, readingSimple, *meaningWords, freq, hsk"
    });

    this.vocab = this.table("vocab");
    this.dict = this.table("dict");

    // lunr is not stripping out brackets, TODO move this function into lunr func
    const punctuationRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;

    this.dict.hook("creating", (primKey, wordDef) => {
      const reading = wordDef.reading || (wordDef as any).wordPinyin || "";
      wordDef.reading = reading;
      wordDef.readingNoSpaces = reading.replace(/ /g, "");
      wordDef.readingSimple = wordDef.readingNoSpaces.replace(/[0-9]/g, "");
      wordDef.meaningWords = getTokenStream(wordDef.meaning).map(({ str }) =>
        str.replace(punctuationRE, "")
      );
      wordDef.sentences = [];
    });
  }
}
