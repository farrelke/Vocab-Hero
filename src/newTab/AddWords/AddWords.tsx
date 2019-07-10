import * as React from "react";
import { PureComponent } from "react";
import "./AddWords.scss";
import PasteAdd from "./PasteAdd";
import SearchAdd from "./SearchAdd";
import { SubPage } from "../components/Sidebar/Sidebar";
import InputAdd from "./InputAdd";
import { VocabWord } from "../../Utils/IndexdbUtils";
import JapaneseSearchAdd from "./JapaneseSearchAdd";
import { getUserPreferences, Language } from "../../Utils/DbUtils";

type Props = {
  addWord: (word: VocabWord) => any;
  subPage: SubPage;
};

enum InputMethod {
  Input = "Input",
  Search = "Search",
  Paste = "Paste"
}

function InputMethodSelector(props: {
  selectedMethod: InputMethod;
  updateMethod: (method: InputMethod) => any;
}) {
  return (
    <div className="AddWords__methods">
      {[InputMethod.Input, InputMethod.Search, InputMethod.Paste].map(
        method => {
          return (
            <div
              className={`AddWords__method ${
                method === props.selectedMethod
                  ? "AddWords__method--selected"
                  : ""
              }`}
              onClick={() => props.updateMethod(method)}
            >
              {method}
            </div>
          );
        }
      )}
    </div>
  );
}

class AddWords extends PureComponent<Props> {
  state = {
    inputMethod: InputMethod.Input
  };

  updateMethod = (inputMethod: InputMethod) => {
    this.setState({ inputMethod });
  };

  render() {
    const { inputMethod } = this.state;
    const { addWord, subPage } = this.props;

    if (subPage === SubPage.Input) {
      return  <InputAdd  addWord={addWord} />
    } else if (subPage === SubPage.Search) {
      const isChinese = getUserPreferences().language === Language.Chinese;
      return isChinese ? <SearchAdd addWord={addWord} /> :  <JapaneseSearchAdd addWord={addWord} />;
    }

    return (
      <div className="AddWords">
        {subPage === SubPage.Paste && <PasteAdd addWord={addWord} />}
      </div>
    );
  }
}

export default AddWords;
