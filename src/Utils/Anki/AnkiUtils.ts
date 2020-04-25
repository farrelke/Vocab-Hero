import { Guid } from "guid-typescript";

import front from "./templates/anki-front";
import back from "./templates/anki-front";
import styling from "./templates/anki-front";
import { VocabWord } from "../DB/VocabDb";
import { convertWebmToOgg } from "../FfmpegUtils";

const ankiServer = "http://127.0.0.1:8765";
const version = 6;

export const convertBlobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onloadend = function() {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const sendAnkiAction = async <T>(action: string, params = {}): Promise<T> => {
  try {
    const res = await fetch(ankiServer, {
      method: "POST",
      body: JSON.stringify({ action, version, params })
    });
    const ans = await res.json();
    if (ans.error) {
      // noinspection ExceptionCaughtLocallyJS
      throw ans.error;
    }

    return ans.result;
  } catch (e) {
    // we just want to ignore this error
    if (e === "Model name already exists") {
      return "" as any;
    }
    alert("Could not connect to Anki. Make sure anki-connect is installed and anki is running");
    throw e;
  }
};

export const getDecks = async () => {
  return await sendAnkiAction<string[]>("deckNames");
};

export const createDeck = async (deckName: string) => {
  // returns deck id
  return await sendAnkiAction<number>("createDeck", { deck: deckName });
};

export const getModelNames = async () => {
  return await sendAnkiAction<string[]>("modelNames");
};

export const createModel = async (modelName: string) => {
  return await sendAnkiAction<any>("createModel", {
    modelName: modelName,
    inOrderFields: ["simplified", "pinyin", "meaning", "audio"],
    css: styling,
    cardTemplates: [
      {
        Front: front,
        Back: back
      }
    ]
  });
};

export const getModelTemplates = async (modelName: string) => {
  return await sendAnkiAction<{ [card: string]: { [feild: string]: string } }[]>("modelTemplates", { modelName });
};

type Note = {
  simplified: string;
  pinyin: string;
  meaning: string;
  audio: string;
};
const createNote = async (params: { deckName: string; modelName: string; fields: Note }) => {
  return await sendAnkiAction<any>("addNote", {
    note: {
      ...params,
      tags: []
    }
  });
};

const createNotes = async (deckName: string, modelName: string, notes: Note[]) => {
  return await sendAnkiAction<any>("addNotes", {
    notes: notes.map(fields => ({
      deckName,
      modelName,
      fields,
      tags: []
    }))
  });
};

const storeMediaFile = async (file: Blob) => {
  // TODO do more testing on supported file types in ffmpeg and anki
  if (["audio/webm", "audio/ogg"].indexOf(file.type) === -1) return "";
  const oggBlob = file.type === "audio/webm" ? await convertWebmToOgg(file) : file;
  const dataBase64 = await convertBlobToBase64(oggBlob);
  const filename = `vocabhero-${Guid.create()}.ogg`;
  await sendAnkiAction("storeMediaFile", {
    filename,
    data: dataBase64.replace("data:audio/ogg;base64,", "")
  });
  return `[sound:${filename}]`;
};

export const createNotesFromWords = async (deckName: string, modelName: string, words: VocabWord[]) => {
  const notes: Note[] = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const audio = word.audio ? await storeMediaFile(word.audio) : "";
    notes.push({
      simplified: word.word,
      pinyin: word.reading,
      meaning: word.meaning,
      audio
    });
  }
  await createNotes(deckName, modelName, notes);
};
