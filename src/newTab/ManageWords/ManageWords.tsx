import * as React from "react";
import { PureComponent } from "react";
import "./ManageWords.scss";
import { VocabWord } from "../../Utils/DbUtils";
import VocabCard from "./../VocabCard";

type Props = {
  words: VocabWord[];
  deleteWord: (word: VocabWord) => any;
  updateWord: (word: VocabWord, index: number) => any;
};

class ManageWords extends PureComponent<Props> {
  render() {
    const { words, deleteWord, updateWord } = this.props;

    return (
      <div className="ManageWords">
        {words.map((word, i) => (
          <VocabCard
            key={word.word + i}
            word={word}
            deleteWord={() => deleteWord(word)}
            updateWord={word => updateWord(word, i)}
          />
        ))}
      </div>
    );
  }
}

export default ManageWords;
