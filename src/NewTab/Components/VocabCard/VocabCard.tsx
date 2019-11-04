import { useState } from "react";
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

const VocabCard = (props: Props) => {
  const [editMode, setEditMode] = useState(false);

  const toggleEditing = () => {
    setEditMode(!editMode);
  };

  const updateWord = (word: VocabWord) => {
    setEditMode(false);
    props.updateWord(word);
  };

  if (editMode) {
    return <EditVocabCard word={props.word} cancel={toggleEditing} save={updateWord} />;
  }

  return (
    <div className="VocabCard">
      <div className="VocabCard__reading">{PinyinConverter.convert(props.word.reading)}</div>

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

      <div className="VocabCard__word" onClick={() => speak(props.word.word)}>
        {props.word.word}
      </div>

      <div className="VocabCard__wordMeaning">{props.word.meaning}</div>
      {props.word.sentences &&
        props.word.sentences.map((sentence, i) => (
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
