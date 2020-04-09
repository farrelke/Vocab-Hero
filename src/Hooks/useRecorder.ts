import { useCallback, useState } from "react";
import { startRecording, stopRecording } from "../Utils/RecordUtils";

export const useRecorder = () => {
  const [isRecording, setRecording] = useState(false);

  const onStartRecording = useCallback(async () => {
    await startRecording();
    setRecording(true);
  }, []);

  const onStopRecording = useCallback(async () => {
    setRecording(false);
    return await stopRecording();
  }, []);

  return { startRecording: onStartRecording, stopRecording: onStopRecording, isRecording };
};
