let recorder: any;
let isRecording = false;

let audioStream; //stream from getUserMedia()
let chunks;
let audioBlob;
let onDoneFunc;

const initRecorder = async () => {
  audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaOptions = {
    audioBitsPerSecond: 256000,
    videoBitsPerSecond: 2500000,
    bitsPerSecond: 2628000,
    mimeType: "audio/webm;codecs=opus"
  };
  chunks = [];
  recorder = new MediaRecorder(audioStream, mediaOptions);
  recorder.ondataavailable = e => {
    // add stream data to chunks
    chunks.push(e.data);

    // if recorder is 'inactive' then recording has finished
    if (recorder.state == "inactive") {
      // convert stream data chunks to a 'webm' audio format as a blob
      audioBlob = new Blob(chunks, { type: "audio/webm", bitsPerSecond: 128000 } as any);
      if (onDoneFunc) onDoneFunc(audioBlob);
    }
  };

  recorder.onerror = e => {
    console.log(e.error);
  };
};

export const startRecording = async () => {
  if (isRecording) return;
  isRecording = true;
  await initRecorder();
  recorder.start(1000);
};

export const stopRecording = async (): Promise<Blob> => {
  return new Promise(resolve => {
    onDoneFunc = resolve;
    //tell the recorder to stop the recording
    recorder.stop();
    //stop microphone access
    audioStream.getAudioTracks()[0].stop();
    isRecording = false;
  });
};
