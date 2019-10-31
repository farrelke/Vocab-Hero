import { useEffect, useState } from "react";
import * as React from "react";
import "./ReviewTab.scss";
import { speak } from "../Utils/SpeechUtils";
import { getRandomVocabWord, VocabWord } from "../Utils/IndexdbUtils";
import CountdownTimer from "../NewTab/components/CountdownTimer/CountdownTimer";
import { getUserPreferences } from "../Utils/DbUtils";

type Props = {
  tabId: number;
  redirectUrl: string;
};

const ReviewTab = (props: Props) => {
  const userPrefs = getUserPreferences();
  const [vocab, setVocab] = useState(null as null | VocabWord);

  const onReviewDone = () => {
    chrome.tabs.update(props.tabId, { url: props.redirectUrl });
  };

  useEffect(() => {
    const fn = async () => {
      const vocab = await getRandomVocabWord();
      if (!vocab) {
        onReviewDone();
        return;
      }
      setVocab(vocab);
      if (userPrefs.forceReviewAutoSpeak) {
        speak(vocab.word);
      }
    };
    fn();
  }, []);



  if (!vocab) return null;

  return (
    <div className="ReviewTab">
      <CountdownTimer seconds={6} onDone={onReviewDone} />
      <div className="ReviewTab__reading">{vocab.reading}</div>
      <div className="ReviewTab__word" onClick={() => speak(vocab.word)}>
        {vocab.word}
      </div>
      <div
        className={`ReviewTab__meaning ${
          vocab.meaning && vocab.meaning.length > 40
            ? "ReviewTab__meaning--long"
            : ""
        }`}
      >
        {vocab.meaning}
      </div>

      {vocab.sentences &&
        vocab.sentences.map((sentence, i) => (
          <div className="ReviewTab__sentenceWrapper" key={i}>
            <div
              className="ReviewTab__sentence"
              onClick={() => speak(sentence.sentence)}
            >
              {sentence.sentence}
            </div>

            <div className="ReviewTab__sentencePinyin">{sentence.reading}</div>
          </div>
        ))}
    </div>
  );
};

export default ReviewTab;
