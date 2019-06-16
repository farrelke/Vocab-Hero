import * as React from "react";
import { PureComponent } from "react";
import "./SearchAdd.scss";
import { getWordDict, VocabWord, WordDefDict } from "../../Utils/DbUtils";
import VocabCard from "../VocabCard";
import PinyinConverter from "../../Utils/PinyinConverter";

type Props = {
  addWord: (word: VocabWord) => any;
};

class SearchAdd extends PureComponent<Props> {
  state = {
    wordDict: null as WordDefDict,
    searchWord: "" as string
  };

  async componentDidMount() {
    const wordDict = await getWordDict();
    this.setState({ wordDict });
  }

  updateSearchWord = async (e: React.FormEvent<HTMLInputElement>) => {
    const searchWord = e.currentTarget.value;
    this.setState({ searchWord });
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

    this.setState({ searchWord: "" });
  };

  render() {
    const { wordDict, searchWord } = this.state;

    let card: any = {};
    if (wordDict && wordDict[searchWord]) {
      card = wordDict[searchWord];
      if (card && card.wordPinyin) {
        card.wordPinyin = PinyinConverter.convert(card.wordPinyin);
      }
      console.log(card);
    }

    return (
      <div className="SearchAdd">
        {!wordDict && <div>Loading dictionary...</div>}
        {wordDict && (
          <>
            {" "}
            <div>Dictionary loaded</div>
            <input
              onChange={this.updateSearchWord}
              type="text"
              value={searchWord}
              className="SearchAdd__word"
              placeholder="hanzi"
            />
            {card && <VocabCard word={card} addWord={this.addWord} />}
          </>
        )}
      </div>
    );
  }
}

export default SearchAdd;
