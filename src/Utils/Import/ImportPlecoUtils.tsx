import { isChineseChar } from "../StringUtils";
import PinyinConverter from "../PinyinConverter";
import { VocabWord } from "../DB/VocabDb";

type PlecoTextNode =
  | {
      _text: string;
    }[]
  | { _text: string };

type PlecoInternalStructure = {
  plecoflash: {
    cards: {
      card: {
        entry: {
          defn?: PlecoTextNode;
          headword?: PlecoTextNode;
          pron?: PlecoTextNode;
          z;
        };
      }[];
    };
  };
};

const extractUtilCharType = (str: string, chinese: boolean) => {
  let word = "";
  let i = 0;
  for (; i < str.length; i++) {
    const letter = str[i];
    if (isChineseChar(letter) === chinese) {
      return word;
    }
    word += letter;
  }
  return word;
};

const extractStrFromTextNode = (textNode: PlecoTextNode | undefined) => {
  return textNode ? (Array.isArray(textNode) ? textNode[0]._text : textNode._text) || "" : "";
};

export const convertPlecoStructureToVocabWords = (plecoJson: PlecoInternalStructure): VocabWord[] => {
  return plecoJson.plecoflash.cards.card
    .map(({ entry }) => {
      try {
        const defData = extractStrFromTextNode(entry.defn);
        const word = extractStrFromTextNode(entry.headword);
        const reading = extractStrFromTextNode(entry.pron);

        // the definition should be in english
        const def = extractUtilCharType(defData, true);

        // the example sentence should be in chinese
        const sentenceStr = defData.substr(def.length);
        const sentence = sentenceStr.length ? extractUtilCharType(sentenceStr, false) : "";

        return {
          word: word,
          reading: PinyinConverter.convert(reading.replace("//", " ")),
          meaning: def.trim(),
          sentences: sentence.length
            ? [
                {
                  sentence: sentence,
                  reading: ""
                }
              ]
            : []
        };
      } catch (e) {
        return null;
      }
    })
    .filter(a => a);
};
