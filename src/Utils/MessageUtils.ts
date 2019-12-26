const fileBlobs: { [fileId: number]: Blob[] } = {};
const files: { [fileId: number]: Blob } = {};

export const addChuckBlock = (request: { fileId: number; blobAsText: string; mimeString: string; chunks: number }) => {
  const blobs = fileBlobs[request.fileId] = fileBlobs[request.fileId] || [];
  const bytes = new Uint8Array(request.blobAsText.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = request.blobAsText.charCodeAt(i);
  }
  // store blob
  blobs.push(new Blob([bytes], { type: request.mimeString }));

  if (blobs.length == request.chunks) {
    let mergedBlob: Blob | undefined;
    // merge all blob chunks
    for (let j = 0; j < blobs.length; j++) {
      if (mergedBlob) {
        // append blob
        mergedBlob = new Blob([mergedBlob, blobs[j]], { type: request.mimeString });
      } else {
        mergedBlob = new Blob([blobs[j]], { type: request.mimeString });
      }
    }

    files[request.fileId] = mergedBlob!;
  }
};

export const getFile = (fileId: number) => {
  return files[fileId];
};

export const removeFile = (fileId: number) => {
  delete files[fileId];
};