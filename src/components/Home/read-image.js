async function readImage(image, progressCallback) {
  const worker = new window.Tesseract.TesseractWorker();
  try {
    const result = worker.recognize(image)
      .progress((p) => {
        if (p.status === 'recognizing text') progressCallback(p.progress);
      })
    return result;
  } catch (err) {
    console.error('ERROR IN TESSERACT', err);
  }
}

export { readImage };
