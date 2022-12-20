<?php
 ini_set('default_charset','iso-8859-1');
$mbox = imap_open("{imap.escribaoffice.com.br:143/novalidate-cert}INBOX" , 'mensageiro@escribaoffice.com.br' , 'C@bumba2010' );
/*
echo "<h1>Headers in INBOX</h1>\n";
$headers = imap_headers($mbox);

if ($headers == false) {
    echo "Call failed<br />\n";
} else {
    foreach ($headers as $val) {
        echo $val . "<br />\n";
    }
}
*/
$concatena="<tr><th>From</th><th>Data</th><th>Assunto</th><th>Texto da mensagem</th></tr>";
$emails = imap_search($mbox,'ALL');
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
$corpo = utf8_decode($corpo);//transforma utf-8 em iso-8859-1
$concatena = $concatena . "<tr><td>". $remetentes."</td><td>".$dataLida."</td><td>".$assunto."</td><td>".$corpo ."</td></tr>";
}//foreach
echo $concatena;
imap_close($mbox);
?>
