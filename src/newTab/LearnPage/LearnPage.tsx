import * as React from "react";
import { PureComponent } from "react";
import "./LearnPage.scss";
import { speak } from "../../Utils/SpeechUtils";
import { VocabWord } from "../../Utils/DbUtils";

type Props = {
  vocab: VocabWord;
  deleteWord: (word: VocabWord) => any;
};

class LearnPage extends PureComponent<Props> {
  deleteWord = () => {
    const confirmed = confirm("Are you sure you want to delete this word?");
    if (confirmed) {
      this.props.deleteWord(this.props.vocab);
    }
  };

  render() {
    const { vocab } = this.props;

    return (
      <div className="LearnPage">
        <div className="LearnPage__wordPinyin">{vocab.wordPinyin}</div>
        <div className="LearnPage__word" onClick={() => speak(vocab.word)}>
          {vocab.word}
        </div>
        <div
          className={`LearnPage__meaning ${
            vocab.meaning && vocab.meaning.length > 40
              ? "LearnPage__meaning--long"
              : ""
          }`}
        >
          {vocab.meaning}
        </div>

        {vocab.sentences &&
          vocab.sentences.map((sentence, i) => (
            <div className="LearnPage__sentenceWrapper" key={i}>
              <div
                className="LearnPage__sentence"
                onClick={() => speak(sentence.sentence)}
              >
                {sentence.sentence}
              </div>

              <div className="LearnPage__sentencePinyin">{sentence.pinyin}</div>
            </div>
          ))}

        <a
          className="LearnPage__btn LearnPage__btn--chinesePod"
          target="_blank"
          href={`https://chinesepod.com/dictionary/english-chinese/${vocab.word &&
            vocab.word.split(" ")[0]}`}
        >
          Open in Chinesepod
        </a>

        <div
          className="LearnPage__btn LearnPage__btn--delete"
          onClick={this.deleteWord}
        >
          Delete word
        </div>
      </div>
    );
  }
}

export default LearnPage;
