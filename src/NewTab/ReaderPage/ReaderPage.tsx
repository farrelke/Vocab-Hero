import * as React from "react";
import "./ReaderPage.scss";
import { segment } from "../../Utils/SegementerUtils";
import { useEffect, useState } from "react";
import { VocabWord, WordDef } from "../../Utils/DB/VocabDb";
import classNames from "classnames";
import { speak } from "../../Utils/SpeechUtils";
import { useAsyncEffect } from "use-async-effect";
import { getWordDict, initDict } from "../../Utils/DB/IndexdbUtils";
type Props = {
  addWord: (word: VocabWord) => any;
};

const SelectGroup = (props: {
  label: string;
  link?: { label: string; link: string };
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => any;
  options: ({ value: string | number; label: string } | number | string)[];
}) => {
  return (
    <div className="ReaderPage__group">
      <label className="ReaderPage__label">
        {props.label}{" "}
        {props.link && (
          <a href={props.link.link} target="_blank">
            {props.link.label}
          </a>
        )}
      </label>
      <select
        className="ReaderPage__control"
        value={props.value}
        onChange={props.onChange}
      >
        {props.options.map(option => {
          const value = typeof option === "object" ? option.value : option;
          const label = typeof option === "object" ? option.label : option;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

const ReaderPage = (props: Props) => {
  const [hskLevel, setHskLevel] = useState(4);
  const [wordFreq, setWordFreq] = useState(1000);
  const [loadingDict, setLoadingDict] = useState(true);
  const [lines, setLines] = useState([] as WordDef[][]);
  const [canHover, setCanHover] = useState(true);

  useAsyncEffect(async () => {
    await initDict();
    await getWordDict();
    setLoadingDict(false);
  }, []);

  useEffect(() => {
    if (!canHover) {
      setCanHover(true);
    }
  }, [canHover]);

  if (loadingDict)
    return (
      <div className="ReaderPage">
        <div>Loading...</div>
      </div>
    );

  const onTextChanged = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const lines = await segment(text);
    setLines(lines);
  };

  const addWord = (wordDef: WordDef) => {
    setCanHover(false);
    const vocabWord: VocabWord = {
      word: wordDef.word,
      reading: wordDef.reading || "",
      meaning: wordDef.meaning || "",
      sentences: []
    };
    props.addWord(vocabWord);
  };

  return (
    <div className="ReaderPage">
      <SelectGroup
        label="Min HSK"
        value={hskLevel}
        onChange={e => {
          setHskLevel(Number(e.target.value));
        }}
        options={[1, 2, 3, 4, 5, 6, 7].map(val => ({
          value: val,
          label: `HSK ${val > 6 ? "6+" : val}`
        }))}
      />

      <SelectGroup
        label="Max word frequency (if no HSK level is found)"
        link={{
          link:
            "https://github.com/chrplr/openlexicon/blob/master/datasets-info/SUBTLEX-CH/README-subtlex-ch.md",

          label: "Based on Film Subtitles"
        }}
        value={wordFreq}
        onChange={e => {
          setWordFreq(Number(e.target.value));
        }}
        options={[10000, 1000, 500, 100, 50]}
      />

      <textarea
        rows={10}
        onChange={onTextChanged}
        placeholder="Copy and paste in some chinese text here"
      />

      <div className="ReaderPage__wordContainer">
        {lines.map((words, i) => (
          <div className="ReaderPage__sentence" key={i}>
            {words.map((word, j) => {
              const hasDef = !!word.meaning;
              const hasHsk = word.hsk > 0 && word.hsk <= 6;

              const hsk = hasHsk ? word.hsk : 0;
              const complicatedWord =
                hasDef &&
                (hasHsk ? hsk >= hskLevel : (word.freq || 0) < wordFreq);
              return (
                <span
                  key={word.word + j}
                  className={classNames(
                    "ReaderPage__word",
                    `ReaderPage__word--hsk-${word.hsk || 0}`,
                    {
                      [`ReaderPage__word--hard`]: complicatedWord
                    }
                  )}
                  onClick={() => complicatedWord && speak(word.word)}
                >
                  {word.word}
                  {canHover && (
                    <div className="ReaderPage__wordDefBox">
                      <div className="ReaderPage__wordDefReading">
                        {word.reading}
                      </div>
                      <div className="ReaderPage__wordDefWord">{word.word}</div>

                      <div className="ReaderPage__wordDefMeaning">
                        {word.meaning}
                      </div>

                      {hasHsk && (
                        <div className="ReaderPage__wordDefHsk">
                          Hsk {word.hsk}
                        </div>
                      )}
                      {!hasHsk && (
                        <div className="ReaderPage__wordDefHsk">
                          Word Freq {word.freq}
                        </div>
                      )}
                      <div
                        className="ReaderPage__addWordBtn"
                        onClick={e => {
                          e.stopPropagation();
                          addWord(word);
                        }}
                      >
                        Learn
                      </div>
                    </div>
                  )}
                </span>
              );
            })}
            {words.length < 0 && (
              <span onClick={() => speak(words.map(w => w.word).join(" "))}>
                Play
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReaderPage;
