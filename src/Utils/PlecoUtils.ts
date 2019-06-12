import * as convert from "xml-js";
import { isChineseChar } from "./StringUtils";
import { VocabWord } from "./DbUtils";
import PinyinConverter from "./PinyinConverter";

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

export async function importPlecoFile(file: File): Promise<VocabWord[]> {
  const xmlString = await getTextFromFile(file);
  const obj: any = convert.xml2js(xmlString, { compact: true });

  return obj.plecoflash.cards.card.map(({entry}) => {
    const defData: string[] = Array.isArray(entry.defn)
      ? entry.defn[0]._text
      : entry.defn._text;
    const headword = Array.isArray(entry.headword)
      ? entry.headword[0]._text
      : entry.headword._text;
    const pron = Array.isArray(entry.pron)
      ? entry.pron[0]._text
      : entry.pron._text;

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
  });
}
