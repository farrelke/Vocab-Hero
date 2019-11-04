import * as React from "react";
import { PureComponent } from "react";
import "./UserPreferences.scss";
import {
  getUserPreferences,
  Language,
  Languages,
  setUserPreferences,
  UserPreferences as UserPreferencesType
} from "../../Utils/UserPreferencesUtils";
import { getVoicesByLanguage } from "../../Utils/SpeechUtils";
import { getChromeSettings, updateChromeSetting } from "../../Utils/ChromeSettingUtils";

type Props = {};

class UserPreferences extends PureComponent<Props> {
  state = {
    localState: getUserPreferences(),
    // State stored in  chrome storage is async so we need to wait for it
    // but it should be pretty fast
    chromeState: { forceReview: false }
  };

  async componentDidMount() {
    const setting = await getChromeSettings();
    this.setState({ chromeState: setting });
  }

  onChange = (field: keyof UserPreferencesType) => (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const newState = {
      ...this.state.localState,
      [field]:
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value
    };

    if (field === "language") {
      const voices = getVoicesByLanguage(e.target.value as Language);
      newState["voiceURI"] = voices[0].voiceURI;
    }

    this.setState({ localState: newState }, () => {
      setUserPreferences(this.state.localState);
    });
  };

  onForceReviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const forceReview = e.target.checked;
    this.setState({ chromeState: { forceReview } });
    updateChromeSetting({ forceReview });
  };

  render() {
    const {
      language,
      voiceURI,
      showChinesePodLink,
      forceReviewAutoSpeak
    } = this.state.localState;
    const { forceReview } = this.state.chromeState;
    const voices = getVoicesByLanguage(language);

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
              <option key={voice.name} value={voice.voiceURI.trim()}>
                {`${voice.lang} - ${voice.name}`}
              </option>
            ))}
          </select>
        </div>

        <div className="UserPreferences__group">
          <label className="UserPreferences__label">Link to ChinesePod</label>
          <input
            className="UserPreferences__control"
            type="checkbox"
            checked={showChinesePodLink}
            onChange={this.onChange("showChinesePodLink")}
          />
        </div>

        <div className="UserPreferences__group">
          <label className="UserPreferences__label">
            Force Review when browsing reddit (every 30 mins)
          </label>
          <input
            className="UserPreferences__control"
            type="checkbox"
            checked={forceReview}
            onChange={this.onForceReviewChange}
          />
        </div>
        {forceReview && (
          <div className="UserPreferences__group">
            <label className="UserPreferences__label">
              Auto speak the word when in force review
            </label>
            <input
              className="UserPreferences__control"
              type="checkbox"
              checked={forceReviewAutoSpeak}
              onChange={this.onChange("forceReviewAutoSpeak")}
            />
          </div>
        )}
      </div>
    );
  }
}

export default UserPreferences;
