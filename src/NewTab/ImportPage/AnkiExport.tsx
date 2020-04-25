import * as React from "react";
import "./AnkiExport.scss";
import { createDeck, createModel, createNotesFromWords } from "../../Utils/Anki/AnkiUtils";
import { useEffect, useState } from "react";
import { VocabWord } from "../../Utils/DB/VocabDb";
import { getVocabWords } from "../../Utils/DB/IndexdbUtils";

type Props = {};
const DeckName = "Vocab Hero";
const ModelName = "Vocab Hero Hanzi Question";

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
      <div className="ImportPage__sectionTitle">Import flashcards from Anki</div>
      <div className="ImportPage__sectionDesc">
        To generate an export file in Anki:
        <ul className="ImportPage__sectionDescList">
          <li>
            First install the add-on{" "}
            <a href="https://ankiweb.net/shared/info/1788670778">CrowdAnki: JSON export&import</a> in anki using{" "}
            <b>Tools > Add-ons > Get Add-ons...</b>.
          </li>
          <li>
            After you install the CrowdAnki add-on then export your anki deck using <b>Export..</b>.
          </li>
          <li>
            Set the export format to CrowdAnki JSON representation and select the deck you want to export.&nbsp;
            <b>Do not select "All Decks"</b>
          </li>
          <li>
            Unset <b>include media</b> and <b>include tags</b>
          </li>
          <li>
            Click <b>Export...</b>
          </li>
        </ul>
      </div>
      <input type="file" id="files" name="files[]" onChange={e => this.handleAnkiImport(e.target.files)} />

      <div className="ImportPage__sectionTitle" style={{ marginTop: 20 }}>
        Export flashcards from Anki
      </div>
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
