<?php
use Dompdf\Dompdf;
require '../vendor/autoload.php';
$corpo = $_POST['corpo'];
$siglaRedator = $_POST['siglaRedator'];
$exibir='<!DOCTYPE html>';
$exibir=$exibir.'<html lang="en">';
$exibir=$exibir.'<head>';
$exibir=$exibir.'<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>';
$exibir=$exibir.'<meta http-equiv="X-UA-Compatible" content="IE=edge">';
$exibir=$exibir.'<meta name="viewport" content="width=device-width, initial-scale=1.0">';
$exibir=$exibir.'<style>';
$exibir=$exibir.'table {';
$exibir=$exibir.'font-family: Arial, Helvetica, sans-serif;';
$exibir=$exibir.'border-collapse: collapse;';
$exibir=$exibir.'width: 80%;';
$exibir=$exibir.'}';
$exibir=$exibir.'table td, table th {';
$exibir=$exibir.'border: 1px solid #ddd;';
$exibir=$exibir.'padding: 8px;';
$exibir=$exibir.'}';
$exibir=$exibir.'table th {';
$exibir=$exibir.'padding-top: 12px;';
$exibir=$exibir.'padding-bottom: 12px;';
$exibir=$exibir.'text-align: left;';
$exibir=$exibir.'background-color: #04AA6D;';
$exibir=$exibir.'color: white;';
$exibir=$exibir.'}';
$exibir=$exibir.'table th {';
$exibir=$exibir.'position: -webkit-sticky;';
$exibir=$exibir.'position: sticky;';
$exibir=$exibir.'top: 0;';
$exibir=$exibir.'z-index: 2;';
$exibir=$exibir.'}';
$exibir=$exibir.'</style>';
$exibir=$exibir.'<title>PDF</title>';
$exibir=$exibir.'</head>';
$exibir=$exibir.'<body>';
$exibir=$exibir.'<div style="overflow-x:auto;">';
$exibir=$exibir.$corpo;
$exibir=$exibir.'</div>';
$exibir=$exibir.'</body>';
$exibir=$exibir.'</html>';
$dompdf = new DOMPDF();
$dompdf->load_Html($exibir);
$dompdf->set_paper("A4", "landscape");
$dompdf->render();
$output = $dompdf->output();
$nomeArquivo=$siglaRedator.".pdf";
file_put_contents("../pdfs/".$nomeArquivo, $output);//grava o pdf na pasta desejada
echo $nomeArquivo;
