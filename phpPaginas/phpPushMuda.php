<?php
ini_set('default_charset','iso-8859-1');
$enderecoEmailPush=$_POST['endEmail'];
$senhaEmailPush=$_POST['pasEmail'];
$numeroEmail=$_POST['numeroEmail'];
$mbox = imap_open("{imap.escribaoffice.com.br:143/novalidate-cert}INBOX" ,$enderecoEmailPush, $senhaEmailPush);
$booResultado = imap_clearflag_full($mbox,$numeroEmail,"\\Seen");//tira o 'já visto'
$concatena = 1;
if($booResultado==FALSE){
$concatena = 0;
}
echo $concatena;
imap_close($mbox,CL_EXPUNGE);
?>
