import * as React from "react";
import { PureComponent } from "react";
import "./ManageWords.scss";
import { VocabWord } from "../../Utils/DbUtils";
import VocabCard from "./../VocabCard";
import { importPlecoFile } from "../../Utils/PlecoUtils";

type Props = {
  words: VocabWord[];
  deleteWord: (word: VocabWord) => any;
};

class ManageWords extends PureComponent<Props> {


  render() {
    const { words, deleteWord } = this.props;

    return (
      <div className="ManageWords">

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
