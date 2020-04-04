import { useState } from "react";
import "./VocabCard.scss";
import * as React from "react";
import { speak } from "../../../Utils/SpeechUtils";
import { VocabWord } from "../../../Utils/DB/VocabDb";
import PinyinConverter from "../../../Utils/PinyinConverter";
import EditVocabCard from "./EditVocabCard";

type Props = {
  word: VocabWord;
  deleteWord?: () => unknown;
  addWord?: () => unknown;
  updateWord?: (word: VocabWord) => unknown;
};

const VocabCard = (props: Props) => {
  const [editMode, setEditMode] = useState(false);
  const { word } = props;

  const toggleEditing = () => {
    setEditMode(!editMode);
  };

  const updateWord = (word: VocabWord) => {
    setEditMode(false);
    props.updateWord(word);
  };

  if (editMode) {
    return <EditVocabCard word={word} cancel={toggleEditing} save={updateWord} />;
  }

  return (
    <div className="VocabCard">
      <div className="VocabCard__reading">{PinyinConverter.convert(word.reading)}</div>

      {props.deleteWord && !editMode && (
        <div className="VocabCard__btns">
          <div className="VocabCard__btn" onClick={toggleEditing}>
            Edit
          </div>
          <div className="VocabCard__btn VocabCard__btn--delete" onClick={props.deleteWord}>
            Delete
          </div>
        </div>
      )}

      {props.addWord && (
        <div className="VocabCard__btn VocabCard__btn--add" onClick={props.addWord}>
          Add
        </div>
      )}

      <div className="VocabCard__word" onClick={() => speak(word.word, word.audio)}>
        {word.word}
      </div>

      <div className="VocabCard__wordMeaning">{word.meaning}</div>
      {word.sentences &&
        word.sentences.map((sentence, i) => (
          <>
            <div key={`s${i}`} className="VocabCard__sentence" onClick={() => speak(sentence.sentence)}>
              {sentence.sentence}
            </div>
            <div key={`r${i}`} className="VocabCard__sentenceMeaning">
              {sentence.reading}
            </div>
          </>
        ))}
    </div>
  );
};

export default VocabCard;
