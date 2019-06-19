import * as React from "react";
import { PureComponent } from "react";
import "./SearchAdd.scss";
import { getDictIndex, getWordDict, VocabWord, WordDef, WordDefDict } from "../../Utils/DbUtils";
import VocabCard from "../VocabCard";
import PinyinConverter from "../../Utils/PinyinConverter";

type Props = {
  addWord: (word: VocabWord) => any;
};

class SearchAdd extends PureComponent<Props> {
  state = {
    wordDict: null as WordDefDict,
    dictIndex: null as any,
    searchWord: "" as string,
    results: [] as VocabWord[]
  };

  async componentDidMount() {
    const wordDict = await getWordDict();
    const dictIndex = await getDictIndex();
    this.setState({ wordDict, dictIndex });
  }

  updateSearchWord = async (e: React.FormEvent<HTMLInputElement>) => {
    const searchWord = e.currentTarget.value;
    this.setState({ searchWord, results: [] });
    if (!searchWord) return;

    const { dictIndex, wordDict } = this.state;


    // check chinese first
    let results: WordDef[] = Object.keys(wordDict).filter(a =>
      a.indexOf(searchWord) > -1
    ) .map(key => wordDict[key])
      .sort((a, b) => a.word.length - b.word.length);


    // try pinyin
    if (results.length <= 0 && searchWord.length >= 2) {
      results = dictIndex.search({
        field: ["wordPinyin", "simplePinyin"],
        bool: "or",
        query: searchWord.replace(" ", "")
      })
        .map(r => wordDict[r.word])
        .sort((a, b) => a.word.length - b.word.length)
        .slice(0, 20);

      // try translation
      if (results.length <= 0)
        results = dictIndex.search({
          field: "meaning",
          query: searchWord
          // remove dedups
        })
          .map(r => wordDict[r.word])
          .sort((a, b) => a.word.length - b.word.length);
    }


    this.setState({ results });
  };

  addWord = () => {
    const { wordDict, searchWord } = this.state;
    const card = wordDict[searchWord];
    if (card && card.word) {
      const word: VocabWord = {
        word: card.word,
        wordPinyin: PinyinConverter.convert(card.wordPinyin),
        meaning: card.meaning,
        sentences: []
      };

      this.props.addWord(word);
    }

    this.setState({ searchWord: "", results: [] });
  };

  render() {
    const { wordDict, results, searchWord } = this.state;

    return (
      <div className="SearchAdd">
        {!wordDict && (
          <div className="SearchAdd__loading">Loading dictionary...</div>
        )}
        {wordDict && (
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
                  key={result.word + result.wordPinyin}
                  word={result}
                  addWord={this.addWord}
                />
              ))}
          </>
        )}
      </div>
    );
  }
}

export default SearchAdd;
