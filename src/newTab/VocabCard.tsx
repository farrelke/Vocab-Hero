import { PureComponent } from "react";
import { VocabWord } from "../Utils/DbUtils";
import "./VocabCard.scss";
import * as React from "react";

type Props = {
  word: VocabWord;
  deleteWord?: () => any;
  addWord?: () => any;
};

class VocabCard extends PureComponent<Props> {
  render() {
    const { word, deleteWord, addWord } = this.props;
    return (
      <div className="VocabCard">
        <div className="VocabCard__wordPinyin">{word.wordPinyin}</div>

        {deleteWord && (
          <div
            className="VocabCard__deleteBtn"
            onClick={deleteWord}
          >
            Delete
          </div>
        )}

        {addWord && (
          <div
            className="VocabCard__addBtn"
            onClick={addWord}
          >
            Add
          </div>
        )}

        <div className="VocabCard__word">{word.word}</div>
        <div className="VocabCard__wordMeaning">{word.meaning}</div>
        {word.sentences &&
          word.sentences.map(sentence => (
            <>
              <div className="VocabCard__sentence">{sentence.sentence}</div>
              <div className="VocabCard__sentenceMeaning">
                {sentence.pinyin}
              </div>
            </>
          ))}
      </div>
    );
  }
}

export default VocabCard;
