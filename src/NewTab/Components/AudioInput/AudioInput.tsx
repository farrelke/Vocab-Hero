import * as React from "react";
import { useCallback, useRef } from "react";
import "./AudioInput.scss";
import { useRecorder } from "../../../Hooks/useRecorder";
import { useObjectUrl } from "../../../Hooks/useObjectUrl";


type Props = {
  file: File | undefined;
  onChange: (file?: File | Blob) => any;
};

const AudioInput = ({ onChange, file }: Props) => {
  const { startRecording, stopRecording, isRecording } = useRecorder();
  const audioFileRef = useRef<HTMLInputElement>(null);

  const fileUrl = useObjectUrl(file);

  const onFileUpdated = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files[0];
      onChange(file);
    },
    [onChange]
  );

  const onStopRecording = useCallback(async () => {
    const blob = await stopRecording();
    onChange(blob as any);
  }, [onChange, stopRecording]);

  return (
    <div className="AudioInput">
      <div className="AudioInput__controls">
        <input
          id="audioFile"
          className="AudioInput__fileInput"
          type="file"
          accept="audio/*"
          onChange={onFileUpdated}
          ref={audioFileRef}
          capture
        />
        <label htmlFor="audioFile" className="AudioInput__fileLabel">
          Local File
        </label>
        {!isRecording && (
          <div className="AudioInput__btn" onClick={startRecording}>
            Record
          </div>
        )}
        {isRecording && (
          <div className="AudioInput__btn AudioInput__btn--red" onClick={onStopRecording}>
            Stop Recording
          </div>
        )}
        {file && (
          <div className="AudioInput__btn AudioInput__btn--red" onClick={() => onChange()}>
            Clear
          </div>
        )}
      </div>

      {fileUrl && !isRecording && <audio className="AudioInput__audioPlayer" controls src={fileUrl} />}
    </div>
  );
};

export default AudioInput;
