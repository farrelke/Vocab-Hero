import { PureComponent } from "react";
import "./VocabCard.scss";
import * as React from "react";
import PinyinConverter from "../Utils/PinyinConverter";
import { speak } from "../Utils/SpeechUtils";
import { VocabWord } from "../Utils/IndexdbUtils";
import { getUserPreferences, Language } from "../Utils/DbUtils";

type Props = {
  word: VocabWord;
  deleteWord?: () => any;
  addWord?: () => any;
  updateWord?: (word: VocabWord) => any;
};

export class EditVocabCard extends PureComponent<
  {
    word?: VocabWord;
    save?: (word: VocabWord) => any;
    cancel?: () => any;
    addWord?: (word: VocabWord) => any;
  },
  { word: string; reading: string; meaning: string }
> {
  state = {
    word: "",
    reading: "",
    meaning: ""
  };

  componentDidMount(): void {
    const { word } = this.props;
    if (word) {
      this.setState({
        word: word.word,
        reading: word.reading,
        meaning: word.meaning
      });
    }
  }

  updateText = (type: string) => (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    this.setState({ [type]: newValue } as any);
  };

  pinyinise = () => {
    try {
      const reading = PinyinConverter.convert(this.state.reading);
      this.setState({ reading });
    } catch (e) {
      console.log(e);
    }
  };

  save = () => {
    const { save, word: wordObj } = this.props;
    const { word, reading, meaning } = this.state;
    save({ ...wordObj, word, reading, meaning });
  };

  addWord = () => {
    const { addWord } = this.props;
    const { word, reading, meaning } = this.state;
    const newWord: VocabWord = {
      word,
      reading: PinyinConverter.convert(reading),
      meaning,
      sentences: []
    };
    addWord(newWord);
    this.setState({ word: "", reading: "", meaning: "" });
  };

  render() {
    const isChinese = getUserPreferences().language === Language.Chinese;
    const { cancel, addWord } = this.props;
    const { word, reading, meaning } = this.state;
    return (
      <div className="VocabCard">
        <input
          type="text"
          value={reading}
          onChange={this.updateText("reading")}
          className="VocabCard__reading"
          placeholder={isChinese ? "pinyin" : "reading"}
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
          placeholder={isChinese ? "hanzi" : "kanji"}
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
        <div className="VocabCard__reading">
          {PinyinConverter.convert(word.reading)}
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
            <>
              <div
                key={'a' + i}
                className="VocabCard__sentence"
                onClick={() => speak(sentence.sentence)}
              >
                {sentence.sentence}
              </div>
              <div
                key={'b' + i}
                className="VocabCard__sentenceMeaning">
                {sentence.reading}
              </div>
            </>
          ))}
      </div>
    );
  }
}

export default VocabCard;
