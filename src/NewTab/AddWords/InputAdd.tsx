import * as React from "react";
import { PureComponent } from "react";
import "./InputAdd.scss";
import PinyinConverter from "../../Utils/PinyinConverter";
import {
  getUserPreferences,
  Language
} from "../../Utils/UserPreferencesUtils";
import { findWord, VocabWord } from "../../Utils/DB/IndexdbUtils";
import { WordDef } from "../../Utils/DB/VocabDb";

type Props = {
  addWord: (word: VocabWord) => any;
};

class InputAdd extends PureComponent<Props> {
  state = {
    hanzi: "",
    pinyin: "",
    translation: "",
    dictDef: null as WordDef
  };
  hanziInput: any;

  async componentDidMount() {}

  updateText = (type: string) => async (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.currentTarget.value;
    this.setState({ [type]: newValue });


    if (type === "hanzi" && getUserPreferences().language === Language.Chinese) {
      this.setState({ dictDef: null });
      const dictDef = await findWord(newValue);
      if (newValue === this.state.hanzi) {
        this.setState({ dictDef });
      }
    }
  };

  pinyinise = () => {
    try {
      const pinyin = PinyinConverter.convert(this.state.pinyin);
      this.setState({ pinyin });
    } catch (e) {
      console.log(e);
    }
  };

  addWord = () => {
    const { addWord } = this.props;
    const { hanzi, pinyin, translation, dictDef } = this.state;


    const newWord: VocabWord = {
      word: hanzi,
      reading: PinyinConverter.convert(pinyin || dictDef.reading),
      meaning: translation || dictDef.meaning,
      sentences: []
    };
    addWord(newWord);
    this.setState({ hanzi: "", pinyin: "", translation: "" });
  };

  onKeyDownTranslation = (e: any) => {
    if (e.key === "Enter") {
      this.addWord();
      this.hanziInput && this.hanziInput.focus();
    }
  };

  onKeyDownPinyin = (e: any) => {
    if (e.key === "Enter") {
      this.pinyinise();
    }
  };

  render() {
    const isChinese = getUserPreferences().language === Language.Chinese;
    const { hanzi, pinyin, translation, dictDef } = this.state;


    return (
      <div className="InputAdd">
        <div className="InputAdd__inputContainer">
          <div className="InputAdd__inputLabel">
            {isChinese ? "Hanzi" : "Kanji"}
          </div>
          <input
            ref={ref => (this.hanziInput = ref)}
            type="text"
            value={hanzi}
            onChange={this.updateText("hanzi")}
            className="InputAdd__input"
          />
        </div>

        <div className="InputAdd__inputContainer">
          <div className="InputAdd__inputLabel">
            {isChinese ? "Pinyin" : "Reading"}
          </div>
          <input
            type="text"
            value={pinyin}
            placeholder={PinyinConverter.convert(
              (dictDef && dictDef.reading) || ""
            )}
            onKeyDown={this.onKeyDownPinyin}
            onChange={this.updateText("pinyin")}
            className="InputAdd__input"
          />
          {isChinese && (
            <div
              className="InputAdd__btn InputAdd__btn--inputBtn"
              onClick={this.pinyinise}
            >
              Pinyinise
            </div>
          )}
        </div>

        <div className="InputAdd__inputContainer">
          <div className="InputAdd__inputLabel">Translation</div>
          <textarea
            rows={4}
            onKeyDown={this.onKeyDownTranslation}
            value={translation}
            placeholder={(dictDef && dictDef.meaning) || ""}
            onChange={this.updateText("translation")}
            className="InputAdd__input InputAdd__input--textarea"
          />
        </div>

        <div
          className="InputAdd__btn InputAdd__btn--add"
          onClick={this.addWord}
        >
          Add Word
        </div>
      </div>
    );
  }
}

export default InputAdd;