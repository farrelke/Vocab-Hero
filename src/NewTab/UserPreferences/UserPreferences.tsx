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
import { ChromeSettings, getChromeSettings, updateChromeSetting } from "../../Utils/ChromeSettingUtils";

type Props = {};

class UserPreferences extends PureComponent<Props> {
  state = {
    localState: getUserPreferences(),
    // State stored in  chrome storage is async so we need to wait for it
    // but it should be pretty fast
    chromeState: null as null | ChromeSettings
  };

  async componentDidMount() {
    const setting = await getChromeSettings();
    this.setState({ chromeState: setting });
  }

  onChange = (field: keyof UserPreferencesType) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const newState = {
      ...this.state.localState,
      [field]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value
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
    const { language, voiceURI, showChinesePodLink, forceReviewAutoSpeak, disableToneColors } = this.state.localState;
    const chromeState = this.state.chromeState;
    const voices = getVoicesByLanguage(language);

    return (
      <div className="UserPreferences">
        <SelectOption
          label="Language"
          value={language}
          options={Languages.map(lang => ({ value: lang, label: lang }))}
          onChange={this.onChange("language")}
        />

        <SelectOption
          label="Speech Voice"
          value={voiceURI.trim()}
          options={voices.map(voice => ({ value: voice.voiceURI.trim(), label: `${voice.lang} - ${voice.name}` }))}
          onChange={this.onChange("voiceURI")}
        />

        <CheckboxOption
          label="Link to ChinesePod"
          value={showChinesePodLink}
          onChange={this.onChange("showChinesePodLink")}
        />

        <CheckboxOption
          label="Disable tone colors"
          value={disableToneColors}
          onChange={this.onChange("disableToneColors")}
        />

        {chromeState && (
          <>
            <CheckboxOption
              label="Force Review when browsing reddit (every 30 mins)"
              value={chromeState.forceReview}
              onChange={this.onForceReviewChange}
            />
            {chromeState.forceReview && (
              <CheckboxOption
                label="Auto speak the word when in force review"
                value={forceReviewAutoSpeak}
                onChange={this.onChange("forceReviewAutoSpeak")}
              />
            )}
          </>
        )}
      </div>
    );
  }
}

export default UserPreferences;

const CheckboxOption = (props: {
  label: string;
  value: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => unknown;
}) => {
  return (
    <div className="UserPreferences__group">
      <label className="UserPreferences__label">{props.label}</label>
      <input className="UserPreferences__control" type="checkbox" checked={props.value} onChange={props.onChange} />
    </div>
  );
};

const SelectOption = (props: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => unknown;
}) => {
  return (
    <div className="UserPreferences__group">
      <label className="UserPreferences__label">{props.label}</label>
      <select className="UserPreferences__control" value={props.value} onChange={props.onChange}>
        {props.options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
