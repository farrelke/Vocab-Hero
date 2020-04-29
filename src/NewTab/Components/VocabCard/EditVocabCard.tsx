import * as React from "react";
import { useState } from "react";
import "./EditVocabCard.scss";
import { VocabWord } from "../../../Utils/DB/VocabDb";
import { isUserLangChinese } from "../../../Utils/UserPreferencesUtils";
import PinyinConverter from "../../../Utils/PinyinConverter";
import AudioInput from "../AudioInput/AudioInput";
import SearchImageBox from "../SearchImageBox/SearchImageBox";

type Props = {
  word?: VocabWord;
  save?: (word: VocabWord) => unknown;
  cancel?: () => unknown;
  addWord?: (word: VocabWord) => unknown;
};

const EditVocabCard = (props: Props) => {
  const [word, setWord] = useState(props.word ? props.word.word : "");
  const [reading, setReading] = useState(props.word ? props.word.reading : "");
  const [meaning, setMeaning] = useState(props.word ? props.word.meaning : "");
  const [audio, setAudio] = useState(props.word ? props.word.audio : null);
  const isChinese = isUserLangChinese();

  const resetState = () => {
    setWord("");
    setReading("");
    setMeaning("");
  };

  const saveChanged = () => {
    props.save({ ...props.word, word, reading, meaning, audio });
  };

  const addNewWord = () => {
    const newWord: VocabWord = {
      word,
      reading: PinyinConverter.convert(reading),
      meaning,
      sentences: []
    };
    console.log(newWord);
    props.addWord(newWord);
    resetState();
  };

  const pinyinise = () => {
    try {
      setReading(PinyinConverter.convert(reading));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="EditVocabCard">
      <input
        type="text"
        value={reading}
        onChange={e => setReading(e.target.value)}
        className="EditVocabCard__reading"
        placeholder={isChinese ? "pinyin" : "reading"}
      />
      <div className="EditVocabCard__btns">
        <div onClick={pinyinise} className="EditVocabCard__btn">
          Pinyinise
        </div>
      </div>
      <input
        onChange={e => setWord(e.target.value)}
        type="text"
        value={word}
        className="EditVocabCard__word"
        placeholder={isChinese ? "hanzi" : "kanji"}
      />
      <textarea
        onChange={e => setMeaning(e.target.value)}
        value={meaning}
        className="EditVocabCard__wordMeaning"
        placeholder="translation"
      />

      <div className="EditVocabCard__searchBox">
        <SearchImageBox setImageUrl={imageUrl => this.setState({ imageUrl })} />
      </div>

      <div className="EditVocabCard__audioWrapper" >
        <AudioInput file={audio as File} onChange={audioFile => setAudio(audioFile)} />
      </div>

      <div className="EditVocabCard__editBtns EditVocabCard__btn--save">
        {!props.addWord && (
          <>
            <div onClick={props.cancel} className="EditVocabCard__btn EditVocabCard__btn--cancel">
              Cancel
            </div>
            <div onClick={saveChanged} className="EditVocabCard__btn">
              Save
            </div>
          </>
        )}
        {props.addWord && (
          <div onClick={addNewWord} className="EditVocabCard__btn">
            Add
          </div>
        )}
      </div>
    </div>
  );
};

export default EditVocabCard;
