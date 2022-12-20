<?php
function fStrDevolveJson($raw_column_data){
/*
//modelo no javascript
myObj = {
  "cars": [
    { "name":"Ford", "models":[ "Fiesta", "Focus", "Mustang" ] },
    { "name":"BMW", "models":[ "320", "X3", "X5" ] },
    { "name":"Fiat", "models":[ "500", "Panda" ] }
  ]
 }
*/    
$concatena='{"resultados":[{';
  foreach($raw_column_data as $outer_key => $array){
      foreach($array as $inner_key => $value){
        $value=str_replace("\r\n",'', $value);
       // $value= mb_convert_encoding ($value,"utf-8","ISO-8859-1");
        $concatena=$concatena.'"'.$inner_key.'":"'.$value.'",'; 
      }//foreach
      $concatena=$concatena."},{";
  }//forech
  $concatena=str_replace(",},{","},{",$concatena);
  $comprimento = strlen($concatena);
  $concatena = substr($concatena,0,$comprimento-3);
  $concatena=$concatena."}]}";
return $concatena;
}//fStrDevolveJson
//---------------------------------------------
function fStrDevolveJsonArquivos($dir){
  error_reporting(E_ALL);
  ini_set('display_errors', 1);
  //$dir = "../imagens/advs/"; exemplo
  /*
  //modelo no javascript
  myObj = {
    "cars": [
      { "name":"Ford", "models":[ "Fiesta", "Focus", "Mustang" ] },
      { "name":"BMW", "models":[ "320", "X3", "X5" ] },
      { "name":"Fiat", "models":[ "500", "Panda" ] }
    ]
   }
   */
  $concatena='{"resultados": [';
    $arrayArquivos = scandir($dir);
    for($i=0;$i < count($arrayArquivos);$i++){
      $concatena=$concatena.'{"arquivo":"'.$arrayArquivos[$i].'"},';
    }
    $tamanho=strlen($concatena);
    $concatena=substr($concatena,0,$tamanho-1);
    $concatena=$concatena.']}';
 return $concatena;
}//fStrDevolveJsonArquivos
//-----------------------------------
function fValidaCPFCNPJ ($cpfCnpj){
  //http://www.macoratti.net/alg_cpf.htm
  //http://www.macoratti.net/alg_cnpj.htm
 //---separar o dígito fornecido pelo usuário para ser comparado com o do cálculo abaixo
 if(strlen($cpfCnpj)==11){
  //é cpf
  $dv = substr($cpfCnpj,9,2);
  //Calcular o primeiro dígito verificador
  $multiplicador=10;
  $produto=0;
  //pegar apenas 9 dígitos
  $cpfCnpj=substr($cpfCnpj,0,9);
  for($i=0;$i < 9;$i++){
   $digito = substr($cpfCnpj,$i,1);
   $produto=$produto+$multiplicador*$digito;
   $multiplicador--;
  }//for
  $resto1=$produto % 11;
  $digito1 = 11 - $resto1;
  if ($resto1 < 2){
   $digito1 = 0;
  }
  //---
  //Calcular o segundo dígito verificador
  //agregar o resto1 ao 9 dígitos do cpf
  $cpfCnpj=$cpfCnpj.$digito1;
  $multiplicador=11;
  $produto=0;
  for($i=0;$i < 10;$i++){
   $digito = substr($cpfCnpj,$i,1);
   $produto=$produto+$multiplicador*$digito;
   $multiplicador--;
  }//for
  $resto2=$produto % 11;
  $digito2 = 11 - $resto2;
  if ($resto2 < 2){
   $digito2 = 0;
  }
  //---
  if($dv == $digito1.$digito2){
   return 1;
  }else{
   return 0;
  }//if $dv
 }elseif(strlen($cpfCnpj)==14){
 //é cnpj
  $dv = substr($cpfCnpj,12,2);
  //Calcular o primeiro dígito verificador
  $multiplicador=5;
  $produto=0;
  //pega somente os primeiros 12 dígitos do número completo do cnpj (=14 dígitos)
  $cpfCnpj=substr($cpfCnpj,0,12);
  //pega os primeiros 4 dígitos do cnpj e multiplica um a um por 5 até 2
  for($i=0;$i < 4;$i++){
   $digito = substr($cpfCnpj,$i,1);
   $produto=$produto+$multiplicador*$digito;
   $multiplicador--;
  }//for
  //pega os 8 outros dígitos do cnpj (de índice 4 até índice 11)  e multiplica um a um por 9 até 2
  $multiplicador=9;
  for($i=4;$i < 12;$i++){
   $digito = substr($cpfCnpj,$i,1);
   $produto=$produto+$multiplicador*$digito;
   $multiplicador--;
  }//for
  $resto1 = $produto % 11;
  $digito1 = 11 - $resto1;
  if ($resto1 < 2){
   $digito1=0;
  }
  //incorporar o dígito1 ao cnpj e recalcular
  $cpfCnpj=$cpfCnpj.$digito1;
  //---
  $multiplicador=6;
  $produto=0;
  $cpfCnpj=substr($cpfCnpj,0,13);
  //pega os primeiros 5 dígitos do cnpj e multiplica um a um por 6 até 2
  for($i=0;$i < 5;$i++){
   $digito = substr($cpfCnpj,$i,1);
   $produto=$produto+$multiplicador*$digito;
   $multiplicador--;
  }//for
  //pega os 8 outros dígitos do cnpj (de índice 5 até índice 12)  e multiplica um a um por 9 até 2
  $multiplicador=9;
  for($i=5;$i < 13;$i++){
   $digito = substr($cpfCnpj,$i,1);
   $produto=$produto+$multiplicador*$digito;
   $multiplicador--;
  }//for  
  $resto2 = $produto % 11;
  $digito2 = 11 - $resto2;
  if ($resto2 < 2){
   $digito2=0;
  }
  //---
  if($dv == $digito1.$digito2){
   return 1;
  }else{
   return 0;
  }//if $dv
 }else{
  return 0;
 }
 }//fValidaCPFCNPJ
