/**
 * Detect the language used in the image
 *
 * @param {File} image
 * @param {*} progressCallback The handler for when tesseract.js emits a progress event
 * @returns Currently returns a reading of "NULL" for everything. Don't use
 */
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

/**
 * Reads the image with tesseract.js
 *
 * @param {File} image
 * @param {func} progressCallback The handler for when tesseract.js emits a progress event
 * @returns Promise -> result object
 */
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
