import * as React from "react";
import { VocabWord } from "../../Utils/VocabDb";
import { PureComponent } from "react";
import VocabCard from "../VocabCard";
import { searchJisho } from "../../Utils/JishoUtils";

type Props = {
  addWord: (word: VocabWord) => any;
};

class JapaneseSearchAdd extends PureComponent<Props> {
  state = {
    dictIndex: null as any,
    searchWord: "" as string,
    results: [] as VocabWord[]
  };

  updateSearchWord = async (e: React.FormEvent<HTMLInputElement>) => {
    const searchWord = e.currentTarget.value;
    this.setState({ searchWord, results: [] });
    const jishoResults = await searchJisho(searchWord);
    if (searchWord !== this.state.searchWord) return;

    const results = jishoResults.map(r => {
      const reading =
        (r.japanese && r.japanese.length > 0 && r.japanese[0].reading) || "";
      const english =
        r.senses && r.senses.length > 0 && r.senses[0].english_definitions;
      const meaning = english.join(",");

      return {
        word: r.slug,
        reading: reading,
        meaning: meaning,
        sentences: []
      };
    });

    this.setState({ results });
  };

  addWord = (word: VocabWord) => {
    this.setState({ searchWord: "", results: [] });
    this.props.addWord(word);
  };

  render() {
    const { results, searchWord } = this.state;

    return (
      <div className="SearchAdd">
        <div className="SearchAdd__inputContainer">
          <div className="SearchAdd__inputLabel">Search</div>
          <input
            type="text"
            value={searchWord}
            onChange={this.updateSearchWord}
            className="SearchAdd__input"
          />
        </div>

        <div className="SearchAdd__resultsTitle">Results</div>

        {results &&
          results.map(result => (
            <VocabCard
              key={result.word + result.reading}
              word={result}
              addWord={() => this.addWord(result)}
            />
          ))}
      </div>
    );
  }
}

export default JapaneseSearchAdd;
