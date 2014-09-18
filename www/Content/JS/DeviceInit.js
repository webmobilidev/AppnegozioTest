/// <reference path="Z:\SimoVinci_HOME\Documenti\Development\DotNET\TP_App\TP_App\Scripts/jquery-1.10.2.min.js" />
/// <reference path="Z:\SimoVinci_HOME\Documenti\Development\DotNET\TP_App\TP_App\Scripts/MobileEngine-2.0.0.js" />

/** Istanza di TP_MobileEngine */
var tp;
/** Istanza di PushManager */
var pushManager;


/** Si occupa delle configurazioni e delle inizializzazioni da fare appena avviato il device */
function DeviceInitializator() {

  var gapReady = $.Deferred();
  var jqmReady = $.Deferred();

  var tpID;
  var domain;

  if(onDevice != undefined)
    gapReady.resolve();


  document.addEventListener("deviceReady", function () {
    gapReady.resolve();
  }, false);

  $(document).one("mobileinit", function () {
    $(function () {
      tpID = getTpID();
      domain = getDomain();
    });
    jqmReady.resolve();
  });


  $.when(gapReady, jqmReady).then(function () {

    //***** PRE-SETTINGS di JQM
    //Make your jQuery Mobile framework configuration changes here!
    $.support.cors = true;  // necessario per il funzionamento di PhoneGap
    $.mobile.allowCrossDomainPages = true;  // necessario per il funzionamento di PhoneGap
    $.mobile.pushStateEnabled = false;  // raccomandato da jquery mobile (uso con PhoneGAP)
    // *******

    if (onDevice != undefined) {
      pushManager = new PushManager(tpID, domain);
      var appID = pushManager.getAppID(tpID);
      pushNotification = window.plugins.pushNotification;
      if (device.platform == 'android' || device.platform == 'Android' || device.platform == 'amazon-fireos')
        pushNotification.register(successHandler, errorHandler, { "senderID": appID, "ecb": "pushManager.onNotification" });		// required!
      else
        pushNotification.register(tokenHandler, errorHandler, { "badge": "true", "sound": "true", "alert": "true", "ecb": "pushManager.onNotificationAPN" });	// required!
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

  function getTpID() {
    /** Controllo l'id del TP tradotto nella memoria local **/
    window.localStorage.setItem("TpId", $(document.body).data("tp"));
    if (window.localStorage.getItem("idLingua") != null) {
      if (window.localStorage.getItem("idLingua") != window.localStorage.getItem("TpId")) {
        return window.localStorage.getItem("idLingua");
      }
      else {
        return window.localStorage.getItem("TpId");
      }
    }
    else {
      return window.localStorage.getItem("TpId");
    }
  }


  function getDomain() {
    if ($(document.body).data("db") == "prod")
      return "http://mobile.wm4pr.com";
    else if ($(document.body).data("db") == "test")
      return "http://mobiletest.wm4pr.com";
    else // debugging da localhost
      return "";
  }

}



(function () {
  var devInit = new DeviceInitializator();
}());