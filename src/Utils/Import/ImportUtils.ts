import * as convert from "xml-js";
import { stripHtml } from "../StringUtils";
import { convertPlecoStructureToVocabWords } from "./ImportPlecoUtils";
import { VocabWord } from "../DB/VocabDb";

export async function getTextFromFile(file: File): Promise<string> {
  return new Promise<string>(resolve => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      resolve(text as string);
    };
    reader.readAsText(file);
  });
}

export async function importJsonFile(file: File): Promise<VocabWord[]> {
  try {
    const jsonString = await getTextFromFile(file);
    const data = JSON.parse(jsonString);
    return data as VocabWord[];
  } catch (e) {
    return [];
  }
}

export async function importPlecoFile(file: File): Promise<VocabWord[]> {
  const xmlString = await getTextFromFile(file);
  const obj: any = convert.xml2js(xmlString, { compact: true });
  return convertPlecoStructureToVocabWords(obj);
}


export type AnkiData = {
  deckName: string;
  notes: { [key: string]: string }[],
  fields: string[]
}

export async function importAnkiFile(file: File): Promise<AnkiData | null> {
  try {
    const jsonString = await getTextFromFile(file);
    const data = JSON.parse(jsonString);
    console.log(data);

    if (data.note_models.length !== 1) {
      alert("Only export one deck at a time");
      return null;
    }

    const fields = data.note_models[0].flds.map(f => f.name);
    const notes = data.notes.map(note => {
      return fields.reduce((acc, field, i) => ({...acc, [field]: stripHtml(note.fields[i])}), {})
    });
    return { deckName: data.name, fields, notes}
  } catch (e) {
    alert("Could not import file");
    return null;
  }
}