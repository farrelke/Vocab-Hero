import * as convert from "xml-js";
import { isChineseChar, stripHtml } from "./StringUtils";
import PinyinConverter from "./PinyinConverter";
import { VocabWord } from "./IndexdbUtils";

export async function getTextFromFile(file: File): Promise<string> {
  return new Promise<string>(resolve => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      resolve(text);
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

  return obj.plecoflash.cards.card.map(({ entry }) => {
    try {
      const defData: string[] =
        (entry.defn &&
          (Array.isArray(entry.defn) ? entry.defn[0]._text : entry.defn._text)) ||
        "";
      const headword =
        (entry.headword &&
          (Array.isArray(entry.headword)
            ? entry.headword[0]._text
            : entry.headword._text)) ||
        "";
      const pron =
        (entry.pron &&
          (Array.isArray(entry.pron) ? entry.pron[0]._text : entry.pron._text)) ||
        "";

      let def = "";
      let i = 0;
      for (; i < defData.length; i++) {
        const letter = defData[i];
        if (isChineseChar(letter)) {
          break;
        }
        def += letter;
      }
      let sentence = "";
      for (; i < defData.length; i++) {
        const letter = defData[i];
        if (!isChineseChar(letter)) {
          break;
        }
        sentence += letter;
      }

      return {
        word: headword,
        wordPinyin: PinyinConverter.convert(pron.replace("//", " ")),
        meaning: def.trim(),
        sentences: [
          {
            sentence: sentence,
            pinyin: ""
          }
        ]
      };
    } catch (e) {
      return null
    }
  }).filter(a => a);
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