import * as React from "react";
import { PureComponent } from "react";
import "./NewTabPage.scss";
import LearnPage from "./LearnPage";
import AddWords from "./AddWords";

type Props = {};

const vocabs = [
  {
    word: "真实 / 可信",
    wordPinyin: "zhēn shí / kě xìn",
    meaning: "believable；real",
    sentence: "这部电影的人物和情节都非常真实",
    sentencePinyin: "Zhè bù diànyǐng de rénwù hé qíngjiē dōu fēicháng zhēnshí"
  },
  {
    word: "衍生剧",
    wordPinyin: "yǎn shēng jù",
    meaning: "spin-off",
    sentence: "我认为大部分衍生剧都很失败。",
    sentencePinyin: "Wǒ rènwéi dà bùfèn yǎnshēngjù dōu hěn shībài."
  },
  {
    word: "总监",
    wordPinyin: "zǒng jiān",
    meaning: "director",
    sentence: "我们公司有技术总监，但是没有财务总监。",
    sentencePinyin:
      "Wǒmen gōngsī yǒu jìshù zǒngjiān，dànshì méiyǒu cáiwù zǒngjiān."
  },
  {
    word: "票房",
    wordPinyin: "piào fáng",
    meaning: "box office",
    sentence: "今年票房最好的电影是《复联4》",
    sentencePinyin: "Jīnnián piàofáng zuìhǎo de diànyǐng shì 《fù lián 4》."
  },
  {
    word: "政治",
    wordPinyin: "zhèng zhì",
    meaning: "politics; political",
    sentence: "年轻人对政治都不太感兴趣，你为什么想当政治家？",
    sentencePinyin:
      "Niánqīng rén duì zhèngzhì dōu bú tài gǎn xìngqù，nǐ wèi shénme xiǎng dāng zhèngzhìjiā"
  }
];

const vocab = vocabs[Math.floor(Math.random() * vocabs.length)];
document.title = vocab.word;

enum Pages {
  Learn,
  Add
}

class NewTabPage extends PureComponent<Props> {
  state = {
    page: Pages.Learn
  };
  render() {
    const { page } = this.state;

    return (
      <div className="NewTabPage">
        {page === Pages.Add && <AddWords />}
        {page === Pages.Learn && <LearnPage vocab={vocab} />}

        {page === Pages.Learn && <div
          className="NewTabPage__addWords"
          onClick={() => this.setState({ page: Pages.Add })}
        >
          Update Vocab
        </div>}
      </div>
    );
  }
}

export default NewTabPage;
