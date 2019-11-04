import * as React from "react";
import { PureComponent } from "react";
import "./AnkiImport.scss";
import { AnkiData } from "../../Utils/Import/ImportUtils";
import VocabCard from "../Components/VocabCard/VocabCard";
import { VocabWord } from "../../Utils/DB/VocabDb";

type Props = {
  ankiData: AnkiData;
  addWords: (words: VocabWord[]) => unknown;
};

const VocabOptions = [
  { label: "Not Exported", value: "" },
  { label: "Hanzi", value: "word" },
  { label: "Pinyin", value: "reading" },
  { label: "Meaning", value: "meaning" },
  { label: "Example", value: "example" },
  { label: "Example Pinyin", value: "examplePinyin" }
];

class AnkiImport extends PureComponent<Props> {
  state = {
    mapFieldsTo: {} as { [field: string]: string }
  };

  handleChange = (field: string) => (event: any) => {
    const mapFieldsTo = { ...this.state.mapFieldsTo };
    const value = event.target.value;

    if (value) {
      Object.keys(mapFieldsTo).forEach(key => {
        if (mapFieldsTo[key] === value) mapFieldsTo[key] = "";
      });
    }
    mapFieldsTo[field] = value;
    this.setState({ mapFieldsTo });
  };

  importDeck = () => {
    const { ankiData, addWords } = this.props;
    const vocabWordMapping = this.getVocabWordMapping();

    if (!vocabWordMapping.word) {
      alert("You didn't export any Hanzi, please select the appropriate field using the dropdowns");
      return;
    }

    const words = ankiData.notes.map(note => this.mapVocabWord(vocabWordMapping, note));
    addWords(words);
  };

  getVocabWordMapping = (): { [key: string]: string } => {
    const { mapFieldsTo } = this.state;
    const vocabWordMapping = {};
    Object.keys(mapFieldsTo).forEach(key => {
      vocabWordMapping[mapFieldsTo[key]] = key;
    });
    return vocabWordMapping as any;
  };

  mapVocabWord = (mapping: { [key: string]: string }, ankiNote: { [key: string]: string }): VocabWord => {
    const sentences: { sentence: string; reading: string }[] = [];
    if (mapping.example || mapping.examplePinyin) {
      sentences.push({
        sentence: ankiNote[mapping.example] || "",
        reading: ankiNote[mapping.examplePinyin] || ""
      });
    }

    return {
      word: ankiNote[mapping.word] || "",
      reading: ankiNote[mapping.reading] || "",
      meaning: ankiNote[mapping.meaning] || "",
      sentences
    };
  };

  render() {
    const { mapFieldsTo } = this.state;
    const { ankiData } = this.props;
    const example = ankiData.notes[0];
    const vocabWordMapping = this.getVocabWordMapping();
    const word = this.mapVocabWord(vocabWordMapping, example);

    return (
      <div className="AnkiImport">
        <div className="ImportPage__sectionTitle">Exported from {ankiData.deckName}</div>
        <table className="AnkiImport__table">
          <thead>
            <tr>
              <th className="AnkiImport__tableHeaderField">Maps To</th>
              <th className="AnkiImport__tableHeaderField">Field</th>
              <th className="AnkiImport__tableHeaderField">Example</th>
            </tr>
          </thead>
          <tbody>
            {ankiData.fields.map(field => (
              <tr className="AnkiImport__row" key={field}>
                <td className="AnkiImport__rowValue">
                  <select value={mapFieldsTo[field] || 0} onChange={this.handleChange(field)}>
                    {VocabOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="AnkiImport__rowValue">{field}</td>
                <td className="AnkiImport__rowValue">{example[field]}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {word && <VocabCard word={word} />}

        <div className="AnkiImport__btn" onClick={this.importDeck}>
          Import Deck
        </div>
      </div>
    );
  }
}

export default AnkiImport;
