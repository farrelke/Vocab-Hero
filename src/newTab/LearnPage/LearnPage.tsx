import * as React from "react";
import { PureComponent } from "react";
import "./LearnPage.scss";

type Props = {
  vocab: any;
};

let chineseVoice: any = null;
window.speechSynthesis.onvoiceschanged = () => {
  const voices = speechSynthesis.getVoices();
  // need to be able to tell the subtitle language
  const chineseVoices = voices.filter(a => a.lang === "zh-CN");
  chineseVoice = chineseVoices[chineseVoices.length - 1];
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
        <div className="LearnPage__word" onClick={() => this.speak(vocab.word)}>
          {vocab.word}
        </div>
        <div className={`LearnPage__meaning ${vocab.meaning.length > 40 ? 'LearnPage__meaning--long' : ''}`}>{vocab.meaning}</div>

        {vocab.sentences.map(sentence => (
          <>
            <div
              className="LearnPage__sentence"
              onClick={() => this.speak(sentence.sentence)}
            >
              {sentence.sentence}
            </div>

            <div className="LearnPage__sentencePinyin">
              {sentence.pinyin}
            </div>
          </>
        ))}

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
