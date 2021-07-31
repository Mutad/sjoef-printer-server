const fs = require("fs");
const path = require("path");
const printer = require("pdf-to-printer");
const fetch = require("node-fetch");

function print(request, response) {
  function onSuccess() {
    response.send({ status: "completed" });
  }

  function onError(error) {
    response.send({ status: "error", error });
  }

  console.log('printer: ' + request.query.printer);
  fetch(request.query.url)
    .then((res) => res.buffer())
    .then((buffer) => {
      const pdf = save(buffer);

      console.log('printing from url: ' + request.query.url);
      printer
        .print(pdf, { printer: request.query.printer })
        .then(onSuccess)
        .catch(onError)
        .finally(() => { console.log("completed!"); remove(pdf) });
    });
}

function save(buffer) {
  const pdfPath = path.join(__dirname, randomString() + ".pdf");
  fs.writeFileSync(pdfPath, buffer, "binary");
  return pdfPath;
}

function remove(pdf) {
  fs.unlinkSync(pdf);
}

function randomString() {
  return Math.random().toString(36).substring(7);
}

module.exports = print;