<?php
$uploaddir = '../docs/';
$nomeFuturo = $_POST['namTxtUPPasta'];
$nomeArquivoAtual = $_FILES['namFilUPHono']['name'];
if(substr($nomeArquivoAtual,-3)=='pdf'){
$uploadfile = $uploaddir . basename($_FILES['namFilUPHono']['name']);
if (move_uploaded_file($_FILES['namFilUPHono']['tmp_name'], $uploaddir.$nomeFuturo.".pdf")) {
 echo "Arquivo válido e enviado com sucesso. Por favor, feche esta janela e faça uma nova pesquisa ".$nomeFuturo."\n";
} else {
    echo "Possível ataque de upload de arquivo!\n";
}
}else{
    echo "ARQUIVO PDF OBRIGATÓRIO. NÃO FEZ O UPLOAD";
}