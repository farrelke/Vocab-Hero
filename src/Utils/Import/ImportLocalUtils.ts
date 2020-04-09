import { saveAs } from "file-saver";
import { VocabWord } from "../DB/VocabDb";
import * as JSZip from "jszip";
import { getTextFromFile } from "./ImportUtils";

const getFileName = (name: string, blobType: string) => {
  // TODO make a more robust solution
  const ext = blobType.split("/").pop();
  return `${name}.${ext}`;
};

const saveWithAudio = async (words: VocabWord[]) => {
  const zip: JSZip = new JSZip();

  const wordsWithAudioPath = words.map(({ audio, ...word }) => {
    if (!audio) return word;

    const fileName = getFileName(word.word, audio.type);
    const audioPath = `audio/${fileName}`;
    zip.file(audioPath, audio);
    return { ...word, audioPath };
  });

  const jsonStr = JSON.stringify(wordsWithAudioPath, null, 2);
  zip.file("vocab-list.json", jsonStr);

  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, "vocab-list.zip");
};

const saveWithoutAudio = (words: VocabWord[]) => {
  const jsonStr = JSON.stringify(words, null, 2);
  const vocabFile = new File([jsonStr], "vocab-list.json", {
    type: "application/json;charset=utf-8"
  });
  saveAs(vocabFile);
};

export const saveWordsAsJson = async (words: VocabWord[]) => {
  // remove id since it's related to database ID
  // which will be different for every user
  // reverse so the newest words appear first
  words = words.map(({ id, ...word }) => word).reverse();

  if (words.some(w => w.audio)) {
    await saveWithAudio(words);
  } else {
    saveWithoutAudio(words);
  }
};

async function importJsonFile(file: File | Blob): Promise<VocabWord[]> {
  try {
    const jsonString = await getTextFromFile(file);
    const data = JSON.parse(jsonString);
    return data as VocabWord[];
  } catch (e) {
    return [];
  }
}

async function importZipFile(file: File): Promise<VocabWord[]> {
  try {
    const zip = await JSZip.loadAsync(file);
    const jsonFile = await zip.files["vocab-list.json"].async("blob");
    const words = await importJsonFile(jsonFile);

    return await Promise.all(
      words.map(async ({ audioPath, ...word }: any) => {
        if (!audioPath) return word;
        const audio = await zip.files[audioPath].async("blob");
        return { ...word, audio };
      })
    );
  } catch (e) {
    return [];
  }
}

export async function importLocalFile(file: File): Promise<VocabWord[]> {
  const ext = file.name.split(".").pop();
  if (ext === "json") {
    return importJsonFile(file);
  } else if (ext === "zip") {
    return importZipFile(file);
  } else {
    alert("File type not supported");
    return [];
  }
}
