<?php
//---lista de tabelas que existem no banco de dados
$arrayTabelas=["tabacesso","tabalmo","tabalmoapres","tabalmomat","tabalmonat","tabandamentos",
"tabareas","tabcategorias","tabclientes","tabcompras","tabcrono",
"tabdespesas","tabexpedicao","tabfaixas","tabfaturados","tabfaturamento","tabfiliais","tabfornecedores",
"taborgaos","taborgaosdivisao","tabpaises","tabpastas","tabpessoas","tabprocessos","tabtaxasespeciais",
"tabtaxaspadrao","tabts"];
//tabclientes = 8;tabpasta = 21, tabpessoas=22
//-------------------------------------------------
$operacao=$_POST['operacao'];//1=select, 2=..., 3=update, 4=insert
//--
//--Conforme o array acima, abaixo //0=tabela tabacesso, 1=tabalmo ...
//...( Se vier 0,1 -> tabacesso,tabalmo, significando TABACESSO INNER JOIN TABALMO) Se vier só um número, não é inner join
$tripaJoin=$_POST['tripaIndiceTab'];
$tripaOn=$_POST['conexoes'];//nomes das colunas para fazer o ON do INNER JOIN acima (se houver)
$tripaWhere=$_POST['limitacoes'];//nomes dos campos no WHERE
$tripaValWhere=$_POST['limitacoesVal'];//valores correspondentes aos campos no WHERE
//---para saber quais tabelas foram indicadas em tripaJoin, transformar essa tripa num array
$arrayJoin = explode(",",$tripaJoin);
$qtdTabelas = count($arrayJoin);//quantas tabelas foram passadas?
//--para saber quais campos farão ON no inner join
$arrayOn = explode(",",$tripaOn);
//--exemplo
//SELECT * FROM tabclientes t0 INNER JOIN tabpastas t1 ON t1.cliente_tabclientes = t2.id WHERE t2.pasta = 'aaaaa'
//-----montando a SQL
$montagemSql ="";
if($operacao=="1") $montagemSql = "SELECT * FROM ";//14 dígitos
$i=0;
$teveInner = 0;
for($i;$i < $qtdTabelas;$i++){
    //--
    $indiceTabela = $arrayJoin[$i];
    $nomeTabCorrespondente = $arrayTabelas[$indiceTabela];
    //--
    $montagemSql = $montagemSql . $nomeTabCorrespondente . " t" . $i . " ";
    //--
    if($teveInner==1){
        $teveInner=0;//refaz
        $onAnterior =  $arrayOn[$i-1];
        $onVez =  $arrayOn[$i];
        $montagemSql = $montagemSql . " ON t" . ($i-1) . "." . $onAnterior . " = t" . $i . "." . $onVez. " ";
    }//if teveInner
    if($qtdTabelas > 1 && $i < $qtdTabelas-1) {
        $montagemSql = $montagemSql . " INNER JOIN ";
        $teveInner=1;
    }//if qtdTabelas
}//for i
$arrayWhere = explode(",",$tripaWhere);//array de nomes de campos no where
$arrayWValores = explode(",",$tripaValWhere);
$qtdW = count($arrayWhere);
if(count($arrayWhere)>0){
    $montagemSql = $montagemSql . "WHERE ";
    $j=0;
    for($j;$j < count($arrayWhere);$j++){
    $campoVez = $arrayWhere[$j];

    //$montagemSql = $montagemSql ." comprimento do campo da vez: ".$campoVez." = ".strlen(trim($campoVez))." ";
    if (strlen(trim($campoVez))>0){
        $montagemSql = $montagemSql . $campoVez . " = ".$arrayWValores[$j]." ";
        if($qtdW > 0  && $j < $qtdW-1){
            $montagemSql = $montagemSql . " AND ";
        }
    }//if strlen
    }// for j
}//if count



echo $montagemSql;