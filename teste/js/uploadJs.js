jQuery(document).ready(function (){
    let siglaLida = getCookie("sigla");
jQuery("#idTxtSigla").val(siglaLida);
jQuery( "#idDivDialogUpload" ).dialog({
  hide: "puff",
  show : "slide",
  height: "auto",
  width:600,   
});
});//ready
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }