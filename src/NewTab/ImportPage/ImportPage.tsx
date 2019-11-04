import * as React from "react";
import { PureComponent } from "react";
import "./ImportPage.scss";
import { saveAs } from "file-saver";
import PreviewDeck from "./PreviewDeck";
import {
  AnkiData,
  importAnkiFile,
  importJsonFile,
  importPlecoFile
} from "../../Utils/Import/ImportUtils";
import { getVocabDecks, GithubFile } from "../../Utils/Api/GithubUtils";
import AnkiImport from "./AnkiImport";
import { clearAllVocab, getVocabWords, VocabWord } from "../../Utils/DB/IndexdbUtils";
import { SubPage } from "../Pages";

type Props = {
  addWords: (words: VocabWord[]) => unknown;
  subPage: SubPage;
};

class ImportPage extends PureComponent<Props> {
  state = {
    addingWord: false,
    previewUrl: "",
    vocabLists: undefined as GithubFile[],
    ankiData: undefined as AnkiData
  };

  async componentDidMount() {
    const vocabLists = await getVocabDecks();
    this.setState({ vocabLists });
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps.subPage !== this.props.subPage) {
      this.setState({
        addingWord: false,
        previewUrl: "",
        ankiData: undefined
      });
    }
  }

  handlePlecoImport = async (selectorFiles: FileList) => {
    try {
      if (selectorFiles && selectorFiles[0]) {
        this.setState({ addingWord: true });
        const words = await importPlecoFile(selectorFiles[0]);
        this.props.addWords(words);
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleAnkiImport = async (selectorFiles: FileList) => {
    try {
      if (selectorFiles && selectorFiles[0]) {
        this.setState({ addingWord: true });
        const ankiData = await importAnkiFile(selectorFiles[0]);
        if (!ankiData) {
          this.setState({ addingWord: false });
        }
        this.setState({ ankiData });
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleJsonImport = async (selectorFiles: FileList) => {
    try {
      if (selectorFiles && selectorFiles[0]) {
        this.setState({ addingWord: true });
        const words = await importJsonFile(selectorFiles[0]);
        this.props.addWords(words);
      }
    } catch (e) {
      console.log(e);
    }
  };

  clearAllCards = async () => {
    const confirm1 = confirm(
      "Are you sure you want to delete all current cards. This action cannot be undo!"
    );
    if (confirm1) {
      await clearAllVocab();
    }
  };

  previewDesk = async (previewUrl: string) => {
    this.setState({ previewUrl });
  };

  previewHskLevel = async (level: number) => {
    this.previewDesk(
      `https://raw.githubusercontent.com/farrelke/chinese-vocab/master/data/hsk-${level}.json`
    );
  };

  exportVocabulary = async () => {
    const words = (await getVocabWords()).reverse().map(word => {
      delete word.id;
      return word;
    });

    const vocabFile = new File(
      [JSON.stringify(words, null, 2)],
      "vocab-list.json",
      {
        type: "application/json;charset=utf-8"
      }
    );
    saveAs(vocabFile);
  };

  render() {
    const { addingWord, previewUrl, vocabLists, ankiData } = this.state;
    const { subPage, addWords } = this.props;

    if (ankiData) {
      return <AnkiImport addWords={addWords} ankiData={ankiData} />;
    }

    if (previewUrl) {
      return (
        <PreviewDeck
          previewUrl={previewUrl}
          addWords={addWords}
          goBack={() => this.setState({ previewUrl: "" })}
        />
      );
    }

    if (addingWord) {
      return (
        <div className="ImportPage">
          <div className="ImportPage__title">Importing...</div>
        </div>
      );
    }

    return (
      <div className="ImportPage">
        <div className="ImportPage__clearBtn" onClick={this.clearAllCards}>
          Delete Current Vocabulary
        </div>

        {subPage === SubPage.Pleco && (
          <div className="ImportPage__section">
            <div className="ImportPage__sectionTitle">
              Import flashcards from Pleco
            </div>
            <div className="ImportPage__sectionDesc">
              To generate an export file in Pleco:
              <ul className="ImportPage__sectionDescList">
                <li>
                  First open the export file function in{" "}
                  <b> Pleco > Flashcards > Import/Export</b>.
                </li>
                <li>
                  Set the file format to <b>XML File</b> (should be the
                  default).
                </li>
                <li>
                  Set <b>card and dictionary definitions</b> to export.
                </li>
              </ul>
            </div>
            <input
              type="file"
              id="files"
              name="files[]"
              onChange={e => this.handlePlecoImport(e.target.files)}
            />
          </div>
        )}

        {subPage === SubPage.Anki && (
          <div className="ImportPage__section">
            <div className="ImportPage__sectionTitle">
              Import flashcards from Anki
            </div>
            <div className="ImportPage__sectionDesc">
              To generate an export file in Anki:
              <ul className="ImportPage__sectionDescList">
                <li>
                  First install the add-on{" "}
                  <a href="https://ankiweb.net/shared/info/1788670778">
                    CrowdAnki: JSON export&import
                  </a>{" "}
                  in anki using <b>Tools > Add-ons > Get Add-ons...</b>.
                </li>
                <li>
                  After you install the CrowdAnki add-on then export your anki
                  deck using <b>Export..</b>.
                </li>
                <li>
                  Set the export format to CrowdAnki JSON representation and
                  select the deck you want to export.&nbsp;
                  <b>Do not select "All Decks"</b>
                </li>
                <li>
                  Unset <b>include media</b> and <b>include tags</b>
                </li>
                <li>
                  Click <b>Export...</b>
                </li>
              </ul>
            </div>
            <input
              type="file"
              id="files"
              name="files[]"
              onChange={e => this.handleAnkiImport(e.target.files)}
            />
          </div>
        )}

        {subPage === SubPage.PreMade && (
          <>
            <div className="ImportPage__section">
              <div className="ImportPage__sectionTitle">
                Import Hsk Vocabulary
              </div>
              <div className="ImportPage__sectionDesc">
                Hsk Vocabulary divided by level
              </div>
              <div className="ImportPage__hskButtons">
                {["Hsk 1", "Hsk 2", "Hsk 3", "Hsk 4", "Hsk 5", "Hsk 6"].map(
                  (hsk, i) => (
                    <div
                      className="ImportPage__hskBtn"
                      key={i}
                      onClick={() => this.previewHskLevel(i + 1)}
                    >
                      {hsk}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="ImportPage__section">
              <div className="ImportPage__sectionTitle">
                Import User made lists
              </div>
              <div className="ImportPage__sectionDesc">
                Vocab lists submitted by users
              </div>
              <div className="ImportPage__hskButtons">
                {!vocabLists && (
                  <div className="ImportPage__loading">Fetching Decks...</div>
                )}
                {vocabLists &&
                  vocabLists.map(list => (
                    <div
                      className="ImportPage__hskBtn"
                      key={list.name}
                      onClick={() => this.previewDesk(list.downloadUrl)}
                    >
                      {list.name}
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {subPage === SubPage.Local && (
          <>
            <div className="ImportPage__section">
              <div className="ImportPage__sectionTitle">
                Export vocabulary to json file
              </div>
              <div className="ImportPage__btn" onClick={this.exportVocabulary}>
                Export Vocabulary
              </div>
            </div>
            <div className="ImportPage__section">
              <div className="ImportPage__sectionTitle">
                Import local json file
              </div>

              <input
                type="file"
                id="files"
                name="files[]"
                onChange={e => this.handleJsonImport(e.target.files)}
              />
            </div>
          </>
        )}
      </div>
    );
  }
}

export default ImportPage;
