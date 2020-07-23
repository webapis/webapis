window.addEventListener("load", function () {
  debugger;

  window.addEventListener("error", function (e) {
    debugger;
    const { message, stack } = e.error;
    debugger;
    var errorMonitor = new XMLHttpRequest();
    //oReq.addEventListener("load", reqListener);
    debugger;
    errorMonitor.open("POST", "/client-error/");
    errorMonitor.send(JSON.stringify({ message, stack }));
  });
});
