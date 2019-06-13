import * as React from "react";
import { PureComponent } from 'react';
import "./PasteAdd.scss"
import { TextareaAutosize } from "react-autosize-textarea/lib/TextareaAutosize";
import VocabCard from "../VocabCard";
import { VocabWord } from "../../Utils/DbUtils";
import { getTextLines } from "../../Utils/StringUtils";

type Props = {
  addWord: (word: VocabWord) => any;
}


function RadioButton(props: {
  index: number;
  label: string;
  name?: string;
  selected: string;
  onSelect: (index: number, value: string) => any;
}) {
  const word = props.name || props.label;
  const isSelected = props.selected === word;
  return (
    <div
      onClick={() => props.onSelect(props.index, word)}
      className={`AddWords__typeOption AddWords__typeOption--${word} ${
        isSelected ? "AddWords__typeOption--selected" : ""
        }`}
    >
      {props.label}
    </div>
  );
}

function TypeLine(props: {
  index: number;
  selected: string;
  onSelect: (index: number, value: string) => any;
}) {
  return (
    <div className="AddWords__typeOptions">
      <RadioButton
        index={props.index}
        name="word"
        label={"hanzi"}
        selected={props.selected}
        onSelect={props.onSelect}
      />
      <RadioButton
        index={props.index}
        name="wordPinyin"
        label={"pinyin"}
        selected={props.selected}
        onSelect={props.onSelect}
      />
      <RadioButton
        index={props.index}
        label={"meaning"}
        selected={props.selected}
        onSelect={props.onSelect}
      />
      <RadioButton
        index={props.index}
        name={"sentence"}
        label={"example"}
        selected={props.selected}
        onSelect={props.onSelect}
      />
      <RadioButton
        index={props.index}
        name={"sentencePinyin"}
        label={"example pinyin"}
        selected={props.selected}
        onSelect={props.onSelect}
      />
    </div>
  );
}

const defaultOrder = [
  "word",
  "wordPinyin",
  "meaning",
  "sentence",
  "sentencePinyin"
];


class PasteAdd extends PureComponent<Props> {
  state = {
    selectedValues: [...defaultOrder],
    card: {} as VocabWord
  };
  textArea: React.RefObject<HTMLTextAreaElement> = React.createRef();

  onSelect = (index: number, value: string) => {
    const selectedValues = [...this.state.selectedValues];
    selectedValues[index] = value;
    this.setState({ selectedValues }, this.updateCard);
  };

  onResize = (e: any) => {
    const { selectedValues } = this.state;
    const rowLen = Math.round(this.textArea.current.clientHeight / 34);
    const diff = rowLen - selectedValues.length;

    if (diff > 0) {
      const newValues = new Array(diff).fill("sentence");
      this.setState({ selectedValues: [...selectedValues, ...newValues] });
    } else if (diff < 0) {
      this.setState({
        selectedValues: selectedValues.slice(0, rowLen)
      });
    }
  };

  updateCard = () => {
    const lines = getTextLines(
      this.textArea.current.clientWidth - 3,
      "AddWords__textTester",
      this.textArea.current.value
    );
    const card: VocabWord = {
      word: "",
      wordPinyin: "",
      meaning: "",
      sentences: []
    };
    const { selectedValues } = this.state;
    let lastSentence = {
      sentence: "",
      pinyin: ""
    };
    let lastType = "";

    selectedValues.forEach((type, i) => {
      let line = lines[i];
      if (!line) return;

      if (type === "sentence") {
        if (lastType === "sentencePinyin" && lastSentence.sentence) {
          card.sentences.push(lastSentence);
          lastSentence = {
            sentence: "",
            pinyin: ""
          };
        }
        lastSentence.sentence += line;
      } else if (type === "sentencePinyin") {
        if (lastType === "sentence" && lastSentence.pinyin) {
          card.sentences.push(lastSentence);
          lastSentence = {
            sentence: "",
            pinyin: ""
          };
        }
        lastSentence.pinyin += line;
      } else {
        card[type] += line;
      }
      lastType = type;
    });

    if (lastSentence.pinyin || lastSentence.sentence) {
      card.sentences.push(lastSentence);
    }

    this.setState({ card });
  };

  addWord = () => {
    if (!this.state.card || !this.state.card.word) return;
    this.props.addWord(this.state.card);
    this.textArea.current.value = "";
    this.setState({ selectedValues: [...defaultOrder], card: {} });
  };

  render() {
    const { selectedValues, card } = this.state;

    return (
      <div className="PasteAdd">
        <div className="AddWords__addArea">
          <div className="AddWords__selectTypeArea">
            {selectedValues.map((val, i) => (
              <TypeLine
                key={i}
                index={i}
                selected={val}
                onSelect={this.onSelect}
              />
            ))}
          </div>
          <div className="AddWords__textAreaContainer">
            <TextareaAutosize
              ref={this.textArea}
              onChange={this.updateCard}
              className="AddWords__textArea"
              rows={5}
              onResize={this.onResize}
              wrap="hard"
            />

            <div className="AddWords__textAreaBackgrounds">
              {selectedValues.map((val, i) => (
                <div
                  key={i}
                  className={
                    "AddWords__textAreaBackground AddWords__textAreaBackground--" +
                    val
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {card && <VocabCard word={card} addWord={this.addWord} />}

        <span id="AddWords__textTester" />
      </div>
    );
  }
}

export default PasteAdd;
