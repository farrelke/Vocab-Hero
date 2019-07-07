import * as React from "react";
import { PureComponent } from "react";
import "./NewTabPage.scss";
import LearnPage from "./LearnPage/LearnPage";
import AddWords from "./AddWords/AddWords";
import ManageWords from "./ManageWords/ManageWords";
import ImportPage from "./ImportPage/ImportPage";
import Sidebar, { Page, SubPage } from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import * as SettingIcon from "./settings-icon.svg";
import {
  addVocabWord,
  bulkAddVocabWords,
  clearAllVocab,
  deleteVocabWord,
  getRandomVocabWord,
  getVocabWords,
  updateVocabWord,
  VocabWord
} from "../Utils/IndexdbUtils";

type Props = {};

class NewTabPage extends PureComponent<Props> {
  state = {
    page: Page.Learn,
    subPage: SubPage.Learn,
    vocab: null as VocabWord,
    words: [] as VocabWord[]
  };

  async componentDidMount() {
    const vocab = await getRandomVocabWord();
    if (vocab) {
      document.title = vocab.word;
      this.setState({ vocab });
    } else {
      this.setState({ page: Page.Import, subPage: SubPage.PreMade });
    }

    const words = await getVocabWords();
    this.setState({ words });
  }

  deleteWord = async (word: VocabWord) => {
    let { words, vocab } = this.state;
    words = words.filter(w => w.id !== word.id);
    if (word === vocab) {
      vocab =
        words.length > 0
          ? words[Math.floor(Math.random() * words.length)]
          : vocab;
    }

    this.setState({ words, vocab });
    await deleteVocabWord(word as any);
  };

  addWord = async (word: VocabWord) => {
    let { words } = this.state;
    const addedWord = await addVocabWord(word);
    words = [addedWord, ...words];
    this.setState({ words, vocab: addedWord });
  };

  addWords = async (newWords: VocabWord[]) => {
    if (newWords.length === 0) return;
    this.setState({
      page: Page.Manage,
      subPage: SubPage.Words
    });

    // reverse the words so it keeps the same order as the import
    await bulkAddVocabWords(newWords.reverse());
    const words = await getVocabWords();

    this.setState({
      words,
      vocab: newWords[0]
    });
  };

  updateWord = async (word: VocabWord, index: number) => {
    let words = [...this.state.words];
    words[index] = word;
    this.setState({ words });
    await updateVocabWord(word);
  };

  clearAll = async () => {
    this.setState({ words: [] });
    await clearAllVocab();
  };

  selectPage = (page: Page, subPage: SubPage) => {
    this.setState({ page, subPage });
  };

  render() {
    const { page, vocab, words, subPage } = this.state;
    const pages = [Page.Manage, Page.Add, Page.Import, Page.Learn];

    return (
      <div className="NewTabPage">
        {page === Page.Learn &&
          vocab && <LearnPage vocab={vocab} deleteWord={this.deleteWord} />}

        {page !== Page.Learn && (
          <div className="NewTabPage__layout">
            <div className="NewTabPage__sidebar">
              <Sidebar
                pages={pages}
                selectPage={this.selectPage}
                selectedPage={page}
              />
            </div>
            <div className="NewTabPage__header">
              <Header
                page={page}
                subPage={subPage}
                selectPage={this.selectPage}
              />
            </div>

            <div className="NewTabPage__content">
              {page === Page.Add && (
                <AddWords subPage={subPage} addWord={this.addWord} />
              )}

              {page === Page.Manage &&
                words && (
                  <ManageWords
                    words={words}
                    deleteWord={this.deleteWord}
                    updateWord={this.updateWord}
                  />
                )}
              {page === Page.Import &&
                words && (
                  <ImportPage
                    subPage={subPage}
                    words={words}
                    clearAll={this.clearAll}
                    addWords={this.addWords}
                  />
                )}
            </div>
          </div>
        )}

        {page === Page.Learn && (
          <img
            src={SettingIcon}
            className="NewTabPage__settings"
            onClick={() => this.selectPage(Page.Manage, SubPage.Words)}
          />
        )}
      </div>
    );
  }
}

export default NewTabPage;
