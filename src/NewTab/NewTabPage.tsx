import * as React from "react";
import { PureComponent } from "react";
import "./NewTabPage.scss";
import LearnPage from "./LearnPage/LearnPage";
import AddWords from "./AddWords/AddWords";
import ManageWords from "./ManageWords/ManageWords";
import ImportPage from "./ImportPage/ImportPage";
import Sidebar, { Page, SubPage } from "./Components/Sidebar/Sidebar";
import Header from "./Components/Header/Header";
import * as SettingIcon from "./settings-icon.svg";
import { addVocabWord, bulkAddVocabWords, deleteVocabWord, getRandomVocabWord, VocabWord } from "../Utils/DB/IndexdbUtils";
import UserPreferences from "./UserPreferences/UserPreferences";
import TestPage from "./TestPage/TestPage";
import ReaderPage from "./ReaderPage/ReaderPage";

type Props = {};

class NewTabPage extends PureComponent<Props> {
  state = {
    page: Page.Learn,
    subPage: SubPage.Learn,
    vocab: null as VocabWord
  };

  async componentDidMount() {
    // When updating the database add this back in
    // upgradeLegacyUsers().then();

    const vocab = await getRandomVocabWord();
    if (vocab) {
      document.title = vocab.word;
      this.setState({ vocab });
    } else {
      this.setState({ page: Page.Import, subPage: SubPage.PreMade });
    }
  }

  deleteWord = async (word: VocabWord) => {
    await deleteVocabWord(word as any);
    const vocab = await getRandomVocabWord();
    document.title = vocab.word;
    this.setState({ vocab });
  };

  addWord = async (word: VocabWord) => {
    const addedWord = await addVocabWord(word);
    document.title = addedWord.word;
    this.setState({ vocab: addedWord });
  };

  addWords = async (newWords: VocabWord[]) => {
    if (newWords.length === 0) return;
    this.setState({
      page: Page.Manage,
      subPage: SubPage.Words
    });

    // reverse the words so it keeps the same order as the import
    await bulkAddVocabWords(newWords.reverse());

    this.setState({
      vocab: newWords[0]
    });
  };

  selectPage = (page: Page, subPage: SubPage) => {
    this.setState({ page, subPage });
  };

  render() {
    const { page, vocab, subPage } = this.state;
    const pages = [
      Page.Reader,
      Page.Manage,
      Page.Add,
      Page.Import,
      Page.UserPreferences,
      Page.Learn
    ];

    const hasLayout = [Page.Learn, Page.Test].indexOf(page) === -1;

    return (
      <div className="NewTabPage">
        {page === Page.Learn &&
          vocab && <LearnPage vocab={vocab} deleteWord={this.deleteWord}  selectPage={this.selectPage} />}

        {page === Page.Test && <TestPage vocab={vocab} selectPage={this.selectPage} />}

        {hasLayout && (
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

              {page === Page.Manage && (
                <ManageWords deleteWord={this.deleteWord} />
              )}
              {page === Page.Import && (
                <ImportPage subPage={subPage} addWords={this.addWords} />
              )}

              {page === Page.Reader && <ReaderPage addWord={this.addWord} />}

              {page === Page.UserPreferences && <UserPreferences />}
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
