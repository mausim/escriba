<?php
/**
 *    Exemplo de utilização de utilização de WebService Kinghost
 *    www.kinghost.com.br
 */
$intOperacao=$_POST['operacao'];
if($intOperacao==1){
    $numeroCEP = $_POST['numeroCEP'];
    //é busca por CEP
$webservice_url     = 'http://webservice.kinghost.net/web_cep.php';
$webservice_query    = array(
    'auth'    => 'f519c80183605296420bb499fa7da1e0', //Chave de autenticação do WebService - Consultar seu painel de controle
    'formato' => 'query_string', //Valores possíveis: xml, query_string ou javascript
    'cep'     => ".$numeroCEP." //CEP que será pesquisado
);

//Forma URL
$webservice_url .= '?';
foreach($webservice_query as $get_key => $get_value){
    $webservice_url .= $get_key.'='.urlencode($get_value).'&';
}

parse_str(file_get_contents($webservice_url), $resultado);

switch($resultado['resultado']){  
    case '2':  
        $texto = " 
    Cidade com logradouro único 
    <b>Cidade: </b> ".$resultado['cidade']." 
    <b>UF: </b> ".$resultado['uf']." 
        ";    
    break;  
      
    case '1':  
        $texto = " 
    Cidade com logradouro completo 
    <b>Tipo de Logradouro: </b> ".$resultado['tipo_logradouro']." 
    <b>Logradouro: </b> ".$resultado['logradouro']." 
    <b>Bairro: </b> ".$resultado['bairro']." 
    <b>Cidade: </b> ".$resultado['cidade']." 
    <b>UF: </b> ".$resultado['uf']." 
        ";  
    break;  
      
    default:  
        $texto = "Falha ao buscar cep: ".$resultado['resultado'];  
    break;  
}
}//if operacao == 1

if($intOperacao==2){
/**
 *    Exemplo de utilização de utilização de WebService Kinghost
 *    www.kinghost.com.br
 */
$tipoRemessa = $_POST['tipoRemessa'];//sedex,carta,pac
$formato = $_POST['formato'];//xml,QUERY_STRING,javacript ou json
$CEPOrigem = $_POST['CEPOrigem'];
$CEPDestino = $_POST['CEPDestino'];
$maoPropria =$_POST['maoPropria'];
$avisoRecebimento = $_POST['avisoRecebimento'];
$peso=$_POST['peso'];
$comprimento=$_POST['comprimento'];
$largura = $_POST['largura'];
$altura = $_POST['altura'];
//--
$webservice_url     = 'http://webservice.kinghost.net/web_frete.php';
/*
$webservice_query    = array(
    'auth'    => 'f519c80183605296420bb499fa7da1e0', //Chave de autenticação do WebService - Consultar seu painel de controle
    'formato' => "javascript", //Valores possíveis: xml, query_string ou javascript
    'tipo'      => "$tipoRemessa",         //Tipo de pesquisa: sedex, carta, pac,
    'cep_origem'  => "$CEPOrigem",      //CEP de Origem - CEP que irá postar a encomenda
    'cep_destino' => "$CEPDestino",      //CEP de Destino - CEP que irá receber a encomenda
    'mao_propria' => "$maoPropria", //Serviço adicional - Mão própria (MP), para utilizar valor "S" ou "1"
    'aviso_de_recebimento' => "$avisoRecebimento", //Serviço adicional - Mão própria (MP), para utilizar valor "S" ou "1"
    'peso'         => "$peso", //em gr
    'cm_comprimento' => "$comprimento",
    'cm_largura' => "$largura",
    'cm_altura' => "$altura"
);
*/
/*exemplo do KINGHOST
$webservice_query    = array(
    'auth'    => 'b14a7b8059d9c055954c92674ce60032', //Chave de autenticação do WebService - Consultar seu painel de controle
    'formato' => 'query_string', //Valores possíveis: xml, query_string ou javascript
    'tipo'      => 'sedex',         //Tipo de pesquisa: sedex, carta, pac,
    'cep_origem'  => '30710460',      //CEP de Origem - CEP que irá postar a encomenda
    'cep_destino' => '90560-002',      //CEP de Destino - CEP que irá receber a encomenda
    'mao_propria' => '0', //Serviço adicional - Mão própria (MP), para utilizar valor "S" ou "1"
    'aviso_de_recebimento' => '0', //Serviço adicional - Mão própria (MP), para utilizar valor "S" ou "1"
    'peso'         => 450, //em gr
    'cep'          => '90560-002',      //CEP que será pesquisado
);
*/
$webservice_query    = array(
    'auth'    => 'f519c80183605296420bb499fa7da1e0', //Chave de autenticação do WebService - Consultar seu painel de controle
    'formato' => $formato, //Valores possíveis: xml, query_string ou javascript
    'tipo'      => $tipoRemessa,         //Tipo de pesquisa: sedex, carta, pac,
    'cep_origem'  => $CEPOrigem,      //CEP de Origem - CEP que irá postar a encomenda
    'cep_destino' => $CEPDestino,      //CEP de Destino - CEP que irá receber a encomenda
    'mao_propria' => $maoPropria, //Serviço adicional - Mão própria (MP), para utilizar valor "S" ou "1"
    'aviso_de_recebimento' => $avisoRecebimento, //Serviço adicional - Mão própria (MP), para utilizar valor "S" ou "1"
    'peso'         => $peso, //em gr
    'cm_comprimento' => $comprimento,
    'cm_largura' => $largura,
    'cm_altura' => $altura,
    'cep'          => $CEPDestino, //CEP que será pesquisado
);

//Forma URL
$webservice_url .= '?';
foreach($webservice_query as $get_key => $get_value){
    $webservice_url .= $get_key.'='.urlencode($get_value).'&';
}

parse_str(file_get_contents($webservice_url), $resultado);
$texto ='<tr><th>DESCRICAO</th><th>VALOR</th></tr>';
switch($resultado['resultado']){  
    case '1':  
        $texto .= "<tr><td>".$resultado['resultado_txt']." </td><td> ".$resultado['valor_rs'] ."</td></tr>";  
    break;  
      
    default:  
        $texto .= "Falha ao buscar frete: <tr><td>".$resultado['resultado_txt']."</td></tr>";  

    break;  
}
}//intOperacao == 2
$texto= mb_convert_encoding ($texto,"utf-8","ISO-8859-1");
echo $texto;

