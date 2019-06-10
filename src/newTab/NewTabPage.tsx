import * as React from "react";
import { PureComponent } from "react";
import "./NewTabPage.scss";
import LearnPage from "./LearnPage";
import AddWords from "./AddWords";
import ManageWords from "./ManageWords";
import { getVocabWords, setVocabWords, VocabWord } from "../Utils/DbUtils";

type Props = {};

enum Pages {
  Learn,
  Add,
  Manage
}

class NewTabPage extends PureComponent<Props> {
  state = {
    page: Pages.Learn,
    vocab: null as VocabWord,
    words: [] as VocabWord[]
  };

  async componentDidMount() {
    const words = await getVocabWords();
    if (!words || words.length === 0) {
      this.setState({ page: Pages.Add });
      return;
    }

    const vocab = words[Math.floor(Math.random() * words.length)];
    document.title = vocab.word;
    this.setState({ vocab, words });
  }

  deleteWord = async (word: VocabWord) => {
    let { words } = this.state;
    words = words.filter(w => w !== word);
    this.setState({ words });
    await setVocabWords(words);
  };

  addWord = async (word: VocabWord) => {
    let { words } = this.state;
    words = [word, ...words];
    this.setState({ words, vocab: word });
    await setVocabWords(words);
  };

  render() {
    const { page, vocab, words } = this.state;

    return (
      <div className="NewTabPage">
        {page === Pages.Add && <AddWords addWord={this.addWord} />}
        {page === Pages.Learn && vocab && <LearnPage vocab={vocab} />}
        {page === Pages.Manage && words && <ManageWords words={words} deleteWord={this.deleteWord} />}

        {page === Pages.Learn && (
          <>
            <div
              className="NewTabPage__manageWords"
              onClick={() => this.setState({ page: Pages.Manage })}
            >
              Manage Vocab
            </div>
            <div
              className="NewTabPage__addWords"
              onClick={() => this.setState({ page: Pages.Add })}
            >
              Add Vocab
            </div>
          </>
        )}
        {page !== Pages.Learn && words && words.length && <>
          <div
            className="NewTabPage__backBtn"
            onClick={() => this.setState({ page: Pages.Learn })}
          >
            Back
          </div>
        </>}
      </div>
    );
  }
}

export default NewTabPage;
