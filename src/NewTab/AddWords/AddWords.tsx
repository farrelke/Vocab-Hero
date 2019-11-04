import * as React from "react";
import "./AddWords.scss";
import PasteAdd from "./PasteAdd";
import SearchAdd from "./SearchAdd";
import InputAdd from "./InputAdd";
import { VocabWord } from "../../Utils/DB/VocabDb";
import JapaneseSearchAdd from "./JapaneseSearchAdd";
import {  isUserLangChinese } from "../../Utils/UserPreferencesUtils";
import { SubPage } from "../Pages";

type Props = {
  addWord: (word: VocabWord) => unknown;
  subPage: SubPage;
};

const AddWords = (props: Props) => {
  const { addWord, subPage } = props;

  switch (subPage) {
    case SubPage.Input:
      return <InputAdd addWord={addWord} />;
    case SubPage.Search:
      return isUserLangChinese() ? <SearchAdd addWord={addWord} /> : <JapaneseSearchAdd addWord={addWord} />;
    case SubPage.Paste:
      return (
        <div className="AddWords">
          <PasteAdd addWord={addWord} />
        </div>
      );
    default:
      return null;
  }
};

export default AddWords;
