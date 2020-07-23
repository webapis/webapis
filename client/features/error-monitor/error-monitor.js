window.addEventListener("load", function () {
  window.addEventListener("error", function (error) {
    var errorMonitor = new XMLHttpRequest();
    //oReq.addEventListener("load", reqListener);
    errorMonitor.open("POST", "/client-error/");
    errorMonitor.send(JSON.stringify({ message: error.message }));
  });
});
