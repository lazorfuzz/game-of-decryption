async function detectLanguage(image, progressCallback) {
  const worker = new window.Tesseract.TesseractWorker();
  try {
    const langauge = worker.detect(image)
      .then((result) => console.log(result));
    return langauge;
  } catch (err) {
    console.error('ERROR DETECTING LANGUAGE', err);
  }
}

async function readImage(image, progressCallback) {
  const worker = new window.Tesseract.TesseractWorker();
  try {
    const result = worker.recognize(image, 'eng+rus+spa+ara+fas')
      .progress((p) => {
        console.log(p);
        progressCallback(p.status, p.progress);
      })
    return result;
    
  } catch (err) {
    console.error('ERROR IN TESSERACT', err);
  }
}

export { readImage, detectLanguage };
