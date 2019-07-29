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
  selectPage: (page: Page, subPage: SubPage) => any;
};

class TestPage extends PureComponent<Props> {
  state = {
    vocabIndex: 0,
    vocabWords: null as VocabWord[],
    showAnswer: false
  };

  async componentDidMount() {
    const vocabWords = await getVocabWords();
    const vocabIndex = Math.floor(Math.random() * vocabWords.length);
    this.setState({ vocabWords, vocabIndex  });
  }

  async showAnswer() {
    this.setState({ showAnswer: true });
  }

  async next() {
    const { vocabIndex, vocabWords } = this.state;
    this.setState({
      showAnswer: false,
      vocabIndex: (vocabIndex + 1) % vocabWords.length
    });
  }

  render() {
    const { vocabWords, vocabIndex, showAnswer } = this.state;
    if (!vocabWords) return null;
    const vocab = vocabWords[vocabIndex];
    if (!vocab) return null;

    return (
      <div className="TestPage">
        <div className="TestPage__reading">{vocab.reading}</div>
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

        <div
          className="TestPage__showBtn"
          onClick={() => (showAnswer ? this.next() : this.showAnswer())}
        >
          {showAnswer ? "Next Word" : "Show Meaning"}
        </div>



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
