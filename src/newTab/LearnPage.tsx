import * as React from "react";
import { PureComponent } from 'react';
import "./LearnPage.scss"

type Props = {
  vocab: any;
}

let chineseVoice: any = null;
window.speechSynthesis.onvoiceschanged = () => {
  const voices = speechSynthesis.getVoices();
  // need to be able to tell the subtitle language
  chineseVoice = voices.filter(a => a.lang === "zh-CN")[1];
};

class LearnPage extends PureComponent<Props> {

  speak = (word: string) => {
    if (!chineseVoice) return;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.voice = chineseVoice;
    speechSynthesis.speak(utterance);
  };

  render() {
    const { vocab } = this.props;

    return (
      <div className="LearnPage">
        <div className="LearnPage__wordPinyin">{vocab.wordPinyin}</div>
        <div
          className="LearnPage__word"
          onClick={() => this.speak(vocab.word)}
        >
          {vocab.word}
        </div>
        <div className="LearnPage__meaning">{vocab.meaning}</div>
        <div
          className="LearnPage__sentence"
          onClick={() => this.speak(vocab.sentence)}
        >
          {vocab.sentence}
        </div>
        <div className="LearnPage__sentencePinyin">{vocab.sentencePinyin}</div>

        <a
          className="LearnPage__chinesePodBtn"
          target="_blank"
          href={`https://chinesepod.com/dictionary/english-chinese/${
            vocab.word.split(" ")[0]
            }`}
        >
          Open in Chinesepod
        </a>
      </div>
    );
  }
}

export default LearnPage;
