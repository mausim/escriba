<?php
class ConexaoBDA {
 private $connA;
 //----------------------------Construtor da abertura do banco de dados de teste
    function __construct() {
    try {
$servername = "mysql.escribaoffice.com.br";
$username = "escribaoffice01";
$password = "cabumba2010";
$dbname = "escribaoffice01";
/*
Quando se vai fazer um update e os dados são os mesmos, a contagem... 
... de linhas afetadas vem zero do MySql. Se você faz um teste para saber ... 
... se deu erro o update (isto é, se deu erro é zero), isto pode confundir.
... O MySql retorna zero, dando a impressão que deu erro, mas ... 
... ele só está avisando que não foi preciso mexer em nada. Isto pode ... 
... confundir o programador, pensando ter dado erro na sentenca Update. ... 
... Para evitar isto, põe-se, abaixo, MYSQL_ATTR_FOUND_ROWS = true, de modo que ... 
... todo update responderá com 1, mesmo que não tenha mudado nada ... 
... e assim o programador não precisa ficar feito louco procurando ... 
... erro que não existe.
*/
$this->connA = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password,array(PDO::MYSQL_ATTR_FOUND_ROWS => true));
$this->connA->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch(PDOException $e) {
      echo "Connection failed: " . $e->getMessage();
    }
  }//construtor
  //---------------------------/construtor
  public function getConexaoA(){
    return $this->connA;
  }//getConexaoA
  //-----------------------------
}//classe
?>