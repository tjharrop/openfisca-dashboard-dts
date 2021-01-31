window.OFdefault = "https://ofcan.herokuapp.com/";
if (typeof(Storage) !== "undefined") {
  // Code for localStorage/sessionStorage.
  if (localStorage.OFURL) {
    window.OFURL = localStorage.OFURL;
  } else {
    window.OFURL = window.OFdefault;
  }
} else {
  // No Web Storage
  window.OFURL = window.OFdefault;
}
$(document).ready(function() {
  document.getElementById("ofurlDisplay").innerHTML = window.OFURL;
  var $loading = $('#loading').hide();
  $(document)
    .ajaxStart(function () {
      $loading.fadeIn(50);
    })
    .ajaxStop(function () {
      $loading.fadeOut(50);
    });
});
