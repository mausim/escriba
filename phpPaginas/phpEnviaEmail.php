<?php
 use PHPMailer\PHPMailer\PHPMailer;
 use PHPMailer\PHPMailer\Exception;
 
 require '../PHPMailer-master/src/Exception.php';
 require '../PHPMailer-master/src/PHPMailer.php';
 require '../PHPMailer-master/src/SMTP.php';
 //----captura os valores passados 
 $tripaDestinatarios = $_POST['destinatarios'] ;//tripa separadas por ;
 $assunto = $_POST['assunto'] ;
 $corpo = $_POST['corpo'];
 $copiar = $_POST['copiar'];
 // Inicia a classe PHPMailer
 $mail = new PHPMailer();
 // DEFINIÇÃO DOS DADOS DE AUTENTICAÇÃO - Você deve alterar conforme o seu domínio!
 $mail->IsSMTP(); // Define que a mensagem será SMTP
 $mail->Host = "smtp.escribaoffice.com.br"; // Seu endereço de host SMTP
 $mail->SMTPAuth = true; // Define que será utilizada a autenticação -  Mantenha o valor "true"
 $mail->Port = 587; // Porta de comunicação SMTP - Mantenha o valor "587"
 $mail->SMTPSecure = false; // Define se é utilizado SSL/TLS - Mantenha o valor "false"
 $mail->SMTPAutoTLS = false; // Define se, por padrão, será utilizado TLS - Mantenha o valor "false"
 $mail->Username = 'mensageiro@escribaoffice.com.br'; // Conta de email existente e ativa em seu domínio
 $mail->Password = 'M3n5@g31r0'; // Senha da sua conta de email
 // DADOS DO REMETENTE
 $mail->Sender = "mensageiro@escribaoffice.com.br"; // Conta de email existente e ativa em seu domínio
 $mail->From = "mensageiro@escribaoffice.com.br"; // Sua conta de email que será remetente da mensagem
 $mail->FromName = "Mensageiro"; // Nome da conta de email
 // DADOS DO DESTINATÁRIO
 $d=0;
 $arrayDestinatarios = explode(";",$tripaDestinatarios);
 for($d;$d<count($arrayDestinatarios);$d++){
  $destinatarioVez = $arrayDestinatarios[$d];
 $mail->AddAddress($destinatarioVez,""); // Define qual conta de email receberá a mensagem
 }
 //$mail->AddAddress('recebe2@dominio.com.br'); // Define qual conta de email receberá a mensagem
 $mail->AddCC($copiar); // Define qual conta de email receberá uma cópia
 $mail->AddBCC('mensageiro@escribaoffice.com.br'); // Define qual conta de email receberá uma cópia oculta
 // Definição de HTML/codificação
 $mail->IsHTML(true); // Define que o e-mail será enviado como HTML
 $mail->CharSet = 'utf-8'; // Charset da mensagem (opcional)
 // DEFINIÇÃO DA MENSAGEM
 $mail->Subject  = $assunto; // Assunto da mensagem
 $mail->Body = $corpo; // Texto da mensagem
  // ENVIO DO EMAIL
 $enviado = $mail->Send();
 // Limpa os destinatários e os anexos
 $mail->ClearAllRecipients();
 // Exibe uma mensagem de resultado do envio (sucesso/erro)
 if ($enviado) {
   echo "E-mail enviado com sucesso para ".$destinatarioVez;
 } else {
   echo "Não foi possível enviar o e-mail para ".$destinatarioVez . ": " . $mail->ErrorInfo;
 }