import * as React from "react";
import "./AddWords.scss";
import PasteAdd from "./PasteAdd";
import SearchAdd from "./SearchAdd";
import { SubPage } from "../components/Sidebar/Sidebar";
import InputAdd from "./InputAdd";
import { VocabWord } from "../../Utils/VocabDb";
import JapaneseSearchAdd from "./JapaneseSearchAdd";
import { getUserPreferences, Language } from "../../Utils/DbUtils";

type Props = {
  addWord: (word: VocabWord) => any;
  subPage: SubPage;
};

const AddWords = (props: Props) => {
  const { addWord, subPage } = props;

  if (subPage === SubPage.Input) {
    return <InputAdd addWord={addWord} />;
  } else if (subPage === SubPage.Search) {
    const isChinese = getUserPreferences().language === Language.Chinese;
    return isChinese ? (
      <SearchAdd addWord={addWord} />
    ) : (
      <JapaneseSearchAdd addWord={addWord} />
    );
  }

  return (
    <div className="AddWords">
      {subPage === SubPage.Paste && <PasteAdd addWord={addWord} />}
    </div>
  );
};

export default AddWords;
