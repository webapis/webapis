window.addEventListener("load", function () {
  window.addEventListener("error", function (e) {
    const { message, stack } = e.error;

    var errorMonitor = new XMLHttpRequest();
    //oReq.addEventListener("load", reqListener);

    errorMonitor.open("POST", "/monitor/client-error/");
    errorMonitor.send(JSON.stringify({ message, stack }));
  });
});
