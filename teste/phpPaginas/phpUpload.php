<?php
$uploaddir = '/teste/imagens/';
$nomeFuturo = $_POST['namTxtUPAdvSigla'];
$uploadfile = $uploaddir . basename($_FILES['namFilUPAdvFoto']['name']);
if (move_uploaded_file($_FILES['namFilUPAdvFoto']['tmp_name'], $uploaddir.$nomeFuturo.".png")) {
 echo "Arquivo válido e enviado com sucesso. Por favor, feche esta janela e faça uma mudança de nome de usuário para o usuário da sigla ".$nomeFuturo."\n";
} else {
    echo "Possível ataque de upload de arquivo!\n";
}