//---------------------------------------------
function fStrFazerBackupDump($meuDb,$meuUsuario,$minhaSenha,$compOrigem,$diretorio){
  //*********************
//esta função pode não funcionar porque o comando EXEC normalmente é bloqueado por questão de segurança
//*********************
  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);
  
  $database = $meuDb;
  $user = $meuUsuario;
  $pass = $minhaSenha;
  $host = $compOrigem;
  $anoMesDia=date("Ymd");
  $caminhoArquivo = $diretorio.'/'.$anoMesDia.'.sql';
    exec('mysqldump --user={$user} --password={$pass} --host={$host} {$database}> > '.$caminhoArquivo);
  //exec('mysqldump --user=... --password=... --host=... DB_NAME > /path/to/output/file.sql');
   //var_dump($output);
   return "Fez backup do dia ".$anoMesDia;
} //fStrFazerBackupDump
//----------------------------------------------------
function fGravaCadaOperacao($arquivo,$linhaAGravar){
  //esta função grava cada inserção ou alteração de dados
$meuArquivo = fopen("../backup/".$arquivo,"a");
fwrite($meuArquivo,$linhaAGravar);
fclose($meuArquivo);
}//fGravaCadaOperacao
//-----------------------------------------------------
function fGravaLog($linhaAGravar){
  date_default_timezone_set('America/Sao_Paulo');
  $nomeArquivo="../log/log.txt";
  $tamanho = filesize($nomeArquivo);
  $agora = date("Y-m-d H:i:s"); 
  $dataArquivo = date("ymdHis") ;
  $linhaAGravar =$agora.": ".$linhaAGravar;
  if($tamanho){
    //se for maior que 10Mb troca o nome do arquivo
    if($tamanho>10000000){
      $nomeArquivo = "../log/log_".$dataArquivo.".txt";
    }
  }//if filesize
  $meuArquivo = fopen($nomeArquivo,"a");
  fwrite($meuArquivo,$linhaAGravar."\r\n");
  fclose($meuArquivo);
  return "Gravou log";
}//fGravaLog
//--------------------------------------------------------
?>