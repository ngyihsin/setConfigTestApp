var startTime;
var endTime;

function getAsText(readFile) {

  var reader = new FileReader();

  // Read file into memory as UTF-16
  reader.readAsBinaryString(readFile);

  // Handle progress, success, and errors
  reader.onprogress = updateProgress;
  reader.onload = loaded;
  reader.onerror = errorHandler;
}

function updateProgress(evt) {
  if (evt.lengthComputable) {
    // evt.loaded and evt.total are ProgressEvent properties
    var loaded = (evt.loaded / evt.total);
    if (loaded < 1) {
      // Increase the prog bar length
      // style.width = (loaded * 200) + "px";
    }
  }
}

function loaded(evt) {
  // Obtain the read file data
  var fileString = evt.target.result;
  console.log(fileString);
  var infile   = new Blob([fileString], {type: "text/plain"});
  navigator.mozNfc.setConfig("setTransit", infile)
  .then((result) => {
    endTime = Date.now();
    setConfigTest.setConfig_result.textContent = result + " " + (endTime - startTime) + "ms";
    console.log(result + " timeDiff:" + (endTime - startTime) + "ms");
  })
  .catch((result) => {
    endTime = Date.now();
    console.log("catch an error" + " timeDiff:" + (endTime - startTime) + "ms");

    setConfigTest.setConfig_result.textContent = result + " " + (endTime - startTime) + "ms";
  })
}

function errorHandler(evt) {
  if(evt.target.error.name == "NotReadableError") {
    // The file could not be read
  }
}


var setConfigTest = {
  init: function init() {
    this.current = 0;
    this.navigableItems[this.current].focus();
    window.addEventListener('keyup', this);
    window.addEventListener('keydown', this);
    window.addEventListener('hashchange', this);
    this.setConfig_result = document.getElementById('setConfig_result');
    this.setConfigNull_result = document.getElementById('setConfigNull_result');
    this.setConfigEmpty_result = document.getElementById('setConfigEmpty_result');
  },

  uninit: function uninit() {

  },

  get navigableItems() {
    delete this.navigableItems;
    return this.navigableItems = document.querySelectorAll('.navigable');
  },

  handleEvent: function handleEvent(ev) {
    dump("handleEvent:" + ev.type);
    switch (ev.type) {
      case 'click':
        if (ev.target.id === "exit-button") {
          window.location.hash = '';
        }
        break;
      case 'load':
        break;
      case 'unload':
        break;
      case 'hashchange':
        break;
      case 'transitionend':
        break;
      case 'keydown':
        this.handleKeydown(ev);
        break;
      case 'keyup':
        this.handleKeyup(ev);
        break;
    }
  },

  handleKeydown: function ut_handleKeydown(ev) {
    var key = ev.key;
    switch(key) {
      case 'Enter':
        if (ev.target.id == "setConfig-button") {
          startTime = Date.now();
          var sdcard = navigator.getDeviceStorage("sdcard");

          var request = sdcard.get("libnfc-nxpTransit.conf");
          request.onsuccess = function () {
            var file = this.result;
            console.log("Get the file: " + file.name);
            getAsText(file);
          }

          request.onerror = function () {
            console.warn("Unable to get the file: " + JSON.stringify(this.error));
          }
        } else if (ev.target.id == "setConfigNull-button") {
            startTime = Date.now();
            navigator.mozNfc.setConfig("revertToDefault")
            .then((result) => {
              console.log(result);
              endTime = Date.now();
              setConfigTest.setConfigNull_result.textContent = result + " " + (endTime - startTime) + "ms";
            })
            .catch((result) => {
              console.log("catch an error:" + result);
              endTime = Date.now();
              setConfigTest.setConfigNull_result.textContent = result + " " + (endTime - startTime) + "ms";
            })
        } else if (ev.target.id == "setConfigEmpty-button") {
            startTime = Date.now();
            navigator.mozNfc.setConfig("revertToTransit")
            .then((result) => {
              endTime = Date.now();
              console.log(result);
              setConfigTest.setConfigEmpty_result.textContent = result + " " + (endTime - startTime) + "ms";
            })
            .catch((result) => {
              endTime = Date.now();
              console.log("catch an error:" + result);
              setConfigTest.setConfigEmpty_result.textContent = result + " " + (endTime - startTime) + "ms";
            })
        } else if (ev.target.id == "clear-button") {
          setConfigTest.setConfig_result.textContent = "";
          setConfigTest.setConfigNull_result.textContent = "";
          setConfigTest.setConfigEmpty_result.textContent = "";
        }
        break;
      case 'ArrowUp':
        this.current -= 1;
        if (this.current < 0) {
          this.current = this.navigableItems.length;
        }
        this.navigableItems[this.current].focus();
        break;
      case 'ArrowDown':
        this.current += 1;
        this.current %= this.navigableItems.length;
        this.navigableItems[this.current].focus();
        break;
      case 'BrowserBack':
      case 'Backspace':
        break;
    }
  },

  handleKeyup: function ut_handleKeyup(ev) {
    var key = ev.key;
    switch(key) {
      case 'BrowserBack':
      case 'Backspace':
        break;
    }
  }
};

window.addEventListener('load', setConfigTest.init.bind(setConfigTest));

