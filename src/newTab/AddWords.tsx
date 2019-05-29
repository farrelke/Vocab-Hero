import * as React from "react";
import { PureComponent } from "react";
import "./AddWords.scss";
import { setVocabWords } from "./DbUtils";
import { TextareaAutosize } from "react-autosize-textarea/lib/TextareaAutosize";

type Props = {};

export interface VocabWord {
  word: string;
  wordPinyin: string;
  meaning: string;
  sentences: {
    sentence: string;
    pinyin: string;
  }[];
}

const words: VocabWord[] = [
  {
    word: "真实 / 可信",
    wordPinyin: "zhēn shí / kě xìn",
    meaning: "believable；real",
    sentences: [
      {
        sentence: "这部电影的人物和情节都非常真实",
        pinyin: "Zhè bù diànyǐng de rénwù hé qíngjiē dōu fēicháng zhēnshí"
      }
    ]
  },
  {
    word: "衍生剧",
    wordPinyin: "yǎn shēng jù",
    meaning: "spin-off",
    sentences: [
      {
        sentence: "我认为大部分衍生剧都很失败。",
        pinyin: "Wǒ rènwéi dà bùfèn yǎnshēngjù dōu hěn shībài."
      }
    ]
  },
  {
    word: "总监",
    wordPinyin: "zǒng jiān",
    meaning: "director",
    sentences: [
      {
        sentence: "我们公司有技术总监，但是没有财务总监。",
        pinyin: "Wǒmen gōngsī yǒu jìshù zǒngjiān，dànshì méiyǒu cáiwù zǒngjiān."
      }
    ]
  },
  {
    word: "票房",
    wordPinyin: "piào fáng",
    meaning: "box office",
    sentences: [
      {
        sentence: "今年票房最好的电影是《复联4》",
        pinyin: "Jīnnián piàofáng zuìhǎo de diànyǐng shì 《fù lián 4》."
      }
    ]
  },
  {
    word: "政治",
    wordPinyin: "zhèng zhì",
    meaning: "politics; political",
    sentences: [
      {
        sentence: "年轻人对政治都不太感兴趣，你为什么想当政治家？",
        pinyin:
          "Niánqīng rén duì zhèngzhì dōu bú tài gǎn xìngqù，nǐ wèi shénme xiǎng dāng zhèngzhìjiā"
      }
    ]
  },

  {
    word: "抽屉",
    wordPinyin: "chōutì",
    meaning: "drawer ; locker",
    sentences: [
      {
        sentence: "我把资料都放在办公桌的第一个抽屉里了。",
        pinyin:
          "wǒ bǎ zī liào dōu fàng zài bàn gōng zhuō de dì yī gè chōu tì lǐ le 。"
      }
    ]
  },

  {
    word: "倒",
    wordPinyin: "dào",
    meaning: "move backward；pour",
    sentences: [
      {
        sentence: "请把视频往回倒三分钟，我想再看一遍。",
        pinyin:
          "qǐng bǎ shì pín wǎng huí dǎo sān fèn zhōng ，wǒ xiǎng zài kàn yī biàn 。"
      },
      {
        sentence: "可惜时间不能倒回，我们回不去年少时光。",
        pinyin:
          "kě xī shí jiān bú néng dǎo huí ，wǒ men huí bú qù nián shǎo shí guāng。"
      }
    ]
  },

  {
    word: "抽屉",
    wordPinyin: "chōutì",
    meaning: "drawer ; locker",
    sentences: [
      {
        sentence: "我把资料都放在办公桌的第一个抽屉里了。",
        pinyin:
          "wǒ bǎ zī liào dōu fàng zài bàn gōng zhuō de dì yī gè chōu tì lǐ le 。"
      }
    ]
  },

  {
    word: "暂停",
    wordPinyin: "zàntíng",
    meaning: "suspend；time-out",
    sentences: [
      {
        sentence: "比赛中一名球员受伤了，教练暂停了比赛，让其他球员替换下他。",
        pinyin:
          "bǐ sài zhōng yī míng qiú yuán shòu shāng le ，jiāo liàn zàn tíng le bǐ sài ，ràng qí tā qiú yuán tì huàn xià tā "
      }
    ]
  },

  {
    word: "白+V",
    wordPinyin: "bái",
    meaning: "without results; in vain",
    sentences: [
      {
        sentence: "本来以为公司要给大家放一周的假，结果只有三天，白激动了。",
        pinyin:
          "běn lái yǐ wéi gōng sī yào gěi dà jiā fàng yī zhōu de jiǎ ，jié guǒ zhī yǒu sān tiān ，bái jī dòng le 。"
      }
    ]
  },

  {
    word: "靠着",
    wordPinyin: "kàozhe",
    meaning: "depend on; rely on",
    sentences: [
      {
        sentence: "我的室友靠着过硬的技术，跳槽到了一家发展更好的公司。",
        pinyin:
          "wǒ de shì yǒu kào zhe guò yìng de jì shù ，tiào cáo dào le yī jiā fā zhǎn gèng hǎo de gōng sī 。"
      }
    ]
  }
];

function RadioButton(props: { id: string | number; label: string, name?: string }) {
  return (
    <div className={`AddWords__typeOption AddWords__typeOption--${props.name || props.label}`}>
      {props.label}
    </div>
  );
}

function TypeLine(props: { id: string | number, selected: string }) {

  return <div className="AddWords__typeOptions">
    <RadioButton id={props.id}  name="word" label={"hanzi"} />
    <RadioButton id={props.id} label={"pinyin"} />
    <RadioButton id={props.id} label={"meaning"} />
    <RadioButton id={props.id}  name={"sentence"} label={"example"} />
    <RadioButton id={props.id} name={"sentencePinyin"} label={"example pinyin"} />
  </div>;
}


class AddWords extends PureComponent<Props> {
  state = {
    quickAdd: false
  };

  onAdd = async () => {
    await setVocabWords(words);
    console.log("New Vocab has been saved");
  };

  render() {
    return (
      <div className="AddWords">
        <div className="AddWords__title">Add Vocab</div>
        <div className="AddWords__addArea" onClick={this.onAdd}>
          <div className="AddWords__selectTypeArea">
            <TypeLine id={"1"} selected={"1"} />
            <TypeLine id={"2"} selected={"1"} />
            <TypeLine id={"3"} selected={"1"} />
          </div>
          <TextareaAutosize rows={5} />
        </div>
      </div>
    );
  }
}

export default AddWords;
