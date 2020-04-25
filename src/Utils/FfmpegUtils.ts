import { createWorker } from "@ffmpeg/ffmpeg";

let worker = null;
const loadWorker = async () => {
  if (worker) return worker;
  const newWorker: any = createWorker({
    corePath: "chrome-extension://egbhlijnkoompngemjibfdfpchopglaf/ffmpeg/ffmpeg-core.js",
    workerPath: "chrome-extension://egbhlijnkoompngemjibfdfpchopglaf/ffmpeg/worker.min.js",
    logger: m =>  console.log(m)
  });
  await newWorker.load();
  worker = newWorker;
  return worker;
};

const loadBlobToUnit8Array = (blob: Blob) => {
  return new Promise(resolve => {
    const fileReader = new FileReader();
    fileReader.onload = function() {
      const res = this.result;
      resolve(new Uint8Array(res as any));
    };
    fileReader.readAsArrayBuffer(blob);
  });
};

const _convertWebmToOgg = async (webmAudio: Blob) => {
  const inputFileName = "test.webm";
  const outputFileName = "test.ogg";
  const worker = await loadWorker();

  const inputData = await loadBlobToUnit8Array(webmAudio);
  await worker.write(inputFileName, inputData);
  await worker.transcode(inputFileName, outputFileName);
  const { data } = await worker.read(outputFileName);
  await worker.remove(inputFileName);
  await worker.remove(outputFileName);

  return new Blob([data.buffer], { type: "audio/ogg" });
};

let prevAsync = null;
export const convertWebmToOgg = async (webmAudio: Blob) => {
  if (prevAsync) {
    await prevAsync;
  }
  prevAsync = _convertWebmToOgg(webmAudio);
  return prevAsync;
};
