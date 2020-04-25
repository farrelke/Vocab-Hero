import * as React from "react";
import "./AnkiExport.scss";
import { createDeck, createModel, createNotesFromWords } from "../../Utils/Anki/AnkiUtils";
import { useEffect, useState } from "react";
import { getVocabWords } from "../../Utils/DB/IndexdbUtils";

type Props = {};
const DeckName = "Vocab Hero";
const ModelName = "Vocab Hero Hanzi Question 2";

const AnkiExport = ({  }: Props) => {
  const [isAnkiInstalling, setAnkiInstalling] = useState(false);
  const [words, setWords] = useState([]);

  useEffect(() => {
    const fn = async () => {
      const words = await getVocabWords();
      setWords(words);
    };
    fn();
  }, []);

  const setupAnki = async () => {
    setAnkiInstalling(true);
    try {
      await createDeck(DeckName);
      await createModel(ModelName);
    } catch (e) {
      console.log(e);
    }
    setAnkiInstalling(false);
  };

  const exportWords = async () => {
    if (!words) return;
    setAnkiInstalling(true);
    try {
      await createNotesFromWords(DeckName, ModelName, words);
    } catch (e) {
      console.log(e);
    }
    setAnkiInstalling(false);
  };

  return (
    <div className="ImportPage__section">
      <div className="ImportPage__sectionTitle">Export flashcards to Anki</div>
      <div className="ImportPage__sectionDesc">To generate an export file in Anki:</div>
      <div className="ImportPage__sectionDesc">
        Export to Anki
        <div className="ImportPage__hskBtn" onClick={setupAnki}>
          Setup Anki
        </div>
        <div className="ImportPage__hskBtn" onClick={exportWords}>
          Export to Anki
        </div>
      </div>
    </div>
  );
};

export default AnkiExport;
