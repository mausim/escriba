<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require("/teste/phpFuncoes/funcoes.php");
//*****
//1 - fazer um select num banco de dados
//2 - ler todos os arquivos em um dado diretório do servidor
//*****
$intOperacao=$_POST['intOperacao'];//determina qual função será chamada
switch($intOperacao){
case 1:
    //este é um select
require("/teste/phpClasses/classesPhp.php");
$conexao = new ConexaoBD();
$minhaConn = $conexao->getConexao();
$minhaConn->exec('SET NAMES utf8');
$sqlPassado = $_POST['sql'];
$meuArquivo=fopen("/teste/vigia/selecao.txt","w");
fwrite($meuArquivo,$sqlPassado."\r\n");
fclose($meuArquivo);
//---segurança
$booTemTracinhos=strpos($sqlPassado,"--");
if($booTemTracinhos!== false) $sqlPassado="SELECT tabpessoas WHERE 1=0";
//---
//A partir do resultado da consulta, se pega os nomes dos  
//...campos e seus valores correspondentes
//https://www.sitepoint.com/community/t/get-pdo-column-name-the-easy-way/4031/16
$st = $minhaConn->prepare($sqlPassado);
$st -> execute();
$raw_column_data = $st->fetchAll(PDO::FETCH_ASSOC);
echo fStrDevolveJson($raw_column_data);
$minhaConn = null;
break;
case 2:
    //lê todos os arquivos de um dado diretório
    $diretorio = $_POST['diretorio'];
    echo fStrDevolveJsonArquivos($diretorio);
break;
case 3:
    //faz update
require("/teste/phpClasses/classesPhp.php");
$meuArquivo=fopen("/teste/vigia/update.txt","w");
$conexao = new ConexaoBD();
$minhaConn = $conexao->getConexao();
$minhaConn->exec('SET NAMES utf8');
$sqlUpdatePassado = $_POST['sqlUpdate'];
$tripa=$_POST['tripa'];
$meuArray=preg_split("/#@#/", $tripa);
fwrite($meuArquivo,"Quantidade de elementos no array: ".count($meuArray)." na sql: ".$sqlUpdatePassado."\r\n");
$stmt = $minhaConn->prepare($sqlUpdatePassado);
for($i=0;$i < count($meuArray);$i++){
$valorVez=$meuArray[$i];
fwrite($meuArquivo,"Valor da vez: ".$valorVez."\r\n");
//fwrite($meuArquivo,"o que vai como parâmetro para update: ".$segundo."\r\n");
$stmt -> bindValue($i+1, $valorVez);
}//for i
$stmt->execute();
$contar = $stmt->rowCount();
echo  $contar;
fclose($meuArquivo);
break;
case 4:
//Faz uma nova inserção
require("/teste/phpClasses/classesPhp.php");
$meuArquivo=fopen("/teste/vigia/insercao.txt","w");
$conexao = new ConexaoBD();
$minhaConn = $conexao->getConexao();
$minhaConn->exec('SET NAMES utf8');
$sqlInsertPassado = $_POST['sqlInsert'];
$tripa=$_POST['tripa'];
fwrite($meuArquivo,"o que vai como parâmetro para inserção: ".$sqlInsertPassado." -> ".$tripa."\r\n");
$meuArray=preg_split("/#@#/", $tripa);
$stmt = $minhaConn->prepare($sqlInsertPassado);
for($i=0;$i < count($meuArray);$i++){
$valorVez=$meuArray[$i];
fwrite($meuArquivo,$valorVez."\r\n");
$stmt -> bindValue($i+1, $valorVez);
}//for i
$stmt->execute();
$idConseguido = $minhaConn->lastInsertId();//pega o id do registro recém-criado
echo  $idConseguido;
fclose($meuArquivo);
break;
case 5:
    //estou desistindo deste modelo
    /*
    //este bloco faz um update que exige atualizar...  
    //... vários registros em loop, dado um id de uma tabela
//$meuArquivo=fopen("../vigia/updateLoop.txt","w");  
require("../phpClasses/classesPhp.php");  
$conexao = new ConexaoBD();
$minhaConn = $conexao->getConexao();
$minhaConn->exec('SET NAMES utf8');
//--
$contar=0;
    $sqlPassado=$_POST['sqlUpdate'];
    $stmt = $minhaConn->prepare($sqlPassado);
    //--a tripa pressupõe um array de APENAS DOIS elementos
    $tripa = $_POST['tripa'];//pressupõe, POR EX, '1,2,3,4#@#1 (1 seria o id da tabela)
    $meuArray=preg_split("/#@#/", $tripa);//meuArray[0] seria 1,2,3, 4 e meuArray[1] o id
    //o meuArray[0] será objeto de um outro split
    $meuArrayIndices = preg_split("/,/", $meuArray[0]);//NOVO ARRAY COM 1,2,3,4
    //faz um loop para cada valor da lista do novo array
    for($i=0;$i < count($meuArrayIndices);$i++){
    $valorVez=$meuArrayIndices[$i];
    //como a sql tem apenas duas interrogações, vai 1 e 2
    $stmt -> bindValue(1, $valorVez);
    $stmt -> bindValue(2, $meuArray[1]);
    $stmt->execute();
    $contar = $contar + $stmt->rowCount();
    }//for i
    echo  $contar/2;//com são duas '?', divido por 2
    */
break;
case 6:
    $cpfCnpj = $_POST['cpfCnpj'];
    echo fValidaCPFCNPJ($cpfCnpj);
break;
case 7:
    return getcwd() . "\n";
    //backup via exec
    //os dados são quase todos oriundos da classesPhp.php
    //*********************
    /* esta função pode não funcionar porque o comando EXEC 
    normalmente é bloqueado por questão de segurança
    */
    //*********************
    /*
    $meuDb="escribaoffice";
    $meuUsuario="escribaoffice";
    $minhaSenha="cabumba2010";
    $compOrigem="sql102.epizy.com";
    $diretorio="../backup";
   
    echo fStrFazerBackupDump($meuDb,$meuUsuario,$minhaSenha,$compOrigem,$diretorio);
    */
break;
case 8:
    //backup via fwrite. Uma espécie de log, mas é para fazer backup de toda inserção/update
    $arquivo = $_POST['arquivo'];
    $linhaAGravar = $_POST['linha'];
    fGravaCadaOperacao($arquivo,$linhaAGravar);
break;
case 9:
    $linhaAGravar = $_POST['linhaAGravar'];
    echo fGravaLog($linhaAGravar);
break;
}//switch
?>