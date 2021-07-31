const printer = require("pdf-to-printer");

function printers(request, response) {
  console.log('get printers');
    function onSuccess(data) {
      console.log(data);
      response.send(data);
    }
  
    function onError(error) {
      response.send({ status: "error", error });
    }
  
    printer.getPrinters().then(onSuccess).catch(onError);
  }

module.exports = printers;