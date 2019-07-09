import * as React from "react";
import { PureComponent } from "react";
import "./LearnPage.scss";
import { speak } from "../../Utils/SpeechUtils";
import { VocabWord } from "../../Utils/IndexdbUtils";
import { getUserPreferences, Language } from "../../Utils/DbUtils";

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
    const isChinese = getUserPreferences().language === Language.Chinese;
    const { vocab } = this.props;

    return (
      <div className="LearnPage">
        <div className="LearnPage__reading">{vocab.reading}</div>
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

              <div className="LearnPage__sentencePinyin">
                {sentence.reading}
              </div>
            </div>
          ))}

        {isChinese && (
          <a
            className="LearnPage__btn LearnPage__btn--chinesePod"
            target="_blank"
            href={`https://chinesepod.com/dictionary/english-chinese/${vocab.word &&
              vocab.word.split(" ")[0]}`}
          >
            Open in Chinesepod
          </a>
        )}

        {!isChinese && (
          <a
            className="LearnPage__btn LearnPage__btn--jisho"
            target="_blank"
            href={`https://jisho.org/search/${vocab.word &&
            vocab.word.split(" ")[0]}`}
          >
            Open in jisho
          </a>
        )}

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
