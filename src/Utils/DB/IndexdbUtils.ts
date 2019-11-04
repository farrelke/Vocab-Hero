import { getWordTokens, VocabDb, VocabWord, WordDef } from "./VocabDb";
import { isChineseChar } from "../StringUtils";
import { getJsonFile } from "../FetchUtils";
import { getChromeLocalVal, updateChromeSetting } from "../ChromeSettingUtils";
export { VocabWord } from "./VocabDb";

const db: VocabDb = new VocabDb();

export async function bulkAddVocabWords(words: VocabWord[]): Promise<void> {
  await db.vocab.bulkAdd(words);
}

export async function addVocabWord(word: VocabWord): Promise<VocabWord> {
  const id: string = await db.vocab.put(word);
  return { ...word, id };
}

export async function updateVocabWord(word: VocabWord): Promise<void> {
  await db.vocab.update(word.id, word);
}

export async function clearAllVocab(): Promise<void> {
  await db.vocab.clear();
}

export async function deleteVocabWord(word: VocabWord): Promise<void> {
  await db.vocab.delete(word.id);
}

export async function getVocabWords(): Promise<VocabWord[]> {
  return (await db.vocab.toArray()).reverse();
}

export async function getRandomVocabWord(): Promise<VocabWord | null> {
  const cnt = await db.vocab.count();
  if (cnt === 0) return null;
  return await db.vocab.offset(Math.floor(Math.random() * cnt)).first();
}

let dictPromise: Promise<void> = null;
export async function initDict(): Promise<void> {
  if (dictPromise) return dictPromise;

  const dictCnt = await db.dict.count();
  if (dictCnt > 0) return;

  dictPromise = addDict();
  await dictPromise;
  dictPromise = null;
}

export type WordDict = { [word: string]: WordDef };
let wordDict: WordDict | undefined;
export async function getWordDict(): Promise<WordDict> {
  if (wordDict) return wordDict;


  wordDict = await getChromeLocalVal<WordDict | undefined>(
    "wordDict",
    undefined
  );
  if (wordDict) return wordDict;

  wordDict = {};
  await db.dict.each(def => {
    wordDict[def.word] = def;
  });

  updateChromeSetting({ wordDict });

  return wordDict;
}

export async function addDict(): Promise<void> {
  const wordDict = await getJsonFile<WordDef[]>(
    "https://raw.githubusercontent.com/farrelke/chinese-vocab/master/data/wordDictList.json"
  );
  await db.dict.bulkAdd(wordDict);
}

export async function findWord(word: string): Promise<WordDef> {
  return await db.dict
    .where("word")
    .equals(word)
    .first();
}

export async function searchDict(query: string): Promise<WordDef[]> {
  query = query.toLowerCase();

  const isHanzi = query.split("").every(a => isChineseChar(a));

  if (isHanzi) {
    return await db.dict
      .where("word")
      .startsWith(query)
      .distinct()
      .limit(35)
      .toArray();
  }

  const words = getWordTokens(query);

  if (words.length === 0) return [];

  if (words.length === 1) {
    const word = words[0];
    return await db.dict
      .where("readingNoSpaces")
      .startsWith(word)
      .or("readingSimple")
      .startsWith(word)
      .or("meaningWords")
      .startsWith(word)
      .distinct()
      .limit(35)
      .toArray();
  }

  return db.transaction("r", db.dict, async () => {
    const results = await Promise.all(
      words.map(prefix =>
        db.dict
          .where("meaningWords")
          .startsWith(prefix)
          .primaryKeys()
      )
    );

    // Intersect result set of primary keys
    const reduced = results.reduce((a, b) => {
      const set = new Set(b);
      return a.filter(k => set.has(k));
    });

    return await db.dict
      .where(":id")
      .anyOf(reduced)
      .distinct()
      .limit(35)
      .toArray();
  });
}
