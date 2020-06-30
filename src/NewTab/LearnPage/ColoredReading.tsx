import * as React from "react";
import { useMemo } from "react";
import "./ColoredReading.scss";
import * as utils from "pinyin-utils";
import * as pinyinSplit from "pinyin-split";
import { getUserPreferences, Language } from "../../Utils/UserPreferencesUtils";

type Props = {
  reading: string;
};

const ColoredReading = ({ reading }: Props) => {
  const words = useMemo(() => {
    const { disableToneColors, language } = getUserPreferences();
    const showToneColors = language === Language.Chinese && !disableToneColors;
    if (!showToneColors) {
      return [{ word: reading, tone: 0 } ];
    }
    const words = reading ? pinyinSplit(reading) : "";
    return words.map(word => ({ word, tone: utils.getToneNumber(word) }));
  }, [reading]);

  return (
    <div className="ColoredReading">
      {words.map(({ word, tone }) => (
        <span className={`ColoredReading__word ColoredReading__word--${tone}`}>{word}</span>
      ))}
    </div>
  );
};

export default ColoredReading;
