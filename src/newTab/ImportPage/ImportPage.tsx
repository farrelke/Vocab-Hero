import * as React from "react";
import { PureComponent } from "react";
import "./ImportPage.scss";
import { importPlecoFile } from "../../Utils/PlecoUtils";
import { getJsonFile } from "../../Utils/FetchUtils";
import { VocabWord } from "../../Utils/DbUtils";
import PinyinConverter from "../../Utils/PinyinConverter";
import { SubPage } from "../components/Sidebar/Sidebar";

type Props = {
  addWords: (words: VocabWord[]) => any;
  clearAll: () => any;
  subPage: SubPage;
};

class ImportPage extends PureComponent<Props> {
  state = { addingWord: false };

  handleChange = async (selectorFiles: FileList) => {
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

  clearAllCards = () => {
    const confirm1 = confirm(
      "Are you sure you want to delete all current cards. This action cannot be undo!"
    );
    if (confirm1) {
      this.props.clearAll();
    }
  };

  addHskCards = async (level: number) => {
    this.setState({ addingWord: true });
    const wordData = await getJsonFile<
      { word: string; wordPinyin: string; meaning: string }[]
    >(
      `https://raw.githubusercontent.com/farrelke/chinese-vocab/master/data/hsk-${level}.json`
    );
    const words: VocabWord[] = wordData.filter(word => word).map(word => ({
      ...word,
      wordPinyin: PinyinConverter.convert(word.wordPinyin || ""),
      sentences: []
    }));
    this.props.addWords(words);
  };

  render() {
    const { addingWord } = this.state;
    const { subPage } = this.props;

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
              <ul className="ImportPage__sectionDescList" >
                <li>First open the export file function in <b> Pleco > Flashcards > Import/Export</b>.</li>
                <li>Set the file format to  <b>XML File</b> (should be the default).</li>
                <li>Set <b>card and dictionary definitions</b> to export.</li>
              </ul>
            </div>
            <input
              type="file"
              id="files"
              name="files[]"
              onChange={e => this.handleChange(e.target.files)}
            />
          </div>
        )}

        {subPage === SubPage.PreMade && (
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
                    onClick={() => this.addHskCards(i + 1)}
                  >
                    {hsk}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ImportPage;
