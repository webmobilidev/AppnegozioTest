/// <reference path="Z:\SimoVinci_HOME\Documenti\Development\DotNET\TP_App\TP_App\Scripts/jquery-2.1.1.js" />
/// <reference path="Z:\SimoVinci_HOME\Documenti\Development\DotNET\TP_App\TP_App\Scripts/MobileEngine-2.0.0.js" />

/** Istanza di TP_MobileEngine */
var tp;
/** Istanza di PushManager */
var pushManager;


/** Si occupa delle configurazioni e delle inizializzazioni da fare appena avviato il device */
function DeviceInitializator() {

  var gapReady = $.Deferred();
  var jqmReady = $.Deferred();


  document.addEventListener("deviceReady", function () {
    gapReady.resolve();
  }, false);

  $(document).one("mobileinit", function () {
    jqmReady.resolve();
  });


  $.when(gapReady, jqmReady).then(function () {

    //***** PRE-SETTINGS di JQM
    //Make your jQuery Mobile framework configuration changes here!
    $.support.cors = true;  // necessario per il funzionamento di PhoneGap
    $.mobile.allowCrossDomainPages = true;  // necessario per il funzionamento di PhoneGap
    $.mobile.pushStateEnabled = false;  // raccomandato da jquery mobile (uso con PhoneGAP)
    // *******

    var tp = new TP_MobileEngine();
    var pushManager = new PushManager(tp.TpID(), tp.Domain());

    var appID = pushManager.getAppID(tp.TpID());
    try {
      pushNotification = window.plugins.pushNotification;
      if (device.platform == 'android' || device.platform == 'Android' || device.platform == 'amazon-fireos')
        pushNotification.register(successHandler, errorHandler, { "senderID": appID, "ecb": "pushManager.onNotification" });		// required!
      else 
        pushNotification.register(tokenHandler, errorHandler, { "badge": "true", "sound": "true", "alert": "true", "ecb": "pushManager.onNotificationAPN" });	// required!
    }
    catch (err) {

      console.log(err);
    }



  }).fail(function () {
    alert("PORCOD_O");
    // no connection
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';

    if (navigator.connection.type == Connection.NONE)
      location.href = "no_connection.html";

  });


  function tokenHandler(result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
    var reg = window.localStorage.getItem("Registered");
    if (reg != 1)
      pushManager.sendRegID(result, device.platform);
  }

  function successHandler(result) {
    //$("#app-status-ul").append('<li>success:'+ result +'</li>');
    //alert("viva dio");
  }

  function errorHandler(error) {
    //$("#app-status-ul").append('<li>error:'+ error +'</li>');
    //alert("errore");
    alert(error);
  }

}



(function () {
  var devInit = new DeviceInitializator();
}());