import { useState } from "react";
import * as React from "react";
import "./ReviewTab.scss";
import { speak } from "../Utils/SpeechUtils";
import { getRandomVocabWord, VocabWord } from "../Utils/DB/IndexdbUtils";
import { getUserPreferences } from "../Utils/UserPreferencesUtils";
import CountdownTimer from "../NewTab/Components/CountdownTimer/CountdownTimer";
import { useAsyncEffect } from "use-async-effect";
import classNames = require("classnames");

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

  useAsyncEffect(async () => {
    const vocab = await getRandomVocabWord();

    // If we don't have any vocab to review just return early
    if (!vocab) {
      onReviewDone();
      return;
    }

    setVocab(vocab);
    if (userPrefs.forceReviewAutoSpeak) {
      speak(vocab.word);
    }
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
        className={classNames("ReviewTab__meaning", {
          "ReviewTab__meaning--long": vocab.meaning && vocab.meaning.length > 40
        })}
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
