import * as React from "react";
import { PureComponent } from "react";
import "./ManageWords.scss";
import VocabCard from "../Components/VocabCard/VocabCard";
import {
  getVocabWords,
  updateVocabWord,
  VocabWord
} from "../../Utils/DB/IndexdbUtils";

type Props = {
  deleteWord: (word: VocabWord) => unknown;
};

class ManageWords extends PureComponent<Props> {
  state = {
    words: [] as VocabWord[]
  };

  async componentDidMount() {
    const words = await getVocabWords();
    this.setState({ words });
  }

  deleteWord = async (word: VocabWord) => {
    let { words } = this.state;
    words = words.filter(w => w.id !== word.id);
    this.setState({ words });
    this.props.deleteWord(word);
  };

  updateWord = async (word: VocabWord, index: number) => {
    let words = [...this.state.words];
    words[index] = word;
    this.setState({ words });
    await updateVocabWord(word);
  };

  render() {
    const { words } = this.state;

    return (
      <div className="ManageWords">
        {words &&
          words.map((word, i) => (
            <VocabCard
              key={word.id}
              word={word}
              deleteWord={() => this.deleteWord(word)}
              updateWord={word => this.updateWord(word, i)}
            />
          ))}
      </div>
    );
  }
}

export default ManageWords;
