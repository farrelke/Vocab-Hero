import { getWordDict, initDict, WordDict } from "./DB/IndexdbUtils";
import PinyinConverter from "./PinyinConverter";
import { WordDef } from "./DB/VocabDb";

export const getLongestMatch = (wordDict: WordDict, str: string) => {
  let i, max_word_len, slice;
  max_word_len = 8;
  i = max_word_len > str.length ? max_word_len : str.length;
  while (i >= 0) {
    slice = str.substr(0, i);
    if (wordDict[slice]) {
      return slice;
    }
    i--;
  }
  // no match found, return undefined
  return undefined;
};

export const segmentLine = (wordDict: WordDict, line: string) => {
  let seg, segments;
  segments = [];
  // loop through the input_str, slicing off each longestMatch and
  // appending it to the segments array
  while (line.length > 0) {
    seg = getLongestMatch(wordDict, line);
    if (!seg) {
      seg = line.substr(0, 1);
    }
    line = line.slice(seg.length);
    segments.push(seg);
  }

  return segments
    .map(a => (wordDict[a] ? wordDict[a] : { word: a }))
    .map(a => ({ ...a, reading: PinyinConverter.convert(a.reading || "") }));
};


export const segment = async (text: string): Promise<WordDef[][]> => {
  await initDict();
  const wordDict = await getWordDict();
  const lines = text.split("\n");
  return lines.map(line => segmentLine(wordDict, line));
};
