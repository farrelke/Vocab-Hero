import * as React from "react";
import { PureComponent } from "react";
import "./NewTabPage.scss";
import LearnPage from "./LearnPage/LearnPage";
import AddWords from "./AddWords/AddWords";
import ManageWords from "./ManageWords/ManageWords";
import { getVocabWords, setVocabWords, VocabWord } from "../Utils/DbUtils";
import ImportPage from "./ImportPage/ImportPage";
import Sidebar, { Page, SubPage } from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import * as SettingIcon from "./settings-icon.svg";

type Props = {};

class NewTabPage extends PureComponent<Props> {
  state = {
    page: Page.Learn,
    subPage: SubPage.Learn,
    vocab: null as VocabWord,
    words: [] as VocabWord[]
  };

  async componentDidMount() {
    const words = await getVocabWords();
    if (!words || words.length === 0) {
      this.setState({ page: Page.Add });
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
    this.setState({ words, vocab: newWords[0], page: Page.Manage });
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

  selectPage = (page: Page, subPage: SubPage) => {
    this.setState({ page, subPage });
  };

  render() {
    const { page, vocab, words, subPage } = this.state;
    const pages = [Page.Manage, Page.Add, Page.Import, Page.Learn];

    return (
      <div className="NewTabPage">
        {page === Page.Learn && vocab && <LearnPage vocab={vocab} />}

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
