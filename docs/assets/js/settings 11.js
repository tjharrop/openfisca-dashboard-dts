document.getElementById("ofurl").value = window.OFURL;
$('#changeAPI').click(function(){
  if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    localStorage.OFURL = $('#ofurl').val();
  } else {
    // No Web Storage
    alert("Please allow localStorage to use this function");
  }
});
$('#resetAPI').click(function(){
  if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    localStorage.removeItem("OFURL");
  } else {
    // No Web Storage
    alert("Please allow localStorage to use this function");
  }
});
