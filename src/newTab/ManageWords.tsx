import * as React from "react";
import { PureComponent } from "react";
import "./ManageWords.scss";
import { VocabWord } from "../Utils/DbUtils";
import VocabCard from "./VocabCard";
import { importPlecoFile } from "../Utils/PlecoUtils";

type Props = {
  words: VocabWord[];
  deleteWord: (word: VocabWord) => any;
  addWords: (words: VocabWord[]) => any;
  clearAll: () => any;
};

class ManageWords extends PureComponent<Props> {
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

  render() {
    const { words, deleteWord, clearAll } = this.props;

    return (
      <div className="ManageWords">
        <input
          type="file"
          id="files"
          name="files[]"
          onChange={e => this.handleChange(e.target.files)}
        />

        <div onClick={clearAll} > Clear All </div>

        <div className="ManageWords__title">Manage Vocab</div>
        {words.map(word => (
          <VocabCard
            key={word.word}
            word={word}
            deleteWord={() => deleteWord(word)}
          />
        ))}
      </div>
    );
  }
}

export default ManageWords;
