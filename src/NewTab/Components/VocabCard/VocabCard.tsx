import { PureComponent } from "react";
import "./VocabCard.scss";
import * as React from "react";
import { speak } from "../../../Utils/SpeechUtils";
import { VocabWord } from "../../../Utils/VocabDb";
import PinyinConverter from "../../../Utils/PinyinConverter";
import EditVocabCard from "./EditVocabCard";

type Props = {
  word: VocabWord;
  deleteWord?: () => any;
  addWord?: () => any;
  updateWord?: (word: VocabWord) => any;
};

class VocabCard extends PureComponent<Props> {
  state = {
    editMode: false
  };

  toggleEditing = () => {
    this.setState({ editMode: !this.state.editMode });
  };

  updateWord = (word: VocabWord) => {
    this.setState({ editMode: false });
    this.props.updateWord(word);
  };

  render() {
    const { editMode } = this.state;
    const { word, deleteWord, addWord } = this.props;

    if (editMode) {
      return (
        <EditVocabCard
          word={word}
          cancel={this.toggleEditing}
          save={this.updateWord}
        />
      );
    }

    return (
      <div className="VocabCard">
        <div className="VocabCard__reading">
          {PinyinConverter.convert(word.reading)}
        </div>

        {deleteWord && !editMode && (
          <div className="VocabCard__btns">
            <div className="VocabCard__btn" onClick={this.toggleEditing}>
              Edit
            </div>
            <div
              className="VocabCard__btn VocabCard__btn--delete"
              onClick={deleteWord}
            >
              Delete
            </div>
          </div>
        )}

        {addWord && (
          <div className="VocabCard__btn VocabCard__btn--add" onClick={addWord}>
            Add
          </div>
        )}

        <div className="VocabCard__word" onClick={() => speak(word.word)}>
          {word.word}
        </div>
        <div className="VocabCard__wordMeaning">{word.meaning}</div>
        {word.sentences &&
          word.sentences.map((sentence, i) => (
            <>
              <div
                key={"a" + i}
                className="VocabCard__sentence"
                onClick={() => speak(sentence.sentence)}
              >
                {sentence.sentence}
              </div>
              <div key={"b" + i} className="VocabCard__sentenceMeaning">
                {sentence.reading}
              </div>
            </>
          ))}
      </div>
    );
  }
}

export default VocabCard;
