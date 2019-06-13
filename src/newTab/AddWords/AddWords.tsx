import * as React from "react";
import { PureComponent } from "react";
import "./AddWords.scss";
import { VocabWord } from "../../Utils/DbUtils";
import PasteAdd from "./PasteAdd";
import { EditVocabCard } from "../VocabCard";

type Props = {
  addWord: (word: VocabWord) => any;
};

enum InputMethod {
  Input = "Input",
  Paste = "Paste"
}

function InputMethodSelector(props: {
  selectedMethod: InputMethod;
  updateMethod: (method: InputMethod) => any;
}) {
  return (
    <div className="AddWords__methods">
      {[InputMethod.Input, InputMethod.Paste].map(method => {
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
      })}
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
    const { addWord } = this.props;

    return (
      <div className="AddWords">
        <div className="AddWords__title">Add Vocab</div>

        <InputMethodSelector
          selectedMethod={inputMethod}
          updateMethod={this.updateMethod}
        />

        {inputMethod === InputMethod.Input && <EditVocabCard addWord={addWord} />}
        {inputMethod === InputMethod.Paste && <PasteAdd addWord={addWord} />}
      </div>
    );
  }
}

export default AddWords;
