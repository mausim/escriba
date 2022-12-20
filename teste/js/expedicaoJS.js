jQuery(document).ready(function (){
    let idLido = getCookie("idPedido");
jQuery("#idSpaExpIdPedido").text(idLido);
//---------------------------------
jQuery(document).on("click","#idBtnExpSalvarPedido",function (){
    let idPedido = jQuery("#idSpaExpIdPedido").text();
    let intStatus = jQuery("#idSelExpStatuspedido option:selected").val();
    let obs =jQuery("#idTAExpObsPedido").val();
    //---
    let sqlUpdate = `UPDATE tabexpedicao     
    SET  obs= ?, status = ?, data_edicao = ?  
    WHERE id = ?`;
    let dataEdicao = new Date().toLocaleString();
       let arrayValores = [obs,intStatus,dataEdicao,idPedido];
       let intOperacao = 3;
       let tripa = fPrepara(arrayValores);
       fExecutaBD(intOperacao, sqlUpdate, tripa).then(function (retorno) {
           if (retorno * 1 > 0) {
            alert ("Alterado o pedido com sucesso. Atualize a pesquisa de pedidos agora, por favor");

           }else{
            alert ("Houve um problema com a alteração do pedido: "+retorno);
           }
        });//fexecutaBD
});//idBtnExpSalvarPedido click
});//ready
//====================================================READY
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