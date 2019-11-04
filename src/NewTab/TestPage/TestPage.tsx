import * as React from "react";
import { PureComponent } from "react";
import "./TestPage.scss";
import { speak } from "../../Utils/SpeechUtils";
import { getVocabWords, VocabWord } from "../../Utils/DB/IndexdbUtils";
import classNames from "classnames";
import { Page, SubPage } from "../Pages";

type Props = {
  vocab: VocabWord;
  selectPage: (page: Page, subPage: SubPage) => unknown;
};

class TestPage extends PureComponent<Props> {
  state = {
    vocabIndex: 0,
    vocabWords: null as VocabWord[],
    showAnswer: false
  };

  async componentDidMount() {
    const { vocab } = this.props;
    const vocabWords = await getVocabWords();
    const vocabIndex = vocabWords.findIndex(a => a.id === vocab.id);
    this.setState({ vocabWords, vocabIndex });
  }

  showAnswer = async () => {
    const { vocabWords, vocabIndex } = this.state;
    const vocab = vocabWords[vocabIndex];
    speak(vocab.word);
    this.setState({ showAnswer: true });
  };

  next = async () => {
    const { vocabIndex, vocabWords } = this.state;
    this.setState({
      showAnswer: false,
      vocabIndex: (vocabIndex + 1) % vocabWords.length
    });
  };

  render() {
    const { vocabWords, vocabIndex, showAnswer } = this.state;
    if (!vocabWords) return null;
    const vocab = vocabWords[vocabIndex];
    if (!vocab) return null;

    return (
      <div className="TestPage">
        <div className="TestPage__reading">{showAnswer ? vocab.reading : ""}</div>
        <div className="TestPage__word" onClick={() => speak(vocab.word)}>
          {vocab.word}
        </div>

        <div
          className={classNames("TestPage__meaning", {
            "TestPage__meaning--long": vocab.meaning && vocab.meaning.length > 60
          })}
        >
          {showAnswer ? vocab.meaning : ""}
        </div>

        {!showAnswer && (
          <div className="TestPage__showBtn" onClick={this.showAnswer}>
            Show
          </div>
        )}

        {showAnswer && (
          <div className="TestPage__buttons">
            <div className="TestPage__showBtn" onClick={() => this.next()}>
              Next
            </div>
          </div>
        )}

        <div className="TestPage__closeBtn" onClick={() => this.props.selectPage(Page.Learn, SubPage.Learn)}>
          Exit
        </div>
      </div>
    );
  }
}

export default TestPage;
