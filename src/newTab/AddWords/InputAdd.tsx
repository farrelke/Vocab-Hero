import * as React from "react";
import { PureComponent } from "react";
import "./InputAdd.scss";
import PinyinConverter from "../../Utils/PinyinConverter";
import { getDictIndex, getWordDict, WordDefDict } from "../../Utils/DbUtils";
import { VocabWord } from "../../Utils/IndexdbUtils";

type Props = {
  addWord: (word: VocabWord) => any;
};

class InputAdd extends PureComponent<Props> {
  state = {
    hanzi: "",
    pinyin: "",
    translation: "",
    wordDict: null as WordDefDict
  };
  hanziInput: any;


  async componentDidMount() {
    const wordDict = await getWordDict();
    this.setState({ wordDict });
  }


  updateText = (type: string) => (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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


  addWord = () => {
    const { addWord } = this.props;
    const { hanzi, pinyin, translation, wordDict } = this.state;
    const dictRef = wordDict && wordDict[hanzi];


    const newWord: VocabWord = {
      word: hanzi,
      reading: PinyinConverter.convert(pinyin || dictRef.reading),
      meaning: translation || dictRef.meaning,
      sentences: []
    };
    addWord(newWord);
    this.setState({ hanzi: "", pinyin: "", translation: "" });
  };

  onKeyDownTranslation = (e: any) => {
    if (e.key === 'Enter') {
      this.addWord();
      this.hanziInput && this.hanziInput.focus();
    }
  };

  onKeyDownPinyin = (e: any) => {
    if (e.key === 'Enter') {
      this.pinyinise()
    }
  };


  render() {
    const { hanzi, pinyin, translation, wordDict } = this.state;

    const dictRef = wordDict && wordDict[hanzi];

    return (
      <div className="InputAdd">
        <div className="InputAdd__inputContainer">
          <div className="InputAdd__inputLabel">Hanzi</div>
          <input
            ref={ref => this.hanziInput = ref}
            type="text"
            value={hanzi}
            onChange={this.updateText("hanzi")}
            className="InputAdd__input"
          />
        </div>

        <div className="InputAdd__inputContainer">
          <div className="InputAdd__inputLabel">Pinyin</div>
          <input
            type="text"
            value={pinyin}
            placeholder={PinyinConverter.convert((dictRef && dictRef.reading) || "")}
            onKeyDown={this.onKeyDownPinyin}
            onChange={this.updateText("pinyin")}
            className="InputAdd__input"
          />
          <div className="InputAdd__btn InputAdd__btn--inputBtn" onClick={this.pinyinise}>Pinyinise</div>
        </div>

        <div className="InputAdd__inputContainer">
          <div className="InputAdd__inputLabel">Translation</div>
          <textarea
            rows={4}
            onKeyDown={this.onKeyDownTranslation}
            value={translation}
            placeholder={(dictRef && dictRef.meaning) || ""}
            onChange={this.updateText("translation")}
            className="InputAdd__input InputAdd__input--textarea"
          />
        </div>

        <div className="InputAdd__btn InputAdd__btn--add" onClick={this.addWord}>Add Word</div>
      </div>
    );
  }
}

export default InputAdd;
