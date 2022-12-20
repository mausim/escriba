<?php
$uploaddir = '/teste/docs/';
$idPasta = $_POST['namTxtUPPasta'];
$nomeFuturo="c_".$idPasta;
$nomeArquivoAtual = $_FILES['namFilUPCrono']['name'];
if(substr($nomeArquivoAtual,-3)=='pdf'){
$uploadfile = $uploaddir . basename($_FILES['namFilUPCrono']['name']);
if (move_uploaded_file($_FILES['namFilUPCrono']['tmp_name'], $uploaddir.$nomeFuturo.".pdf")) {
 echo "Arquivo válido e enviado com sucesso.\n";
} else {
    echo "Possível arquivo não informado!\n";
}
}else{
    echo "ARQUIVO PDF OBRIGATÓRIO. NÃO FEZ O UPLOAD";
}