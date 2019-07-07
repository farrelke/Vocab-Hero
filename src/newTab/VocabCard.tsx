import { PureComponent } from "react";
import "./VocabCard.scss";
import * as React from "react";
import PinyinConverter from "../Utils/PinyinConverter";
import { speak } from "../Utils/SpeechUtils";
import { VocabWord } from "../Utils/IndexdbUtils";

type Props = {
  word: VocabWord;
  deleteWord?: () => any;
  addWord?: () => any;
  updateWord?: (word: VocabWord) => any;
};

export class EditVocabCard extends PureComponent<{
  word?: VocabWord;
  save?: (word: VocabWord) => any;
  cancel?: () => any;
  addWord?: (word: VocabWord) => any;
}> {
  state = {
    word: "",
    pinyin: "",
    meaning: ""
  };

  componentDidMount(): void {
    const { word } = this.props;
    if (word) {
      this.setState({
        word: word.word,
        pinyin: word.wordPinyin,
        meaning: word.meaning
      });
    }
  }

  updateText = (type: string) => (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    this.setState({ [type]: newValue });
  };

  pinyinise = () => {
    try {
      const pinyin = PinyinConverter.convert(this.state.pinyin);
      this.setState({ pinyin });
    } catch (e) {
      console.log(e);
    }
  };

  save = () => {
    const { save, word: wordObj } = this.props;
    const { word, pinyin, meaning } = this.state;
    save({ ...wordObj, word, wordPinyin: pinyin, meaning });
  };

  addWord = () => {
    const { addWord } = this.props;
    const { word, pinyin, meaning } = this.state;
    const newWord: VocabWord = {
      word,
      wordPinyin: PinyinConverter.convert(pinyin),
      meaning,
      sentences: []
    };
    addWord(newWord);
    this.setState({ word: "", pinyin: "", meaning: "" });
  };

  render() {
    const { cancel, addWord } = this.props;
    const { word, pinyin, meaning } = this.state;
    return (
      <div className="VocabCard">
        <input
          type="text"
          value={pinyin}
          onChange={this.updateText("pinyin")}
          className="VocabCard__wordPinyin"
          placeholder="pinyin"
        />
        <div className="VocabCard__btns">
          <div onClick={this.pinyinise} className="VocabCard__btn">
            Pinyinise
          </div>
        </div>
        <input
          onChange={this.updateText("word")}
          type="text"
          value={word}
          className="VocabCard__word"
          placeholder="hanzi"
        />
        <input
          type="text"
          onChange={this.updateText("meaning")}
          value={meaning}
          className="VocabCard__wordMeaning"
          placeholder="translation"
        />
        <div className="VocabCard__editBtns VocabCard__btn--save">
          {!addWord && (
            <>
              <div
                onClick={cancel}
                className="VocabCard__btn VocabCard__btn--cancel"
              >
                Cancel
              </div>
              <div onClick={this.save} className="VocabCard__btn">
                Save
              </div>
            </>
          )}
          {addWord && (
            <div onClick={this.addWord} className="VocabCard__btn">
              Add
            </div>
          )}
        </div>
      </div>
    );
  }
}

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
        <div className="VocabCard__wordPinyin">
          {PinyinConverter.convert(word.wordPinyin)}
        </div>

        {deleteWord &&
          !editMode && (
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
            <div key={i}>
              <div
                className="VocabCard__sentence"
                onClick={() => speak(sentence.sentence)}
              >
                {sentence.sentence}
              </div>
              <div className="VocabCard__sentenceMeaning">
                {sentence.pinyin}
              </div>
            </div>
          ))}
      </div>
    );
  }
}

export default VocabCard;
