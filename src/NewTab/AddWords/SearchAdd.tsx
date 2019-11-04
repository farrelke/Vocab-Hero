import * as React from "react";
import { PureComponent } from "react";
import "./SearchAdd.scss";
import VocabCard from "../Components/VocabCard/VocabCard";
import PinyinConverter from "../../Utils/PinyinConverter";
import { initDict, searchDict, VocabWord } from "../../Utils/DB/IndexdbUtils";
import { WordDef } from "../../Utils/DB/VocabDb";

type Props = {
  addWord: (word: VocabWord) => unknown;
};

let dictLoaded = false;

class SearchAdd extends PureComponent<Props> {
  state = {
    isReady: dictLoaded,
    searchWord: "" as string,
    results: [] as WordDef[]
  };

  async componentDidMount() {
    await initDict();
    dictLoaded = true;
    this.setState({ isReady: true });
  }

  updateSearchWord = async (e: React.FormEvent<HTMLInputElement>) => {
    const searchWord = e.currentTarget.value;
    this.setState({ searchWord, results: [] });
    if (!searchWord) return;

    const results = await searchDict(searchWord);
    if (searchWord === this.state.searchWord) {
      this.setState({ results });
    }
  };

  addWord = (wordDef: WordDef) => {
    if (wordDef && wordDef.word) {
      const word: VocabWord = {
        word: wordDef.word,
        reading: PinyinConverter.convert(wordDef.reading),
        meaning: wordDef.meaning,
        sentences: []
      };
      this.props.addWord(word);
    }
    this.setState({ searchWord: "", results: [] });
  };

  render() {
    const { results, searchWord, isReady } = this.state;

    return (
      <div className="SearchAdd">
        {!isReady && (
          <div className="SearchAdd__loading">Loading dictionary...</div>
        )}
        {isReady && (
          <>
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
                  key={result.id}
                  word={{ ...result, sentences: [] } as any}
                  addWord={() => this.addWord(result)}
                />
              ))}
          </>
        )}
      </div>
    );
  }
}

export default SearchAdd;
