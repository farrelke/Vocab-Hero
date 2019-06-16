import * as React from "react";
import { PureComponent } from "react";
import "./ImportPage.scss";
import { importPlecoFile } from "../../Utils/PlecoUtils";
import { getJsonFile } from "../../Utils/FetchUtils";
import { VocabWord } from "../../Utils/DbUtils";
import PinyinConverter from "../../Utils/PinyinConverter";

type Props = {
  addWords: (words: VocabWord[]) => any;
  clearAll: () => any;
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
      wordPinyin: PinyinConverter.convert(word.wordPinyin || ''),
      sentences: []
    }));
    this.props.addWords(words);
  };

  render() {
    const { addingWord } = this.state;

    if (addingWord) {
      return (
        <div className="ImportPage">
          <div className="ImportPage__title">Importing...</div>
        </div>
      );
    }

    return (
      <div className="ImportPage">
        <div className="ImportPage__title">Import Vocab</div>

        <div className="ImportPage__clearBtn" onClick={this.clearAllCards}>
          Delete All Current Vocabulary
        </div>

        <div className="ImportPage__section">
          <div className="ImportPage__sectionTitle">
            Import flashcards from Pleco
          </div>
          <div className="ImportPage__sectionDesc">
            To import flashcards from pleco first create an export file in Pleco
            > Flashcards > Import/Export. The file format should be "XML File".
            The included data should have card and dictionary definitions set to
            export.
          </div>
          <input
            type="file"
            id="files"
            name="files[]"
            onChange={e => this.handleChange(e.target.files)}
          />
        </div>

        <div className="ImportPage__section">
          <div className="ImportPage__sectionTitle">Import Hsk Cards</div>
          <div className="ImportPage__sectionDesc">
            Flashcards built to learn about hsk cards.
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
      </div>
    );
  }
}

export default ImportPage;
