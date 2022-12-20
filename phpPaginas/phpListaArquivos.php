<?php
$nomeDiretorio = $_POST['nomeDiretorio'];//os diretórios podem ser docs, log e pdfs
$diretorio    = '../'.$nomeDiretorio;
$arrayDocumentos= scandir($diretorio, 1);
echo json_encode($arrayDocumentos); 

