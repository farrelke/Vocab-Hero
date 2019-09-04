import * as React from "react";
import { PureComponent } from "react";
import "./TestPage.scss";
import { speak } from "../../Utils/SpeechUtils";
import {
  getRandomVocabWord,
  getVocabWords,
  VocabWord
} from "../../Utils/IndexdbUtils";
import { Page, SubPage } from "../components/Sidebar/Sidebar";

type Props = {
  vocab: VocabWord;
  selectPage: (page: Page, subPage: SubPage) => any;
};

class TestPage extends PureComponent<Props> {
  state = {
    vocabIndex: 0,
    vocabWords: null as VocabWord[],
    showAnswer: false,
    answered: 0,
    correctAnswers: 0
  };

  async componentDidMount() {
    const { vocab } = this.props;
    const vocabWords = await getVocabWords();
    const vocabIndex = vocabWords.findIndex(a => a.id === vocab.id);
    this.setState({ vocabWords, vocabIndex });
  }

  showAnswer = async () => {
    this.setState({ showAnswer: true });
  };

  next = async (correct?: boolean) => {
    const { vocabIndex, vocabWords, answered, correctAnswers } = this.state;
    this.setState({
      showAnswer: false,
      vocabIndex: (vocabIndex + 1) % vocabWords.length,
      correctAnswers: correctAnswers + (correct ? 1 : 0),
      answered: answered + 1
    });
  };

  render() {
    const { vocabWords, vocabIndex, showAnswer, answered, correctAnswers } = this.state;
    if (!vocabWords) return null;
    const vocab = vocabWords[vocabIndex];
    if (!vocab) return null;

    return (
      <div className="TestPage">
        <div className="TestPage__reading">
          {showAnswer ? vocab.reading : ""}
        </div>
        <div className="TestPage__word" onClick={() => speak(vocab.word)}>
          {vocab.word}
        </div>

        <div
          className={`TestPage__meaning ${
            vocab.meaning && vocab.meaning.length > 40
              ? "TestPage__meaning--long"
              : ""
          }`}
        >
          {showAnswer ? vocab.meaning : ""}
        </div>

        {!showAnswer && (
          <div className="TestPage__showBtn" onClick={this.showAnswer}>
            Show
          </div>
        )}

        {showAnswer && (
          <div className="TestPage__buttons" >
            <div className="TestPage__showBtn TestPage__showBtn--wrong" onClick={() => this.next(false)} >
              Forgot
            </div>
            <div className="TestPage__showBtn TestPage__showBtn--correct" onClick={() => this.next(true)} >
              Remembered
            </div>
          </div>
        )}


        <span style={{ marginTop: 30 }} >{correctAnswers} / {answered} Remembered Correctly</span>

        <div
          className="TestPage__closeBtn"
          onClick={() => this.props.selectPage(Page.Learn, SubPage.Learn)}
        >
          Exit
        </div>
      </div>
    );
  }
}

export default TestPage;
