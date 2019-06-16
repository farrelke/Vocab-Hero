import * as React from "react";
import { PureComponent } from "react";
import "./NewTabPage.scss";
import LearnPage from "./LearnPage/LearnPage";
import AddWords from "./AddWords/AddWords";
import ManageWords from "./ManageWords/ManageWords";
import { getVocabWords, getWordDict, setVocabWords, VocabWord } from "../Utils/DbUtils";
import ImportPage from "./ImportPage/ImportPage";

type Props = {};

enum Pages {
  Learn,
  Add,
  Manage,
  Import
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

  addWords = async (newWords: VocabWord[]) => {
    if (newWords.length === 0) return;
    let { words } = this.state;
    words = [...newWords, ...words];
    this.setState({ words, vocab: newWords[0], page: Pages.Manage });
    await setVocabWords(words);
  };

  updateWord = async (word: VocabWord, index: number) => {
    let words = [...this.state.words];
    words[index] = word;
    this.setState({ words });
    await setVocabWords(words);
  };

    clearAll = async () => {
    this.setState({ words: [] });
    await setVocabWords([]);
  };

  render() {
    const { page, vocab, words } = this.state;

    return (
      <div className="NewTabPage">
        {page === Pages.Add && <AddWords addWord={this.addWord} />}
        {page === Pages.Learn && vocab && <LearnPage vocab={vocab} />}
        {page === Pages.Manage &&
          words && <ManageWords words={words} deleteWord={this.deleteWord} updateWord={this.updateWord} />}
        {page === Pages.Import &&
          words && (
            <ImportPage clearAll={this.clearAll} addWords={this.addWords} />
          )}

        <div className="NewTabPage__buttons">
          {page !== Pages.Import && (
            <div
              className="NewTabPage__button"
              onClick={() => this.setState({ page: Pages.Import })}
            >
              Import
            </div>
          )}
          {page !== Pages.Manage && (
            <div
              className="NewTabPage__button"
              onClick={() => this.setState({ page: Pages.Manage })}
            >
              Manage Vocab
            </div>
          )}
          {page !== Pages.Add && (
            <div
              className="NewTabPage__button"
              onClick={() => this.setState({ page: Pages.Add })}
            >
              Add Vocab
            </div>
          )}
        </div>

        {page !== Pages.Learn &&
          words &&
          !!words.length && (
            <>
              <div
                className="NewTabPage__backBtn"
                onClick={() => this.setState({ page: Pages.Learn })}
              >
                Back
              </div>
            </>
          )}
      </div>
    );
  }
}

export default NewTabPage;
