import * as React from "react";
import { PureComponent } from "react";
import "./ManageWords.scss";
import VocabCard from "./../VocabCard";
import { VocabWord } from "../../Utils/IndexdbUtils";

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
            key={word.id}
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
