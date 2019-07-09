import * as React from "react";
import { PureComponent } from "react";
import "./UserPreferences.scss";
import { getUserPreferences, Language, Languages, setUserPreferences } from "../../Utils/DbUtils";
import { getVoices } from "../../Utils/SpeechUtils";

type Props = {};

class UserPreferences extends PureComponent<Props> {
  state = getUserPreferences();

  onChange = (field: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      [field]: e.target.value
    }, () => {
      setUserPreferences(this.state);
    });
  };

  render() {
    const { language, voiceURI } = this.state;
    const voices = getVoices().filter(a => {
      if (language === Language.Chinese) return a.lang.startsWith("zh");
      if (language === Language.Japanese) return a.lang.startsWith("ja");
      return true;
    });

    return (
      <div className="UserPreferences">
        <div className="UserPreferences__group">
          <label className="UserPreferences__label">Language</label>
          <select
            className="UserPreferences__control"
            value={language}
            onChange={this.onChange("language")}
          >
            {Languages.map(lang => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div className="UserPreferences__group">
          <label className="UserPreferences__label">Speech Voice</label>
          <select
            className="UserPreferences__control"
            value={voiceURI.trim()}
            onChange={this.onChange("voiceURI")}
          >
            {voices.map(voice => (
              <option key={voice.name} value={voice.voiceURI.trim()} >
                {`${voice.lang} - ${voice.name}`}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}

export default UserPreferences;
