import * as React from "react";
import { PureComponent } from "react";
import "./LearnPage.scss";
import { speak } from "../../Utils/SpeechUtils";

type Props = {
  vocab: any;
};



class LearnPage extends PureComponent<Props> {

  render() {
    const { vocab } = this.props;

    return (
      <div className="LearnPage">
        <div className="LearnPage__wordPinyin">{vocab.wordPinyin}</div>
        <div className="LearnPage__word" onClick={() => speak(vocab.word)}>
          {vocab.word}
        </div>
        <div className={`LearnPage__meaning ${vocab.meaning.length > 40 ? 'LearnPage__meaning--long' : ''}`}>{vocab.meaning}</div>

        {vocab.sentences.map((sentence, i) => (
          <div  className="LearnPage__sentenceWrapper" key={i}>
            <div
              className="LearnPage__sentence"
              onClick={() => speak(sentence.sentence)}
            >
              {sentence.sentence}
            </div>

            <div className="LearnPage__sentencePinyin">
              {sentence.pinyin}
            </div>
          </div>
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
