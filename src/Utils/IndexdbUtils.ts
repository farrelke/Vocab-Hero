import { VocabDb, VocabWord } from "./VocabDb";
export { VocabWord } from "./VocabDb";

const db: VocabDb = new VocabDb();


export async function bulkAddVocabWords(
  words: VocabWord[]
): Promise<void> {
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



