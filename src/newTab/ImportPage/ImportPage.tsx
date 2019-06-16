import * as React from "react";
import { PureComponent } from "react";
import "./ImportPage.scss";
import { importPlecoFile } from "../../Utils/PlecoUtils";
import { VocabWord } from "../../Utils/DbUtils";

type Props = {
  addWords: (words: VocabWord[]) => any;
  clearAll: () => any;
};

class ImportPage extends PureComponent<Props> {
  handleChange = async (selectorFiles: FileList) => {
    try {
      if (selectorFiles && selectorFiles[0]) {
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

  render() {
    const { clearAll } = this.props;

    return (
      <div className="ImportPage">
        <div className="ImportPage__title">Import Vocab</div>

        <div className="ImportPage__clearBtn" onClick={this.clearAllCards}>
          Delete All Current Vocabulary
        </div>

        <div className="ImportPage__section">
          <div className="ImportPage__sectionTitle">Import flashcards from Pleco</div>
          <div className="ImportPage__sectionDesc">
            To import flashcards from pleco first create an export file in Pleco > Flashcards > Import/Export.
            The file format should be "XML File". The included data should have card and dictionary definitions set to export.
          </div>
          <input
            type="file"
            id="files"
            name="files[]"
            onChange={e => this.handleChange(e.target.files)}
          />
        </div>


        <div className="ImportPage__section">
          <div className="ImportPage__sectionTitle">Hsk Cards</div>
        </div>
      </div>
    );
  }
}

export default ImportPage;
