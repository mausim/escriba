<?php
ini_set('default_charset','iso-8859-1');
$lidoNaoLido=$_POST['lidoNaoLido'];//Procurar mensagens 0=não lido, 1=lido;2=todos;
$textoCondicao = "novas.";
$condicao="NEW";
if($lidoNaoLido==1){
$condicao = "SEEN";
$textoCondicao = "já lidas.";
}
if($lidoNaoLido==2){
  $condicao = "ALL";
  $textoCondicao = "na caixa de entrada, sejam lidas ou não lidas.";
}
$enderecoEmailPush=$_POST['endEmail'];
$senhaEmailPush=$_POST['pasEmail'];
$mbox = imap_open("{imap.escribaoffice.com.br:143/novalidate-cert}INBOX" ,$enderecoEmailPush, $senhaEmailPush);
//$concatena="<tr><th>From</th><th>Data</th><th>Assunto</th><th>Texto da mensagem</th></tr>";
$concatena="<tr></tr>";
$emails = imap_search($mbox,$condicao);
if($emails){
  //se a variável emails retornar FALSE, nem entra aqui, significando não existir o tipo de mensagem lida ou não
foreach($emails as $email_number) {
$objAssunto = imap_headerinfo($mbox,$email_number);
$dataLida = $objAssunto->date;
$veioDe = $objAssunto->from;
$remetentes="";
foreach ($veioDe as $id => $meuObj) {
  $remetentes = $remetentes.$meuObj->mailbox . "@" . $meuObj->host;
}
$assunto = $objAssunto->subject;
$assunto = iconv_mime_decode($assunto,0, "ISO-8859-1");
$corpo = imap_fetchbody($mbox, $email_number, 1);
$corpo = quoted_printable_decode($corpo);//para tirar os símbolos tais como '=C3=A1' e renderizar imagens
$corpo = utf8_decode($corpo);//transforma utf-8 em iso-8859-1
$concatena = $concatena . "<tr><th colspan='3' class='idTabDataAcompProcessos'><img src='/imagens/direita-icone.png' width = '25px' height = '25px' alt=''> ".$dataLida."</th></tr><tr><th class='idTabAssuntoAcompProcessos'>".$assunto."</th><td>".$corpo ."</td></tr><tr> </tr>";
}//foreach
}else{
  //não há mensagem neste tipo de visualização (lida, não lida, todas)
$mensagem = "Não há mensagens ".$textoCondicao;
$mensagem = utf8_decode($mensagem);//transforma utf-8 em iso-8859-1 
$concatena = $concatena."<tr><th colspan='4'>".$mensagem."</th></tr>";
}
echo $concatena;
imap_close($mbox);
?>
