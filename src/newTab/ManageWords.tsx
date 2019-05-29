import * as React from "react";
import { PureComponent } from "react";
import "./ManageWords.scss";
import { VocabWord } from "./AddWords";

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
          <div className="ManageWords__wordCard">
            <div className="ManageWords__wordPinyin">{word.wordPinyin}</div>
            <div className="ManageWords__deleteBtn" onClick={() => deleteWord(word)}>Delete</div>
            <div className="ManageWords__word">{word.word}</div>
            <div className="ManageWords__wordMeaning">{word.meaning}</div>
          </div>
        ))}
      </div>
    );
  }
}

export default ManageWords;
