global_Int_NivelNaMaquina = 0;
global_int_operacaoSelect=1;
global_int_operacaoInsert=4;
global_int_operacaoUpdateDelete=3;
global_arrayObj_lembretes=[];//lembretes redigidos por quem está na máquina e como participante de redação feita por outra pessoa
jQuery(document).ready(function () {
    /*
    *
    *****************************************
    ATUALIZADO POR MAURO EM 10/11/2022 15:33 hs
    
    - QUANDO UM USUÁRIO AINDA NÃO TEM SIGLA, ELE NÃO CONSEGUE ENTRAR NA APLICAÇÃO: PARA ISTO...
    ...CRIEI UM USUÁRIO 'usuario' com senha 'usuario' para todos aqueles que precisam entrar...
    ...para se cadastrar como funcionário

    **********************************O que eu precisamos fazer*********************************
    a) Precisa fazer uma nova aba para 'Administrando Cartas'.
    
    b) No Almoxarifado, no botão Fornecedores, o primeiro campo é CPF/CNPJ. Isto é ruim,
    porque se a pessoa não sabe o CPF/CNPJ vai ficar difícil de ela consertar. Na hora de registrar...
    ...tudo bem, porque ela tem de saber este dado, mas na hora de consertar não dá.
    Tem de ter um SELECT listando todos os fornecedores existentes.

    c) Fazer controle de estoque
    
    d) Gerenciar faixa do usuário

    e) Todas as inserções de texto de Cliente, material, pessoas, tem de ser em CAIXA ALTA

    f) Atribuir restrições de uso das telas de acordo com o nível de acesso (futura Aba Sys)

    g) Registrar filiais (futura Aba Sys)

    h) Mostrar o LOG para o administrador (futura Aba Sys)

    i) No faturamento, se se incluir pastas de ts de clientes diferentes nas adicionais, avisar
    
    *****************************************
    */
    

 jQuery(".claTelasForms").hide();//todas as telas são escondidas
 jQuery(".claFormularios").hide();//todas as telas que guardam funcionalidades são escondidas
 jQuery("#idDivUsuario").hide();//bloco do registro por uma pessoa que não tem sigla para login (usuario)
// jQuery(".claFlexDash").hide();
 jQuery("#idBtnPesPesSalvAlt").hide();
 jQuery("#idDivLiberarBloco").hide();
 jQuery("#idDivLiberarBloco *").prop("disabled", true);
jQuery(".gridLembreteHome *").prop("disabled", true);
jQuery(".gridLembreteHome").hide();
 jQuery("#idDivLogout").hide();
 jQuery(".claAndamentos").hide();
 jQuery(".claHonorarios").hide();
 jQuery(".claDespesas").hide();
 jQuery(".claTs").hide();
 jQuery(".claTelaForms").hide();
 jQuery("#idDivDialogUpload").hide();
 jQuery(".dropdown").hide();
 jQuery(".botao1").hide();
 jQuery(".botao12").hide();
 jQuery(".botao13").hide();
 jQuery(".backAdicionarLembretes").hide();   
 
 //--TESTE----------------------------------------------**************T
     jQuery("#idBtnTeste").click(function () {
        jQuery.post("../phpPaginas/phpExecuta.php",{intOperacao:7},function (retorno){
            //console.log("retorno");
        });
    });//idBtnTeste click
    //--------------------------------------------------**********************/T
    //----------------------------------------inicializações-/A
    jQuery(document).on("click","#idBtnFatuRegSaN",function (){
        //registrando uma fatura
        let dataAgora = fPegaDataAtualNoFormatoAmericano();
        //console.log(dataAgora);
        let contadorT=0;
        let numeroFatura = jQuery("#idSpaFatuRegNuFat").text();
        let idRedator = jQuery("#idSpaLogNaMaquinaId").text();
        let siglaRedator = jQuery("#idSpaLogNaMaquinaSigla").text();
        let idPrincipal = jQuery("#idSelFatuRegPas option:selected").val();
        let vencimento = jQuery("#idDatFatuRegVen").val();
        let idAprovador = jQuery("#idSpaFatuRegIdApr").text();
        let idFaturado = jQuery("#idSelFatuRegFaN option:selected").val();
        let pastasAdicionais = jQuery("#idTxtFatuRegFPA").val();
        let idContato = jQuery("#idSelFatuRegNoC option:selected").val();
        let texto = jQuery("#idTAFatuRegTeC") .val();
        let valor =jQuery("#idNumFatuRegVNH").val();
        let obs = jQuery("#idTAFatuRegObs").val();
        let tripaIDsTS = jQuery("#idHidFatuRegTSOK").val();
        let arrayIDsTS = tripaIDsTS.split(",");
        //---
        if(idPrincipal*1>0 && vencimento != '' && idAprovador*1>0 && idFaturado*1>0 && idContato *1>0 && texto.length>0 && valor*1 > 0 ){
            let sqlInsert = `INSERT INTO tabfaturamento 
            (principal_tabpastas,pastas_adicionais,vencimento,redator_tabpessoas,faturado_tabfaturados,
            contato_tabfaturados,aprovador_tabpessoas,descricao,valor,obs,data_insercao,status)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
               //console.log("insert de faturado: ",sqlInsert);
               let arrayValores = [idPrincipal,pastasAdicionais,vencimento,idRedator,idFaturado,idContato,idAprovador,
                texto,valor,obs,dataAgora,2];
                let tripa = fPrepara(arrayValores);
                //console.log(arrayValores);
                //console.log(sqlInsert+" ====>>>> "+sqlInsert+" "+tripa);
                //-------------------post----------------
                /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
                jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsert, tripa: tripa }, function (retorno) {
                    //console.log("retorno do insert   ",retorno);
                    if (retorno * 1 > 0) {
                        //-----agora que fez a inserção da fatura, baixar os TS correspondentes----T
                        let a=0;
                        for(a;a<arrayIDsTS.length;a++){
                            let idVez = arrayIDsTS[a];
                        let sqlUpdate = `UPDATE tabts 
                        SET  numero_nh = ?,
                        data_nh=?,data_edicao=?,int_status=? 
                        WHERE id = ?`;
                       let objDatT = new Date();
                        let dataFatura = objDatT.toISOString().split('T')[0]
                        let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
                        let dataEdicao= (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
                        
                           let arrayValores = [numeroFatura,dataFatura,dataEdicao,3,idVez];
                                      /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
                           let intOperacao = global_int_operacaoUpdateDelete;
                           let tripa = fPrepara(arrayValores);
                           fExecutaBD(intOperacao, sqlUpdate, tripa).then(function (retornoT) {
                               if (retornoT * 1 > 0) {
                               contadorT++;
                                   fGravaLog(siglaRedator + " UPDATE tabela ts baixa fatura com sucesso: " + sqlUpdate + " " + tripa);
                               }else{
                                fGravaLog(siglaRedator + " UPDATE órgão na ts baixa fatura com problema: " + sqlUpdate + " " + tripa);
                               }//if
                           }).then(function () {
                             //???
                           });//fExecutaBD
                        }//for a
                        //-----
                        alert ("Faturamento salvo com sucesso");
                        alert("Fez " + contadorT + " alterações nos Timesheets");
                        fGravaLog(siglaRedator + " Insert tabela de faturamento: " + sqlInsert + " " + tripa);
                    } else {
                        fGravaLog(siglaRedator + "  PROBLEMA: Insert tabela faturamento: " + sqlInsert + " " + tripa);
                    }//if retorno
                });//post  
                 //----- ---------------------------------baixar os TS correspondentes----/T
        }else{
            alert (`Antes de salvar, 
            a) selecione uma pasta, o nome do Faturado e seu Contato. 
            b) indique data do boleto e também preencha o texto de cobrança e o valor. 
            c) Verifique se o nome do Aprovador também está explícito.`);
        }//if idPrincipal
       });//idBtnFatuRegSaN clickl
//------------------------------------------------------------------    
jQuery(document).on("click","#idBtnAbaAndamentos",function (){
    jQuery(".claAndamentos").show();
    jQuery(".claHonorarios").hide();
    jQuery(".claDespesas").hide();
    jQuery(".claTs").hide();
    jQuery(".claCrono").hide();
});

jQuery(document).on("click","#idBtnadicionarLembrete",function (){
jQuery(".backAdicionarLembretes").show();
jQuery("#idBtnadicionarLembrete").hide(); 

});

jQuery(document).on("click","#idBtnAbaHonorarios",function (){
    jQuery(".claAndamentos").hide();
    jQuery(".claHonorarios").show();
    jQuery(".claDespesas").hide();
    jQuery(".claTs").hide();
    jQuery(".claCrono").hide();
});

jQuery(document).on("click","#idBtnAbaDespesas",function (){
    jQuery(".claAndamentos").hide();
    jQuery(".claHonorarios").hide();
    jQuery(".claDespesas").show();
    jQuery(".claTs").hide();
    jQuery(".claCrono").hide();
});

jQuery(document).on("click","#idBtnAbaTs",function (){
    jQuery(".claAndamentos").hide();
    jQuery(".claHonorarios").hide();
    jQuery(".claDespesas").hide();
    jQuery(".claTs").show();
    jQuery(".claCrono").hide();
    //---
    let idCli = jQuery("#idSelDashGCli option:selected").val();
    fMontaGraficoPie(idCli);
    fMontaGraficoLinha(idCli);
    //---
});
//-----------------------------------------------------------
jQuery(document).on("click","#idBtnAbaCrono",function (){
    jQuery(".claAndamentos").hide();
    jQuery(".claHonorarios").hide();
    jQuery(".claDespesas").hide();
    jQuery(".claTs").hide();
    jQuery(".claCrono").show();
});
//---------------------------------------------------------
jQuery(document).on("click","#idBtnFatuPesPesF",function (){
    //pesquisando faturamento
let idCli = jQuery("#idSelFatuPesCli option:selected").val();
let idPasta = jQuery("#idSelFatuPesPas option:selected").val();
let objTab = jQuery("#idTabFatuPesResF");
objTab.empty();
let sql="";
let concatena="";
//---
   //já que escolheu cliente ou pasta, perguntar se escolheu pasta. Se não escolheu é pesquisa pelo cliente inteiro
    if(idPasta * 1 > 0){
            //não se quer as baixadas, só as pendentes
        sql = `SELECT c.cliente,p.materia,f.id, g.pessoa as redator, h.pessoa as aprovador, 
        i.faturado,p.pasta, f.pastas_adicionais, 
        i.contato, f.vencimento, f.descricao, f.valor, f.obs, f.data_insercao,f.status 
        FROM tabfaturamento f 
        INNER JOIN tabpastas p 
        ON f.principal_tabpastas = p.id 
        INNER JOIN tabclientes c 
        ON c.id = p.cliente_tabclientes 
        INNER JOIN tabpessoas g 
        ON g.id = f.redator_tabpessoas 
        INNER JOIN tabpessoas h 
        ON h.id = f.aprovador_tabpessoas 
        INNER JOIN tabfaturados i 
        ON i.id = f.faturado_tabfaturados 
        WHERE  f.principal_tabpastas = `+idPasta;
          //console.log("pesquisa",sql);
                                                /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
           intOperacao = global_int_operacaoSelect;
           tripa = "";
          
           fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            //console.log("retorno na 184",retorno);
               if (retorno.length > 20) {
                   let obj = JSON.parse(retorno);
                   let i = 0;
                   for (i; i < obj.resultados.length; i++) {
                    let cliente = obj.resultados[i].cliente;
                    if(i==0){
                    concatena=concatena+`<tr><th colspan="10">Cliente: `+cliente+`</th></tr>';
                    concatena=concatena+'<tr><th>Pasta</th><th>Matéria</th><th>Adicionais</th><th>Data</th>
           <th>Vencimento</th><th>Descrição</th><th>Valor</th><th>Redator</th><th>Aprovador</th><th>Contato</th><th>status</th></tr>`;
                    }
                    let estilo = 'background-color:initial';
                    let pasta = obj.resultados[i].pasta;
                    let materia = obj.resultados[i].materia;
                    let adicionais = obj.resultados[i].pastas_adicionais;
                     let redator = obj.resultados[i].redator;
                     let dataInsercao = obj.resultados[i].data_insercao;
                     let vencimento = obj.resultados[i].vencimento;
                     let descricao = obj.resultados[i].descricao;
                     let aprovador = obj.resultados[i].aprovador;
                     let contato = obj.resultados[i].contato;
                     let valor = obj.resultados[i].valor;
                     let intStatus = obj.resultados[i].status;
                      let legenda="x";
                     //---
                         if(intStatus*1==1) {
                            estilo="background-color:#FAEBD7;";//antiquewhite
                            legenda="Rascunho";
                         }
                         if(intStatus*1==2) {
                             estilo="background-color:#90EE90;";//lightgreen
                             legenda="Pendente";
                         }
                         if(intStatus*1==3){
                            estilo="background-color:#48D1CC;";//turqueza
                            legenda="Aprovada";
                         } 
                         if(intStatus*1==4){
                            estilo="background-color:#48D1CC;";//tomato
                            legenda="Liquidada";
                         } 
                         if(intStatus*1==7)  {
                            estilo="background-color:red;";//
                            legenda="Cancelada";
                        }
                         //--
                       //console.log("valor, estilo e status",valor+" / "+estilo+" / "+intStatus);
                     //--
                     concatena =  concatena + `<tr><td>`+pasta+`</td><td>`+materia+`</td>
                     <td>`+adicionais+`</td><td>`+dataInsercao+`</td>
                     <td>`+vencimento+`</td><td>`+descricao+`</td><td>`+valor+`</td><td>`+redator+`</td><td>`+aprovador+`</td>
                     <td>`+contato+`</td><td style="`+estilo+`">`+legenda+`</td></tr>`;
                   }//for i
               }//if retorno
               objTab.append(concatena);
               jQuery("#idTAFatuPesPDF").val('<table>'+concatena+'</table>');
               //console.log("Ok. Funcionou: "+concatena);
           }, function (respostaErrada) {
               //console.log(respostaErrada);
           }).catch(function (e) {
               //console.log(e);
           });//fExecutaBD
    } else if (idCli *1 > 0) {
        //a pesquisa é todas por CLIENTE
        sql = `SELECT c.cliente,p.materia,f.id, g.pessoa as redator, h.pessoa as aprovador, 
        i.faturado,p.pasta, f.pastas_adicionais, 
        i.contato, f.descricao, f.valor, f.obs, f.data_insercao,f.status 
        FROM tabfaturamento f 
        INNER JOIN tabpastas p 
        ON f.principal_tabpastas = p.id 
        INNER JOIN tabclientes c 
        ON c.id = p.cliente_tabclientes 
        INNER JOIN tabpessoas g 
        ON g.id = f.redator_tabpessoas 
        INNER JOIN tabpessoas h 
        ON h.id = f.aprovador_tabpessoas 
        INNER JOIN tabfaturados i 
        ON i.id = f.faturado_tabfaturados 
        WHERE c.id = `+idCli;
        //--
         //console.log("pesquisa só por cliente",sql);
                                                         /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
           intOperacao = global_int_operacaoSelect;
           tripa = "";
          let concatena = '';
           fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            //console.log("retorno da pesquisa só por cliente",retorno);
               if (retorno.length > 20) {
                   let obj = JSON.parse(retorno);
                   let i = 0;
                   for (i; i < obj.resultados.length; i++) {
                    let cliente = obj.resultados[i].cliente;
                    if(i==0){
                    concatena=concatena+`<tr><th colspan="10">Cliente: `+cliente+`</th></tr>';
                    concatena=concatena+'<tr><th>Pasta</th><th>Matéria</th><th>Adicionais</th><th>Data</th>
           <th>Descrição</th><th>Valor</th><th>Redator</th><th>Aprovador</th><th>Contato</th><th>status</th></tr>`;
                    }
                   let estilo = 'background-color:initial';
                  
                      let pasta = obj.resultados[i].pasta;
                      let materia = obj.resultados[i].materia;
                      let adicionais = obj.resultados[i].pastas_adicionais;
                       let redator = obj.resultados[i].redator;
                       let dataInsercao = obj.resultados[i].data_insercao;
                       let descricao = obj.resultados[i].descricao;
                       let aprovador = obj.resultados[i].aprovador;
                       let contato = obj.resultados[i].contato;
                       let valor = obj.resultados[i].valor;
                       let intStatus = obj.resultados[i].status;
                       let legenda="";
                       //---
                           if(intStatus*1==1) {
                              estilo="background-color#FAEBD7;";//antiquewhite
                              legenda="Rascunho";
                           }
                           if(intStatus*1==2) {
                               estilo="background-color:#90EE90;";//lightgreen
                               legenda="Pendente";
                           }
                           if(intStatus*1==3){
                              estilo="background-color:#48D1CC;";//turqueza
                              legenda="Aprovada";
                           } 
                           if(intStatus*1==4){
                              estilo="background-color:#48D1CC;";//tomato
                              legenda="Liquidada";
                           } 
                           if(intStatus*1==7)  {
                              estilo="background-color:red;";//
                              legenda="Cancelada";
                          }
                         //console.log("valor pesquisa por cliente, estilo e status",valor+" / "+estilo+" / "+intStatus);
                       //--
                       concatena =  concatena + `<tr><td>`+pasta+`</td><td>`+materia+`</td>
                       <td>`+adicionais+`</td><td>`+dataInsercao+`</td>
                       <td>`+descricao+`</td><td>`+valor+`</td><td>`+redator+`</td><td>`+aprovador+`</td>
                       <td>`+contato+`</td><td style="`+estilo+`">`+legenda+`</td></tr>`;
                   }//for i
                   //console.log("concatena",concatena);
               }//if retorno
               objTab.append(concatena);
               jQuery("#idTAFatuPesPDF").val('<table>'+concatena+'</table>');
           }, function (respostaErrada) {
               //console.log("Erro no click idBtnFaturaPesPesF",respostaErrada);
           }).catch(function (e) {
               //console.log("Erro no catch",e);
           });//fExecutaBD
}else{
    alert ("Para pesquisar, escolha um Cliente ou uma pasta");
}//if idCli
});//idBtnFatuPesPesF click
//---------------------------------------------------------------    
jQuery(document).on("change","#idSelFatuRegNoC",function (){
  //  alert ("Entrou na alteração do contato");
let idFatu = jQuery("option:selected",this).val();
//--
let objSpaTipoLog = jQuery("#idSpaFatuRegTipoLog");
let objSpaLog=jQuery("#idSpaFatuRegLog");
let objSpaNum = jQuery("#idSpaFatuRegLoN");
let objSpaComp = jQuery("#idSpaFatuRegComp");
let objSpaCid = jQuery("#idSpaFatuRegCid");
let objSpaUF =jQuery("#idSpaFatuRegUF");
let objSpaCEP = jQuery("#idSpaFatuRegCEP");
let objSpaPai = jQuery("#idSpaFatuRegPais");
let objSpaEma = jQuery("#idSpaFatuRegEmail");
//---
objSpaTipoLog.text('');
objSpaLog.text('');
objSpaNum.text('');
objSpaComp.text('');
objSpaCid.text('');
objSpaUF.text('');
objSpaCEP.text('');
objSpaPai.text('');
objSpaEma.text('');
//---
let sql = `SELECT t.tipo,f.logradouro,f.numero,f.complemento,f.cidade,f.estado,f.email, f.cep,p.pais 
from tabfaturados f 
INNER JOIN tabpaises p 
ON f.pais_tabpaises = p.id 
INNER JOIN tabtiposlogradouro t 
ON t.id = f.tipo_tabtiposlogradouro 
WHERE f.id = ` + idFatu;
//console.log("sql na escolha do contato",sql);
                                                /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
 let intOperacao = global_int_operacaoSelect;
 let tripa = "";
 fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
   //console.log("retorno",retorno+" "+retorno.length+" typeof length "+typeof retorno.length);
     if (retorno.length > 20) {
         let obj = JSON.parse(retorno);
             let tipoLog = obj.resultados[0].tipo;
             let logradouro = obj.resultados[0].logradouro;
             let numero = obj.resultados[0].numero;
             let complemento = obj.resultados[0].complemento;
             let cidade = obj.resultados[0].cidade;
             let estado = obj.resultados[0].estado;
             let cep = obj.resultados[0].cep;
             let email = obj.resultados[0].email;
             let pais = obj.resultados[0].pais;
           //  //console.log('Dentro do retorno',logradouro);
objSpaTipoLog.text(tipoLog);             
objSpaLog.text(logradouro);
objSpaNum.text(numero);
objSpaComp.text(complemento);
objSpaCid.text(cidade);
objSpaUF.text(estado);
objSpaCEP.text(cep);
objSpaPai.text(pais);
objSpaEma.text(email);
     } else {
         alert("Este Faturado não tem contato");
     }//if retorno
 }, function (respostaErrada) {
     //console.log(respostaErrada);
 }).catch(function (e) {
    alert("Erro na escolha do contato: "+e);
     //console.log(e);
 });//fExecutaBD

});
//-----------------------------------------------------------------    
jQuery(document).on("change","#idSelFatuRegFaN",function (){
    let idFatu = jQuery("option:selected",this).val();
    let objSel = jQuery("#idSelFatuRegNoC");
    objSel.empty();
    let concatena = '<option value="0" title="0"></option>';
    let sql = `SELECT id, contato from tabfaturados WHERE id = ` + idFatu;
   //console.log("sql na despsa",sql);
                                                /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */   
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let id = obj.resultados[i].id;
                let contato = obj.resultados[i].contato;
                concatena = concatena + '<option value="' + id + '" title="' + id + '">' + contato + '</option>';
            }//for i
        } else {
            alert("Este Faturado não tem contato");
        }//if retorno
        objSel.append(concatena);
    }, function (resposta) {
        alert ("erro na seleção do Faturado");
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD

});//idSelFatuRegFaN change
//-------------------------------------------------------------    
jQuery(document).on("click","#idBtnFatuNoFSalvar",function (){
    //salvando um contato/faturado
let idRedator = jQuery("#idSpaLogNaMaquinaId").text();
let siglaNaMaquina = jQuery("#idSpaLogNaMaquinaSigla").text();
let idClie = jQuery("#idSelFatuRegCli option:selected").val();
if(idClie*1>0){
    let nomeFatu = jQuery("#idTxtFatuNoFNNF").val();
    let nomeCon = jQuery("#idTxtFatuNoFNNC").val();
    let teleFat = jQuery("#idTxtFatuNoFTNC").val();
    let tiPFatu = jQuery("#idSelFatuNoFTipPes option:selected").val();//física ou júridica 1 ou 2
    let cpfCnpj = jQuery("#idTxtFatuNoFCPFCNPJ").val();
    let celuCon = jQuery("#idTxtFatuNoFCNF").val();
    let emaFatu = jQuery("#idTxtFatuNoFENF").val();
    let cepFatu = jQuery("#idTxtFatuNoFCEP").val();
    let tipoLog = jQuery("#idSelFatuNoFETL option:selected").val();
    let logFatu = jQuery("#idTxtFatuNoFLog").val();
    let numFatu = jQuery("#idNumFatuNoFLoN").val();
    let comFatu = jQuery("#idTxtFatuNoFComp").val();
    let baiFatu = jQuery("#idTxtFatuNoFBai").val();
    let cidFatu = jQuery("#idTxtFatuNoFCid").val();
    let estFatu = jQuery("#idTxtFatuNoFUF").val();
    let paiFatu = jQuery("#idSelFatuNoFPais option:selected").val();
    let status = jQuery("#idSelFatuNoFStat option:selected").val();
    //--
    let idFatu = jQuery("#idSelFatuRegFaN option:selected").val();//se estiver selecionado o id existente é update
    //--
    let contador=0;
    if(idClie * 1 > 0 && nomeFatu != '' && nomeCon != '' && teleFat != '' && cpfCnpj != '' && emaFatu != '' && 
    cepFatu != '' && tipoLog != '' && logFatu != '' && numFatu != '' && comFatu != '' && 
    baiFatu != '' && cidFatu != '' && estFatu != '' && paiFatu != ''){
        //testa se é update
        if(idFatu *1 > 0 ){
            //é update
            let sqlUpdate = `UPDATE tabfaturados   
            SET  redator_tabpessoas = ?,
            cliente_tabclientes=?,faturado=?,tipo_pessoa=?,
            cpfcnpj=?,email=?,telefone=?,celular=?,cep=?,tipo_tabtiposlogradouro=?,
            logradouro=?,numero=?,complemento=?,bairro=?,cidade=?,estado=?,pais_tabpaises=?,
            contato=?,data_edicao=?,status=? 
            WHERE id = ?`;
            //console.log("update de faturado: ",sqlUpdate);
            let dataEdicao = new Date().toLocaleString();
               let arrayValores = [idRedator,idClie,nomeFatu,tiPFatu,cpfCnpj,emaFatu,teleFat,celuCon,
                cepFatu,tipoLog,logFatu,numFatu,comFatu,baiFatu,cidFatu,estFatu,paiFatu,nomeCon,dataEdicao,status,idFatu];
                                                                /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
               let intOperacao = global_int_operacaoUpdateDelete;
               let tripa = fPrepara(arrayValores);
               fExecutaBD(intOperacao, sqlUpdate, tripa).then(function (retorno) {
                   if (retorno * 1 > 0) {
                    alert ("Faturado alterado com sucesso");
                       fGravaLog(siglaNaMaquina + " UPDATE tabela faturados com sucesso: " + sqlUpdate + " " + tripa);
                   }else{
                    fGravaLog(siglaNaMaquina + " UPDATE órgão na faturados com problema: " + sqlUpdate + " " + tripa);
                   }//if
               }).then(function () {
                   alert("Fez " + contador + " alterações");
               });//fExecutaBD
        }else{
            //é insert
            let sqlInsert = `INSERT INTO tabfaturados 
            (redator_tabpessoas,cliente_tabclientes,faturado,tipo_pessoa,
                cpfcnpj,email,telefone,celular,cep,tipo_tabtiposlogradouro,
                logradouro,numero,complemento,bairro,cidade,estado,pais_tabpaises,
                contato)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
               //console.log("insert de faturado: ",sqlInsert);
               let arrayValores = [idRedator,idClie,nomeFatu,tiPFatu,cpfCnpj,emaFatu,teleFat,celuCon,
                cepFatu,tipoLog,logFatu,numFatu,comFatu,baiFatu,cidFatu,estFatu,paiFatu,nomeCon];
                let tripa = fPrepara(arrayValores);
                //console.log(sqlInsert+" ====>>>> "+sqlInsert+" "+tripa);
                //-------------------post----------------
                                                /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */                
                jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsert, tripa: tripa }, function (retorno) {
                    //console.log("retorno do insert   ",retorno);
                    if (retorno * 1 > 0) {
                        alert ("Novo faturado salvo com sucesso");
                        fGravaLog(siglaNaMaquina + " Insert tabela de faturados: " + sqlInsert + " " + tripa);
                        jQuery("#idBtnFatuRegACO").trigger("click");
                        jQuery("#idSelFatuRegCli option[value='"+idClie+"']").prop('selected', true);
                        jQuery("#idSelFatuRegCli").trigger("change");
                    } else {
                        fGravaLog(siglaNaMaquina + "  PROBLEMA: Insert fabela fatruados: " + sqlInsert + " " + tripa);
                    }//if retorno
                });//post  
        }//if exiFatu
    }else{
        alert ("Por favor, para evitar inconsistência no faturamento, preencha todos os campos, antes de salvar");
    }//if idClie * 1
}else{
    alert ("Para prosseguir, por favor, escolha uma Cliente antes");
}//if idClie
});//idBtnFatuNoFSalvar click
//---------------------------------------------------------    
jQuery(document).on("blur","#idTxtFatuRegFPA",function (){
//ao sair do campo das pastas adicionais no registro de uma fatura, verificar se não existe mistura de files de outros clientes
let tripaPastas = jQuery(this).val();
tripaPastas = tripaPastas.replaceAll(' ','');
let sql = `SELECT distinct id 
FROM tabclientes c 
WHERE c.id IN (select cliente_tabclientes from tabpastas where pasta in (`+tripaPastas+`))`;
});//idTxtFatuRegFPA blur
//---------------------------------------------------------
jQuery(document).on("change","#idSelFatuRegPas",function (){
    fLimpaCamposFaturamento();//limpa todos os campos
    let txtMateria = jQuery("#idSelFatuRegPas").find('option:selected').data('materia')
    let idAprovador = jQuery("#idSelFatuRegPas").find('option:selected').data('responsavel')
    let objSpa = jQuery("#idSpaFatuRegMat");
    objSpa.text(txtMateria);
    let objSpa2 = jQuery("#idSpaFatuRegIdApr");
    objSpa2.text(idAprovador);
    objSpa3 = jQuery("#idSpaFatuRegNomeApr");
    objSpa3.text("");
    //---procurando o nome do aprovador
    sql = `SELECT pessoa 
    FROM tabpessoas 
    WHERE  id = `+idAprovador;
                                                /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */    
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
                       let pessoa = obj.resultados[0].pessoa;
                       objSpa3.text(pessoa);
        } else {
            alert("Aprovador não encontrado");
        }//if retorno
    }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
});//idSelFatuRegPas change
//-------------------------------------------------------    
jQuery(document).on("change","#idSelFatuRegCli",function (){

    let idCli = jQuery("option:selected",this).val();
    let objSel = jQuery("#idSelFatuRegPas");
    objSel.empty();
    fSelecionaPastas(idCli,objSel);
    let objSelFatu = jQuery("#idSelFatuRegFaN");
    objSelFatu.empty();
    let concatenaFatu = '<option value="0" title="0"></option>';
    /*
    let concatena = '<option value="0" title="0"></option>';

            let sql = `SELECT id, pasta,materia,responsavel_tabpessoas FROM tabpastas WHERE cliente_tabclientes = ` + idCli;
           //console.log("sql na despsa",sql);
            let intOperacao = "1";
            let tripa = "";
            fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
                if (retorno.length > 20) {
                    let obj = JSON.parse(retorno);
                    let i = 0;
                    for (i; i < obj.resultados.length; i++) {
                        let id = obj.resultados[i].id;
                        let pasta = obj.resultados[i].pasta;
                        let materia = obj.resultados[i].materia;
                        let responsavel = obj.resultados[i].responsavel_tabpessoas;
                        concatena = concatena + `<option value="` + id + `" 
                        title="` + materia + `" data-responsavel="`+responsavel+`" 
                        data-materia ="` + materia + `">` + pasta + `</option>`;
                    }//for i
                } else {
                    alert("Este cliente não tem pasta");
                }//if retorno
                objSel.append(concatena);
            }, function (respostaErrada) {
                //console.log(respostaErrada);
            }).catch(function (e) {
                //console.log(e);
            });//fExecutaBD
*/            
            //------------------AGORA CARREGA OS FATURADOS DESTE CLIENTE ---F
            let sqlFatu = `SELECT id, faturado FROM tabfaturados WHERE cliente_tabclientes = ` + idCli;
                                                /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */            
            let intOperacaoFatu = global_int_operacaoSelect;
            let tripaFatu = "";
            fExecutaBD(intOperacaoFatu, sqlFatu, tripaFatu).then(function (retornoFatu) {
                //console.log("retornoFatu: ",retornoFatu);
                if (retornoFatu.length > 20) {
                    let obj = JSON.parse(retornoFatu);
                    let i = 0;
                    for (i; i < obj.resultados.length; i++) {
                        let id = obj.resultados[i].id;
                        let faturado = obj.resultados[i].faturado;
                            concatenaFatu = concatenaFatu + '<option value="' + id + '" title="' + id + '">' +faturado+ '</option>';
                    }//for i
                } else {
                    alert("Este cliente não tem um faturado registrado");
                }//if retornoFatu
                objSelFatu.append(concatenaFatu);
            }, function (respostaErrada) {
                //console.log(respostaErrada);
            }).catch(function (e) {
                //console.log(e);
            });//fExecutaBD
            //-------------------------------------------------------------/F
});//idSelFatuRegCli change
//-------------------------------------------------------------    
jQuery(document).on("change","#idSelFatuPesCli",function (){
    let idCli = jQuery("option:selected",this).val();
    let objSel = jQuery("#idSelFatuPesPas");
    fSelecionaPastas(idCli,objSel);
    /*
    objSel.empty();
    let concatena = '<option value="0" title="0"></option>';
            let sql = `SELECT id, pasta,materia,responsavel_tabpessoas FROM tabpastas WHERE cliente_tabclientes = ` + idCli;
           //console.log("sql na despsa",sql);
            let intOperacao = "1";
            let tripa = "";
            fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
                if (retorno.length > 20) {
                    let obj = JSON.parse(retorno);
                    let i = 0;
                    for (i; i < obj.resultados.length; i++) {
                        let id = obj.resultados[i].id;
                        let pasta = obj.resultados[i].pasta;
                        let materia = obj.resultados[i].materia;
                        let responsavel = obj.resultados[i].responsavel_tabpessoas;
                    concatena = concatena + `<option value="` + id + `" 
                    title="` + materia + `" data-responsavel="`+responsavel+`" 
                    data-materia ="` + materia + `">` + pasta + `</option>`;
                    }//for i
                } else {
                    alert("Este cliente não tem pasta");
                }//if retorno
                objSel.append(concatena);
            }, function (respostaErrada) {
                //console.log(respostaErrada);
            }).catch(function (e) {
                //console.log(e);
            });//fExecutaBD
            */
});//idSelFatuPesCli change
//---------------------------------------------------
    jQuery(document).on("click",".claSistDespApr",function (){
        let siglaNaMaquina = jQuery("#idSpaLogNaMaquinaSigla").text();
        let idDesp = jQuery(this).attr("id");
        let booAprova = confirm("Quer aprovar a despesa "+idDesp+"?");
        let contador=0;
        if(booAprova){
            let sqlUpdate = `UPDATE tabdespesas   
            set status = 3 
            WHERE id = ?`;
               let arrayValores = [idDesp];
                                                               /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
               let intOperacao = global_int_operacaoUpdateDelete;
               let tripa = fPrepara(arrayValores);
               fExecutaBD(intOperacao, sqlUpdate, tripa).then(function (retorno) {
                   if (retorno * 1 > 0) {
                       contador++;
                       let objTab = jQuery("#idTabSistDespPesTab");
                       objTab.empty();
                       fGravaLog(siglaNaMaquina + " UPDATE órgão na tabela despesas com sucesso: " + sqlUpdate + " " + tripa);
                   }else{
                    fGravaLog(siglaNaMaquina + " UPDATE órgão na tabela despesas com problema: " + sqlUpdate + " " + tripa);
                   }//if
               }).then(function () {
                   alert("Fez " + contador + " alterações");
               });//fExecutaBD
        }//if booAprova
    });//claSistDespApr click
//---------------------------------------------------------------
jQuery(document).on("click",".claSistDespRep",function (){
    let siglaNaMaquina = jQuery("#idSpaLogNaMaquinaSigla").text();
    let idDesp = jQuery(this).attr("id");
    let booReprova = confirm("Quer realmente REPROVAR a despesa "+idDesp+"? (Na dúvida, cancele esta janela");
    let contador=0;
    if(booReprova){
        let sqlUpdate = `UPDATE tabdespesas   
        set status = 7 
        WHERE id = ?`;
           let arrayValores = [idDesp];
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */           
           let intOperacao = global_int_operacaoUpdateDelete;
           let tripa = fPrepara(arrayValores);
           fExecutaBD(intOperacao, sqlUpdate, tripa).then(function (retorno) {
               if (retorno * 1 > 0) {
                   contador++;
                   let objTab = jQuery("#idTabSistDespPesTab");
                   objTab.empty();
                   fGravaLog(siglaNaMaquina + " UPDATE órgão na tabela despesas com sucesso: " + sqlUpdate + " " + tripa);
               }else{
                fGravaLog(siglaNaMaquina + " UPDATE órgão na tabela despesas com problema: " + sqlUpdate + " " + tripa);
               }//if
           }).then(function () {
               alert("Fez " + contador + " alterações");
           });//fExecutaBD
    }//if booAprova
});//claSistDespRep click
//---------------------------------------------------------------
jQuery(document).on("click","#idBtnSistDespPesPesq",function (){
    //administrando despesas
    let idCli = jQuery("#idSelSistDespCli").val();
    let clausulaCliente = "AND c.id = "+idCli+" ";
    if(idCli=="0") clausulaCliente="";
    let idPasta = jQuery("#idSelSistDespPesPas option:selected").val();
    let clausulaPasta = `AND f.id = `+idPasta+` `;
    if(idPasta=='0') clausulaPasta="";
    let dataInicial = jQuery("#idDatSistDespPesDaI").val();
    let dataFinal = jQuery("#idDatSistDespPesDaF").val();
    let nhrd = jQuery("#idSelSistDespPesInc option:selected").val();
    let clausulaNHRD = "AND d.incluir = "+nhrd;
    if(nhrd == "0") clausulaNHRD = "";
    let status = jQuery("#idSelSistDespPesSta option:selected").val();
    let clausulaStatus = `AND d.status = `+status;
    if(status*1==0) clausulaStatus="";
    let objTab = jQuery("#idTabSistDespPesTab");
    objTab.empty();
    let sql="SELECT * FROM tabdespesas where id < 0";//absurdo para ter valor default
    sql = `SELECT d.id,d.data,
    CASE 
    WHEN d.incluir = 1 THEN 'Escritório'
    WHEN d.incluir = 2 THEN 'NH'
    WHEN d.incluir = 3 THEN 'RD'
    END incluir,d.descricao,d.valor,d.data_insercao,d.status as intstatus,
    CASE 
    WHEN d.status = 1 THEN 'Rascunho'
    WHEN d.status = 2 THEN 'Pendente'
    WHEN d.status = 3 THEN 'Aprovada'
    WHEN d.status = 7 THEN 'Cancelada' 
    END status,d.pasta_tabpastas,
        p1.pessoa as redator,p2.pessoa as aprovador,f.materia  
        FROM tabdespesas d 
        INNER JOIN tabpessoas p1 
        ON p1.id = d.redator_tabpessoas 
        INNER JOIN tabpessoas p2 
        ON p2.id = d.aprovador_tabpessoas 
        INNER JOIN tabpastas f 
        ON f.id = d.pasta_tabpastas 
        INNER JOIN tabclientes c 
        ON f.cliente_tabclientes = c.id 
        WHERE d.data BETWEEN '`+dataInicial+`'  
        AND '`+dataFinal+`' `+clausulaPasta +` `+clausulaCliente+` `+clausulaStatus+` `+clausulaNHRD;
           
          //console.log("pesquisa despesa",sql);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */          
           intOperacao = global_int_operacaoSelect;
           tripa = "";
           let concatena = `<tr><th>Aprovar</th><th>Pasta</th><th>Matéria</th><th>Data</th><th>Descrição</th><th>Valor</th>
           <th>Redator</th><th>Aprovador</th><th>Inclusao</th><th>Inserção</th><th>status</th></tr>`;
           fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            //console.log("retorno",retorno);
               if (retorno.length > 20) {
                   let obj = JSON.parse(retorno);
                   let i = 0;
                   let estilo="";
                   for (i; i < obj.resultados.length; i++) {
                    estilo = 'background-color:initial';
                      let idDesp = obj.resultados[i].id;
                    let redator = obj.resultados[i].redator;
                       let pasta = obj.resultados[i].pasta_tabpastas;
                       let dataLida = obj.resultados[i].data+" 00:00:00";
                       dataLida = new Date(dataLida).toLocaleDateString();
                       let incluir = obj.resultados[i].incluir;
                       let descricao = obj.resultados[i].descricao;
                       let aprovador = obj.resultados[i].aprovador;
                       let valor = obj.resultados[i].valor;
                       let insercao = obj.resultados[i].data_insercao;
                       let status = obj.resultados[i].status;
                       //---
                        let intStatus = obj.resultados[i].intstatus;
                           if(intStatus*1==1)   estilo="background-color#FAEBD7";//antiquewhite
                           if(intStatus*1==2)   estilo="background-color:#90EE90";//lightgreen
                           if(intStatus*1==3)   estilo="background-color:#48D1CC";//turqueza
                           if(intStatus*1==7)   estilo="background-color:tomato";//
                           //--
                          //console.log("estilo e status",estilo+" / "+intStatus);
                       let materia = obj.resultados[i].materia;
                       //--
                       concatena = concatena + `<tr>
                       <td>
                       <button type="button" id="`+idDesp+`" 
                       class="btn btn-success btn-sm claSistDespApr" title="Aprova a despesa"`+idDesp+`>Sim</button>
                       <button type="button" id="`+idDesp+`" 
                       class="btn btn-danger btn-sm claSistDespRep" title="REPROVA a despesa"`+idDesp+`>Não</button>
                       </td>
                       <td>` + pasta + `</td><td>` + materia + `</td><td>` + dataLida + `</td>
                       <td>` + descricao + `</td><td>` + valor + `</td><td>` + redator + `</td>
                       <td>` + aprovador + `</td><td>` + incluir + `</td><td>` + insercao + `</td>
                       <td style="`+estilo+`">` + status + `</td></tr>`;
                   }//for i
               }//if retorno
               objTab.append(concatena);
               //console.log("Ok. Funcionou: "+concatena);
           }, function (respostaErrada) {
               //console.log(respostaErrada);
           }).catch(function (e) {
               //console.log(e);
           });//fExecutaBD
});//idBtnSistDespPesPesq click
//------------------------------------------------------------------
jQuery(document).on("change","#idSelSistDespPesPas",function (){
    let txtMateria = jQuery("#idSelSistDespPesPas").find('option:selected').data('materia');
    let objSpa = jQuery("#idSpaSistDespPesMat");
    objSpa.text(txtMateria);
});//idSelSistDespPesPas change
//---------------------------------------------------------
    jQuery(document).on("change","#idSelSistDespCli",function (){
        let idCli = jQuery("option:selected",this).val();
        let objSel = jQuery("#idSelSistDespPesPas");
        fSelecionaPastas(idCli,objSel);
    /*
        objSel.empty();
        let concatena = '<option value="0" title="0"></option>';
                let sql = `SELECT id, pasta,materia,responsavel_tabpessoas FROM tabpastas WHERE cliente_tabclientes = ` + idCli;
               //console.log("sql na despsa",sql);
                let intOperacao = "1";
                let tripa = "";
                fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
                    if (retorno.length > 20) {
                        let obj = JSON.parse(retorno);
                        let i = 0;
                        for (i; i < obj.resultados.length; i++) {
                            let id = obj.resultados[i].id;
                            let pasta = obj.resultados[i].pasta;
                            let materia = obj.resultados[i].materia;
                            let responsavel = obj.resultados[i].responsavel_tabpessoas;
                    concatena = concatena + `<option value="` + id + `" 
                    title="` + materia + `" data-responsavel="`+responsavel+`" 
                    data-materia ="` + materia + `">` + pasta + `</option>`;
                        }//for i
                    } else {
                        alert("Este cliente não tem pasta");
                    }//if retorno
                    objSel.append(concatena);
                }, function (respostaErrada) {
                    //console.log(respostaErrada);
                }).catch(function (e) {
                    //console.log(e);
                });//fExecutaBD
                */
    });//idSelSistDespCli change
    //-------------------------------------------------
    jQuery(document).on("click","#idBtnDespPesPesq",function (){
        //pesquisando despesas
        let idCli = jQuery("#idSelDespPesCli option:selected").val();
        let nomeCliente = jQuery("#idSelDespPesCli option:selected").text();
        //console.log("nomeCliente",nomeCliente);
        let idPasta = jQuery("#idSelDespPesPas option:selected").val();
        let dataInicial = jQuery("#idDatDespPesDaI").val();
        let dataFinal = jQuery("#idDatDespPesDaF").val();
        //---
        let nhrd = jQuery("#idSelDespPesInc option:selected").val();
        let clausulaInclusao = "AND d.incluir = "+nhrd;
        if(clausulaInclusao == "AND d.incluir = 0") clausulaInclusao="";//se for zero são todas
        //---
        let sql="SELECT * FROM tabdespesas where id < 0";//absurdo para ter valor default
        if(idPasta * 1 > 0 ){
        sql = `SELECT d.data,d.incluir,d.descricao,d.valor,d.data_insercao, CASE 
        WHEN d.status = 1 THEN 'Rascunho'
        WHEN d.status = 2 THEN 'Pendente'
        WHEN d.status = 3 THEN 'Aprovada'
        WHEN d.status = 7 THEN 'Cancelada' 
        END status,d.pasta_tabpastas,
            p1.pessoa as redator,p2.pessoa as aprovador,f.materia  
            FROM tabdespesas d 
            INNER JOIN tabpessoas p1 
            ON p1.id = d.redator_tabpessoas 
            INNER JOIN tabpessoas p2 
            ON p2.id = d.aprovador_tabpessoas 
            INNER JOIN tabpastas f 
            ON f.id = d.pasta_tabpastas 
            WHERE d.pasta_tabpastas = `+idPasta+`
            AND d.data BETWEEN '`+dataInicial+`'  
            AND '`+dataFinal+`' `+clausulaInclusao;
        }//if idPasta
        if(idPasta * 1 > 0 ){
            sql = `SELECT d.data,d.incluir,d.descricao,d.valor,d.data_insercao,CASE 
            WHEN d.status = 1 THEN 'Rascunho'
            WHEN d.status = 2 THEN 'Pendente'
            WHEN d.status = 3 THEN 'Aprovada' 
            WHEN d.status = 7 THEN 'Cancelada' 
            END status,d.pasta_tabpastas,
            p1.pessoa as redator,p2.pessoa as aprovador,f.materia  
            FROM tabdespesas d 
            INNER JOIN tabpessoas p1 
            ON p1.id = d.redator_tabpessoas 
            INNER JOIN tabpessoas p2 
            ON p2.id = d.aprovador_tabpessoas 
            INNER JOIN tabpastas f 
            ON f.id = d.pasta_tabpastas 
            WHERE d.pasta_tabpastas = `+idPasta+` `+clausulaInclusao+` 
            AND d.data BETWEEN '`+dataInicial+`'  
            AND '`+dataFinal+`' `;
        }//if idPasta
        if(idCli * 1 > 0 && idPasta * 1 == 0){
            sql = `SELECT d.data,d.incluir,d.descricao,d.valor,d.data_insercao,CASE 
            WHEN d.status = 1 THEN 'Rascunho'
            WHEN d.status = 2 THEN 'Pendente'
            WHEN d.status = 3 THEN 'Aprovada' 
            WHEN d.status = 7 THEN 'Cancelada' 
            END status,d.pasta_tabpastas,
            p1.pessoa as redator,p2.pessoa as aprovador,f.materia  
            FROM tabdespesas d 
            INNER JOIN tabpessoas p1 
            ON p1.id = d.redator_tabpessoas 
            INNER JOIN tabpessoas p2 
            ON p2.id = d.aprovador_tabpessoas 
            INNER JOIN tabpastas f 
            ON f.id = d.pasta_tabpastas 
            INNER JOIN tabclientes c 
            ON c.id = f.cliente_tabclientes 
            WHERE c.id = `+idCli+ ` `+clausulaInclusao+` 
            AND d.data BETWEEN '`+dataInicial+`'  
            AND '`+dataFinal+`' 
            `;
        }//if idPasta
              //console.log("pesquisa despesa",sql);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */              
               intOperacao = global_int_operacaoSelect;
               tripa = "";
               let concatena ='';
               let objTab = jQuery("#idTabDespPesResP");
               objTab.empty();
               fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
                //console.log("retorno",retorno);
                   if (retorno.length > 20) {
                       let obj = JSON.parse(retorno);
                       let i = 0;
                       for (i; i < obj.resultados.length; i++) {
                        if(i==0){
                            concatena = concatena +'<tr><th colspan="10">'+nomeCliente+'</th></tr>';
                            concatena = concatena +  `<tr><th>Pasta</th><th>Matéria</th><th>Data</th><th>Descrição</th><th>Valor</th>
                            <th>Redator</th><th>Aprovador</th><th>Inclusao</th><th>Inserção</th><th>Status</th></tr>`;
                        }
                        let redator = obj.resultados[i].redator;
                           let pasta = obj.resultados[i].pasta_tabpastas;
                           let data = obj.resultados[i].data;
                           let incluir = obj.resultados[i].incluir;
                           let txtIncluir="";
                           switch (incluir*1){
                            case 1:
                                txtIncluir="Escritório";
                                break;
                                case 2:
                                txtIncluir="Inclusão em NH";
                                break;
                                case 3:
                                txtIncluir ="Reembolso";
                                break;
                           }//switch
                           let descricao = obj.resultados[i].descricao;
                           let aprovador = obj.resultados[i].aprovador;
                           let valor = obj.resultados[i].valor;
                           //---
                           let insercao = obj.resultados[i].data_insercao;
                        
                           //---
                           let status = obj.resultados[i].status;
                           let materia = obj.resultados[i].materia;
                           //--
                           concatena = concatena + `<tr><td>` + pasta + `</td><td>` + materia + `</td><td>` + data + `</td>
                           <td>` + descricao + `</td><td>` + valor + `</td><td>` + redator + `</td>
                           <td>` + aprovador + `</td><td>` + txtIncluir + `</td><td>` + insercao + `</td>
                           <td>` + status + `</td></tr>`;
                       }//for i
                   }//if retorno
                   objTab.append(concatena);
                   jQuery("#idTADespPesPDF").val('<table>'+concatena+'</table>');
                   //console.log("Ok. Funcionou: "+concatena);
               }, function (respostaErrada) {
                   //console.log("Erro na pesquisa de despesa",respostaErrada);
               }).catch(function (e) {
                   //console.log("Erro na pesquisa de despesa catch",e);
               });//fExecutaBD
    });//idBtnDespPesPesq click
//-------------------------------------------------------------    
    jQuery(document).on("click","#idSelDespRegPas",function (){
        let txtMateria = jQuery("#idSelDespRegPas").find('option:selected').data('materia')
        let objSpa = jQuery("#idSpaDespRegMat");
        objSpa.text(txtMateria);
    });//idSelDespRegPas click
//-----------------------------------------------------------
jQuery(document).on("click","#idSelDespPesPas",function (){
    let txtMateria = jQuery("#idSelDespPesPas").find('option:selected').data('materia')
    let objSpa = jQuery("#idSpaDespPesMat");
    objSpa.text(txtMateria);
});//idSelDespPesPa click  
//-----------------------------------------------------------    
    jQuery(document).on("change","#idSelDespRegCli",function (){
        let idCli = jQuery("option:selected",this).val();
        let objSel = jQuery("#idSelDespRegPas");
       fSelecionaPastas(idCli,objSel);
            });//idSelDespRegCli change    
//-----------------------------------------------------------------    
    jQuery(document).on("change","#idSelDespPesCli",function (){
let idCli = jQuery("option:selected",this).val();
let objSel = jQuery("#idSelDespPesPas");
fSelecionaPastas(idCli,objSel);
/*
objSel.empty();
let concatena = '<option value="0" title="0"></option>';
        let sql = `SELECT id, pasta,materia,responsavel_tabpessoas FROM tabpastas WHERE cliente_tabclientes = ` + idCli;
        //console.log("sql na despsa",sql);
        let intOperacao = "1";
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let id = obj.resultados[i].id;
                    let pasta = obj.resultados[i].pasta;
                    let materia = obj.resultados[i].materia;
                    let responsavel = obj.resultados[i].responsavel_tabpessoas;
                    concatena = concatena + `<option value="` + id + `" 
                    title="` + materia + `" data-responsavel="`+responsavel+`" 
                    data-materia ="` + materia + `">` + pasta + `</option>`;
                }//for i
            } else {
                alert("Este cliente não tem pasta");
            }//if retorno
            objSel.append(concatena);
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
        */
    });//idSelDespPesCli change
    //----------------------------------------------------
    jQuery(document).on("change","#idSelProAdmOrgDivExist",function (){
        let txtDiv = jQuery("option:selected",this).text();
        jQuery("#idTxtProAdmSubNovo").val(txtDiv);
    });//idSelProAdmOrgDivExist change
//--------------------------------------------------------    
jQuery(document).on("click","#idBtnProAdmSubSalvar",function (){
    //salva ou altera uma nova divisão
let idOrg = jQuery("#idSelProAdmOrgExist option:selected").val()*1;
let idSub = jQuery("#idSelProAdmOrgDivExist option:selected").val()*1;
let nomeSub = jQuery("#idTxtProAdmSubNovo").val();
let siglaNaMaquina = jQuery("#idSpaLogNaMaquinaSigla").text();
if(idOrg * 1 > 0 && nomeSub != ''){
    if(idSub > 0){
        let contador=0;
//Já que foi escolhida uma subdivisão existente, logo é alteração.
                let sqlUpdate = `UPDATE taborgaossubdivisao   
                set divisao=? 
                WHERE id = ?`;
                   let arrayValores = [nomeSub, idSub];
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */                   
                   let intOperacao = global_int_operacaoUpdateDelete;
                   let tripa = fPrepara(arrayValores);
                   fExecutaBD(intOperacao, sqlUpdate, tripa).then(function (retorno) {
                       if (retorno * 1 > 0) {
                           contador++;
                           //fCarregaSubdivisao(idOrg);
                           fGravaLog(siglaNaMaquina + " UPDATE órgão na tabela taborgaossubdivisao com sucesso: " + sqlUpdate + " " + tripa);
                       }else{
                        fGravaLog(siglaNaMaquina + " UPDATE órgão na tabela taborgaossubdivisao com problema: " + sqlUpdate + " " + tripa);
                       }//if
                   }).then(function () {
                       alert("Fez " + contador + " alterações");
                   });//fExecutaBD
              }else{
                //não existe esta subdivisão. É insert
                let sqlInsert = `INSERT INTO taborgaossubdivisao (orgao_taborgaos,divisao) VALUES (?,?)`;
                let arrayValores = [idOrg, nomeSub];
                let tripa = fPrepara(arrayValores);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */                
                jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsert, tripa: tripa }, function (retorno) {
                    if (retorno * 1 > 0) {
                        //inserção com sucesso
                        alert ("Inseriu uma nova subdivisão com sucesso");
                        fGravaLog(siglaNaMaquina + " INSERÇÃO novo órgão na tabela taborgaos com sucesso: " + sqlInsert + " " + tripa);
                        //fCarregaSubdivisao(idOrg);
                    } else {
                        //a inserção deu erro
                        alert ("Houve um problema com a inserção de nova subdivisão");
                        fGravaLog(siglaNaMaquina + " PROBLEMA: a INSERÇÃO novo órgão em taborgaos: " + sqlInsert + " " + tripa);
                    }//if retorno
                });//post 
              }//if obj.resultados
    }else{
        alert ("Antes de salvar, indique o nome do órgão e o nome da subdivisão");
    }//if idOrg
});//idBtnProAdmSubSalvar click
//---------------------------------------------------------------    
    jQuery(document).on("change","#idSelProAdmOrgExist",function (){
        //preenche o input para uma possível alteração no nome do órgão
        let idOrgao = jQuery("option:selected",this).val();
        let nomeOrgao="";//valor default
        if(idOrgao *1 > 0){
        nomeOrgao = jQuery("option:selected",this).text();
        }//if idOrgao
        jQuery("#idTxtProAdmOrgNovo").val(nomeOrgao);
        jQuery("#idSpaProAdmOrgPai").text(nomeOrgao);//nome do órgão na inserção/alteração da subdivisão
        //---carregas as subdivisões deste órgão
        //fCarregaSubdivisao(idOrgao);
    });//idSelProAdmOrgExist change
//----------------------------------------------------------------------    
    jQuery(document).on("click", "#idBtnProAdmOrgSalvar", function () {
        //registrando ou consertando órgão de julgamento nos processos
        let idOrgao =jQuery("#idSelProAdmOrgExist option:selected").val();
        let siglaNaMaquina = jQuery("#idSpaLogNaMaquinaSigla").text();
        let novoOrgao = jQuery("#idTxtProAdmOrgNovo").val();
        let instancia = jQuery("#idSelProAdmOrgIns option:selected").val();
        if(novoOrgao != '' && instancia*1 > 0){
            //será que o órgão já existente está sendo modificado? Ou será insert?
        if(idOrgao *1 == 0){
            //é órgão novo
        let sqlInsert = `INSERT INTO taborgaos (orgao,instancia) VALUES (?,?)`;
        let arrayValores = [novoOrgao, instancia];
        let tripa = fPrepara(arrayValores);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsert, tripa: tripa }, function (retorno) {
            if (retorno * 1 > 0) {
                //inserção com sucesso
                alert ("Inseriu um novo órgão com sucesso");
                fGravaLog(siglaNaMaquina + " INSERÇÃO novo órgão na tabela taborgaos com sucesso: " + sqlInsert + " " + tripa);
                fCarregaOrgaos();
            } else {
                //a inserção deu erro
                alert ("Houve um problema com a inserção do novo órgão");
                fGravaLog(siglaNaMaquina + " PROBLEMA: a INSERÇÃO novo órgão em taborgaos: " + sqlInsert + " " + tripa);
            }//if retorno
        });//post 
    }else{
        //é update de um órgão já existente
        let contador=0;
        let sqlUpdate = `UPDATE taborgaos  
        set orgao =?,instancia=?  
        WHERE id = ?`;
           let arrayValores = [novoOrgao, instancia, idOrgao];
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */           
           let intOperacao = global_int_operacaoUpdateDelete;
           let tripa = fPrepara(arrayValores);
           fExecutaBD(intOperacao, sqlUpdate, tripa).then(function (retorno) {
               if (retorno * 1 > 0) {
                   contador++;
                   fGravaLog(siglaNaMaquina + " UPDATE órgão na tabela taborgaos com sucesso: " + sqlUpdate + " " + tripa);
                   fCarregaOrgaos();
               }else{
                fGravaLog(siglaNaMaquina + " UPDATE órgão na tabela taborgaos FALHOU: " + sqlUpdate + " " + tripa);
               }//if
           }).then(function () {
               alert("Fez " + contador + " alterações");

           });
    }//if idOrgao
    }else{
        alert ("Antes de salvar, indique o nome do órgão e a sua instância");
    }//if novoOrgao
    });//idBtnProAdmOrgSalvar click
    //-----------------------------------------------------
    jQuery(document).on("change", "#idSelProRegAndaPas", function () {
        //selecionando um file e listando seus processos na hora de registrar um andamento
        let objSelPro = jQuery("#idSelProRegAndaPro");
        objSelPro.empty();
        let objSpa = jQuery("#idSpaProRegAndaMat");
        objSpa.text('');
        let idPas = jQuery("option:selected", this).val();
        let sql = `SELECT p.id,p.original,
        (SELECT f.materia  FROM tabpastas f WHERE f.id = `+idPas+`) materia 
        FROM tabprocessos p  
        WHERE p.pasta_tabpastas = `+ idPas + ` ORDER BY p.original`;
        //console.log("sql ",sql);
        let concatena = '<option value="0" title="0">...</option>';
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                //--
                let materia = obj.resultados[0].materia;
                //--
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let original = obj.resultados[i].original;
                    let idLido = obj.resultados[i].id;
                    concatena = concatena + '<option value="' + idLido + '" title="' + idLido + '">' + original + '</option>';
                }//for
                objSelPro.append(concatena);
                objSpa.text(materia);
            }//if retorno
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
    });//idSelProRegAndaPas change
    //---------------------------------------------------------
    jQuery(document).on("change", "#idSelProRegAndaPro", function () {
        //selecionando um processo, traz o julgador e o responsável
        let objSpaJul = jQuery("#idSpaProRegAndaJul");
        objSpaJul.text('');
        let objSpaResp = jQuery("#idSpaProRegAndaResp");
        objSpaResp.text('');
        let idPro = jQuery("option:selected", this).val();
        let sql = `SELECT p.julgador,g.pessoa FROM tabprocessos p  
INNER JOIN tabpessoas g 
WHERE p.responsavel_tabpessoas= g.id 
AND p.id = '`+ idPro + `'`;
        //console.log(sql);
        let concatena = '<option value="0" title="0">...</option>';
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                //--
                let julgador = obj.resultados[0].julgador;
                let responsavel = obj.resultados[0].pessoa;

                objSpaJul.text(julgador);
                objSpaResp.text(responsavel);
            }//if retorno
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
    });//idSelProRegAndaPro change
    //---------------------------------------------------------
    jQuery(document).on("change", "#idSelProRegAndaCli", function () {
        //populando a lista de files no registro de um andamento
        let idCli = jQuery("option:selected", this).val();
        let objSel = jQuery("#idSelProRegAndaPas");
        fSelecionaPastas(idCli,objSel);
        /*
        objSel.empty();
        let concatena = '<option value="0" title="0"></option>';
        let sql = `SELECT id, pasta,materia FROM tabpastas WHERE cliente_tabclientes = ` + idCli;
        //console.log(sql);
        let intOperacao = "1";
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let id = obj.resultados[i].id;
                    let pasta = obj.resultados[i].pasta;
                    concatena = concatena + '<option value="' + id + '" title="' + id + '">' + pasta + '</option>';
                }//for i
            } else {
                alert("Este cliente não tem pasta");
            }//if retorno
            objSel.append(concatena);
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
        */
    });//idSelProRegAndaCli change
    //---------------------------------------------------------
    jQuery(document).on("change", "#idSelProRegCli", function () {
        //carrega as pastas a partir da seleção do cliente em Processos
                //---
                jQuery(".claLimpaRegPro").val('');
                jQuery(".claLimpaRegProSel option[value='0']").prop('selected', true);
                //---
        let idCliente = jQuery("option:selected", this).val();
        let objSel = jQuery("#idSelProRegPas");
        fSelecionaPastas(idCliente,objSel);
/*        
        objSel.empty();
        let concatena = '<option value="0" title="0"></option>';
        let sql = `SELECT id, pasta,materia FROM tabpastas WHERE cliente_tabclientes = ` + idCliente;
        //console.log(sql);
        let intOperacao = "1";
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let id = obj.resultados[i].id;
                    let pasta = obj.resultados[i].pasta;
                    concatena = concatena + '<option value="' + id + '" title="' + id + '">' + pasta + '</option>';
                }//for i
            } else {
                alert("Este cliente não tem pasta");
            }//if retorno
            objSel.append(concatena);
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
        */
    });//idSelProRegCli change
    //---------------------------------------------------------
    jQuery(document).on("change", "#idSelProRegPas", function () {
        //seleciona um select com um responsável por um processo
        //---
        jQuery(".claLimpaRegPro").val('');
        jQuery(".claLimpaRegProSel option[value='0']").prop('selected', true);
        //---
        jQuery("#idSelProRegResp option[value='0']").prop('selected', true);
        let idPasta = jQuery("option:selected", this).val();
        let sql = "x";
        //---selecionar o responsável
        sql = `SELECT id,materia,responsavel_tabpessoas,area_tabareas,int_status 
            FROM tabpastas
         WHERE id = `+ idPasta;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */         
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let idResp = obj.resultados[0].responsavel_tabpessoas;
                let materia = obj.resultados[0].materia;
                jQuery("#idSelProRegResp option[value='" + idResp + "']").prop('selected', true);
                jQuery("#idSpaProRegMat").text(materia);
            }//if retorno
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
    });// 
    //---------------------------------------------------------
    jQuery(document).on("change", "#idSelProPesCli", function () {
        //carrega as pastas a partir da seleção do cliente
        let idCliente = jQuery("option:selected", this).val();
        let objSel = jQuery("#idSelProPesPas");
        objSel.empty();
        //---limpezas somente
        let objTabPro = jQuery("#idTabProPesResultado");
        objTabPro.empty();
        jQuery("#idSpaProPesMat").text('');
        jQuery("#idSelProPesPrE").empty();
        //---
        fSelecionaPastas(idCliente,objSel);
        /*
        let concatena = '<option value="0" title="0"></option>';
        let sql = `SELECT id, pasta,materia,responsavel_tabpessoas FROM tabpastas WHERE cliente_tabclientes = ` + idCliente;
        //console.log(sql);
        let intOperacao = "1";
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let id = obj.resultados[i].id;
                    let pasta = obj.resultados[i].pasta;
                    let materia = obj.resultados[i].materia;
                    let responsavel = obj.resultados[i].responsavel_tabpessoas;
                    concatena = concatena + `<option value="` + id + `" 
                    title="` + materia + `" data-responsavel="`+responsavel+`" 
                    data-materia ="` + materia + `">` + pasta + `</option>`;
                }//for i
            } else {
                alert("Este cliente não tem pasta");
            }//if retorno
            objSel.append(concatena);
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
*/
    });//idSelProPesCli change
    //---------------------------------------------------------
    jQuery(document).on("change", "#idSelProPesPas", function () {
        //pesquisando processo: selecionando a pasta mostra os processos existentes
        let idPasta = jQuery("option:selected", this).val();
        let objSel = jQuery("#idSelProPesPrE");
        objSel.empty();
        //---
        let materia = jQuery("#idSelProPesPas").find('option:selected').data('materia');
        jQuery("#idSpaProPesMat").text(materia);
        //---
        let concatena = '<option value="0" title="0"></option>';
        let sql = `SELECT id, responsavel_tabpessoas,original FROM tabprocessos WHERE pasta_tabpastas = ` + idPasta;
        //console.log(sql);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let id = obj.resultados[i].id;
                    let original = obj.resultados[i].original;
                    concatena = concatena + '<option value="' + id + '" title="' + id + '">' + original + '</option>';
                }//for i
            } else {
                alert("Esta pasta não tem processos originais");
            }//if retorno
            objSel.append(concatena);
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD

    });//idSelProPesPas change
    //---------------------------------------------------------
    jQuery("#idSelDashGCli").change(function () {
        //carrega os quadros na dashboard
        let sql = "";
        let intOperacao = 0;
        let tripa = "";
        let idCliente = jQuery("option:selected", this).val();
       let txtNomeCliente = jQuery("option:selected",this).text();
        //---fecha as janelas para não mostrar dados do anterior, porque os gráficos não renovam
        jQuery(".claAndamentos").hide();
        jQuery(".claHonorarios").hide();
        jQuery(".claDespesas").hide();
        jQuery(".claTs").hide();
        //jQuery(".claCrono").hide();
        //---só vai liberar os botões da dashboard para serem clicados se a escolha do id do cliente for válida
        jQuery(".claBtnAbasDashboard").prop("disabled",false);//botões liberados como default
        if(idCliente*1 >0){
        jQuery(".claH4DashGCLI").text(txtNomeCliente);
        //---Andamentos
        sql = `SELECT f.pasta,f.materia,p.original as processo,a.data_andamento,a.andamento,
        a.mesma_posicao,g.pessoa as redator,a.data_prazo1,a.data_prazo2,a.data_insercao 
        FROM tabandamentos a 
        INNER JOIN tabprocessos p 
        ON a.processo_tabprocessos = p.id 
        INNER JOIN tabpastas f 
        ON p.pasta_tabpastas = f.id 
        INNER JOIN tabpessoas g 
        ON a.redator_tabpessoas = g.id 
        WHERE p.pasta_tabpastas IN (SELECT id FROM tabpastas WHERE cliente_tabclientes = `+ idCliente + `) 
        AND a.status = 2 
        ORDER BY a.data_andamento DESC` ;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        intOperacao = global_int_operacaoSelect;
        tripa = "";
        let concatenaAndaP = `<tr><th>Pasta</th><th>Matéria</th><th>Processo Original</th><th>Data</th>
        <th>Andamento</th><th>Mesma posição?</th><th>Redator</th><th>Prazo 1</th><th>Prazo 2</th><th>Inserção</th></tr>`;
        let concatenaAndaU = `<tr><th>Pasta</th><th>Matéria</th><th>Processo Original</th><th>Data</th>
        <th>Andamento</th><th>Mesma posição?</th><th>Redator</th><th>Inserção</th></tr>`;
        let objTabAndaU = jQuery("#idTabDashGPRUA");
        let objTabAndaP = jQuery("#idTabDashGPRAP");
        objTabAndaU.empty();
        objTabAndaP.empty();
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            //console.log(retorno);
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let pasta = obj.resultados[i].pasta;
                    let materia = obj.resultados[i].materia;
                    let processo = obj.resultados[i].processo;
                    let dataAndamento = obj.resultados[i].data_andamento;
                    let andamento = obj.resultados[i].andamento;
                    //---
                    let intMesmaPosicao = obj.resultados[i].mesma_posicao;
                    let txtPosicao ="SIM";
                    if(intMesmaPosicao*1==0) txtPosicao='';
                    let redator = obj.resultados[i].redator;
                    let prazo1 = obj.resultados[i].data_prazo1;//pressupõe-se que, não havendo prazo, é 0000-00-00
                    let prazo2 = obj.resultados[i].data_prazo2;//pressupõe-se que, não havendo prazo, é 0000-00-00
                    let insercao = obj.resultados[i].data_insercao;
                    if(prazo1 != '0000-00-00' || prazo2 != '0000-00-00'){
                    concatenaAndaP = concatenaAndaP + `<tr><td>` + pasta + `</td><td>` + materia + `</td>
                    <td>` + processo + `</td><td>` + dataAndamento + `</td><td>` + andamento + `</td><td>` + txtPosicao+ `</td>
                    <td>` + redator + `</td><td>` + prazo1 + `</td><td>` + prazo2 + `</td>
                    <td>` + insercao + `</td>
                    </tr>`;
                    }//if prazo1 != 
                    if(prazo1 == '0000-00-00' && prazo2 == '0000-00-00'){
                    concatenaAndaU = concatenaAndaU + `<tr><td>` + pasta + `</td><td>` + materia + `</td>
                    <td>` + processo + `</td><td>` + dataAndamento + `</td><td>` + andamento + `</td><td>` + txtPosicao+ `</td>
                    <td>` + redator + `</td><td>` + insercao + `</td>
                    </tr>`;
                    }//if prazo1 ==
                }//for i
            }//if retorno
            objTabAndaU.append(concatenaAndaU);
            objTabAndaP.append(concatenaAndaP);
            //console.log("concatenaAndaU",concatenaAndaU);
        }, function (respostaErrada) {
            //console.log("concatenaAndaU",respostaErrada);
        }).catch(function (e) {
            //console.log("concatenaAndaU catch",e);
        });//fExecutaBD

        
  //---Honorários
  sql = `  SELECT p.pasta,p.materia,c.faturado,f.data_insercao,f.descricao,f.vencimento,
  f.valor,g.pessoa as redator,n.contato,f.status  
  FROM tabfaturamento f 
  INNER JOIN tabfaturados c 
  ON f.faturado_tabfaturados = c.id 
  INNER JOIN tabpastas p 
  ON f.principal_tabpastas = p.id 
  INNER JOIN tabpessoas g 
  ON f.redator_tabpessoas = g.id 
  INNER JOIN tabfaturados n 
  ON f.contato_tabfaturados = n.id 
  WHERE f.principal_tabpastas IN (SELECT id FROM tabpastas WHERE cliente_tabclientes = `+ idCliente + `) 
  ORDER BY f.data_insercao` ;
  //console.log(sql);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */  
  intOperacao = global_int_operacaoSelect;
  tripa = "";
  let concatenaNHPA = `<tr><th>Pasta</th><th>Matéria</th><th>Faturado</th><th>Data</th>
  <th>Vencimento</th><th>Texto</th><th>Valor</th><th>Redator</th><th>Contato</th></tr>`;
  let concatenaNHPL = `<tr><th>Pasta</th><th>Matéria</th><th>Faturado</th><th>Data</th>
  <th>Vencimento</th><th>Texto</th><th>Valor</th><th>Redator</th><th>Contato</th></tr>`;
  let objTabNHPA = jQuery("#idTabDashGNHPA");//pendentes de aprovação
  let objTabNHPL = jQuery("#idTabDashGNHPL");//ainda pendente de liquidação
  objTabNHPA.empty();
  objTabNHPL.empty();
  fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
      //console.log("retorno",retorno);
      if (retorno.length > 20) {
          let obj = JSON.parse(retorno);
          let i = 0;
          for (i; i < obj.resultados.length; i++) {
              let pasta = obj.resultados[i].pasta;
              let materia = obj.resultados[i].materia;
              let faturado = obj.resultados[i].faturado;
              let dataNH = obj.resultados[i].data_insercao;
              let vencimento = obj.resultados[i].vencimento;
              let texto = obj.resultados[i].descricao;
              //--
              let valor = parseFloat(obj.resultados[i].valor).toLocaleString('pt-BR');
              /*
              let intPosVirg = valor.toString().indexOf(",");
              if(intPosVirg == -1) valor = valor+",00";
              */
              //--
              let redator = obj.resultados[i].redator;
              let contato = obj.resultados[i].contato;
              let status = obj.resultados[i].status;
                if(status*1==2){
              concatenaNHPA = concatenaNHPA + `<tr><td>` + pasta + `</td><td>` + materia + `</td>
              <td>` + faturado + `</td><td>` + dataNH + `</td><td>` + vencimento + `</td><td>` + texto + `</td>
              <td style="text-align:right;">` + valor+ `</td>
              <td>` + redator + `</td><td>` + contato + `</td><td></tr>`;
                }//if status
                if(status*1==3){
              concatenaNHPL = concatenaNHPL + `<tr><td>` + pasta + `</td><td>` + materia + `</td>
              <td>` + faturado + `</td><td>` + dataNH + `</td><td>` + vencimento + `</td>
              <td>` + texto + `</td><td style="text-align:right;">` + valor+ `</td>
              <td>` + redator + `</td><td>` + contato + `</td><td></tr>`;
                }//if status
          }//for i
      }//if retorno
      objTabNHPA.append(concatenaNHPA);
      objTabNHPL.append(concatenaNHPL);
      //console.log("concatenaNHPL",concatenaNHPL);
  }, function (respostaErrada) {
      //console.log("concatenaNHPL",respostaErrada);
  }).catch(function (e) {
      //console.log("concatenaNHPL catch",e);
  });//fExecutaBD

        //---Despesas a cobrar
        sql = `SELECT p.pasta,p.materia,d.*  
        FROM tabdespesas d 
        INNER JOIN tabpastas p 
        ON d.pasta_tabpastas = p.id 
        WHERE d.pasta_tabpastas IN (SELECT id FROM tabpastas WHERE cliente_tabclientes = `+ idCliente + `) 
        AND d.status = 2` ;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        intOperacao = global_int_operacaoSelect;
        tripa = "";
        let concatenaDesp = "<tr><th>Pasta</th><th>Matéria</th><th>Valor</th></tr>";
        let objTabDesp = jQuery("#idTabDashGDEPA");
        objTabDesp.empty();
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            //console.log(retorno);
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let pasta = obj.resultados[i].pasta;
                    let materia = obj.resultados[i].materia;
                    let valor = obj.resultados[i].valor;
                    concatenaDesp = concatenaDesp + `<tr><td>` + pasta + `</td><td>` + materia + `</td>
                    <td>` + valor + `</td></tr>`;
                }//for i
            }//if retorno
            objTabDesp.append(concatenaDesp);
            //console.log("Ok. Funcionou despesas: "+concatenaDesp);
        }, function (respostaErrada) {
            //console.log("despesas",respostaErrada);
        }).catch(function (e) {
            //console.log("despesas catch",e);
        });//fExecutaBD
        //---timesheets a cobrar
        sql = `SELECT p.pasta,p.materia, SUM(t.uts*t.taxa_padrao) as volumePadrao,
 SUM(t.uts*t.taxa_especial) as volumeEspecial 
 FROM tabts t 
 INNER JOIN tabpastas p 
 ON t.pasta_tabpastas = p.id 
 WHERE t.pasta_tabpastas IN (SELECT id FROM tabpastas WHERE cliente_tabclientes = `+ idCliente + `) 
 AND t.int_status = 2 
 GROUP BY p.pasta,p.materia` ;
        //console.log(sql);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        intOperacao = global_int_operacaoSelect;
        tripa = "";
        let concatenaTS = "<tr><th>Pasta</th><th>Matéria</th><th>Valor</th></tr>";
        let objTabTS = jQuery("#idTabDashTS");
        objTabTS.empty();
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let pasta = obj.resultados[i].pasta;
                    let materia = obj.resultados[i].materia;
                    let volume = obj.resultados[i].volumePadrao;
                    //--
                    let volumeEspecial = obj.resultados[i].volumeEspecial
                    if (volumeEspecial * 1 > 0) {
                        volume = volumeEspecial;
                    }//if especial
                    //--
                    concatenaTS = concatenaTS + `<tr><td>` + pasta + `</td><td>` + materia + `</td><td>` + volume + `</td></tr>`;
                }//for i
            }//if retorno
            objTabTS.append(concatenaTS);
            //console.log("Ok. Funcionou ts: "+concatenaTS);
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
        //---timesheets baixado
        sql = `SELECT p.pasta,p.materia, SUM(t.uts*t.taxa_padrao) as volumePadrao,
 SUM(t.uts*t.taxa_especial) as volumeEspecial 
 FROM tabts t 
 INNER JOIN tabpastas p 
 ON t.pasta_tabpastas = p.id 
 WHERE t.pasta_tabpastas IN (SELECT id FROM tabpastas WHERE cliente_tabclientes = `+ idCliente + `) 
 AND t.int_status = 3 
 GROUP BY p.pasta,p.materia` ;
        //console.log(sql);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        intOperacao = global_int_operacaoSelect;
        tripa = "";
        let concatenaTSB = "<tr><th>Pasta</th><th>Matéria</th><th>Valor</th></tr>";
        let objTabTSB = jQuery("#idTabDashTSBaix");
        objTabTSB.empty();
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let pasta = obj.resultados[i].pasta;
                    let materia = obj.resultados[i].materia;
                    let volume = obj.resultados[i].volumePadrao;
                    //--
                    let volumeEspecial = obj.resultados[i].volumeEspecial
                    if (volumeEspecial * 1 > 0) {
                        volume = volumeEspecial;
                    }//if especial
                    //--
                    concatenaTSB = concatenaTSB + `<tr><td>` + pasta + `</td><td>` + materia + `</td><td>` + volume + `</td></tr>`;
                }//for i
            }//if retorno
            objTabTSB.append(concatenaTSB);
            //console.log("Ok. Funcionou ts: "+concatenaTSB);
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
        //---cronológica
        sql = `SELECT c.id,p.pasta,p.materia, c.ano, c.referencia 
 FROM tabcrono c 
 INNER JOIN tabpastas p 
 ON c.pasta_tabpastas = p.id 
 WHERE c.pasta_tabpastas IN (SELECT id FROM tabpastas WHERE cliente_tabclientes = `+ idCliente + `) 
 AND c.int_status = 2` ;
        //console.log(sql);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        intOperacao = global_int_operacaoSelect;
        tripa = "";
        let concatenaCrono = "<tr><th>No. crono</th><th>Pasta</th><th>Matéria</th><th>Ano</th><th>Ref</th></tr>";
        let objTabCrono = jQuery("#idTabDashCrono");
        objTabCrono.empty();
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let idLido=obj.resultados[i].id;
                    let pasta = obj.resultados[i].pasta;
                    let materia = obj.resultados[i].materia;
                    let ano = obj.resultados[i].ano;
                    let refer = obj.resultados[i].referencia;
                    concatenaCrono = concatenaCrono + `<tr><td>`+idLido+`</td><td>` + pasta + `</td><td>` + materia + `</td><td>` + ano + `</td><td>` + refer + `</td></tr>`;
                }//for i
            }//if retorno
            objTabCrono.append(concatenaCrono);
            //console.log("Ok. Funcionou crono: "+concatenaCrono);
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
    }else{
        jQuery(".claBtnAbasDashboard").prop("disabled",true);
    }//if idCliente > 0
    });//idSelDashGCli change
//---------------------------------------------------------   
jQuery(document).on("change","#idChkAlmoAdmPIA",function (){
    //almoxarifado primeira checkbox
 let intIncluir = jQuery("#idChkAlmoAdmPIA:checked").val();
 let intIncluir2 = jQuery("#idChkAlmoAdmPIC:checked").val();
 if(intIncluir*1==1 && typeof intIncluir2 == "undefined"){
    //recarregar a tabela com os já atendidos também
    fCarregaAlmoxarifadoPendentes(1);//carrega os pendentes e os atendidos
 }
 if(typeof intIncluir == "undefined" && typeof intIncluir2 == "undefined"){
    //recarregar a tabela só com os pendentes
    fCarregaAlmoxarifadoPendentes(0);//carrega os pendentes
 }
 if(intIncluir2 *1==1){
    //recarregar a tabela só com os pendentes
    fCarregaAlmoxarifadoPendentes(2);//carrega tudo
 } 
});//idChkAlmoAdmPIA change
    //--------------------------------------------------
    jQuery(document).on("change","#idChkAlmoAdmPIC",function (){
        //almoxarifado segunda checkbox
     let intIncluir = jQuery("#idChkAlmoAdmPIA:checked").val();
     let intIncluir2 = jQuery("#idChkAlmoAdmPIC:checked").val();
     //console.log("intIncluir e intIncluir2",intIncluir+" / "+intIncluir2);
     if(intIncluir*1==1 && typeof intIncluir2 == "undefined"){
        //recarregar a tabela com os já atendidos também
        fCarregaAlmoxarifadoPendentes(1);//carrega os pendentes e os atendidos
     }
     if(typeof intIncluir == "undefined" && typeof intIncluir2 == "undefined"){
        //recarregar a tabela só com os pendentes
        fCarregaAlmoxarifadoPendentes(0);//carrega os pendentes
     }
     if(intIncluir2*1==1){
        //recarregar a tabela só com os pendentes
        fCarregaAlmoxarifadoPendentes(2);//carrega tudo
     } 
    });//idChkAlmoAdmPIC change
        //--------------------------------------------------
    jQuery("#idBtnAlmoPesMoI").click(function () {
        //almoxarifado: altera o status do pedido, enquanto não atendido
        let siglaNaMaquina = jQuery("#idSpaLogNaMaquinaSigla").text();
        let contador = 0;
        let tripaIdsAlmo = jQuery("input[class='claChkPed']:checkbox:checked").map(function () {
            return jQuery(this).val();
        }).get().join(",");
        let intEscolha = jQuery("input[name=namRadAlmoPesAlP]:checked").val();
        //alert (intEscolha+" lista de ids: "+tripaIdsAlmo);
        if (tripaIdsAlmo.length > 0 && intEscolha * 1 > 0) {
                let sqlUpdate = `UPDATE tabalmo 
             set int_status=? 
             WHERE id IN (?)`;
                let arrayValores = [intEscolha, tripaIdsAlmo];
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */                
                let intOperacao = global_int_operacaoUpdateDelete;
                let tripa = fPrepara(arrayValores);
                fExecutaBD(intOperacao, sqlUpdate, tripa).then(function (retorno) {
                    console.log("retorno do almo",retorno);
                    if (retorno * 1 > 0) {
                        contador++;
                        fGravaLog(siglaNaMaquina + " UPDATE tabalmo com sucesso: " + sqlUpdate + " " + tripa);
                    }else{
                        fGravaLog(siglaNaMaquina + " UPDATE tabalmo com PROBLEMA: " + sqlUpdate + " " + tripa);
                    }//if
                    alert("Fez " + contador + " alterações");
                    jQuery('#idChkAlmoAdmPIC').prop("checked",false);
                    jQuery('#idChkAlmoAdmPIA').prop("checked",false);  
                    fCarregaAlmoxarifadoPendentes(0);//SÓ OS PENDENTES 
                }).then(function (erro) {
                console.log("Erro no almoxarifado",erro);
                },function (problema){
                   console.log("problema no almoxarifado",problema);
                }).catch(function (e){
                    console.log("catch no almoxarifado ",e);
                });
        } else {
            alert("Antes de comandar alteração, selecione na tabela os itens a serem modificados e também indique uma opção deste quadro");
        }//if arrayIdsAlmo
    });//idBtnAlmoPesMoI click
    //----------------------------------------------------
    jQuery("#idSelAlmoRegMat").change(function () {
        //almoxarifado. Pondo a apresentação do produto no campo
        let apresenta = jQuery("option:selected", this).prop("title");
        jQuery("#idSpaAlmoRegApr").text(apresenta);
    });//idSelAlmoRegMat change
    //----------------------------------------------------------
    jQuery("#idBtnAlmoRegPoC").click(function () {
        //pedindo material e pondo no carrinho
        let intNaMaquina = jQuery("#idSpaLogNaMaquinaId").text();
        //---
        let objTab = jQuery("#idTabAlmoRegReP");
        objTab.empty();
        let concatena = `<tr><th>id</th><th>Solic</th><th>Material</th><th>Qtd</th><th>Apresentação</th><th>Status</th></tr>`;
        //---
        let idSol = jQuery("#idSelAlmoRegSol option:selected").val();
        let siglaSol = jQuery("#idSelAlmoRegSol option:selected").prop("title");
        //--
        let idMat = jQuery("#idSelAlmoRegMat option:selected").val();
        let nomeMat = jQuery("#idSelAlmoRegMat option:selected").text();
        let apresenta = jQuery("#idSpaAlmoRegApr").text();
        //--
        let qtd = jQuery("#idNumAlmoRegQtd").val();
        let intStatus = jQuery("#idSelAlmoRegSit option:selected").val();
        if (idSol * 1 > 0 && idMat * 1 > 0 && qtd * 1 > 0 && intStatus * 1 > 0) {
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */            
            let intOperacao = global_int_operacaoInsert;
            let sqlInsert = `INSERT INTO tabalmo 
            (redator_tabpessoas,solicitante_tabpessoas,material_tabalmomat,
                quantidade,int_status) 
                VALUES (?,?,?,?,?)`;
            let arrayValores = [intNaMaquina, idSol, idMat, qtd, intStatus];
            let tripa = fPrepara(arrayValores);
            fExecutaBD(intOperacao, sqlInsert, tripa).then(function (retorno) {
                let msg = "";
                if (retorno * 1 > 0) {
                    //inserção com sucesso. Retorno aqui é o ID da inserção do BD
                    let traducao = "";
                    let estilo = "background-color:initial";
                    switch (intStatus * 1) {
                        case 1:
                            traducao = "Rascunho";
                            estilo = "background-color:yellow";
                            break;
                        case 2:
                            traducao = "Pendente";
                            estilo = "background-color:green";
                            break;
                        case 3:
                            traducao = "Atendido";
                            break;
                        case 7:
                            traducao = "Cancelado";
                            estilo = "background-color:red";
                            break;
                    }//switch
                    concatena = concatena + `<tr><td>` + retorno + `</td><td>` + siglaSol + `</td>
                    <td>`+ nomeMat + `</td><td>` + qtd + `</td>
                    <td>`+ apresenta + `</td><td style="` + estilo + `">` + traducao + `</td></tr>`;
                    alert("Pôs no carrinho");
                    jQuery("#idSelAlmoRegMat option[value='0']").prop('selected', true);
                    jQuery("#idNumAlmoRegQtd").val('');
                    msg = "    INSERÇÃO de pedido no carrinho com sucesso: ";
                    fGravaLog(intNaMaquina + msg + sqlInsert + " " + tripa);
                } else {
                    alert("Problema na inserção: " + retorno);
                    msg = "  PROBLEMA INSERÇÃO de pedido no carrinho: ";
                    fGravaLog(intNaMaquina + msg + sqlInsert + " " + tripa);
                }//if retorno
                objTab.append(concatena);
            });//fExecutaBD
        } else {
            alert("Antes de salvar, indique todos os campos");
        }//if idSol
    });//idBtnAlmoRegPoC click
    //--------------------------------------------------------------
    jQuery(document).on("click", ".claLinhaTE", function () {
        //preenchendo os campos de conserto. Alterando pela pasta
        jQuery(".claLimpaCTE").val('');
        let idTaxa = jQuery(this).attr("id");
        jQuery("#idSpaSistNTENumT").text(idTaxa);
        let sql = `SELECT c.id as idcliente,p.id as idpasta,e.profissional_tabpessoas, 
        e.inicio_validade, e.fim_validade, 
        e.valor, e.int_status 
        FROM tabtaxasespeciais e 
        INNER JOIN tabpastas p 
        ON e.pasta_tabpastas = p.id 
        INNER JOIN tabclientes c 
        ON p.cliente_tabclientes = c.id 
        WHERE e.id = `+ idTaxa;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let idPasta = obj.resultados[0].idpasta;
                let idCliente = obj.resultados[0].idcliente;
                let idPessoa = obj.resultados[0].profissional_tabpessoas;
                let inicio = obj.resultados[0].inicio_validade;
                let fim = obj.resultados[0].fim_validade;
                let valor = obj.resultados[0].valor;
                //---
                jQuery("#idSelSistNTECliA option[value='" + idCliente + "']").prop('selected', true);
                jQuery("#idSelSistNTEPasA option[value='" + idPasta + "']").prop('selected', true);
                jQuery("#idSelSistNTEProfA option[value='" + idPessoa + "']").prop('selected', true);
                jQuery("#idDatSistNTEPDiA").val(inicio);
                jQuery("#idDatSistNTEPDfA").val(fim);
                jQuery("#idNumSistNTEValorA").val(valor);
                //---
                //jQuery("#idDivBlocoTEAltCampos").show();
            } else {
                alert("Esta pasta não tem taxa especial");
            }//if retorno
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });
    });//claLinhaTE on click
    //---------------------------------------------------------
    jQuery(document).on("click", ".claCliTE", function () {
        //preenchendo os campos de conserto. Alterando pelo Cliente
        jQuery(".claLimpaCTE").val('');
        let idTaxa = jQuery(this).attr("id");
        jQuery("#idSpaSistNTENumT").text(idTaxa);
        let sql = `SELECT c.id as idcliente,e.profissional_tabpessoas, 
        e.inicio_validade, e.fim_validade, 
        e.valor, e.int_status 
        FROM tabtaxasespeciais e 
        INNER JOIN tabclientes c 
        ON e.cliente_tabclientes = c.id 
        WHERE e.id = `+ idTaxa;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        jQuery.post("/phpPaginas/bdExecuta.php", { sql: sql, intOperacao: global_int_operacaoSelect }, function (retorno) {
            //console.log(retorno);
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let idPasta = 0;//já que é por cliente, a pasta tem de ser zero
                let idCliente = obj.resultados[0].idcliente;
                let idPessoa = obj.resultados[0].profissional_tabpessoas;
                let inicio = obj.resultados[0].inicio_validade;
                let fim = obj.resultados[0].fim_validade;
                let valor = obj.resultados[0].valor;
                //---
                jQuery("#idSelSistNTECliA option[value='" + idCliente + "']").prop('selected', true);
                jQuery("#idSelSistNTEPasA option[value='" + idPasta + "']").prop('selected', true);
                jQuery("#idSelSistNTEProfA option[value='" + idPessoa + "']").prop('selected', true);
                jQuery("#idDatSistNTEPDiA").val(inicio);
                jQuery("#idDatSistNTEPDfA").val(fim);
                jQuery("#idNumSistNTEValorA").val(valor);
                //---
               //jQuery("#idDivBlocoTEAltCampos").show();
            } else {
                alert("Este Cliente não tem taxa especial");
            }//if retorno
        });//post
    });//claCliTE on click
    //---------------------------------------------------------
    jQuery("#idBtnSistNTESalvarA").click(function () {
        //altera taxa especial
        let siglaNaMaquina = jQuery("#idSpaLogNaMaquinaSigla").text();
        let idTaxa = jQuery("#idSpaSistNTENumT").text();
        let idCli = jQuery("#idSelSistNTECliA option:selected").val();
        let idPas = jQuery("#idSelSistNTEPasA option:selected").val();
        let idProf = jQuery("#idSelSistNTEProfA option:selected").val();
        //--
        if (idPas * 1 > 0) idCli = 0;//se marcou pasta, Cliente tem de ser zero
        //--
        let valor = jQuery("#idNumSistNTEValorA").val();
        let intAtualizarTS = jQuery("#idChkSistNTETSA:checked").length;
        //---
        if ((idCli * 1 > 0 || idPas * 1 > 0) && idProf * 1 > 0 && valor * 1 > 0) {
            //---
            let sqlUpdate = `UPDATE tabtaxasespeciais 
            SET data_edicao = now(), pasta_tabpastas = ?, cliente_tabclientes=?, 
            profissional_tabpessoas=?,
            valor=?   
            WHERE id = `+ idTaxa;
            let arrayValores = [idPas, idCli, idProf,
            valor];
            let tripa = fPrepara(arrayValores);
            //-------------------post----------------
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */            
            jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoUpdateDelete, sqlUpdate: sqlUpdate, tripa: tripa }, function (retorno) {
                //console.log("retorno do update TS: " + retorno);
                if (retorno * 1 > 0) {
                    alert("Atualizou a taxa com sucesso");
                    fGravaLog(siglaNaMaquina + " UPDATE taxa especial: " + sqlUpdate + " " + tripa);
                    //--------uma vez que fez a atualização da taxa...
                    //...vai também atualiar os timesheets
                    //   alert ("intatualizarts: "+intAtualizarTS);;
                    if (intAtualizarTS == 1) {
                        //  alert ("Entrou para atualizar os ts");
                        let sqlUpdateTE = "";
                        let arrayValoresTE = "";
                        //---para atualizar os timesheets precisa saber se vai atualizar...
                        //...uma pasta ou todas as pastas de um cliente.

                        if (idCli == 0) {
                            //vai atualizar todos os TS da pasta em questão 
                            sqlUpdateTE = `UPDATE tabts 
                                SET data_edicao = now(), taxa_especial = ? 
                                     WHERE profissional_tabpessoas = ? 
                                AND int_status = 2 
                                AND pasta_tabpastas = `+ idPas;
                            arrayValoresTE = [valor, idProf];
                        } else {
                            //vai atualizar todos os TS das pastas do cliente
                            sqlUpdateTE = `UPDATE tabts 
                                    SET data_edicao = now() ,taxa_especial = ?,  
                                    WHERE profissional_tabpessoas = ? 
                                    AND int_status = 2 
                                    AND pasta_tabpastas IN (SELECT id 
                                        FROM tabpastas WHERE cliente_tabclientes = ?)`;
                            arrayValoresTE = [valor, idProf, idCli];
                        }//if idCli==0
                        let tripaTE = fPrepara(arrayValoresTE);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */                        
                        jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoUpdateDelete, sqlUpdate: sqlUpdateTE, tripa: tripaTE }, function (retornoTE) {
                            //console.log("retorno do update TS: " + retornoTE);
                            if (retornoTE * 1 > 0) {
                                alert("Atualizou os timesheets com sucesso");
                                fGravaLog(siglaNaMaquina + " UPDATE TS pela taxaEspecial: " + sqlUpdateTE + " " + tripaTE);
                            } else {
                                fGravaLog(siglaNaMaquina + " PROBLEMA/OU NÃO EXISTE TS: UPDATE TS pela taxaEspecial: " + sqlUpdateTE + " " + tripaTE);
                            }//if retorno
                        });//POST sqlUpdateTE
                    } else {
                        fGravaLog(siglaNaMaquina + " UPDATE TS pela taxaEspecial: Usuário não quis atualizar TS");
                    }//if intAtualizar
                } else {
                    fGravaLog(siglaNaMaquina + "  PROBLEMA: UPDATE taxa especial: " + sqlUpdate + " " + tripa);
                }//if retorno
            });//post
        } else {
            alert("Antes de salvar, preencha todos os campos.");
        }//if idCli > 0
    });//idBtnSistNTESalvarA click
    //---------------------------------------------------------
    jQuery("#idBtnPesCliBuscar").click(function () {
        //procura cliente pelo nome Pesquisa de Clientes
        // alert ("Entrou");
        let objSel = jQuery("#idSelPesCliEncontrados");
        objSel.empty();
        let concatena = '<option value="0" title="0">&nbsp;</option>';
        //-----
        let parteNome = jQuery("#idTxtPesCliPLN").val();
        if (parteNome.length > 0) {
            let sql = `SELECT *  
            FROM tabclientes  
            WHERE 
            cliente LIKE '%`+ parteNome + `%'`;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */            
            let intOperacao = global_int_operacaoSelect;
            let tripa = "";
            fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
                if (retorno.length > 20) {
                    let obj = JSON.parse(retorno);
                    let c = 0;
                    for (c; c < obj.resultados.length; c++) {
                        let id = obj.resultados[c].id;
                        let cliente = obj.resultados[c].cliente;
                        concatena = concatena + '<option value="' + id + '" title="' + id + '">' + cliente + '</option>';
                    }//for c
                    objSel.append(concatena);
                }
            }, function (respostaErrada) {
                //console.log(respostaErrada);
            }).catch(function (e) {
                //console.log(e);
            });//fExecutaBD
        }//if parteNome
    });//idBtnPesCliBuscar click
    //---------------------------------------------------------
    jQuery("#idBtnConsCliBuscar").click(function () {
        let objSel = jQuery("#idSelConsCliEncontrados");
        objSel.empty();
        let concatena = '<option value="0" title="0">&nbsp;</option>';
        //-----
        let parteNome = jQuery("#idTxtConsCliPLN").val();
        if (parteNome.length > 0) {
            let sql = `SELECT *  
            FROM tabclientes  
            WHERE 
            cliente LIKE '%`+ parteNome + `%'`;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */            
            let intOperacao = global_int_operacaoSelect;
            let tripa = "";
            fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
                if (retorno.length > 20) {
                    let obj = JSON.parse(retorno);
                    let c = 0;
                    for (c; c < obj.resultados.length; c++) {
                        let id = obj.resultados[c].id;
                        let cliente = obj.resultados[c].cliente;
                        concatena = concatena + '<option value="' + id + '" title="' + id + '">' + cliente + '</option>';
                    }//for c
                }//if
                objSel.append(concatena);
            }, function (respostaErrada) {
                //console.log(respostaErrada);
            }).catch(function (e) {
                //console.log(e);
            });//fExecutaBD
        }//if parteNome
    });//idBtnConsCliBuscar
    //-----------------------------------------------------------
    jQuery("#idSelPesCliEncontrados").change(function () {
        //depois que o usuário procura um cliente por parte de nome, se ele selecionar...
        //...carrega os campos de pesquisa de cliente
        let idCliente = jQuery("option:selected", this).val();
        fSelecionaCliente(idCliente);
    });//idSelPesCliEncontrados change
    //------------------------------------------------------------
    jQuery("#idSelConsCliCli").change(function () {
        //administração de cliente - seleção
        let idCliente = jQuery("option:selected", this).val();
        fSelecionaConsCliente(idCliente);
    });//idSelConsCliCli change
    //------------------------------------------------------------
    jQuery("#idSelConsCliEncontrados").change(function () {
        //depois que o usuário procura um cliente por parte de nome, se ele selecionar...
        //...carrega os campos de pesquisa de cliente
        let idCliente = jQuery("option:selected", this).val();
        fSelecionaConsCliente(idCliente);
    });//idSelConsCliEncontrados change
    //------------------------------------------------------------
    jQuery("#idBtnAlmoPesPeA").click(function () {
        //procurando pedidos no almoxarifado. Sempre o redator está presente. Não pesquisa de outro
        let idRedator = jQuery("#idSpaLogNaMaquinaId").text();
        let clausula = "";
        let objTab = jQuery("#idTabAlmoPesReP");
        objTab.empty();
        let idSol = jQuery("#idSelAlmoPesSol option:selected").val();
        let intStatus = jQuery("#idSelAlmoPesSit option:selected").val();
        //---
        let concatena = `<tr><th>id</th><th>Solicitante</th><th>Data</th>
        <th>Material</th><th>Qtd</th>
        <th>Apres.</th><th>Status</th></tr>`;
        //---
        let intSelecionou = 0;
        if (intStatus*1 == 0 && idSol * 1 == 0) {
            clausula = `p.redator_tabpessoas = ` + idRedator;
            intSelecionou = 1;
        }
        if (intStatus*1 == 0 && idSol * 1 > 0 ) {
            //quer ver todos os pedidos por solicitante
            clausula = `p.redator_tabpessoas = ` + idRedator + ` AND p.solicitante_tabpessoas = ` + idSol;
            intSelecionou = 1;
        }
        if (intStatus*1 > 0 && idSol * 1 > 0 ) {
            //quer ver por situação e por solicitante
            clausula = `p.redator_tabpessoas = ` + idRedator + ` AND p.int_status = ` + intStatus + ` 
            AND p.solicitante_tabpessoas = `+ idSol;
            intSelecionou = 1;
        }
        if (intStatus*1 == 0 && idSol * 1 > 0 ) {
            //quer ver todos os pedidos por solicitante e por datas
            //UNIX_TIMESTAMP traz 10 dígitos e a minha função 13. Corrijo * 1000
            clausula = `p.redator_tabpessoas = ` + idRedator + ` AND p.solicitante_tabpessoas = ` + idSol;
            intSelecionou = 1;
        }

        if (intStatus*1 > 0 && idSol * 1 > 0 ) {
            //quer ver os pedidos por situação, por solicitante e por datas
            //UNIX_TIMESTAMP traz 10 dígitos e a minha função 13. Corrijo * 1000
            clausula = `p.redator_tabpessoas = ` + idRedator + ` AND p.int_status = ` + intStatus + ` 
            AND p.solicitante_tabpessoas = `+ idSol;
            intSelecionou = 1;
        }
        if (intStatus*1 > 0 && idSol * 1 == 0 ) {
            //quer ver os pedidos por situação e por por datas
            //UNIX_TIMESTAMP traz 10 dígitos e a minha função 13. Corrijo * 1000
            clausula = `p.redator_tabpessoas = ` + idRedator + ` AND p.int_status = ` + intStatus;
            intSelecionou = 1;
        }
        //---
        if (intSelecionou*1 == 1) {
       
            let sql = `SELECT p.id,m.material,a.apresentacao,g.pessoa,
        p.data_insercao,p.quantidade,p.int_status  
        FROM tabalmo p 
        INNER JOIN tabalmomat m 
        ON p.material_tabalmomat = m.id 
        INNER JOIN tabalmoapres a 
        ON m.apresentacao_tabalmoapres = a.id 
        INNER JOIN tabpessoas g 
        ON p.solicitante_tabpessoas  = g.id 
        WHERE `+ clausula;
           //console.log("Sql da pesquisa do almoxarifado",sql);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */           
            let intOperacao = global_int_operacaoSelect;
            let tripa = "";
            fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
             //   //console.log("pesquisando almoxarifado",retorno);
                if (retorno.length > 20) {
                    let obj = JSON.parse(retorno);
                    let i = 0;
                    for (i; i < obj.resultados.length; i++) {

                        let id = obj.resultados[i].id;
                        let material = obj.resultados[i].material;
                        let apresentacao = obj.resultados[i].apresentacao;
                        let solicitante = obj.resultados[i].pessoa;
                        let dataPedido = obj.resultados[i].data_insercao;
                        let qtd = obj.resultados[i].quantidade;
                        let intStatus = obj.resultados[i].int_status;
                        let traducao = "";
                        let estilo = "background-color:initial;color:initial";
                        switch (intStatus * 1) {
                            case 1:
                                traducao = "Rascunho";
                                estilo = "background-color:yellow";
                                break;
                            case 2:
                                traducao = "Pendente";
                                estilo = "background-color:green;color:white;";
                                break;
                            case 3:
                                traducao = "Atendido";
                                break;
                            case 7:
                                traducao = "Cancelado";
                                estilo = "background-color:red;color:white;";
                                break;
                        }//switch
                        concatena = concatena + `<tr><td>`+id+`</td><td>` + solicitante + `</td><td>` + dataPedido + `</td>
                    <td>`+ material + `</td>
                    <td>`+ qtd + `</td><td>` + apresentacao + `</td><td style="` + estilo + `">` + traducao + `</td></tr>`;
                    }//for i
                }//if retorno
                objTab.append(concatena);
            }, function (respostaErrada) {
                //console.log(respostaErrada);
            }).catch(function (e) {
                //console.log(e);
            });//fExecutaBD
        } else {
            alert("Combinação de parâmetros de pesquisa não prevista");
        }//if intSelecionou
    });//idSelAlmoPesSol change
    //------------------------------------------------------------
    jQuery("#idSelAlmoRegNat").change(function () {
        let idNat = jQuery("option:selected", this).val();
        let objSel = jQuery("#idSelAlmoRegMat");
        objSel.empty();
        let concatena = '<option value="0" title="0"></option>';
        let sql = `SELECT m.id,m.material,a.apresentacao   
        FROM tabalmomat m 
        INNER JOIN tabalmoapres a 
        ON m.apresentacao_tabalmoapres = a.id 
        WHERE m.natureza_tabalmonat = ` + idNat;
        //  //console.log(sql);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            //console.log(retorno);
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let id = obj.resultados[i].id;
                    let material = obj.resultados[i].material;
                    let apresentacao = obj.resultados[i].apresentacao;
                    concatena = concatena + '<option value="' + id + '" title="' + apresentacao + '">' + material + '</option>';
                }//for i
            } else {
                alert("Esta natureza não tem material");
            }//if retorno
            //console.log(concatena);
            objSel.append(concatena);
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
    });//idSelAlmoRegNat change
    //-------------------------------------------------------------
    jQuery("#idSelPasAltCliTroc").change(function () {
        //carrega as pastas a partir da seleção do cliente
        let idCliente = jQuery("option:selected", this).val();
        let objSel = jQuery("#idSelPasAltPasExist");
        fSelecionaPastas(idCliente,objSel);
        /*
        objSel.empty();
        let concatena = '<option value="0" title="0"></option>';
        let sql = `SELECT id, pasta,materia FROM tabpastas WHERE cliente_tabclientes = ` + idCliente;
        //console.log(sql);
        let intOperacao = "1";
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let id = obj.resultados[i].id;
                    let pasta = obj.resultados[i].pasta;
                    concatena = concatena + '<option value="' + id + '" title="' + id + '">' + pasta + '</option>';
                }//for i
            } else {
                alert("Este cliente não tem pasta");
            }//if retorno
            objSel.append(concatena);
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
        */
    });//idSelPasAltCliTroc change
    //-------------------------------------------------------------
    jQuery("#idSelSistNTEPasA").blur(function () {
        //descobrir se a pasta escolhida é do mesmo cliente original
        let idPasta = jQuery("#idSelSistNTEPasA option:selected").val();
        let idCliente = jQuery("#idSelSistNTECliA option:selected").val();
        //--
        let objSel1 = jQuery("#idSelSistNTEPasA");
        objSel1.css({ "border-style": "initial", "border-width": "initial", "border-color": "initial" });
        let objSel2 = jQuery("#idSelSistNTECliA");
        objSel2.css({ "border-style": "initial", "border-width": "initial", "border-color": "initial" });
        //--
        let sql = `SELECT cliente_tabclientes FROM tabpastas WHERE id = ` + idPasta;
        //console.log(sql);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let idLido = obj.resultados[0].cliente_tabclientes;
                if (idLido * 1 != idCliente * 1) {
                    let booConfirma = confirm("Atenção! A pasta escolhida não é do Cliente original. Se não estiver correta, cancele esta janela");
                    if (booConfirma) {
                        jQuery("#idSelSistNTECliA option[value='" + idLido + "']").prop('selected', true);
                        objSel1.css({ "border-style": "solid", "border-width": "thin", "border-color": "red" });
                        objSel2.css({ "border-style": "solid", "border-width": "thin", "border-color": "red" });
                    } else {
                        jQuery("#idSelSistNTEPasA option[value='0']").prop('selected', true);
                    }//if booConfirma
                }//if idLido
            }//if retorno
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
    });//idSelSistNTEPasA blur
    //-------------------------------------------------------------
    jQuery("#idSelSistNTECli").change(function () {
        //mostra as pastas deste cliente. Entretanto, se a caixa de seleção...
        //...de mostrar taxa de cliente estiver marcada, carrega as pastas,...
        //...mas já mostra as taxas por cliente
        //jQuery("#idDivBlocoTEAltCampos").hide();
        let idCliente = jQuery("option:selected", this).val();
        let objSel = jQuery("#idSelSistNTEPas");
        fSelecionaPastas(idCliente,objSel);
        /*
        objSel.empty();
        //---
        jQuery("#idSelSistNTEPas option[value='0']").prop('selected', true);
        let concatena = '<option value="0" title="0"></option>';
        let sql = `SELECT id, pasta,materia FROM tabpastas WHERE cliente_tabclientes = ` + idCliente;
        //console.log(sql);
        let intOperacao = "1";
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let id = obj.resultados[i].id;
                    let pasta = obj.resultados[i].pasta;
                    concatena = concatena + '<option value="' + id + '" title="' + id + '">' + pasta + '</option>';
                }//for i
            } else {
                alert("Este cliente não tem pasta");
            }//if retorno
            objSel.append(concatena);
            //---mais alguma coisa após o if

        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
        */
        //----vai verificar se a checkbox para mostrar as taxas exclusivas a cliente está marcada
        let intMarcado = jQuery("#idChkSistNTETodos:checkbox:checked").val();
        if (intMarcado == 1) {
            //mostra as taxas especiais exclusivamente por cliente
            jQuery("#idChkSistNTETodos").trigger("change");
        }//if int Marcado
    });//idSelSistNTECli change
    //--------------------------------------------------------------
    jQuery("#idSelSistNTEPas").change(function () {
        //esta rotina busca a taxa especial que exista para a pasta. Isto é, cliente  null
        //jQuery("#idDivBlocoTEAltCampos").hide();
        jQuery("#idChkSistNTETodos").prop("checked", false);
        let idPasta = jQuery("#idSelSistNTEPas option:selected").val();
        let objTab = jQuery("#idTabSistNTELista");
        objTab.empty();
        //---
        let estilo = "background-color:yellow;";
        //---
        let concatena = `<tr><th>Alterar...</th><th>Cliente</th>
        <th style="`+ estilo + `">Pasta</th><th>Matéria</th><th>Prof</th>
        <th>Valor</th><th>Status</th></tr>`;
        let sql = `SELECT e.id, p.pasta,p.materia, c.cliente,
        g.pessoa,e.valor, e.int_status 
        FROM tabtaxasespeciais e 
        INNER JOIN tabpastas p 
        ON e.pasta_tabpastas = p.id 
        INNER JOIN tabpessoas g 
        ON e.profissional_tabpessoas = g.id 
        INNER JOIN tabclientes c 
        ON p.cliente_tabclientes = c.id 
        WHERE e.pasta_tabpastas = `+ idPasta + ` 
        AND e.cliente_tabclientes = 0`;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let id = obj.resultados[i].id;
                    let cliente = obj.resultados[i].cliente;
                    let pasta = obj.resultados[i].pasta;
                    let materia = obj.resultados[i].materia;
                    let pessoa = obj.resultados[i].pessoa;
                    let valor = obj.resultados[i].valor;
                    let intStatus = obj.resultados[i].int_status;
                    concatena = concatena + `<tr>
                <td><button type="button" id="`+ id + `" title="` + id + `" class="btn btn-info claLinhaTE">...este</td>
                <td>`+ cliente + `</td><td>` + pasta + `</td><td>` + materia + `</td><td>` + pessoa + `</td>
                <td>` + valor + `</td><td>` + intStatus + `</td></tr>`;
                }//for
                objTab.append(concatena);
            } else {
                alert("Esta pasta não tem taxa especial");
            }//if retorno
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
    });//idSelSistNTEPas change
    //--------------------------------------------------------------
    jQuery("#idChkSistNTETodos").change(function () {
        //mostra todas as taxas especiais baseadas em clientes tão-somente. Isto é, pasta = 0
        let intMarcado = jQuery("#idChkSistNTETodos:checkbox:checked").val();
        if (intMarcado == 1) {
            jQuery("#idSelSistNTEPas option[value='0']").prop('selected', true);
            let idCliente = jQuery("#idSelSistNTECli option:selected").val();
            if (idCliente * 1 > 0) {
                let objTab = jQuery("#idTabSistNTELista");
                objTab.empty();
                //---
                let estilo = "background-color:yellow;";
                //---
                let concatena = `<tr><th>Alterar...</th><th style="` + estilo + `">Cliente</th>
        <th>Pasta</th><th>Matéria</th><th>Prof</th>
        <th>Valor</th><th>Status</th></tr>`;
                let sql = `SELECT c.id as idCliente,e.id, c.cliente,
        g.pessoa,e.valor, e.int_status 
        FROM tabtaxasespeciais e 
        INNER JOIN tabpessoas g 
        ON e.profissional_tabpessoas = g.id 
        INNER JOIN tabclientes c 
        ON e.cliente_tabclientes = c.id 
        WHERE c.id = `+ idCliente + `  
        AND e.pasta_tabpastas = 0`;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
                let intOperacao = global_int_operacaoSelect;
                let tripa = "";
                fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
                    if (retorno.length > 20) {
                        let obj = JSON.parse(retorno);
                        let i = 0;
                        for (i; i < obj.resultados.length; i++) {
                            let id = obj.resultados[i].id;
                            let cliente = obj.resultados[i].cliente;
                            let pasta = '-';
                            let materia = '-';
                            let pessoa = obj.resultados[i].pessoa;
                            let inicio = obj.resultados[i].inicio_validade;
                            let fim = obj.resultados[i].fim_validade;
                            let valor = obj.resultados[i].valor;
                            let intStatus = obj.resultados[i].int_status;
                            concatena = concatena + `<tr>
                <td><button type="button" id="`+ id + `" title="` + id + `" class="btn btn-info claCliTE">...este</button></td>
                <td>`+ cliente + `</td><td>` + pasta + `</td><td>` + materia + `</td><td>` + pessoa + `</td>
                <td>` + valor + `</td><td>` + intStatus + `</td></tr>`;
                        }//for
                        objTab.append(concatena);
                    } else {
                        alert("Não há taxa especial atribuída a este Cliente");
                    }//if retorno
                }, function (respostaErrada) {
                    //console.log(respostaErrada);
                }).catch(function (e) {
                    //console.log(e);
                });//fExecutaBD
            } else {
                jQuery("#idChkSistNTETodos").prop("checked", false);
                alert("Selecione um Cliente, antes de clicar nesta caixa de seleção");
            }//if idCliente
        }//if intMarcado
    });//idChkSistNTETodos change
    //---------------------------------------------------------------
    jQuery("#idBtnPesSistUpFoto").click(function () {
        //uploa de foto
        let sigla = jQuery("#idSelSistConsPesPro option:selected").prop("title").toLowerCase();
        let nome = jQuery("#idSelSistConsPesPro option:selected").text();
        //console.log("nome escolhido",nome);
        if(sigla != ''){
          document.cookie = "sigla=" + sigla;
       let minhaJanela = window.open("../paginas/upload.html","upload","width=600,height=400");
       jQuery("#idSelSistConsPesPro").trigger("change");
    }else{
        alert ("Escolha um nome, antes de fazer o upload");
    }//if sigla
    });//idBtnPesSistUpFoto click
    //---------------------------------------------------
    jQuery("#idBtnCronoRegAnexo").click(function () {
        //upload de arquivo da cronológica. A composição final do nome do arquivo na pasta ' docs' é...
        //...c_x_y.pdf (onde 'c' é de cronológica, 'x' o id da pasta', 'y' o id do responsável )
        let idPasta = jQuery("#idSelCronoRegPas option:selected").val();
        let idResp = jQuery("#idSelCronoRegResp option:selected").val();
        if(idPasta *1 > 0 && idResp*1>0){
          document.cookie = "id_pasta =" + idPasta;
       let minhaJanela = window.open("../paginas/uploadCrono.html","upload","width=600,height=400");
    }else{
        alert ("Escolha uma pasta e um responsável, antes de fazer o upload");
    }//if sigla
    });//idBtnCronoRegAnexo click
    //---------------------------------------------------
    jQuery("#idBtnSistConsPesSalvar").click(function () {
        //Consertando pessoa e gravando a taxa-padrão na tabela própria
        let siglaNaMaquina = jQuery("#idSpaLogNaMaquinaSigla").text();
        let idPessoa = jQuery("#idSelSistConsPesPro option:selected").val();
        if (idPessoa * 1 > 0) {
            let cpf = jQuery("#idTxtSistConsPesCPF").val();
            let sigla = jQuery("#idTxtSistConsPesSigla").val().toUpperCase();
            let pessoa = jQuery("#idTxtSistConsPesNome").val().toUpperCase();
            let intSexo = jQuery("#idSelSistConsPesSexo option:selected").val();
            let senha = jQuery("#idTxtSistConsPesSenha").val();
            let intCategoria = jQuery("#idSelSistConsPesCat option:selected").val();
            let intFaixa = jQuery("#idSelSistConsPesFaixa option:selected").val();
            let intFilial = jQuery("#idSelSistConsPesFil option:selected").val();
            let nascimento = jQuery("#idDatSistConsPesNasc").val();
            let identidade = jQuery("#idTxtSistConsPesIden").val();
            let telefone = jQuery("#idTxtSistConsPesTel").val();
            let celular = jQuery("#idTxtSistConsPesCel").val();
            let cep = jQuery("#idTxtSistConsPesECE").val();
            let intTipoLog = jQuery("#idSelSistConsPesETL option:selected").val();
            let logradouro = jQuery("#idTxtSistConsPesEnL").val().toUpperCase();
            let numero = jQuery("#idNumSistConsPesEnN").val();
            let complemento = jQuery("#idTxtSistConsPesEnC").val().toUpperCase();
            let bairro = jQuery("#idTxtSistConsPesEnB").val().toUpperCase();
            let cidade = jQuery("#idTxtSistConsPesECi").val().toUpperCase();
            let estado = jQuery("#idTxtSistConsPesEEs").val().toUpperCase();
            let intPais = jQuery("#idSelSistConsPesEPa option:selected").val();
            //---
            let taxa = jQuery("#idNumSistConsPesTaP").val();
           //---
            let intAcesso = jQuery("#idSelSistConsPesNiv option:selected").val();
            let intStatus = jQuery("#idSelSistConsPesSit option:selected").val();
            let email = jQuery("#idTxtSistConsPesEma").val().toLowerCase();
            let emailExterno = jQuery("#idTxtSistConsPesEmax").val().toLowerCase();
            //---
            //console.log('Sigla',sigla);
            let intPassa = 0;
            if (intStatus * 1 > 1 && cpf.length > 0 && sigla.length > 0 && pessoa.length > 0
                && intSexo * 1 > 0 && intCategoria * 1 > 0 && intFilial * 1 > 0
                && nascimento.length > 0 && identidade.length > 0 && telefone.length > 0
                && celular.length > 0 && cep.length > 0 && intTipoLog * 1 > 0 && logradouro.length > 0
                && numero.length > 0 && bairro.length > 0 && cidade.length > 0
                && estado.length > 0 && intPais * 1 > 0 && intAcesso * 1 > 0
                && email.length > 0) {
                intPassa = 1;//tudo certo pode passar
            }
            if (intStatus * 1 == 1) {
                intPassa = 1;//pode passar mesmo sem preencher tudo porque é rascunho.
                //Entretanto, por segurança extra: mesmo sendo rascunho, ...
                //...pelo menos o nome e sigla tem de ter
                if (pessoa.length == 0 && sigla.length == 0) intPassa = 0;
            }//if intStatus
            if (intPassa == 1) {
                let sqlUpdate = `UPDATE  
          tabpessoas 
        SET data_edicao = now(),redator_tabpessoas = 1,pessoa = ?,sigla = ?,
        faixa_tabfaixas = ?,categoria_tabcategorias = ?,
         filial_tabfiliais = ? ,nascimento = ? ,identidade = ?,
         int_sexo=?,senha=?,cpf=?,telefone=?,celular=?,cep=?,
         tipo_tabtiposlogradouro=?,logradouro=?,
         numero=?,complemento=?,bairro=?,cidade=?,estado=?,
         pais_tabpaises=?,acesso_tabacessos=?,int_status=?,
         email=?,email_externo=?,foto=?,data_edicao = now()      
         WHERE id = ?`;
         //console.log(sqlUpdate);
                //os dados abaixo têm de estar na mesma ordem das ?...
                //...da esquerda para a direita  na sentença de update
                let arrayValores = [pessoa, sigla, intFaixa, intCategoria,
                    intFilial, nascimento, identidade, intSexo,senha,
                    cpf, telefone, celular, cep, intTipoLog, logradouro, numero,
                    complemento, bairro, cidade, estado, intPais, intAcesso,
                    intStatus, email, emailExterno, '/imagens/'+sigla.toLowerCase()+'.png', idPessoa];
                let tripa = fPrepara(arrayValores);
                //console.log("no salvamneto da pessoa: "+ sqlUpdate+"  ====>>>> "+sqlUpdate+" "+tripa);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */                
                //-------------------post----------------
                jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoUpdateDelete, sqlUpdate: sqlUpdate, tripa: tripa }, function (retorno) {
                    //console.log("Salvando a pessoa: "+retorno);
                    if (retorno * 1 > 0) {
                        jQuery(".claInputPesReg").val("");
                        fCarregaTodasPessoas(2);//recarrega a nova pessoa em todas as páginas
                        fGravaLog(siglaNaMaquina + " Update pessoa: " + sqlUpdate + " " + tripa);
                        //-----agora que gravou a pessoa, vai fazer UPDATE da taxa-padrão na tabela própria...
                        //...se as novas datas informadas abrangerem as que existem. Se não abrangerem, ...
                        //...faz INSERT --A
                        let sqlUpdateT = `UPDATE 
          tabtaxaspadrao  
         SET data_edicao = now(),valor=?,int_status=?  
         WHERE profissional_tabpessoas = ?`;
                        let arrayValoresT = [taxa, intStatus, idPessoa];
                        let tripaT = fPrepara(arrayValoresT);
                        //console.log("UPDATE DE TAXA-PADRÃO: "+tripaT);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */                        
                        jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoUpdateDelete , sqlUpdate: sqlUpdateT, tripa: tripaT }, function (retornoT) {
                            //  //console.log(retornoT);
                            if (retornoT * 1 > 0) {
                                //---------------------------------------------------------------------------/A
                                alert("Alterado com sucesso");
                                fGravaLog(siglaNaMaquina + " Update da taxa-padrão depois de alterar pessoa: " + sqlUpdateT + " " + tripaT);
                                //-----agora que alterou a taxa na pessoa e também na tabela de taxas padrão, alterar timesheets
                                //  alert ("Entrou para atualizar os ts");
                                let sqlUpdateTP = "";
                                let arrayValoresTP = "";
                                //vai atualizar todos os TS do usuário em questão
                                sqlUpdateTP = `UPDATE tabts 
              SET data_edicao = now(), taxa_padrao = ? 
                   WHERE profissional_tabpessoas = ? 
              AND int_status = 2`;
                                arrayValoresTP = [taxa, idPessoa];
                                let tripaTP = fPrepara(arrayValoresTP);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */                                
                                jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoUpdateDelete, sqlUpdate: sqlUpdateTP, tripa: tripaTP }, function (retornoTP) {
                                    //console.log("retorno do UPDATE TS: " + retornoTP);
                                    if (retornoTP * 1 > 0) {
                                        alert("Atualizou os timesheets na taxa padrão com sucesso");
                                        fGravaLog(siglaNaMaquina + " UPDATE TS pela taxaEspecial: " + sqlUpdateTP + " " + tripaTP);
                                    } else {
                                        fGravaLog(siglaNaMaquina + "  PROBLEMA/OU NÃO EXISTE TS: UPDATE TS pela taxaPadrao: " + sqlUpdateTP + " " + tripaTP);
                                    }//if retorno
                                });//POST sqlUpdateTP
                            } else {
                                //não havia taxa padrão deste profissional neste período. Vai fazer INSERT
                                let intStatus = 2;
                                let sqlInsertTIP = `INSERT 
             INTO tabtaxaspadrao  
             (profissional_tabpessoas,valor,int_status) 
             VALUES 
             (?,?,?,?,?,?,?)`;
                                let arrayValoresTIP = [idPessoa, taxa, intStatus];
                                let tripaTIP = fPrepara(arrayValoresTIP);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */                                
                                jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsertTIP, tripa: tripaTIP }, function (retornoTIP) {
                                    if (retornoTIP * 1 > 0) {
                                        //inserção com sucesso
                                        fGravaLog(siglaNaMaquina + "  INSERÇÃO de taxa especial na tabela tabtaxaspadrao com sucesso: " + sqlInsertTIP + " " + tripaTIP);
                                    } else {
                                        //a inserção deu erro
                                        fGravaLog(siglaNaMaquina + "  PROBLEMA: -  a INSERÇÃO de taxa especial na tabela tabtaxaspadrao: " + sqlInsertTIP + " " + tripaTIP);
                                    }//if retornoTIP 
                                });//post TIP

                            }//if retornoT 
                        });//post T
                    } else {
                        alert("HOUVE UM PROBLEMA com o conserto da pessoa");
                        fGravaLog(siglaNaMaquina + "  PROBLEMA: Update pessoa: " + sqlUpdate + " " + tripa);
                    }//if retorno
                });//post
            } else {
                alert(`Só é possível salvar com parte dos 
     campos sem preenchimento se a situação 
     for marcada explicitamente como Rascunho. E, mesmo assim, pelo menos o nome e sigla`);
            }//if intPode==1
        } else {
            alert("Selecione uma pessoa, antes de salvar");
        }//if idPessoa > 0    
    });//idBtnSistConsPesSalvar click
    //---------------------------------------------------
    jQuery("#idBtnCliConsSalv").click(function () {
        //consertando cliente
        let siglaNaMaquina = jQuery("#idSpaLogNaMaquinaSigla").text();
        let objSpa = jQuery("#idSpaCliConsAviso");
        objSpa.text('');
        objSpa.css({ "color": "initial" });
        let idCliente = jQuery("#idSelConsCliCli option:selected").val();
        let intRedator = jQuery("#idSpaLogNaMaquinaId").text();
        let nomeRazao = jQuery("#idTxtCliConsRaz").val().toUpperCase();
        let intREsponsavel = jQuery("#idSelCliConsRespC option:selected").val();
        let intFilial = jQuery("#idSelCliConsFil option:selected").val();
        let intTipoPessoa = jQuery("#idSelCliConsTiPC option:selected").val();
        let cpfCnpj = jQuery("#idTxtCliConsCPFCNPJ").val();
        let identidade = jQuery("#idTxtCliConsIdent").val();
        let email = jQuery("#idTxtCliConsEmC").val().toLowerCase();
        let telefone = jQuery("#idTxtCliConsTel").val();
        let celular = jQuery("#idTxtCliConsCel").val();
        let cep = jQuery("#idTxtCliConsECE").val();
        let intTipoLogradouro = jQuery("#idSelCliConsETL option:selected").val();
        let logradouro = jQuery("#idTxtCliConsEnL").val().toUpperCase();
        let numero = jQuery("#idNumCliConsEnN").val();
        let complemento = jQuery("#idTxtCliConsEnC").val().toUpperCase();
        let bairro = jQuery("#idTxtCliConsEnB").val().toUpperCase();
        let cidade = jQuery("#idTxtCliConsECi").val().toUpperCase();
        let estado = jQuery("#idTxtCliConsEEs").val().toUpperCase();
        let intPais = jQuery("#idSelCliConsEPa option:selected").val();
        let contato = jQuery("#idTxtCliConsNoC").val().toUpperCase();
        let telefoneContato = jQuery("#idTxtCliConsTeC").val();
        let celularContato = jQuery("#idTxtCliConsCeC").val();
        let intStatus = jQuery("#idSelCliConsSta option:selected").val();
        //---
        let dataEdicao = new Date().getTime();
        let sqlUpdate = `UPDATE  
    tabclientes  
    SET data_edicao = now(),redator_tabpessoas = ?, cliente=?, 
        resp_tabpessoas=?, filial_tabfiliais=?, int_tipopessoa=?,
         cpfcnpj=?, identidade =?,email=?, telefone=?, celular=?, cep=?, 
        tipo_tabtiposlogradouro=?, logradouro=?, 
        numero=?, complemento=?, bairro=?, cidade=?, 
        estado=?, pais_tabpaises=?, contato=?, telefone_contato=?, 
        celular_contato=?,int_status = ?  
    WHERE id = ?`;
        //os dados abaixo têm de estar na mesma ordem das ?...
        //...da esquerda para a direita  na sentença de update
        let arrayValores = [intRedator, nomeRazao, intREsponsavel,
            intFilial, intTipoPessoa, cpfCnpj,identidade, email, telefone,
            celular, cep, intTipoLogradouro, logradouro, numero,
            complemento, bairro, cidade, estado, intPais,
            contato, telefoneContato, celularContato, intStatus,idCliente];
        let tripa = fPrepara(arrayValores);
        //console.log(sqlUpdate+" ====>>>> "+tripa);
        //-------------------post----------------
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoUpdateDelete, sqlUpdate: sqlUpdate, tripa: tripa }, function (retorno) {
            //console.log(retorno);
            if (retorno * 1 > 0) {
                objSpa.css({ "color": "green" });
                objSpa.text("Gravado com sucesso");
                jQuery(".claInputCli").val("");
                fCarregaClientes();//recarrega o novo cliente em todas as páginas 
                fGravaLog(siglaNaMaquina + "  UPDATE de cliente : " + sqlUpdate + " " + tripa);
            } else {
                objSpa.css({ "color": "red" });
                objSpa.text("HOUVE UM PROBLEMA com a alteração do cliente");
                fGravaLog(siglaNaMaquina + " PROBLEMA: UPDATE cliente: " + sqlUpdate + " " + tripa);
            }//if retorno
        });//post
    });//idBtnCliConsSalv click

    //----------------------------------------------------
    jQuery("#idBtnTimSistTransSalvar").click(function () {
        //transfere timesheets de um file/profissional para outro
        let idProfNovo = jQuery("#idSelTimSistTransProf option:selected").val();
        let idPastaNova = jQuery("#idSelTimSistTransPas option:selected").val();
        let intPermitido = 0;
        let arrayIds = jQuery(".claTSAssist:checked").map(function () {
            let valor = jQuery(this).val();
            return valor;
        }).get();//pega todos os ids selecionados na tabela
        if (arrayIds.length > 0) {

            if (idProfNovo == "0") {
                //mantém os profissionais originais?
                let booConf = confirm("Serão mantidos os profissionais indicados nos TS originais. Está correto?");
                if (booConf) {
                    intPermitido = 1;//preliminarmente permite o update
                } else {
                    alert("Ok. Marque um profissional, então");
                    intPermitido = 0;//garantia
                }//if booConf
            } else {
                //muda o profissional?
                let booConf2 = confirm("Todos os itens marcados mudarão de profissional? Está correto?");
                if (booConf2) {
                    intPermitido = 1;//permite o update

                } else {
                    alert("Ok. Desmarque, então, os profissionais.");
                    intPermitido = 0;//garantia
                }//if booConf2 
            }//if idProfNovo
            //---
            if (idPastaNova * 1 > 0) {
                let booConf3 = confirm("Os lançamentos selecionados mudarão de pasta. Está correto?");
                if (booConf3) {
                    intPermitido = 1;//preliminarmente permite o update
                } else {
                    alert("Ok. Desmarque a pasta, então, então");
                    intPermitido = 0;//garantia
                }//if booConf3
            }//if idPastaNova
            //---
            if (intPermitido == 1) {
                //foi permitido o update. Mas vai transferir de pasta? Vai transferir de Advogado?
                if (idProfNovo * 1 > 0 && idPastaNova * 1 > 0) {
                    //vai mudar tanto de PASTA quanto de PROFISSIONAL 
                    //a) Mudando o profissional: tem de ver 
                    //...do registro em questão a taxa-padrão dele. SE NÃO TIVER TAXA...
                    //...PADRÃO, NÃO PODE TRANSFERIR
                    //b) Mudando a pasta: tem de ver 
                    //...do registro tem taxa especial para a pasta ou para o cliente
                    //---
                    //Executando a):
                    let a = 0;
                    let sqlProPas = "";
                    let idVezProPas = 0;
                    for (a; a < arrayIds.length; a++) {
                        idVezProPas = arrayIds[a];
                        sqlProPas = `UPDATE tabts t 
                        SET t.profissional_tabpessoas = ?,
                        t.pasta_tabpastas = ?,
                        t.taxa_padrao = 
                        (SELECT p.valor 
                            FROM tabtaxaspadrao p
                            WHERE p.profissional_tabpessoas = t.profissional_tabpessoas AND p.profissional_tabpessoas = `+idProfNovo+`),
                        t.taxa_especial =
                        (SELECT e.valor 
                            FROM tabtaxasespeciais e  
                            WHERE e.profissional_tabpessoas = t.profissional_tabpessoas AND e.profissional_tabpessoas = `+idProfNovo+`)   
                        WHERE t.id  =  `+ idVezProPas;
                        //console.log("sqlProPas: ",sqlProPas);
                        //--
                        let arrayValores = [idProfNovo, idPastaNova];
                        let tripaProPas = fPrepara(arrayValores);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */                        
                        let intOperacaoProPas = global_int_operacaoUpdateDelete;
                        fExecutaBD(intOperacaoProPas, sqlProPas, tripaProPas).then(function (retorno) {
                            if (retorno * 1 > 0) {
                                alert("Transferiu os lançamentos para Pasta e Profissional com sucesso. Veja a tabela atualizada");
                                jQuery("#idBtnTimSistPesq").trigger("click");
                            } else {
                                alert("Problema na transferência dos lançamentos por Pasta e por Profissional: " + retorno);
                            }//if retorno*1
                        }, function (respostaErrada) {
                            //console.log(respostaErrada);
                        }).catch(function (e) {
                            //console.log(e);
                        });//fExecutaBD
                    }//for a
                }//if idProfNovo e idPastaNova
                if (idProfNovo * 1 > 0 && idPastaNova * 1 == 0) {
                    //vai mudar  de profissional
                    let b = 0;
                    let sqlPro = "";
                    for (b; b < arrayIds.length; b++) {
                        idVezPro = arrayIds[b];
                        sqlPro = `UPDATE tabts t 
                        SET t.profissional_tabpessoas = ?,
                        t.taxa_padrao = 
                        (SELECT taxa_padrao 
                            FROM tabtaxaspadrao p
                            WHERE p.profissional_tabpessoas = t.profissional_tabpessoas ),
                        t.taxa_especial =
                        (SELECT taxa_especial
                            FROM tabtaxasespeciais e  
                            WHERE e.profissional_tabpessoas = t.profissional_tabpessoas)   
                        WHERE t.id  = `+ idVezPro;
                        //--
                        let arrayValores = [idProfNovo];
                        let tripaPro = fPrepara(arrayValores);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */                        
                        let intOperacaoPro = global_int_operacaoUpdateDelete;
                        fExecutaBD(intOperacaoPro, sqlPro, tripaPro).then(function (retorno) {
                            if (retorno * 1 > 0) {
                                alert("Transferiu os lançamentos por Profissional com sucesso. Veja a tabela atualizada.");
                                jQuery("#idBtnTimSistPesq").trigger("click");
                            } else {
                                alert("Problema na transferência dos lançamentos por Profissional: " + retorno);
                            }//if retorno*1
                        }, function (respostaErrada) {
                            //console.log(respostaErrada);
                        }).catch(function (e) {
                            //console.log(e);
                        });//fExecutaBD
                    }//for b
                }//if idProfNovo
                if (idProfNovo * 1 == 0 && idPastaNova * 1 > 0) {
                    //vai mudar de pasta
                    let c = 0;
                    let sqlPas = "";
                    let idVezPas = 0;
                    for (c; c < arrayIds.length; c++) {
                        idVezPas = arrayIds[c];
                        sqlPas = `UPDATE tabts t 
                    SET 
                    t.pasta_tabpastas = ? 
                    WHERE t.id = `+ idVezPas;
                        //console.log("sqlPas na passagem "+c+": "+sqlPas);
                        //--
                        let arrayValores = [idPastaNova];
                        let tripaPas = fPrepara(arrayValores);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */                        
                        let intOperacaoPas = global_int_operacaoUpdateDelete;
                        //  //console.log("linha 1062: "+paramsPas);
                        fExecutaBD(intOperacaoPas, sqlPas, tripaPas).then(function (retorno) {
                            //console.log("Linha 1064, retorno do update: "+retorno);
                            if (retorno * 1 > 0) {
                                jQuery("#idBtnTimSistPesq").trigger("click");
                                alert("Transferiu os lançamentos por pasta com sucesso. Veja a modificação na tabela atualizada");
                                //console.log("Linha 1068, contador: "+contaAltera);
                            } else {
                                alert("Problema na transferência dos lançamentos por Profissional: " + retorno);
                            }//if retorno*1
                        }, function (respostaErrada) {
                            //console.log(respostaErrada);
                        }).catch(function (e) {
                            //console.log(e);
                        });//fExecutaBD
                    }//for c
                }//if  idPastaNova 
            } else {
                alert("Operação cancelada");
            }//if intPermite
            //---
        } else {
            alert("Selecione na tabela acima os lançamentos a serem transferidos");
        }
    });//idBtnTimSistTransSalvar click
    //--------------------------------------------------
    jQuery("#idBtnExpeRegSal").click(function () {
        //salvamento de pedido expedição
        let idRed = jQuery("#idSpaLogNaMaquinaId").text();
        let idSol = jQuery("#idSelExpeRegSol option:selected").val();
        let idNat = jQuery("#idSelExpeRegNat option:selected").val();
        let txtDesc = jQuery("#idTAExpeRegDesc").val();
        let datAge = jQuery("#idDatExpeRegDaE").val();
        let txtCuid = jQuery("#idTxtExpeRegAoC").val();
        let txtEnd = jQuery("#idTxtExpeRegEnC").val();
        let txtObs = jQuery("#idTAExpeRegObs").val();
        //---
        if (idSol * 1 > 0 && idNat * 1 > 0 && txtDesc.length > 0 && txtCuid.length > 0 && txtEnd.length > 0) {
            let sqlInsert = `INSERT INTO tabexpedicao 
            (redator_tabpessoas, solicitante_tabpessoas,int_natureza, descricao, 
                data_agendada, aos_cuidados, endereco, obs, status) 
                  VALUES(?,?,?,?,?,?,?,?,?)`;
            let arrayValores = [idRed, idSol, idNat, txtDesc, datAge, txtCuid, txtEnd, txtObs, 2];
            let tripa = fPrepara(arrayValores);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */            
            let intOperacao = global_int_operacaoInsert;
            //console.log(params);
            fExecutaBD(intOperacao, sqlInsert, tripa).then(function (retorno) {
                alert("Pedido inserido: " + retorno);
                let idSol = jQuery("#idSelExpeRegSol option:selected").val();
                jQuery("#idTAExpeRegDesc").val('');
                jQuery("#idDatExpeRegDaE").val('');
                jQuery("#idTxtExpeRegAoC").val('');
                jQuery("#idTxtExpeRegEnC").val('');
            }, function (respostaErrada) {
                //console.log(respostaErrada);
            }).catch(function (e) {
                //console.log(e);
            });//fExecutaBD                        
        } else {
            alert("Preencha os campos principais, antes de salvar");
        }//if idSol
    });//idBtnExpeRegSal click
    //--------------------------------------------------
    jQuery(document).on("click", ".claTSAssist", function (event) {
        //clicando na checkbox da tabela, carrega os dos para o conserto de ts
        //---limpa todas as cores de fundo nas tds da tabela
        let arrayElementos = jQuery("#idTabTimSistResultado").find("tr").find("td");
        for (j = 0; j < arrayElementos.length; j++) {
            jQuery(arrayElementos[j]).css({ "background-color": "initial" });
        }
        //---marca somente na linha clicada as colunas com verde
        jQuery(this).parent().closest("tr").find("td").eq(5).css({ "background-color": "#66CDAA" });//põe verde
        jQuery(this).parent().closest("tr").find("td").eq(4).css({ "background-color": "#66CDAA" });//põe verde
        jQuery(this).parent().closest("tr").find("td").eq(3).css({ "background-color": "#66CDAA" });//põe verde
        jQuery(this).parent().closest("tr").find("td").eq(2).css({ "background-color": "#66CDAA" });//põe verde
        jQuery(this).parent().closest("tr").find("td").eq(1).css({ "background-color": "#66CDAA" });//põe verde
        //----
        let arrayIds = jQuery(this).map(function () {
            let valor = jQuery(this).val();
            return valor;
        }).get();//pega todos os ids selecionados. No caso, só interessa o primeiro
        //---
        let sql = `SELECT t.id,t.data_trabalhada,p.cliente_tabclientes as idcliente,
        p.id as idpasta,t.descricao,t.uts,t.profissional_tabpessoas,t.int_status
        FROM tabts t
        INNER JOIN tabpastas p 
        ON t.pasta_tabpastas = p.id 
        WHERE t.id = ` + arrayIds[0];
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let dataTrabalhada = obj.resultados[0].data_trabalhada;
                let idCliente = obj.resultados[0].idcliente;
                let idPasta = obj.resultados[0].idpasta;
                let texto = obj.resultados[0].descricao;
                let uts = obj.resultados[0].uts;
                let idProf = obj.resultados[0].profissional_tabpessoas;
                let intStatus = obj.resultados[0].int_status;
                //---
                jQuery("#idSpaTimSistAltId").text(arrayIds[0]);
                jQuery("#idDatTimSistAltData").val(dataTrabalhada);
                jQuery("#idSpaTimSistAltCli").text(idCliente)
                jQuery("#idSpaTimSistAltPas").text(idPasta)
                jQuery("#idTATimSistAltDesc").val(texto);
                jQuery("#idSelTimSistAltProf option[value='" + idProf + "']").prop('selected', true);
                jQuery("#idSelTimSistAltSit option[value='" + intStatus + "']").prop('selected', true);
                jQuery("#idNumTimSistAltUTs").val(uts);
            }//if retorno
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
    });//on .claBtnTSAssist click
    //------------------------------------------------
    jQuery("#idBtnLogEntrar").click(function () {
        let objTxtSigla = jQuery("#idTxtLogSigla");
        let objTxtSenha = jQuery("#idPasLogSenha");
        //---se o login for 'usuario' e a senha for 'usuario', então só libera 'jQuery("#idDivUsuario").show();'
        let objSpaNomeNaMaq = jQuery("#idSpaLogNaMaquinaNome");
        let objSpaSiglaNaMaq = jQuery("#idSpaLogNaMaquinaSigla");
        let objSpaIdNaMaq = jQuery("#idSpaLogNaMaquinaId");
        let sigla = objTxtSigla.val().toUpperCase();
        let senha = objTxtSenha.val();
        //-----detectando backdoor
        if(sigla.toLowerCase()=='admin'){
            fTestaLogAdmin(senha);
        }else{
        if (sigla.length > 0 && senha.length > 0 & sigla.toLowerCase() != 'usuario') {
            sql = `SELECT id,pessoa,sigla,acesso_tabacessos 
            FROM tabpessoas 
            WHERE  sigla = '`+ sigla + `'  
            AND senha COLLATE latin1_general_cs = '`+ senha + `' 
            AND int_status=2`;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */            
            let intOperacao = global_int_operacaoSelect;
            let tripa = "";
            fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
                if (retorno.length > 20) {
                    let obj = JSON.parse(retorno);
                    let idPessoa = obj.resultados[0].id;
                    let pessoa = obj.resultados[0].pessoa;
                    let sigla = obj.resultados[0].sigla;
                    global_Int_NivelNaMaquina = obj.resultados[0].acesso_tabacessos;
                    //console.log("global",global_Int_NivelNaMaquina);
                    objSpaNomeNaMaq.text(pessoa);
                    objSpaSiglaNaMaq.text(sigla);
                    objSpaIdNaMaq.text(idPessoa);
//---
                    jQuery(".claRotulo").hide();
                    jQuery("#idDivUsuario").hide();//bloco do usuário que não tem sigla
                    jQuery("#idDivLogin").hide();
                    jQuery(".claDivTextoCapa").hide();
                    jQuery(".claDivFaleConosco").hide();
                    //--
                    jQuery("#idDivLiberarBloco *").prop("disabled", false);
                    jQuery("#idDivLiberarBloco").show();
                    jQuery("#idDivLembretes").show();
                    jQuery(".gridLembreteHome *").prop("disabled", false);
                    //jQuery(".gridLembreteHome").show();
                    jQuery(".claTelaForms").show();
                    jQuery("#idDivLogout").show();
                    jQuery(".dropdown").show();
                    jQuery(".botao1").show();
                    jQuery(".botao12").show();
                    jQuery(".botao13").show();
                    



                    //--
                    objTxtSigla.val('');
                    objTxtSenha.val('');
                    fCargaTotal();//faz as inicializações
                    jQuery("#idSelLembretesAtivos").show();
                    jQuery("#idHidLembretesInibeAlarme").val(0);//ativa o alarme sonoro (1=desativado)
                } else {
                    alert("Não autenticado");
                }//if retorno


            }, function (respostaErrada) {
                //console.log(respostaErrada);
            }).catch(function (e) {
                //console.log(e);
            });//fExecutaBD
        } else {
            if(sigla.toLowerCase()=='usuario'){
                jQuery(".claRotulo").hide();
                jQuery("#idDivLogin").hide();
                jQuery(".claDivTextoCapa").hide();
                jQuery(".claDivFaleConosco").hide();
                jQuery("#idDivUsuario").show();//libera somente o bloco especial para registro de um novo usuario que não tem sigla
            }else{
            alert("Preencha todos os campos antes de entrar");
            }
        }//if sigla.length
    }//if sigla==admin
    });//idBtnLogEntrar click
    //--------------------------------------------
    jQuery("#idBtnTimSistAltSalvar").click(function () {
        //alterando timesheet pelo administrador
        let siglaNaMaquina = jQuery("#idSpaLogNaMaquinaSigla").text();
        let idTS = jQuery("#idSpaTimSistAltId").text();
        let idCliente = jQuery("#idSpaTimSistAltCli").text();
        let idPasta = jQuery("#idSpaTimSistAltPas").text();
        let dataT = jQuery("#idDatTimSistAltData").val();
        let objTxt = jQuery("#idTATimSistAltDesc");
        let texto = objTxt.val();
        let idProf = jQuery("#idSelTimSistAltProf option:selected").val();
        let numUTs = jQuery("#idNumTimSistAltUTs").val();
        let intStatus = jQuery("#idSelTimSistAltSit option:selected").val();
        //console.log("idTS: "+idTS+" idCliente: "+idCliente+" idPasta:"+idPasta+" data:"+dataT+" texto:"+texto+" idProf:"+idProf+" uts:"+numUTs);
        //---tem de pegar a taxa padrão do profissional e a taxa especial no cliente/file
        let taxaPadrao = fPegaTaxaPadrao(idProf);
        let taxaEspecial = fPegaTaxaEspecial(idPasta, idCliente, idProf);
        //-----
        if (idTS * 1 > 0 && idPasta * 1 > 0 && dataT.length > 0
            && texto.length > 0 && idProf * 1 > 0 && numUTs * 1 > 0 && intStatus * 1 > 0) {
            let dataEdicao = new Date().getTime();
            let sqlUpdate = `UPDATE tabts 
            SET data_edicao = now(),pasta_tabpastas = ?,data_trabalhada = ?,
            descricao = ?,profissional_tabpessoas = ?,
            uts = ?,int_status = ?   
             WHERE id = ?`;
            let arrayValores = [idPasta, dataT, texto, idProf, numUTs, intStatus, idTS];
            let tripa = fPrepara(arrayValores);
            //console.log(tripa);
            //------------------post
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */            
            jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoUpdateDelete, sqlUpdate: sqlUpdate, tripa: tripa }, function (retorno) {
                if (retorno > 0) {
                    //console.log("Valor do retorno: "+retorno);
                    objTxt.val('');
                    jQuery("#idBtnTimSistPesq").trigger("click");
                    alert("Timeheet alterado com sucesso! Veja a tabela novamente. Automaticamente ela mostra a alteração");
                    fGravaLog(siglaNaMaquina + "  Alteração de Timesheet: " + sqlUpdate + " " + tripa);
                } else {
                    alert("Houve um problema com a atualização do timesheet");
                    fGravaLog(siglaNaMaquina + "  PROBLEMA: Alteração de Timesheet: " + sqlUpdate + " " + tripa);
                }//if retorno
            });//post
        } else {
            alert("Não é possível salvar. Há campo vazio");
        }
    });//idBtnTimSistAltSalvar click
    //--------------------------------------------
    jQuery("#idBtnTimSistBaixSalvar").click(function () {
        //baixando ou reativando timesheet pelo administrador
        let objJust = jQuery("#idTxtTimSistBaixJust");
        let objData = jQuery("#idDatTimSistBaixData");
        let justif = objJust.val();
        let dataBaixa = objData.val();
        let intBaixReativ = jQuery("#idSelTimSistBaixSit option:selected").val();
        //--aqui captura num array todos os ids dos TS selecionados a baixar
        let objTab = jQuery("#idTabTimSistResultado  .claTSAssist");
        //---
        var i = 0;
        var arrayIds = jQuery(objTab).map(function () {
            let valor = jQuery(this).val();
            return valor;
        }).get();//pega todos os ids selecionados.
        //--Vai testar se todos os campos necessários a cada operação foram preenchidos
        if (intBaixReativ == 3) {
            //é baixa
            if (justif.length > 0 && dataBaixa.length == 10 && arrayIds.length > 0) {
                fFazUpdateBaixarReativar(intBaixReativ, arrayIds, justif, dataBaixa);
            } else {
                alert("Para baixar, é necessário pesquisar os lançamentos, selecionar os itens na tabela para que possam ser baixados, informar a justificativa, a data e a nova situação dos lançamentos, antes de clicar neste botão");
            }//if justi
        } else {
            if (arrayIds.length > 0 && intBaixReativ == "2") {
                fFazUpdateBaixarReativar(intBaixReativ, arrayIds, "", "");
            } else {
                alert("Para fazer a reativação, é necessário fazer a pesquisa dos lançamentos, selecionar os itens que deseja reativar no corpo da tabela e informar a futura situação, antes de clicar neste botão");
            }//if array
        }//if intBaixReativ==3
    });//idBtnTimSistBaixSalvar click
    //--------------------------------------------
    jQuery("#idBtnLogSair").click(function () {
        //com asterisco tranca todos os filhos
        //jQuery("#idDivLiberarBloco *").prop("disabled", true);
        jQuery("#idSpaLembreteAlarme").hide();
        jQuery("#idSelLembretesAtivos").hide();
        jQuery("#idHidLembretesInibeAlarme").val(0);//ativa o alarme sonoro (1=desativado)
        jQuery(".dropdown").hide();
        jQuery(".botao1").hide();
        jQuery(".botao12").hide();
        jQuery(".botao13").hide();
        jQuery("#idDivLogout").hide();
        jQuery("#idDivLogin").show();
        jQuery("#idSpaLogNaMaquinaNome").text('');
        jQuery("#idSpaLogNaMaquinaSigla").text('');
        jQuery(".claTelasForms").hide();//todas as telas são escondidas
        jQuery(".claFormularios").hide();//todas as telas que guardam funcionalidades são escondidas
        jQuery(".claFlexDash").hide();//fechando dashboard
        jQuery(".gridLembreteHome").hide();
        jQuery(".claDivTextoCapa").show();
        jQuery(".claDivFaleConosco").show();
        //repõe as globais como se fosse usuário comum, caso estivessem carregadas com os valores dos admins
        global_int_operacaoSelect=1;
global_int_operacaoInsert=4;
global_int_operacaoUpdateDelete=3;
    });//idBtnLogSair click
    //--------------------------------------------
    jQuery("#idSelPasAltPasExist").change(function () {
        //---alterando área de uma pasta
        let idPasta = jQuery("option:selected", this).val();
        let sql = "x";
        //---selecionar o responsável
        sql = `SELECT id,materia,responsavel_tabpessoas,area_tabareas,int_status 
                FROM tabpastas
             WHERE id = `+ idPasta;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */             
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let materia = obj.resultados[0].materia;
                let idResp = obj.resultados[0].responsavel_tabpessoas;
                let idArea = obj.resultados[0].area_tabareas;
                let intStatus = obj.resultados[0].int_status;
                //--
                jQuery("#idTxtPasAltMatTroc").val(materia);
                jQuery("#idSelPasAltRespTroc option[value='" + idResp + "']").prop('selected', true);
                jQuery("#idSelPasAltAreaTroc option[value='" + idArea + "']").prop('selected', true);
                jQuery("#idSelPasAltSitTroc option[value='" + intStatus + "']").prop('selected', true);
            }//if retorno
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
    });//idSelPasPesPasExist change
    //----------------------------------------------------
    jQuery("#idSelTimRegPas").blur(function () {
        //verifica se na inserção de timesheet há taxa especial para o file
        let idPasta = jQuery("option:selected", this).val();
    });//idSelTimRegPas blur
    //------------------------------------------
    jQuery("#idSelTimRegCli").change(function () {
        //carrega as pasta sob escolha do cliente na página dos timesheets
        let idCliente = jQuery("option:selected", this).val();
        let objSel = jQuery("#idSelTimRegPas");
        fSelecionaPastas(idCliente,objSel);
        /*
        objSel.empty();
        var concatena = '<option value="0" title="0">&nbsp;</option>';
        let idPessoa = jQuery(this).val() * 1;
        let sql = `SELECT *  
 FROM tabpastas 
 WHERE cliente_tabclientes = `+ idCliente;
        let intOperacao = "1";
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let idLido = obj.resultados[i].id;
                    let pasta = obj.resultados[i].pasta;
                    let materia = obj.resultados[i].materia;
                    concatena = concatena + '<option value="' + idLido + '" title="' + materia + '">' + pasta + '</option>';
                }//for
                objSel.append(concatena);
            }//if retorno


        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
        */
    });//idSelTimRegCli change
    //---------------------------------------------
    jQuery("#idSelTimSistTransCli").change(function () {
        //carrega as pasta na transferência de timesheets para outro file
        //-***************AQUI TEM UMA PARTICULARIDADE QUE É CARREGAR...
        //-***************NO TITLE DA PASTA O NÚMERO DO CLIENTE, PARA EVITAR IR AO BANCO...
        //-***************DE DADOS QUANDO QUISER SELECIONAR O CLIENTE SELECT DELE
        let idCliente = jQuery("option:selected", this).val();
        let objSel = jQuery("#idSelTimSistTransPas");
        fSelecionaPastas(idCliente,objSel);
        /*
        objSel.empty();
        var concatena = '<option value="0" title="0">&nbsp;</option>';
        let idPessoa = jQuery(this).val() * 1;
        let sql = `SELECT *  
FROM tabpastas 
WHERE cliente_tabclientes = `+ idCliente;
        let intOperacao = "1";
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let idLido = obj.resultados[i].id;
                    let pasta = obj.resultados[i].pasta;
                    let materia = obj.resultados[i].materia;
                    concatena = concatena + '<option value="' + idLido + '" title="' + idCliente + '">' + pasta + '</option>';
                }//for
                objSel.append(concatena);
            }//if retorno


        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
        */
    });//idSelTimSistTransCli change
    //---------------------------------------------
    jQuery("#idSelTimSistTransPas").change(function () {
        //selecionando o cliente a partir da pasta, na transferência de uts
        //-***************AQUI TEM UMA PARTICULARIDADE QUE É A CARGA DO NÚMERO DO CLIENTE...
        //-***************NO TITLE DA PASTA O NÚMERO DO CLIENTE, PARA EVITAR IR AO BANCO...
        //-***************DE DADOS QUANDO QUISER SELECIONAR O CLIENTE SELECT DELE
        let idCliente = jQuery("option:selected", this).prop("title");
        jQuery("#idSelTimSistTransCli option[value='" + idCliente + "']").prop('selected', true);
    });//idSelTimSistTransPas change
    //---------------------------------------------
    jQuery("#idBtnTimSistDT").click(function () {
        //DESMARCAR TODAS
        var objTabela = jQuery("#idTabTimSistResultado");//SELECIONA A TABELA MÃE
        jQuery(".claTSAssist:checkbox:checked").each(function () {
            //FAZ UM LOOP EM TODAS AS CHECKBOXES COM A CLASSE
            if (jQuery(this).closest(objTabela).length > 0) {
                //SÓ INTERESSA A CHECKBOX QUE ESTIVER PRÓXIMA À TABELA MÃE
                jQuery(this).prop("checked", false);//DESMARCA A CHECKBOX
            }//if

        });
    });

    //---------------------------------------------
    jQuery("#idBtnTimSistMT").click(function () {
        //marcar todos
        var objTabela = jQuery("#idTabTimSistResultado");//SELECIONA A TABELA MÃE
        jQuery(".claTSAssist:checkbox").each(function () {
            //FAZ UM LOOP EM TODAS AS CHECKBOXES COM A CLASSE 
            //if (jQuery(this).closest(objTabela).length == 0) {
            //SÓ INTERESSA A CHECKBOX QUE ESTIVER PRÓXIMA À TABELA MÃE
            jQuery(this).prop("checked", true);//MARCA CHECKBOX
            // }//if

        });
    });
    //---------------------------------------------- 
    jQuery("#idSelTimRegPas").change(function () {
        //mostra a matéria quando se escolhe pasta no timesheet
        let materia = jQuery("option:selected", this).prop("title");
        jQuery("#idSpaTimRegMat").text(materia);
    });//idSelTimRegPas change
    //------------------------------------------------  
    jQuery("#idSelTimPesPas").change(function () {
        //mostra a matéria quando se escolhe pasta no timesheet
        let objTabTS = jQuery("#idTabTimPesResultado");
        objTabTS.empty();
        let materia = jQuery("option:selected", this).prop("title");
        jQuery("#idSpaTimPesMat").text(materia);
    });//idSelTimPesPas change
    //------------------------------------------------  
    jQuery("#idSelTimPesCli").change(function () {
        let objTabTS = jQuery("#idTabTimPesResultado");
        objTabTS.empty();
        let idCli = jQuery("option:selected", this).val();
        let objSel = jQuery("#idSelTimPesPas");
        fSelecionaPastas(idCli,objSel);
       /*
        var concatena = '<option value="0" title"0">&nbsp;</option>';
        let sql = `SELECT * FROM tabpastas WHERE cliente_tabclientes = ` + idCli;
        let intOperacao = "1";
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let idLido = obj.resultados[i].id;
                    let pasta = obj.resultados[i].pasta;
                    let materia = obj.resultados[i].materia;
                    concatena = concatena + '<option value="' + idLido + '" title="' + materia + '">' + pasta + '</option>';
                }//for
                objSel.append(concatena);
            }//if retorno


        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
        */
    });//idSelTimPesCli change
    //-------------------------------------------------------
    jQuery("#idSelTimSistCli").change(function () {
        let idCli = jQuery("option:selected", this).val();
        let objSel = jQuery("#idSelTimSistPas");
        fSelecionaPastas(idCli,objSel);
/*        
        objSel.empty();
        var concatena = '<option value="0" title"0">&nbsp;</option>';
        let sql = `SELECT * FROM tabpastas WHERE cliente_tabclientes = ` + idCli;
        let intOperacao = "1";
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let idLido = obj.resultados[i].id;
                    let pasta = obj.resultados[i].pasta;
                    let materia = obj.resultados[i].materia;
                    concatena = concatena + '<option value="' + idLido + '" title="' + materia + '">' + pasta + '</option>';
                }//for
                objSel.append(concatena);
            }//if retorno
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
        */
    });//idSelTimSistCli change
    //-------------------------------------------------------
jQuery(document).on("change","#idSelTimSistPas",function (){
//ao mudar o file em Administrando timesheet
jQuery("#idSpaTimSistMat").text('');
//---
let idFile = jQuery("option:selected",this).val();
let sql = `SELECT c.cliente,c.id as idCliente,p.id,p.materia,
g.pessoa as responsavel  
FROM tabpastas p 
INNER JOIN tabclientes c 
ON p.cliente_tabclientes = c.id 
INNER JOIN tabpessoas g 
ON p.responsavel_tabpessoas = g.id 
WHERE p.id = `+ idFile;
let tripa="";
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
let intOperacao=global_int_operacaoSelect;
fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
    if (retorno.length > 20) {
        let obj = JSON.parse(retorno);
       jQuery("#idSpaTimSistMat").text(obj.resultados[0].materia);
    }//if retorno
});//fExecutaBD

});//idSelTimSistPas change
//------------------------------------------------------    
    jQuery("#idBtnProRegSalvar").click(function () {
        //registro de processo
        let idRedator = jQuery("#idSpaLogNaMaquinaId").text();
        let siglaNaMaquina = jQuery("#idSpaLogNaMaquinaSigla").text();
        let idPasta = jQuery("#idSelProRegPas option:selected").val();
        //--
        let idResp = jQuery("#idSelProRegResp option:selected").val();
        //--
        let julPI = jQuery("#idTxtProRegJul").val();
        let numPI = jQuery("#idTxtProRegNuO").val();
        let subPI = jQuery("#idSelProRegOrS option:selected").val();
        //--
        let julSI = jQuery("#idTxtProRegJuR").val();
        let numSI=jQuery("#idTxtProRegNuR").val();
        let subSI = jQuery("#idSelProRegReS option:selected").val();
        //--
        let obs = jQuery("#idTAProRegObs").val();
        //--pode ser insert ou pode ser update

        let sqlInsert = `INSERT INTO tabprocessos (redator_tabpessoas,pasta_tabpastas,
            responsavel_tabpessoas,julgador,original,subdivisao,
            julgador_recurso,numero_recurso,subdivisao_r,obs) 
              VALUES(?,?,?,?,?,?,?,?,?,?)`;
           //os dados abaixo têm de estar na mesma ordem das ?...
           //...da esquerda para a direita  na sentença de update
           let arrayValores = [idRedator,idPasta,idResp,julPI,numPI,subPI,julSI,numSI,subSI,obs];
           let tripa = fPrepara(arrayValores);
           //console.log(sqlInsert+" ====>>>> "+tripa);
           //-------------------post----------------
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */           
           jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsert, tripa: tripa }, function (retorno) {
               //console.log("retorno do insert processo: " + retorno);
               if (retorno * 1 > 0) {
                alert ("Processo salvo com sucesso");
                       fGravaLog(siglaNaMaquina + "  Insert processo: " + sqlInsert + " " + tripa);
               } else {
                   fGravaLog(siglaNaMaquina + " PROBLEMA: Insert processo: " + sqlInsert + " " + tripa);
               }//if retorno
           });//post  

    });//idBtnProRegSalvar click
    //-------------------------------------------------------
    jQuery(document).on("click","#idBtnProPesPesq",function () {
        //pesquisando andamentos de processo
        let nomeCliente=jQuery("#idSelProPesCli option:selected").text();
        let idCli = jQuery("#idSelProPesCli option:selected").val();
        let idFile = jQuery("#idSelProPesPas option:selected").val();
        let objTab = jQuery("#idTabProPesResultado");
        objTab.empty();
        let idPro = jQuery("#idSelProPesPrE option:selected").val();
        let numeroPro = jQuery("#idSelProPesPrE option:selected").text();
        let sql="x";
        if(numeroPro != ''){
        sql = `SELECT *    
        FROM tabandamentos a 
        INNER JOIN tabpessoas p 
        ON a.redator_tabpessoas = p.id
        WHERE a.processo_tabprocessos = `+ idPro + ` 
        ORDER BY a.data_andamento DESC`;
        }//if numeroPro
        //--se escolher só o cliente
        if(numeroPro=='' && idFile*1 == 0 && idCli *1 > 0){
        sql = `SELECT *    
        FROM tabandamentos a 
        INNER JOIN tabpessoas g 
        ON a.redator_tabpessoas = g.id 
        INNER JOIN tabprocessos p  
        ON a.processo_tabprocessos = p.id 
        INNER JOIN tabpastas f 
        ON p.pasta_tabpastas = f.id 
        WHERE f.cliente_tabclientes = `+ idCli + ` 
        ORDER BY a.data_andamento DESC`;
        }//if numeroPro==''
        //--se escolher só o file
        if(numeroPro=='' && idFile*1 > 0){
            sql = `SELECT *    
            FROM tabandamentos a 
            INNER JOIN tabpessoas g 
            ON a.redator_tabpessoas = g.id 
            INNER JOIN tabprocessos p  
            ON a.processo_tabprocessos = p.id 
            INNER JOIN tabpastas f 
            ON p.pasta_tabpastas = f.id 
            WHERE f.id = `+ idFile + ` 
            ORDER BY a.data_andamento DESC`;
            }//if numeroPro==''
        //console.log("sql do processo", sql);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        let concatena = '';
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            //console.log("retorno de pesquisa de processo",retorno);
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    if(i==0){
                        concatena = concatena='<tr><th colspan="8">'+nomeCliente+'</th><th>Processo: '+numeroPro+'</th></tr>';
                        concatena = concatena+ `<tr><th>Data</th><th>Andamento</th><th>Mesma posição?</th>
                        <th>Prazo 1</th><th>Prazo 2</th><th>Redator</th><th>Sigla</th><th>Obs</th><th>Inserção</th></tr>`;
                    }
                    let estiloMP='background-color:#F5DEB3;';
                    let dataAndamento = obj.resultados[i].data_andamento+" 00:00:00";//para forçar a ser a primeira do dia
                    //console.log("Dentro do for da pesquisa, data do andamento",dataAndamento);
                    dataAndamento = new Date(dataAndamento).toLocaleDateString();
                    //console.log("Dentro do for da pesquisa, data do andamento APÓS locale",dataAndamento);
                    let intMP = obj.resultados[i].mesma_posicao;
                    let txtMP="Não";
                    if(intMP*1==1){
                        txtMP="Sim";
                        estiloMP='border-color:initial;';
                    }//if intMP
                   //console.log("estilo",intMP+" / "+estiloMP);
                    let texto = obj.resultados[i].andamento;
                    let redator = obj.resultados[i].pessoa;
                    let sigla = obj.resultados[i].sigla;
                    let insercao = obj.resultados[i].data_insercao;
                    let prazo1 = obj.resultados[i].data_prazo1;
                    let prazo2 = obj.resultados[i].data_prazo2;
                    let obs = obj.resultados[i].obs;
                    concatena = concatena + '<tr><td>' + dataAndamento + '</td><td>' + texto + '</td>';
                    concatena = concatena + '<td style='+estiloMP+'>'+txtMP+'</td><td>'+prazo1+'</td><td>'+prazo2+'</td>';
                    concatena = concatena + '<td>'+redator + '</td><td>' + sigla + '</td><td>'+obs+'</td><td>' + insercao + '</td></tr>';
                }//for i
            }else{
                concatena = concatena='<tr><th colspan="9">Não há andamento para este processo</th></tr>';
            }//if retorno
            objTab.append(concatena);
            jQuery("#idTAProPesPDF").val('<table>'+concatena+'</table>');;
        });//fExecutaBD
    });//idBtnProPesPesq click
    //-----------------------------------------------------------
    jQuery("#idBtnProRegAndaSalvar").click(function () {
        //salvar andamento
        let intProcesso = jQuery("#idSelProRegAndaPro option:selected").val();
        let dataAnda = jQuery("#idDatProRegAndaData").val();
        let ano=dataAnda.substring(0,4);
        let mes=dataAnda.substring(5,7);
        let dia=dataAnda.substring(8,10);
        //---acrescentar a hora atual, do contrário registra 'ontem'
        let d =new Date();//yyyy-mm-dd hh:mm:ss
        let hojeHora = d.toLocaleString();//dd/mm/yyyy hh:mm:ss
        let horaH = hojeHora.substring(11,13);
        let minuH = hojeHora.substring(14,16);
        let seguH = hojeHora.substring(17,19);
        //refazendo a data do andamento pondo a hora corrente
        dataAnda = ano+"-"+mes+"-"+dia+" "+horaH+":"+minuH+":"+seguH;
        //console.log("dataAnda",dataAnda);
        //--
        let texto = jQuery("#idTAProRegAndaAnda").val();
        let intMesmaPosicao = jQuery("#idChkProRegAndaMP:checked").val();
        let idRedator = jQuery("#idSpaLogNaMaquinaId").text();
        let siglaRedator = jQuery("#idSpaLogNaMaquinaSigla").text();
        let prazo1 = jQuery("#idDatProRegAndaPrP").val();
        let prazo2 = jQuery("#idDatProRegAndaPrS").val();
        //----se for mesma posição, pegar o texto do andamento da última e repetir na inserção
        if(intMesmaPosicao*1==1){
        sql = `SELECT andamento 
        FROM tabandamentos 
        WHERE processo_tabprocessos = `+ intProcesso+`
        ORDER BY data_andamento desc`;//ordena os andamentos do processo em ordem inversa e pega o primeiro (que seria o último)
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        let intOperacao = global_int_operacaoSelect;
        let tripa="";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let textoAndamento = obj.resultados[0].andamento;
                //aqui é textoAndamento nos parâmetros
                fInsereAndamento(siglaRedator,intProcesso, dataAnda, textoAndamento, intMesmaPosicao,idRedator, prazo1, prazo2);
            } else {
               alert ("Há um problema: foi marcado 'Mesma posição', mas não foi encontrado um andamento anterior. Desmarque a caixa 'Mesma posição'");
            }//if retorno
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
    }else{
        //não é mesma posição, insere normal. Aqui é 'texto' nos parâmetros
        fInsereAndamento(siglaRedator,intProcesso, dataAnda, texto, intMesmaPosicao,idRedator, prazo1, prazo2);
    }//if intMesmaPosicao

    });//idBtnProRegAndaSalvar click
    //-----------------------------------------------------------    
    jQuery("#idBtnPesAltSitPasSalvar").click(function () {
        //alterando dados de pasta
        let siglaNaMaquina = jQuery("#idSpaLogNaMaquinaSigla").text();
        let idPasta = jQuery("#idSelPasAltPasExist option:selected").val();
        let objTxt = jQuery("#idTxtPasAltMatTroc");
        let materia = objTxt.val();
        let resp = jQuery("#idSelPasAltRespTroc option:selected").val();
        let area = jQuery("#idSelPasAltAreaTroc option:selected").val();
        let intStatus = jQuery("#idSelPasAltSitTroc option:selected").val();
        if (idPasta * 1 > 0 && materia.length > 0 && area * 1 > 0 && resp * 1 > 0 && intStatus * 1 > 0) {

            let sqlUpdate = `UPDATE tabpastas 
            SET data_edicao = now(),materia = ?,responsavel_tabpessoas =?,area_tabareas=?,int_status = ? 
             WHERE id = ?`;
            let arrayValores = [materia, resp, area, intStatus, idPasta];
            let tripa = fPrepara(arrayValores);
            //console.log(tripa);
            //------------------post
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */            
            jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoUpdateDelete, sqlUpdate: sqlUpdate, tripa: tripa }, function (retorno) {
                if (retorno > 0) {idBtnProPesPesq
                    //   //console.log("Valor do retorno: "+retorno);
                    fCarregaPastas();
                    objTxt.val('');
                    alert("Alterado com sucesso!");
                    jQuery("#idSelPasAltPasExist option[value='0']").prop('selected', true);
                    jQuery("#idSelPasAltRespTroc option[value='0']").prop('selected', true);
                    jQuery("#idSelPasAltAreaTroc option[value='0']").prop('selected', true);
                    objTxt.val('');
                    fGravaLog(siglaNaMaquina + "  Alterando dados da pasta: " + sqlUpdate + " " + tripa);
                } else {
                    alert("Houve um problema com a atualização da pasta");
                    fGravaLog(siglaNaMaquina + "  PROBLEMA: Alterando dados da pasta: " + sqlUpdate + " " + tripa);
                }//if retorno
            });//post
        } else {
            alert("Preencha/selecione todos os campos antes de salvar");
        }//if
    });//idBtnPesAltSitPasSalvar click
    //-------------------------------------------------------
    jQuery("#idBtnPasSistAreaTrocaSalva").click(function () {
        //alteração de área
        let siglaNaMaquina = jQuery("#idSpaLogNaMaquinaSigla").text();
        let idArea = jQuery("#idSelPasAltSistAreas option:selected").val();
        let objTxt = jQuery("#idTxtPasAltSistAreaTrocaArea");
        let nomeArea = objTxt.val();
        let intStatus = jQuery("#idSelPasAltSitSitTrocArea option:selected").val();
        //---
        //console.log(typeof novaArea+ " "+idArea+" typeof idARea "+typeof idArea);
        if (idArea * 1 > 0 && intStatus > 0 && nomeArea.length > 0) {

            let sqlUpdate = `UPDATE tabareas 
           SET data_edicao = now(),area = ?,int_status = ? 
            WHERE id = ?`;
            //alert (dataEdicao);
            let arrayValores = [nomeArea, intStatus, idArea];
            let tripa = fPrepara(arrayValores);
            //console.log(tripa);
            //------------------post
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */            
            jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoUpdateDelete, sqlUpdate: sqlUpdate, tripa: tripa }, function (retorno) {
                if (retorno > 0) {
                    //console.log("Valor do retorno: "+retorno);
                    fCarregaAreasAtuacaoAlteracao(0);
                    fCarregaAreasAtuacao(2);
                    alert("Alterado com sucesso!");
                    objTxt.val('');
                    fGravaLog(siglaNaMaquina + "  Alterando área: " + sqlUpdate + " " + tripa);
                } else {
                    alert("Houve um problema com a atualização da área de atuação");
                    fGravaLog(siglaNaMaquina + "  PROBLEMA: Alterando área: " + sqlUpdate + " " + tripa);
                }
            });//post
        } else {
            alert("Antes de alterar o nome da área, selecione a área a ser mudada e preencha o novo nome");
        }
    });//idBtnPasSistAreaTrocaSalva click
    //--------------------------------------------------------
    jQuery("#idBtnPasSistAreaSalvar").click(function () {
        let novaArea = jQuery("#idTxtPasSistNomeArea").val();
        //---verificar se já não existe no banco de dados algo parecido. Pegar primeira palavar
        let arrayPrimeira = novaArea.split(" ");
        let sql = `SELECT * FROM tabareas WHERE area LIKE '` + arrayPrimeira[0] + `%' 
        AND int_status = 2`;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        jQuery.post("/phpPaginas/bdExecuta.php", { sql: sql, intOperacao: global_int_operacaoSelect }, function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                let concatena = "";
                for (i; i < obj.resultados.length; i++) {
                    concatena = concatena + obj.resultados[i].area + "\r\n";
                }//for     
                alert("Já existe(m) as seguintes áreas com o nome parecido a este. Está correto?\r\n\r\n" + concatena);
            } else {
                alert("LIBERADO");
            }//if retorno
        });
    });//idBtnPasSistAreaSalvar click
    //------------------------------------------------ 
    jQuery("#idBtnTimPesPes").click(function () {
        //pesquisando timesheet e pondo numa tabela
        var objTab = jQuery("#idTabTimPesResultado");
        objTab.empty();
        //--
        let idCli = jQuery("#idSelTimPesCli option:selected").val();
        let idPasta = jQuery("#idSelTimPesPas option:selected").val();
        //---
        let idProf = jQuery("#idSelTimPesPrD option:selected").val();
        let intBaixadas = jQuery("#idChkTimPesInB:checked").length;
        let intBlocoOrigem = 1;//bloco da carga inicial, normal, da página
        let dataInicial = jQuery("#idDatTimPesDaI").val();
        let dataFinal = jQuery("#idDatTimPesDaF").val();
        fProcessa(intBlocoOrigem, objTab, idCli, idPasta, idProf, intBaixadas,dataInicial,dataFinal);
    });//idBtnTimPesPes click
//-----------------------------------------------------
jQuery(document).on("click","#idBtnTimPesPDF",function (){
    //PDF timesheet
    let concatena = jQuery("#idTATimPesPDF").val();
    fCriaPdf(concatena);
});//idBtnTimPesPDF
//-----------------------------------------------------
jQuery(document).on("click","#idBtnDespPesPDF",function (){
    //PDF despesas
    let concatena = jQuery("#idTADespPesPDF").val();
    fCriaPdf(concatena);
});//idBtnDespPesPDF
    //------------------------------------------------
    jQuery(document).on("click","#idBtnFatuPesPDF",function (){
        //PDF faturamento
        let concatena = jQuery("#idTAFatuPesPDF").val();
        fCriaPdf(concatena);
    });//idBtnFatuPesPDF
        //------------------------------------------------
jQuery(document).on("click","#idBtnProPesPDF",function (){
            //PDF processos/andamentos
            let concatena = jQuery("#idTAProPesPDF").val();
            fCriaPdf(concatena);
});//idBtnProPesPDF
//------------------------------------------------

jQuery(document).on("click","#idBtnPasPesPDF",function (){
    //PDF pastas
    let concatena = jQuery("#idTAPasPesPDF").val();
    //console.log("Concatena",concatena);
    fCriaPdf(concatena);

});//idBtnProPesPDF      
//------------------------------------------------
    jQuery("#idBtnTimSistPesq").click(function () {
        //SISTEMA: alterando / baixando / timesheet. Rotina muito parecida com a anterior
        var objTab = jQuery("#idTabTimSistResultado");
        objTab.empty();
        //--
        let idCli = jQuery("#idSelTimSistCli option:selected").val();
        let idPasta = jQuery("#idSelTimSistPas option:selected").val();
        let idProf = jQuery("#idSelTimSistPrD option:selected").val();
        let intBaixadas = jQuery("#idChkTimSistInB:checked").length;
        let intBlocoOrigem = 2;//bloco da seção timesheet sistemas
        let dataInicial = jQuery("#idDatTimSistDaI").val();
        let dataFinal = jQuery("#idDatTimSistDaF").val();
        fProcessa(intBlocoOrigem, objTab, idCli, idPasta,idProf, intBaixadas,dataInicial,dataFinal);
    });//idBtnTimSistPesq click
    //------------------------------------------------
    jQuery("#idSelTimRegProf").blur(function () {
        //verifica se o profissional está com taxa padrão
        let idCliente = jQuery("#idSelTimRegCli option:selected").val();
        let idFile = jQuery("#idSelTimRegPas option:selected").val();
        let nomeProf = jQuery("#idSelTimRegProf option:selected").text();
        let objSpaAvi = jQuery("#idSpaTimRegAvi");
        objSpaAvi.css({ "background-color": "initial", "color": "initial" });
        objSpaAvi.text('');
        //--
        let objBtn = jQuery("#idBtnTimRegSalvar");
        objBtn.prop("disabled", false);//libera o botão de salvamento
        jQuery("#idSpaTimRegTaE").text("0.00");//nem sempre há taxa especial
          let idProf = jQuery("option:selected", this).val();
        //---procurando a taxa padrão
        let sql = "x";
        sql = `SELECT valor    
        FROM tabtaxaspadrao
        WHERE profissional_tabpessoas = `+ idProf;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let taxaPadrao = obj.resultados[0].valor;
                jQuery("#idSpaTimRegTaP").text(taxaPadrao);
            } else {
                // alert("Há um problema com o profissional escolhido. Ele está sem taxa-padrão.");
                objBtn.prop("disabled", true);
                objBtn.prop("title", "Bloqueado pela inexistência da taxa-padrão. Por favor, altere o documento do profissional");
                objSpaAvi.text(`O profissional ` + nomeProf + ` está sem taxa-padrão.
                Entre no menu Pessoas, Administrar Pessoa, selecione o profissional.
                No campo da taxa-padrão, ponha aquela que valha para o período trabalhado.
                Informe um intervalo de vigência desta taxa`);
                objSpaAvi.css({ "background-color": "red", "color": "white" });
            }//if retorno
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
        //console.log(sql);
        //---procurando a taxa especial no file ou no Cliente
            sql = `SELECT t.valor   
        FROM tabtaxasespeciais t 
        WHERE (t.pastas_tabpastas = `+idFile+` OR t.cliente_tabclientes = `+idCliente+`) 
        AND t.profissional_tabpessoas = `+ idProf; 
            //console.log(sql);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */            
            intOperacao = global_int_operacaoSelect;
            tripa = "";
            fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
                if (retorno.length > 20) {
                    let obj = JSON.parse(retorno);
                    let taxaEspecial = obj.resultados[0].valor;
                    jQuery("#idSpaTimRegTEU").text(taxaEspecial);
                }//if retorno
            }, function (respostaErrada) {
                //console.log(respostaErrada);
            }).catch(function (e) {
                //console.log(e);
            });//fExecutaBD
       
    });//idSelTimRegProf blur
    //------------------------------------------------
    jQuery("#idBtnTimSistNTESalvar").click(function () {
        //salva nova taxa especial
        let siglaNaMaquina = jQuery("#idSpaLogNaMaquinaSigla").text();
        let idCli = jQuery("#idSelTimSistNTECli option:selected").val();
        let idPas = jQuery("#idSelTimSistNTEPas option:selected").val();
        let idProf = jQuery("#idSelTimSistNTEProf option:selected").val();
        //--
        let valor = jQuery("#idNumTimSistNTEValor").val();
        //---
        if ((idCli * 1 > 0 || idPas * 1 > 0) && idProf * 1 > 0 && valor * 1 > 0) {
            //---
            //--só vai fazer insert se não existir
            let sql = `SELECT id 
        FROM tabtaxasespeciais 
        WHERE cliente_tabclientes = `+ idCli + ` 
        AND pasta_tabpastas = `+ idPas + ` 
        AND profissional_tabpessoas = `+ idProf;
            //console.log("FAZENDO TESTE SE EXISTE A TE: "+sql);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */            
            jQuery.post("/phpPaginas/bdExecuta.php", { sql: sql, intOperacao: global_int_operacaoSelect}, function (retorno) {
                //console.log("retorno do select: "+retorno);
                if (retorno.length > 20) {
                    //achou... Não interessa
                    alert("Infelizmente, este cliente ou esta pasta já tem taxa especial neste período. Faça conserto, não inserção");
                } else {
                    //não existe a taxa no período. Pode inserir
                    //---
                    let sqlInsert = `INSERT INTO tabtaxasespeciais(pasta_tabpastas, cliente_tabclientes, 
            profissional_tabpessoas, valor, int_status) 
              VALUES(?,?,?,?,?)`;
                    //  //console.log("sqlInsert: "+sqlInsert);
                    //os dados abaixo têm de estar na mesma ordem das ?...
                    //...da esquerda para a direita  na sentença de update
                    let arrayValores = [idPas, idCli, idProf, valor, 2];
                    let tripa = fPrepara(arrayValores);
                    //console.log(sqlInsert+" ====>>>> "+tripa);
                    //-------------------post----------------
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */                    
                    jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsert, tripa: tripa }, function (retorno) {
                        //console.log("retorno do insert TS: " + retorno);
                        if (retorno * 1 > 0) {
                            alert("Inseriu com sucesso");
                            fGravaLog(siglaNaMaquina + "  Insert nova taxa especial: " + sqlInsert + " " + tripa);
                        } else {
                            fGravaLog(siglaNaMaquina + "  PROBLEMA: Insert nova taxa especial: " + sqlInsert + " " + tripa);
                        }//if retorno
                    });//post

                }//if retorno do select
            });//post 
        } else {
            alert("Antes de salvar, preencha todos os campos.");
        }//if idCli > 0
    });//idBtnTimSistNTESalvar click
    //------------------------------------------------
    jQuery("#idBtnTimRegSalvar").click(function () {
        //lançando registrando timesheets
        let objTabBer = jQuery("#idTabTimRegBer");//tabela-berçário para rascunhos
        objTabBer.empty();
        //----------
        let siglaNaMaquina = jQuery("#idSpaLogNaMaquinaSigla").text();
        let intRedator = jQuery("#idSpaLogNaMaquinaId").text();
        var objSpa = jQuery("#idSpaTimRegAvi");
        objSpa.text("");
        let idPasta = jQuery("#idSelTimRegPas option:selected").val();
        let dataTrab = jQuery("#idDatTimRegData").val();
        //---------
        let texto = jQuery("#idTATimRegTexto").val();
        let idProf = jQuery("#idSelTimRegProf option:selected").val();
        let numUTs = jQuery("#idNumTimRegUts").val();
        let taxaPadrao = jQuery("#idSpaTimRegTaP").text();
        let taxaEsp = jQuery("#idSpaTimRegTEU").text();
        let intStatus = jQuery("#idSelTimRegSit option:selected").val();
        if (idPasta * 1 > 0 && dataTrab.length > 0 && texto.length > 0
            && idProf * 1 > 0 && numUTs * 1 > 0 && intStatus * 1 > 0 && taxaPadrao * 1>0) {
            let sqlInsert = `INSERT INTO tabts (redator_tabpessoas,pasta_tabpastas,
             data_trabalhada,descricao,uts,
              profissional_tabpessoas,taxa_padrao,
               taxa_especial,int_status) 
               VALUES(?,?,?,?,?,?,?,?,?)`;
            //os dados abaixo têm de estar na mesma ordem das ?...
            //...da esquerda para a direita  na sentença de update
            let arrayValores = [intRedator, idPasta, dataTrab, texto,
                numUTs, idProf, taxaPadrao, taxaEsp, intStatus];
            let tripa = fPrepara(arrayValores);
            //console.log(sqlInsert+" ====>>>> "+tripa);
            //-------------------post----------------
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */            
            jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsert, tripa: tripa }, function (retorno) {
                //console.log("retorno do insert TS: " + retorno);
                if (retorno * 1 > 0) {
                    jQuery("#idSpaTimRegAvi").text("Gravado com sucesso");
                    objSpa.css({ "color": "green" });
                    objSpa.text("Gravado com sucesso");
                    jQuery(".claInputTimReg").val("");
                    fCarregaClientes();//recarrega o novo cliente em todas as páginas
                    fGravaLog(siglaNaMaquina + "  Insert TS: " + sqlInsert + " " + tripa);
                    //---se for rascunho, vai preenchendo a tabela-berçário, pegando da tabela de lançados
                    fPegaRascunhosPreencheTabela(intRedator,objTabBer);
                    //---
                } else {
                    objSpa.css({ "color": "red" });
                    objSpa.text("HOUVE UM PROBLEMA com a gravação");
                    fGravaLog(siglaNaMaquina + " PROBLEMA: Insert TS: " + sqlInsert + " " + tripa);
                }//if retorno
            });//post  
        } else {
            alert("Todos os campos têm de estar preenchidos antes de salvar. Verifique também se a taxa padrão é maior que zero");
        }
    });//idBtnTimRegSalvar click
    //-------------------------------------------------
    jQuery("#idBtnDespRegSalv").click(function () {
        //registro de despesa
        let siglaNaMaquina =jQuery("#idSpaLogNaMaquinaSigla").text();
        let idRedator = jQuery("#idSpaLogNaMaquinaId").text();
        let idPasta = jQuery("#idSelDespRegPas option:selected").val();
        let dataDesp = jQuery("#idDatDespRegDaD").val();
        let nhrd = jQuery("#idSelDespRegInc option:selected").val();
        let descr = jQuery("#idTADespRegDesc").val();
        let aprov = jQuery("#idSelDespRegApr option:selected").val();
        let valor = jQuery("#idNumDespRegVal").val();
        if(idPasta * 1 > 0 && dataDesp.length > 0 && descr.length > 0 && aprov * 1 > 0 && valor *1 > 0 ){
            let sqlInsert = `INSERT INTO tabdespesas  
       (redator_tabpessoas,pasta_tabpastas,data,
        incluir,descricao,aprovador_tabpessoas,valor)
          VALUES (?,?,?,?,?,?,?)`;
            let arrayValores = [idRedator, idPasta, dataDesp,nhrd,descr,aprov,valor];
            let tripa = fPrepara(arrayValores);
            //console.log(sqlInsert+" ====>>>> "+tripa);
            //-------------------post----------------
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */            
            jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsert, tripa: tripa }, function (retorno) {
                //console.log(retorno);
                if (retorno * 1 > 0) {
                    alert ("Despesa salva com sucesso");
                    fGravaLog(siglaNaMaquina + "  Insert despesa: " + sqlInsert + " " + tripa);
                } else {
                    alert ("Problema no salvamento da despesa");
                      fGravaLog(siglaNaMaquina + "  PROBLEMA: Insert despesa: " + sqlInsert + " " + tripa);
                }//if retorno
            });//post  
        }else{
            alert ("Antes de pressionar o botão de salvamento, preencha todos os campos");
        }//if idPasta
    });//idBtnDespRegSalv click
    //---------------------------------------------------
    jQuery("#idSelPesCliCli").change(function () {
        let idCliente = jQuery("option:selected", this).val();
        fSelecionaCliente(idCliente);
    });//idSelPesCliCli change
    //-----------------------------------------
    jQuery("#idSelPasAltSistAreas").change(function () {
        //altera área de uma pasta
        let idArea = jQuery("option:selected", this).val();
        let txtArea = jQuery("option:selected", this).text()
        txtArea = txtArea.replace(/\*/g, "");
        jQuery("#idTxtPasAltSistAreaTrocaArea").val(txtArea);
        let sql = `SELECT *  
        FROM tabareas 
        WHERE id = `+ idArea;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let intStatus = obj.resultados[0].int_status;
                jQuery("#idSelPasAltSitSitTrocArea option[value='" + intStatus + "']").prop('selected', true);
            }//if retorno
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
    });//idSelPasAltSistAreas change
    //-----------------------------------------
    jQuery("#idSelCronoRegCli").change(function () {
        //carrega as pasta sob escolha do cliente na página da crono
        let idCliente = jQuery("option:selected", this).val();
        let objSel = jQuery("#idSelCronoRegPas");
        fSelecionaPastas(idCliente,objSel);
/*        
        objSel.empty();
        var concatena = '<option value="0" title="0">&nbsp;</option>';
        let idPessoa = jQuery(this).val() * 1;
        let sql = `SELECT *  
        FROM tabpastas 
        WHERE cliente_tabclientes = `+ idCliente;
        let intOperacao = "1";
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let idLido = obj.resultados[i].id;
                    let pasta = obj.resultados[i].pasta;
                    concatena = concatena + '<option value="' + idLido + '" title="' + idLido + '">' + pasta + '</option>';
                }//for
                objSel.append(concatena);
            }//if retorno
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
        */
    });//idSelCronoRegCli change
    //-----------------------------------------
    jQuery("#idSelCronoPesCli").change(function () {
        let objTab = jQuery("#idTabCronoPesResultado");
        objTab.empty();
        let idCliente = jQuery("option:selected", this).val();
        let intTodos = jQuery("#idChkCronoPesTodos:checked").length;
        let objSel = jQuery("#idSelCronoPesPas");
        //console.log("intTodos ==1?",intTodos);
        if(intTodos*1==1){
            fMostraTodas();
        }else{
        fSelecionaPastas(idCliente,objSel);
        }
        /*        
        objSel.empty();
        var concatena = '<option value="0" title="0">&nbsp;</option>';
        let sql = `SELECT *  
        FROM tabpastas 
        WHERE cliente_tabclientes = `+ idCliente;
        //console.log("intTodos",intTodos);
        if(intTodos*1==1){
            fMostraTodas();
        }else{
        let intOperacao = "1";
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let idLido = obj.resultados[i].id;
                    let pasta = obj.resultados[i].pasta;
                    concatena = concatena + '<option value="' + idLido + '" title="' + idLido + '">' + pasta + '</option>';
                }//for
                objSel.append(concatena);
            }//if retorno
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
    }//if intTodos
    */
    });//idSelCronoPesCli change
    //-----------------------------------------
    jQuery("#idChkCronoPesTodos").change(function () {
        fMostraTodas();
    });//idChkCronoPesTodos change
    //-------------------------------------------
    jQuery("#idSelCronoPesAno").change(function () {
        jQuery("#idSelCronoPesPas").trigger("change");
    });//idSelCronoPesAno change
    //-------------------------------------------
    jQuery("#idSelCronoPesPas").change(function () {
        //mostra as cronológicas da pasta
        jQuery("#idChkCronoPesTodos").prop("checked", false);//DESMARCA A CHECKBOX
        let objTab = jQuery("#idTabCronoPesResultado");
        objTab.empty();
        let ano = jQuery("#idSelCronoPesAno option:selected").val();
        let idPasta = jQuery("option:selected", this).val();
        if (idPasta * 1 > 0) {
            //---
            let estilo = "background-color:yellow";
            let estiloAno = "background-color:initial";
            if (ano * 1 > 0) {
                estiloAno = "background-color:yellow";
            }
            //---
            let clausula = ` r.ano = ` + ano + `  
    AND p.id = `+ idPasta;
            if (ano * 1 == 0) {
                clausula = ` p.id = ` + idPasta;
            }
            let concatena = `<tr><th>No. carta</th><th>Cliente</th>
        <th>Pasta</th><th>Assunto/Matéria</th>
        <th>Resp</th><th>Ref</th><th>Atenção</th>
        <th>Ano</th><th>Status</th></tr>`;
            let sql = `SELECT c.cliente,p.pasta,p.materia,g.pessoa as responsavel,
        r.id,r.atencao,r.referencia,r.ano,r.int_status,r.responsavel_tabpessoas,r.pasta_tabpastas   
        FROM tabclientes c INNER JOIN tabpastas p 
        ON p.cliente_tabclientes = c.id 
        INNER JOIN tabcrono r 
        ON r.pasta_tabpastas  = p.id 
        INNER JOIN tabpessoas g 
        ON r.responsavel_tabpessoas = g.id 
        WHERE `+ clausula;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
            let intOperacao = global_int_operacaoSelect;
            let tripa = "";
            fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
                if (retorno.length > 20) {
                    let obj = JSON.parse(retorno);
                    let i = 0;
                    for (i; i < obj.resultados.length; i++) {
                        let idLido = obj.resultados[i].id;
                        let cliente = obj.resultados[i].cliente;
                        let pasta = obj.resultados[i].pasta;
                        let materia = obj.resultados[i].materia;
                        let resp = obj.resultados[i].responsavel;
                        let ref = obj.resultados[i].referencia;
                        let atencao = obj.resultados[i].atencao;
                        let intStatus = obj.resultados[i].int_status;
                        //---
                        let idPasta = obj.resultados[i].pasta_tabpastas;
                        let nomeArquivo ='<a href="/docs/c_'+idPasta+'.pdf" target="_blank">'+idLido+'</a>';
                        concatena = concatena + `<tr><td>` + nomeArquivo+ `</td>
                        <td>`+ cliente + `</td><td style="` + estilo + `">` + pasta + `</td>
                        <td>`+ materia + `</td><td>` + resp + `</td><td>` + ref + `</td>
                        <td>`+ atencao + `</td><td style="` + estiloAno + `">` + ano + `</td>
                        <td>` + intStatus + `</td>
                        </tr>`;
                    }//for i
                }//if retorno.lenth
                objTab.append(concatena);
            }, function (respostaErrada) {
                //console.log(respostaErrada);
            }).catch(function (e) {
                //console.log(e);
            });//fExecutaBD
        }//if idPasta
    });//idSelCronoPesCli change
    //-----------------------------------------    
    jQuery("#idSelCronoRegPas").change(function () {
        let idPasta = jQuery("option:selected", this).val();
        let objSpa = jQuery("#idSpaCronoRegMate");
        //--
        let sql = `SELECT *  
        FROM tabpastas 
        WHERE id = `+ idPasta;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let materia = obj.resultados[0].materia;
                objSpa.text(materia);
            } else {
                objSpa.text('Não encontrada a matéria da pasta de id ' + idPasta);
            }//if retorno
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
    });//idSelCronoRegPas change
    //-----------------------------------------
    jQuery("#idTxtCliRegCPFCNPJ").blur(function () {
        let cpfCnpj = jQuery(this).val();
        let clienteOuFaturado = 'cliente';
        fVerificaCPFCNPJClienteFaturado(cpfCnpj, clienteOuFaturado)
    });//idTxtCliRegCPFCNPJ
    //-------------------------------------------
    jQuery("#idTxtFatuNoFCPFCNPJ").blur(function () {
        let cpfCnpj = jQuery(this).val();
        let clienteOuFaturado = 'faturado';
        fVerificaCPFCNPJClienteFaturado(cpfCnpj, clienteOuFaturado)
    });//idTxtFatuNoFCPFCNPJ
    //---------------------------------------
    jQuery(document).on("blur","#idTxtFatuNoFCPFCNPJ",function (){
        let cpfCnpj = jQuery(this).val();
        let clienteOuFaturado = 'faturado';
        fVerificaCPFCNPJClienteFaturado(cpfCnpj, clienteOuFaturado)
    });//idTxtFatuNoFCPFCNPJ blur
    //------------------------------------------------
    jQuery(".claTxtCPFCNPJ").blur(function () {
        let cpfCnpj = jQuery(this).val();
        let idTxt = jQuery(this).attr("id");
        let objBtnSalvar;
        let objSpa;
        let intTipo=0;
        let comprimento;
        if (idTxt == "idTxtPesRegCPF") {
            objBtnSalvar = jQuery("#idBtnPesRegSalvar");
            objSpa = jQuery("#idSpaPesRegAvi");
        }//if idTxt
        if (idTxt == "idTxtUsuarioCPF") {
            objBtnSalvar = jQuery("#idBtnUsuarioSalvar");
            objSpa = jQuery("#idSpaUsuarioAvi");
        }//if idTxt
        if (idTxt == "idTxtCliRegCPFCNPJ") {
            objBtnSalvar = jQuery("#idBtnCliRegSalvar");
            objSpa = jQuery("#idSpaCliRegAvi");
            //--
            intTipo = jQuery("#idSelCliRegTiP option:selected").val() * 1;
            comprimento = cpfCnpj.length;
            if (intTipo == 2 && comprimento != 14) {
                alert("Você escolheu pessoa jurídica. Obrigatoriamente 14 dígitos para CNPJ");
            }//if intTipo
            if (intTipo == 1 && comprimento != 11) {
                alert("Você escolheu pessoa  física. Obrigatoriamente 11 dígitos para CPF");
            }//if intTipo
            //--
        }//if idTxt==idTxtCliRegCPFCNPJ
        //--
        objBtnSalvar.prop("disabled", false);
        objBtnSalvar.prop("title", "");
        objSpa.text('');
        objSpa.css({ "color": "initial" });
        //--
        jQuery.post("/phpPaginas/bdExecuta.php", { cpfCnpj: cpfCnpj, intOperacao: 6 }, function (retorno) {
            //console.log("retorno do tete do cpf",retorno);
            if (retorno * 1 == 0) {
                objBtnSalvar.prop("disabled", true);
                if (idTxt == "idTxtPesRegCPF") {
                    objSpa.text("Reveja o CPF preenchido. A sequência numérica não está correta. CPFs têm 11 dígitos.");
                    objBtnSalvar.prop("title", "Bloqueado por erro de preenchimento no CPF");
                }
                if (idTxt == "idTxtUsuarioCPF") {
                    objSpa.text("Reveja o CPF preenchido. A sequência numérica não está correta. CPFs têm 11 dígitos.");
                    objBtnSalvar.prop("title", "Bloqueado por erro de preenchimento no CPF");
                }
                if (idTxt == "idTxtCliRegCPFCNPJ") {
                    objSpa.text("Reveja o CPF/CNPJ preenchido. A sequência numérica não está correta. CPFs têm 11 dígitos e CNPJs 14.");
                    objBtnSalvar.prop("title", "Bloqueado por erro de preenchimento no CPF/CNPJ");
                }

                objSpa.css({ "color": "red" });
            }else{
                //console.log("Sequência certa",intTipo);
                //estando a sequência certa, agora perguntar se o cpf/cnpj passado já não existe na base
                let sql = `SELECT * FROM tabpessoas WHERE cpf = '` + cpfCnpj+`'`;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */                
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            //console.log("retorno do //console.log verificação existencia cpf",retorno);
            if (retorno.length > 20) {
                //existe já. Não pode.
                if (idTxt == "idTxtUsuarioCPF") {
                    objBtnSalvar.prop("disabled",true);
                    objSpa.text("Reveja o CPF preenchido. Ele já existe no banco de dados e não é possível dois iguais.");
                    objBtnSalvar.prop("title", "Bloqueado por não permitir salvar um novo usuário com CPF já existente");
                    objSpa.css({ "color": "red" });
                }
            }//if retorno
        });//fExecutBD
            }//if retorno da verificação da sequência/dígto do cpf/cnpj
        });
    });//idDatPesRegCPF blur
    //------------------------------------
    jQuery("input").focus(
        function () {
            jQuery(this).select();
        });//input text focus
    //-----------------------------------     
    jQuery(".claTxtCEP").blur(function () {
        let idTxtBlur = jQuery(this).attr("id");
        let intCEP = jQuery(this).val();
        //console.log(intCEP+" "+idTxtBlur);
        if (!isNaN(intCEP)) {
            fBuscaEnderecoDandoCEP(intCEP, idTxtBlur);
        } else {
            alert("O CEP exige apenas algarismos e com 8 dígitos");
        }//if
    });//.claTxtCEP blur
//----------------------------------------
jQuery(document).on("blur","#idTxtAlmoFornCEP",function () {
    let idTxtBlur = jQuery(this).attr("id");
    let intCEP = jQuery(this).val();
    if (!isNaN(intCEP)) {
        fBuscaEnderecoDandoCEP(intCEP, idTxtBlur);
    } else {
        alert("O CEP exige apenas algarismos e com 8 dígitos");
    }//if
});//idTxtAlmoFornCEP blur
//----------------------------------------
jQuery(document).on("blur","#idTxtExpeRegCEP",function (){
    let idTxtBlur = "idTxtExpeRegEnC";
    let intCEP = jQuery(this).val();
    jQuery("#idTxtExpeRegEnC").val("");
    //console.log(intCEP+" "+idTxtBlur);
    if (!isNaN(intCEP)) {
        fBuscaEnderecoDandoCEP(intCEP, idTxtBlur);
    } else {
        alert("O CEP exige apenas algarismos e com 8 dígitos");
    }//if
});//idTxtExpeRegCEP blur
    //----------------------------------------
    jQuery("#idTxtPesRegSigla").blur(function () {
        //verifica se já existe  o cpf (em conjunto com o de baixo)
        let objBtn = jQuery("#idBtnPesRegSalvar");
        objBtn.prop("disabled", false);
        //--
        let cpf = jQuery("#idTxtPesRegCPF").val();
        fVerificaExistenciaCPF(cpf);
    });//idTxtPesRegSigla blur
    //----------------------------------------
    jQuery("#idTxtPesRegCPF").blur(function () {
        //verifica se já existe a sigla e o cpf (em conjunto com o de cima)
        let objBtn = jQuery("#idBtnPesRegSalvar");
        objBtn.prop("disabled", false);
        //--
        let cpf = jQuery(this).val();
        fVerificaExistenciaCPF(cpf);
    });//idTxtPesRegSigla blur
    //----------------------------------------
    jQuery("#idBtnCronoRegSalvar").click(function () {
        //Salvando cronológica nova
        let siglaNaMaquina = jQuery("#idSpaLogNaMaquinaSigla").text();
        let objSpa = jQuery("#idSpaCronoRegAvi");
        objSpa.text('');
        objSpa.css({ "color": "initial" });
        jQuery("#idSpaCronoRegNumero").text('');
        let intRedator = jQuery("#idSpaLogNaMaquinaId").text();
        let intPasta = jQuery("#idSelCronoRegPas option:selected").val();
        let idResp = jQuery("#idSelCronoRegResp option:selected").val();
        let ref = jQuery("#idTxtCronoRegRef").val();
        let atencao = jQuery("#idTxtCronoRegAten").val();
        let intStatus = jQuery("#idSelCronoRegSit option:selected").val();
        //---
        if(intPasta*1>0 && idResp*1>0 && ref != '' && atencao != '' && intStatus *1 >0){
        let anoObj = new Date();
        var ano = anoObj.getFullYear();
        //--
            let sqlInsert = `INSERT INTO tabcrono 
       (redator_tabpessoas,pasta_tabpastas,responsavel_tabpessoas,
        referencia, atencao,ano, int_status)
          VALUES (?,?,?,?,?,?,?)`;
            //os dados abaixo têm de estar na mesma ordem das ?...
            //...da esquerda para a direita  na sentença de update
            let arrayValores = [intRedator, intPasta, idResp, ref,
                atencao, ano, intStatus];
            let tripa = fPrepara(arrayValores);
            //console.log(sqlInsert+" ====>>>> "+tripa);
            //-------------------post----------------
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */            
            jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsert, tripa: tripa }, function (retorno) {
                //console.log(retorno);
                if (retorno * 1 > 0) {
                    objSpa.css({ "color": "green" });
                    objSpa.text("Gravado com sucesso");
                    jQuery(".claInputCronoReg").val("");
                    fCarregaClientes();//recarrega o novo cliente em todas as páginas
                    fGravaLog(siglaNaMaquina + "  Insert crono: " + sqlInsert + " " + tripa);
                } else {
                    objSpa.css({ "color": "red" });
                    objSpa.text("HOUVE UM PROBLEMA com a gravação");
                    fGravaLog(siglaNaMaquina + "  PROBLEMA: Insert crono: " + sqlInsert + " " + tripa);
                }//if retorno
            });//post  
    }else{
        alert ("Por favor, preencha todos os campos");
    }//if intPasta
    });//idBtnCronoRegSalvar click
    //--------------------------------------------
    jQuery(".claBotoesPrincipais").click(function () {
        jQuery(".claTelasForms").hide();
        jQuery(".claFormularios").hide();
        fCarregaLembretes(2);//faz um refresh em qualquer botão clicado, recarregando algum lembrete
    });//.claBotoesPrincipais click
    //------------------------------------------
    jQuery(".claBtnInterno").click(function () {
        jQuery(".claFormularios").hide();
        //jQuery("#idDivFormPasSistNovaArea").hide();
    });//.claBtnInterno click
    //--------------------------
    jQuery("#idSelPesPesPro").change(function () {
        fLimpaCamposDetectandoElemento("idDivFormPesPes");
        //selecionando pessoa na pesquisa de pessoa
        let idPessoa = jQuery(this).val() * 1;
        let sql = `SELECT p.*,t.valor 
        FROM tabpessoas p 
        INNER JOIN tabtaxaspadrao t 
        ON t.profissional_tabpessoas = p.id 
        WHERE p.id = `+ idPessoa;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let pessoa = obj.resultados[0].pessoa;
                let sigla = obj.resultados[0].sigla;
                //--
                let intFaixa = obj.resultados[0].faixa_tabfaixas;
                if (intFaixa.length == 0) intFaixa = 0;
                //--
                let intCategoria = obj.resultados[0].categoria_tabcategorias;
                let email = obj.resultados[0].email;
                let emailExt = obj.resultados[0].email_externo;
                let intFilial = obj.resultados[0].filial_tabfiliais;
                let intAcesso = obj.resultados[0].acesso_tabacessos;
                let intSituacao = obj.resultados[0].int_status;
                let intSexo = obj.resultados[0].int_sexo;
                let foto = obj.resultados[0].foto;
                let nascimento = obj.resultados[0].nascimento;
                let identidade = obj.resultados[0].identidade;
                let cpf = obj.resultados[0].cpf;
                let telefone = obj.resultados[0].telefone;
                let celular = obj.resultados[0].celular;
                let logradouro = obj.resultados[0].logradouro;
                let numero = obj.resultados[0].numero;
                let complemento = obj.resultados[0].complemento;
                let bairro = obj.resultados[0].bairro;
                let cidade = obj.resultados[0].cidade;
                let estado = obj.resultados[0].estado;
                let pais = obj.resultados[0].pais_tabpaises;
                let cep = obj.resultados[0].cep;
                let taxa = obj.resultados[0].valor;
                //--
                jQuery("#idTxtPesPesNome").val(pessoa);
                jQuery("#idTxtPesPesSigla").val(sigla);
                
                jQuery("#idSelPesPesCat option[value='" + intCategoria + "']").prop('selected', true);
                jQuery("#idSelPesPesSexo option[value='" + intSexo + "']").prop('selected', true);
                jQuery("#idSelPesPesFil option[value='" + intFilial + "']").prop('selected', true);
                jQuery("#idSelPesPesNiv option[value='" + intAcesso + "']").prop('selected', true);
                jQuery("#idSelPesPesSit option[value='" + intSituacao + "']").prop('selected', true);
                jQuery("#idSelPesPesFaixa option[value='" + intFaixa + "']").prop('selected', true);
                jQuery("#idImgPesPesFoto").prop("src", foto);
                jQuery("#idDatPesPesNasc").val(nascimento);
                jQuery("#idTxtPesPesIden").val(identidade);
                jQuery("#idTxtPesPesCPF").val(cpf);
                jQuery("#idTxtPesPesTel").val(telefone);
                jQuery("#idTxtPesPesCel").val(celular);
                jQuery("#idTxtPesPesEnL").val(logradouro);
                jQuery("#idNumPesPesEnN").val(numero);
                jQuery("#idTxtPesPesEnC").val(complemento);
                jQuery("#idTxtPesPesEnB").val(bairro);
                jQuery("#idTxtPesPesECi").val(cidade);
                jQuery("#idTxtPesPesEEs").val(estado);
                jQuery("#idTxtPesPesEPa").val(pais);
                jQuery("#idTxtPesPesECE").val(cep);
                jQuery("#idTxtPesPesEma").val(email);
                jQuery("#idTxtPesPesEmax").val(emailExt);
                jQuery("#idNumPesPesTaP").val(taxa);
                //---agora vai pegar a faixa
                //fPegaFaixa(idPessoa,"idSelPesPesFaixa");

            } else {
                jQuery("#idImgPesPesFoto").prop("src", "/imagens/interroga.png");
            }//if retorno
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
    });//idSelPesPesPro change
    //--------------------------------------------------
    jQuery("#idSelSistConsPesPro").change(function () {
        //administrando pessoas
        fLimpaCamposDetectandoElemento("idDivFormSistPess");
        //selecionando pessoa na pesquisa de pessoa
        let idPessoa = jQuery(this).val() * 1;
        let sql = `SELECT p.*,t.valor 
        FROM tabpessoas p 
        INNER JOIN tabtaxaspadrao t 
        ON t.profissional_tabpessoas = p.id 
        WHERE p.id = `+ idPessoa;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            //console.log(retorno);
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let pessoa = obj.resultados[0].pessoa;
                let sigla = obj.resultados[0].sigla;
                let intCategoria = obj.resultados[0].categoria_tabcategorias;
                //--
                let intFaixa = obj.resultados[0].faixa_tabfaixas;
                if (intFaixa.length == 0) intFaixa = 0;
                //--
                let email = obj.resultados[0].email;
                let emailExt = obj.resultados[0].email_externo;
                let intFilial = obj.resultados[0].filial_tabfiliais;
                let intAcesso = obj.resultados[0].acesso_tabacessos;
                let intSituacao = obj.resultados[0].int_status;
                let intSexo = obj.resultados[0].int_sexo;
                let foto = obj.resultados[0].foto;
                let nascimento = obj.resultados[0].nascimento;
                let identidade = obj.resultados[0].identidade;
                let cpf = obj.resultados[0].cpf;
                let telefone = obj.resultados[0].telefone;
                let celular = obj.resultados[0].celular;
                let logradouro = obj.resultados[0].logradouro;
                let numero = obj.resultados[0].numero;
                let complemento = obj.resultados[0].complemento;
                let bairro = obj.resultados[0].bairro;
                let cidade = obj.resultados[0].cidade;
                let estado = obj.resultados[0].estado;
                let pais = obj.resultados[0].pais_tabpaises;
                let cep = obj.resultados[0].cep;
                let taxa = obj.resultados[0].valor;
                //--Para evitar cache da imagem
                let dataAgoraCache = new Date().getTime();
                //---
                jQuery("#idTxtSistConsPesNome").val(pessoa);
                jQuery("#idTxtSistConsPesSigla").val(sigla);
                jQuery("#idHidNomeFoto").val(sigla.toLowerCase());
                jQuery("#idSelSistConsPesCat option[value='" + intCategoria + "']").prop('selected', true);
                jQuery("#idSelSistConsPesSexo option[value='" + intSexo + "']").prop('selected', true);
                jQuery("#idSelSistConsPesFil option[value='" + intFilial + "']").prop('selected', true);
                jQuery("#idSelSistConsPesNiv option[value='" + intAcesso + "']").prop('selected', true);
                jQuery("#idSelSistConsPesSit option[value='" + intSituacao + "']").prop('selected', true);
                jQuery("#idSelSistConsPesFaixa option[value='" + intFaixa + "']").prop('selected', true);


                jQuery("#idImgSistConsPesFoto").prop("src", foto + "?" + dataAgoraCache);
                jQuery("#idDatSistConsPesNasc").val(nascimento);
                jQuery("#idTxtSistConsPesIden").val(identidade);
                jQuery("#idTxtSistConsPesCPF").val(cpf);
                jQuery("#idTxtSistConsPesTel").val(telefone);
                jQuery("#idTxtSistConsPesCel").val(celular);
                jQuery("#idTxtSistConsPesEnL").val(logradouro);
                jQuery("#idNumSistConsPesEnN").val(numero);
                jQuery("#idTxtSistConsPesEnC").val(complemento);
                jQuery("#idTxtSistConsPesEnB").val(bairro);
                jQuery("#idTxtSistConsPesECi").val(cidade);
                jQuery("#idTxtSistConsPesEEs").val(estado);
                jQuery("#idTxtSistConsPesEPa").val(pais);
                jQuery("#idTxtSistConsPesECE").val(cep);
                jQuery("#idTxtSistConsPesEma").val(email);
                jQuery("#idTxtSistConsPesEmax").val(emailExt);
                jQuery("#idNumSistConsPesTaP").val(taxa);
                //---agora vai buscar a faixa da pessoa
                // fPegaFaixa(idPessoa,"idSelSistConsPesFaixa");
            } else {
                jQuery("#idImgSistConsPesFoto").prop("src", "/imagens/interroga.png");
            }//if retorno
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
    });//idSelSistConsPesPro change
    //--------------------------------------------------
    //===================        
    //-ooo---BLOCO DASHBOARD **********
    jQuery(document).on("click","#idBtnHDash",function () {
        //jQuery(".claFlexDash").show();
        jQuery(".claFormularios").hide();
        jQuery("#idDivHDash").show();
    });//idBtnHDash click
    //-------------------------
    //-oooBLOCO DA PESSOA--*************
    jQuery("#idBtnHPess").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivHPessoa").show();
    });//idBtnHPess click
    //-------------------------
    jQuery("#idBtnMenuPessCad").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormPesReg").show();
    });//idBtnMenuPessCad click
    //--------------------------
    jQuery("#idBtnMenuPessPes").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormPesPes").show();
    });//idBtnMenuPessPes click
    //--------------------------

    //-oooBLOCO DO CLIENTE************
    jQuery("#idBtnHClie").click(function () {
        jQuery("#idDivHCliente").show();
    });//idBtnHClie click
    //-------------------------
    jQuery("#idBtnMenuCliCad").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormCliReg").show();
    });//idBtnMenuCliCad click
    //--------------------------
    jQuery("#idBtnMenuCliPes").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormCliPes").show();
    });//idBtnMenuCliPes click
    //--------------------------

    //-ooo---BLOCO DAS PASTAS**********
    jQuery("#idBtnHPast").click(function () {
        jQuery("#idDivHPasta").show();
    });//idBtnHPast click
    //-------------------------
    jQuery("#idBtnMenuPasCad").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormPasReg").show();
    });//idBtnMenuPasCad click
    //--------------------------
    jQuery("#idBtnMenuPasPes").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormPasPes").show();
    });//idBtnMenuPasPes click
    //--------------------------

    //-ooo---BLOCO DA CRONOLÓGICA**********
    jQuery("#idBtnHCrono").click(function () {
        jQuery("#idDivHCrono").show();
        //console.log("global na Crono",global_Int_NivelNaMaquina);
    });//idBtnHCrono click
    //-------------------------
    jQuery("#idBtnMenuCronoCad").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormCronoReg").show();
    });//idBtnMenuCronoCad click
    //--------------------------
    jQuery("#idBtnMenuCronoPes").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormCronoPes").show();
    });//idBtnMenuCronoPes click
    //--------------------------

    //-ooo---BLOCO DOS PROCESSOS**********
    jQuery("#idBtnHProc").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivHProc").show();
        });//idBtnHProc click
    //-------------------------
    jQuery("#idBtnMenuProCad").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormProReg").show();
    });//idBtnMenuProCad click
    //--------------------------
    jQuery("#idBtnMenuProPes").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormProPes").show();
    });//idBtnMenuProPes click
    //--------------------------
    jQuery("#idBtnMenuProAnda").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormProAnda").show();
    });//idBtnMenuProAnda click
    //--------------------------

    //-ooo---BLOCO DO TIMESHEET**********
    jQuery("#idBtnHTime").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivHTime").show();
    });//idBtnHTime click
    //-------------------------
    jQuery("#idBtnMenuTimCad").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormTimReg").show();
        //----já carrega os rascunhos no berçário desta pessoa que está na máquina
        let objTabBer = jQuery("#idTabTimRegBer");//tabela-berçário para rascunhos
        objTabBer.empty();
        //----------
        let intRedator = jQuery("#idSpaLogNaMaquinaId").text();  
        fPegaRascunhosPreencheTabela(intRedator,objTabBer)              ;
    });//idBtnMenuTimCad click
    //--------------------------
    jQuery("#idBtnMenuTimPes").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormTimPes").show();
    });//idBtnMenuTimPes click
    //--------------------------

    //-ooo---BLOCO DAS DESPESAS **********
    jQuery("#idBtnHDesp").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivHDesp").show();
    });//idBtnHDesp click
    //-------------------------
    jQuery("#idBtnMenuDespCad").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormDespReg").show();
    });//idBtnMenuDespCad click
    //--------------------------
    jQuery("#idBtnMenuDespPes").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormDespPes").show();
    });//idBtnMenuDespPes click
    //--------------------------

    //-ooo---BLOCO DO FATURAMENTO **********
    jQuery("#idBtnHFatu").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivHFatu").show();
    });//idBtnHFatu click
    //-------------------------
    jQuery("#idBtnMenuFatuCad").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormFatuReg").show();
        let sigla = jQuery("#idSpaLogNaMaquinaSigla").text();
        let objData = new Date();
        let ano=objData.getFullYear();
        let mes=objData.getMonth()+1;
        if(mes*1<10) mes ="0"+mes;
        let dia=objData.getDate();
        if(dia*1<10) dia ="0"+dia;
        let horas=objData.getHours();
        if(horas*1<10) horas ="0"+horas;
        let minutos=objData.getMinutes();
        if(minutos*1<10) minuos ="0"+minutos;
        let segundos=objData.getSeconds();
        if(segundos*1<10) segundos ="0"+segundos;
        let numeroFatura = sigla+"#"+ano+mes+dia+horas+minutos+segundos;
        jQuery("#idSpaFatuRegNuFat").text(numeroFatura);
        fDataFutura(5,"#idDatFatuRegVen");//sugere a data do boleto com mais 5 dias
    });//idBtnMenuFatuCad click
    //--------------------------
    jQuery("#idBtnMenuFatuPes").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormFatuPes").show();
    });//idBtnMenuFatuPes click
    //--------------------------

    //-ooo---BLOCO DA EXPEDIÇÃO **********
    jQuery("#idBtnHExpe").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivHExpe").show();
    });//idBtnHExpe click
    //-------------------------
    jQuery("#idBtnMenuExpeCad").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormExpeReg").show();
    });//idBtnMenuExpeCad click
    //--------------------------
    jQuery("#idBtnMenuExpePes").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormExpePes").show();
    });//idBtnMenuExpePes click
    //--------------------------
    jQuery("#idBtnMenuExpeAdm").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormExpeAdm").show();
    });//idBtnMenuExpeAdm click
    //--------------------------
    //-ooo---BLOCO DO ALMOXARIFADO **********
    jQuery("#idBtnHAlmo").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivHAlmo").show();
    });//idBtnHAlmo click
//----------------------------------------------------------
    jQuery("#idBtnLembretes").click(function () {
        jQuery(".claFormularios").hide();
        //jQuery(".claTelaLembrete").show();
        jQuery("#idDivLembreteRegistro").show();
        fCarregaLembretes(2);//carregar todos os lembretes ativos
        //sugere data de hoje e uma hora à frente
        let objDataHoje = new Date();
let dataFinal=objDataHoje.toLocaleDateString();//dd/mm/aaaa
let diaF=dataFinal.substring(0,2);
let mesF=dataFinal.substring(3,5);
let anoF=dataFinal.substring(6);
let horaAtual = jQuery("#timer").text();
let hora = horaAtual.substring(0,2);//hh:mm:ss
let restante = horaAtual.substring(2,5);//resulta em ':mm:ss'
hora = hora*1+1;//põe uma hora à frente
if(hora.toString().length==1) hora = "0"+hora;//corrigindo um dígito
let horaAFrente = hora+restante;
jQuery("#idDatLembreteInicio").val(anoF+"-"+mesF+"-"+diaF+"T"+horaAFrente);
let minutos = horaAtual.substring(3,5);
if(minutos*1<50) minutos = minutos*1+10;
let horaAlarme = hora+":"+minutos;
jQuery("#idDatLembreteFim").val(anoF+"-"+mesF+"-"+diaF+"T"+horaAlarme);
});//idBtnLembretes click
//----------------------------------------------------------------
        //-ooo---BLOCO DO SISTEMA **********
        jQuery("#idBtnSistema").click(function () {
            alert ("Ainda não programado");
        });//idBtnHAlmo click
        //-------------------------
    jQuery("#idBtnMenuAlmoCad").click(function () {
        let idRedator = jQuery("#idSpaLogNaMaquinaId").text();
        jQuery("#idSelAlmoRegSol option[value='" + idRedator + "']").prop('selected', true);
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormAlmoReg").show();
    });//idBtnMenuAlmoCad click
    //--------------------------
    jQuery("#idBtnMenuAlmoPes").click(function () {
        let idRedator = jQuery("#idSpaLogNaMaquinaId").text();
        jQuery("#idSelAlmoPesSol option[value='" + idRedator + "']").prop('selected', true);
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormAlmoPes").show();
    });//idBtnMenuAlmoPes click
    //--------------------------
    jQuery("#idBtnMenuAlmoComp").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormAlmoComp").show();
    });//idBtnMenuAlmoComp click
    //--------------------------
    jQuery("#idBtnMenuAlmoAdm").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormAlmoAdm").show();
        let intAtendidos = jQuery("#idChkAlmoAdmPIA:checked").val();
        let intTodos = jQuery("#idChkAlmoAdmPIC:checked").val();
        if(typeof intAtendidos == "undefined" && typeof intTodos == "undefined"){
        fCarregaAlmoxarifadoPendentes(0);//SÓ OS PENDENTES
        }
        if(intAtendidos*1 == 1 && typeof intTodos == "undefined"){
            fCarregaAlmoxarifadoPendentes(1);//PENDENTES E ATENDIDOS
        }
        if(intTodos*1 == 1){
            fCarregaAlmoxarifadoPendentes(2);//PENDENTES, ATENDIDOS, cancelados e rascunho
        }
    });//idBtnMenuAlmoAdm click
    //--------------------------
    jQuery("#idBtnMenuAlmoForn").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormAlmoForn").show();
    });//idBtnMenuAlmoForn click
    //--------------------------

    //-ooo---BLOCO DO SISTEMA **********
    jQuery("#idBtnHSist").click(function () {
        jQuery("#idDivHSist").show();
    });//idBtnHAlmo click
    //-------------------------
    jQuery("#idBtnMenuSistPes").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormSistPess").show();
    });//idBtnMenuSistPes click
    //--------------------------
    jQuery("#idBtnMenuSistCli").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormSistCli").show();
    });//idBtnMenuSistCli click
    //--------------------------
    jQuery("#idBtnMenuSistPas").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormPasSist").show();
    });//idBtnMenuSistPas click
    //--------------------------
    jQuery("#idBtnMenuProSist").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormSistProc").show();
    });//idBtnMenuProSist
    //--------------------------
    jQuery("#idBtnMenuSistTime").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormSistTime").show();
    });//idBtnMenuSistTime
    //---------------------------------
    jQuery("#idBtnMenuSistDesp").click(function () {
        jQuery(".claFormularios").hide();
        jQuery("#idDivFormSistDesp").show();
    });//idBtnMenuSistDesp click
    //--------------------------
    jQuery("#idBtnMenuSistFatu").click(function () {
        jQuery(".claFormularios").hide();
        fCarregaNotasPendentesAprovacao();
        jQuery("#idDivFormSistFatu").show();
    });//idBtnMenuSistFatu click
    //--------------------------
    /*
    jQuery("#idBtnPasRegSalvar").click(function () {
        let idCliente = jQuery("#idSelPasRegCli option:selected").val();
        let materia = jQuery("#idTxtPasRegMate").val();
        let idResp = jQuery("#idSelPasRegResp option:selected").val();
        let idArea = jQuery("#idSelPasRegArea option:selected").val();
    });//idBtnPasRegSalvar click
    */
    //--------------------------
    jQuery("#idBtnPesRegSalvar").click(function () {
        //Salvando pessoa nova como rascunho e enviando para o Administrador para validar
        let emailCoord = jQuery("#idHidTxtPesRegEmailCoor").val();
        let siglaNaMaquina = jQuery("#idSpaLogNaMaquinaSigla").text();
        let objSpa = jQuery("#idSpaPesRegAvi");
        objSpa.text('');
        objSpa.css({ "color": "initial" });
        let cpf = jQuery("#idTxtPesRegCPF").val();
        //let sigla = jQuery("#idTxtPesRegSigla").val().toUpperCase();
        let sigla="sigla ?";
        
        let senha = sigla.toLowerCase();
        let intRedator = jQuery("#idSpaLogNaMaquinaId").text();
        let pessoa = jQuery("#idTxtPesRegNome").val().toUpperCase();
        let corpo = "Por favor, a pessoa de nome "+pessoa+" registrou-se e pede sua avaliação para lhe dar nível de acesso, email corporativo, taxa-padrão e outras providências e ativá-la, se for o caso";
        let intSexo = jQuery("#idTxtPesRegSexo option:selected").val();
        let intCategoria = jQuery("#idSelPesRegCat option:selected").val();
        //let intFaixa = jQuery("#idSelPesRegFaixa option:selected").val();
        let intFaixa = 0; 
        let intFilial = jQuery("#idSelPesRegFil option:selected").val();
        let nascimento = jQuery("#idDatPesRegNasc").val();
        let identidade = jQuery("#idTxtPesRegIden").val();
        let telefone = jQuery("#idTxtPesRegTel").val();
        let celular = jQuery("#idTxtPesRegCel").val();
        let cep = jQuery("#idTxtPesRegECE").val();
        let intTipoLog = jQuery("#idSelPesRegETL option:selected").val();
        let logradouro = jQuery("#idTxtPesRegEnL").val().toUpperCase();
        let numero = jQuery("#idNumPesRegEnN").val();
        let complemento = jQuery("#idTxtPesRegEnC").val().toUpperCase();
        let bairro = jQuery("#idTxtPesRegEnB").val().toUpperCase();
        let cidade = jQuery("#idTxtPesRegECi").val().toUpperCase();
        let estado = jQuery("#idTxtPesRegEEs").val().toUpperCase();
        let intPais = jQuery("#idSelPesRegEPa option:selected").val();
        //---O início da vigência da taxa-padrão é gravada na tabela de taxa padrão, mais abaixo
        //let taxa = jQuery("#idNumPesRegTaP").val();
        let taxa = 0;
        //---
        //let intAcesso = jQuery("#idSelPesRegNiv option:selected").val();
        let intAcesso=2;
        //let intStatus = jQuery("#idSelPesRegSit option:selected").val();
        let intStatus=1;
        //let email = jQuery("#idTxtPesRegEmP").val().toLowerCase();
        let email="@escribaoffice.com.br";
        
        let emailExterno = jQuery("#idTxtPesRegEmX").val().toLowerCase();
        let foto = '/imagens/' + sigla.toLowerCase() + ".png";//as fotos são sigla com extensão png
        //---
        let intPassa = 0;
        if (intStatus * 1 > 1 && cpf.length > 0 && sigla.length > 0 && pessoa.length > 0
            && intSexo * 1 > 0 && intCategoria * 1 > 0 && intFilial * 1 > 0
            && nascimento.length > 0 && identidade.length > 0 && telefone.length > 0
            && celular.length > 0 && cep.length > 0 && intTipoLog * 1 > 0 && logradouro.length > 0
            && numero.length > 0 && complemento.length > 0 && bairro.length > 0 && cidade.length > 0
            && estado.length > 0 && intPais * 1 > 0 && taxa * 1 > 0 && intAcesso * 1 > 0
            && email.length > 0) {
            intPassa = 1;//tudo certo pode passar
        }
        if (intStatus * 1 == 1) {
            intPassa = 1;//pode passar mesmo sem preencher tudo porque é rascunho.
            //Entretanto, por segurança extra: mesmo sendo rascunho, ...
            //...pelo menos o nome e sigla tem de ter
            if (pessoa.length == 0 && sigla.length == 0) intPassa = 0;
        }//if intStatus
        if (intPassa == 1) {
            let sqlInsert = `INSERT 
        INTO tabpessoas 
        (redator_tabpessoas,pessoa,sigla,senha,faixa_tabfaixas,categoria_tabcategorias,
        filial_tabfiliais,nascimento,identidade,int_sexo,
        cpf,telefone,celular,cep,tipo_tabtiposlogradouro,logradouro,
        numero,complemento,bairro,cidade,estado,pais_tabpaises,
        acesso_tabacessos,int_status,email,email_externo,foto) 
        VALUES 
        (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            //os dados abaixo têm de estar na mesma ordem das ?...
            //...da esquerda para a direita  na sentença de update
            let arrayValores = [intRedator, pessoa, sigla, senha, intFaixa, intCategoria,
                intFilial, nascimento, identidade, intSexo,
                cpf, telefone, celular, cep, intTipoLog, logradouro, numero,
                complemento, bairro, cidade, estado, intPais, intAcesso,
                intStatus, email, emailExterno, foto];
            let tripa = fPrepara(arrayValores);
            //console.log("no salvamneto da pessoa: "+ sqlInsert+"  ====>>>> "+sqlInsert+" "+tripa);
            //-------------------post----------------
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */            
            jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsert, tripa: tripa }, function (retorno) {
                //console.log("Salvando a pessoa: "+retorno);
                if (retorno * 1 > 0) {
                    jQuery(".claInputPesReg").val("");
                    fCarregaTodasPessoas(2);//recarrega a nova pessoa em todas as páginas
                    fGravaLog(siglaNaMaquina + " Insert pessoa nova: " + sqlInsert + " " + tripa);

                    let sqlInsertT = `INSERT 
        INTO tabtaxaspadrao  
        (profissional_tabpessoas,valor,int_status) 
        VALUES 
        (?,?,?)`;
                    //os dados abaixo têm de estar na mesma ordem das ?...
                    //...da esquerda para a direita  na sentença de update
                    let idPes = retorno * 1;
                    let arrayValoresT = [idPes, taxa, intStatus];
                    let tripaT = fPrepara(arrayValoresT);
                    //console.log("INSERÇÃO DE TAXA-PADRÃO: "+tripaT);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */                    
                    jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsertT, tripa: tripaT }, function (retornoT) {
                        //console.log("Será que isto é o número do ID da pessoa recém-inserida?: "+retorno);
                        if (retornoT * 1 > 0) {
                            //---------------------------------------------------------------------------/A
                            objSpa.css({ "color": "green" });
                            objSpa.text("Gravado com sucesso");
                            fGravaLog(siglaNaMaquina + " Insert taxa-padrão depois de pessoa nova: " + sqlInsert + " " + tripa);
                            fEnviaEmail(emailCoord,"Registro de Pessoa nova a confirmar "+pessoa,corpo,"");
                        } else {
                            alert("HOUVE UM PROBLEMA com a gravação da taxa-padrão. A pessoa foi criada normalmente.")
                            fGravaLog(siglaNaMaquina + "  PROBLEMA: Insert taxa-padrão depois de pessoa nova: " + sqlInsert + " " + tripa);
                        }//if retornoT 
                    });//post T
                } else {
                    objSpa.css({ "color": "red" });
                    objSpa.text("HOUVE UM PROBLEMA com a gravação da pessoa");
                    fGravaLog(siglaNaMaquina + "   PROBLEMA: Insert pessoa nova: " + sqlInsert + " " + tripa);
                }//if retorno
            });//post
        } else {
            alert(`Só é possível salvar com parte dos 
    campos sem preenchimento se a situação 
    for marcada explicitamente como Rascunho. E, mesmo assim, pelo menos o nome e sigla deverão ser indicados.`);
        }//if intPode==1
    });//idBtnPesRegSalvar
    //------------------------------------------
    jQuery("#idBtnCliRegSalvar").click(function () {
        //Salvando cliente novo
        let siglaNaMaquina = jQuery("#idSpaLogNaMaquinaSigla").text();
        let objSpa = jQuery("#idSpaCliRegAvi");
        objSpa.text('');
        objSpa.css({ "color": "initial" });
        let intRedator = jQuery("#idSpaLogNaMaquinaId").text();
        let nomeRazao = jQuery("#idTxtCliRegRaz").val().toUpperCase();
        let intResponsavel = jQuery("#idSelCliRegResp option:selected").val();
        let intFilial = jQuery("#idSelCliRegFil option:selected").val();
        let intTipoPessoa = jQuery("#idSelCliRegTiP option:selected").val();
        let cpfCnpj = jQuery("#idTxtCliRegCPFCNPJ").val();
        let identidade = jQuery("#idTxtCliReg").val();
        let email = jQuery("#idTxtCliRegEmC").val().toLowerCase();
        let telefone = jQuery("#idTxtCliRegTeP").val();
        let celular = jQuery("#idTxtCliRegCeP").val();
        let cep = jQuery("#idTxtCliRegECE").val();
        let intTipoLogradouro = jQuery("#idSelCliRegETL option:selected").val();
        let logradouro = jQuery("#idTxtCliRegEnL").val().toUpperCase();
        let numero = jQuery("#idNumCliRegEnN").val();
        let complemento = jQuery("#idTxtCliRegEnC").val().toUpperCase();
        let bairro = jQuery("#idTxtCliRegEnB").val().toUpperCase();
        let cidade = jQuery("#idTxtCliRegECi").val().toUpperCase();
        let estado = jQuery("#idTxtCliRegEEs").val().toUpperCase();
        let intPais = jQuery("#idSelCliRegEPa option:selected").val();
        let contato = jQuery("#idTxtCliRegNoo").val().toUpperCase();
        let telefoneContato = jQuery("#idTxtCliRegTelCon").val();
        let celularContato = jQuery("#idTxtCliRegCelCon").val();
        let intStatus = jQuery("#idSelCliRegSit option:selected").val();
        //---
        let intPodeSalvar=1;
        if(intStatus*1 != 1 && (nomeRazao == "" || intResponsavel == "" || intFilial == "" || 
        cpfCnpj =="" || telefone == "")) intPodeSalvar=0;
        if(intPodeSalvar*1==1){
        let sqlInsert = `INSERT 
    INTO tabclientes  
    (redator_tabpessoas, cliente, 
        resp_tabpessoas, filial_tabfiliais, int_tipopessoa,
         cpfcnpj, identidade, email, telefone, celular, cep, 
        tipo_tabtiposlogradouro, logradouro, 
        numero, complemento, bairro, cidade, 
        estado, pais_tabpaises, contato, telefone_contato, 
        celular_contato,int_status) 
    VALUES 
    (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        //os dados abaixo têm de estar na mesma ordem das ?...
        //...da esquerda para a direita  na sentença de update
        let arrayValores = [intRedator, nomeRazao, intResponsavel,
            intFilial, intTipoPessoa, cpfCnpj, identidade, email, telefone,
            celular, cep, intTipoLogradouro, logradouro, numero,
            complemento, bairro, cidade, estado, intPais,
            contato, telefoneContato, celularContato, intStatus
        ];
        let tripa = fPrepara(arrayValores);
        //console.log(sqlInsert+" ====>>>> "+tripa);
        //-------------------post----------------
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsert, tripa: tripa }, function (retorno) {
            console.log(retorno);
            if (retorno * 1 > 0) {
                objSpa.css({ "color": "green" });
                objSpa.text("Gravado com sucesso");
                jQuery(".claInputCliReg").val("");
                fCarregaClientes();//recarrega o novo cliente em todas as páginas 
                fGravaLog(siglaNaMaquina + " Insert cliente novo: " + sqlInsert + " " + tripa);
            } else {
                objSpa.css({ "color": "red" });
                objSpa.text("HOUVE UM PROBLEMA com a gravação do cliente");
                fGravaLog(siglaNaMaquina + " PROBLEMA: Insert cliente novo: " + sqlInsert + " " + tripa);
            }//if retorno
        });//post
    }else{
        alert ("Por favor, o cadastro está incompleto. Nesta situação só poderá ser salvo como Rascunho (veja o último campo 'Status do Cliente')");
    }//if intPodeSalvar
    });//idBtnCliRegSalvar click
    //--------------------------------------------
    jQuery("#idBtnPasRegSalvar").click(function () {
        //Salvando pasta nova
        let siglaNaMaquina = jQuery("#idSpaLogNaMaquinaSigla").text();
        let objSpa = jQuery("#idSpaPasRegAvi");
        objSpa.text('');
        objSpa.css({ "color": "initial" });
        let intRedator = jQuery("#idSpaLogNaMaquinaId").text();
        let intCliente = jQuery("#idSelPasRegCli option:selected").val();
        let materia = jQuery("#idTxtPasRegMate").val();
        let resumo = jQuery("#idTAPasRegResumo").val();
        let intResp = jQuery("#idSelPasRegResp option:selected").val();
        let valorHono = jQuery("#idNumPasRegVaH").val();
        let intArea = jQuery("#idSelPasRegArea option:selected").val();
        let doc = "x";
        let intStatus = jQuery("#idSelPasRegSitu option:selected").val();
        var novaPasta = 1;//se não encontrar nenhuma pasta é porque será  a 1
        //---pegar a última pasta existente na tavela e somar 1
        let sqlSel = `SELECT max(pasta) as pasta 
    FROM tabpastas`;
    try {
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        jQuery.post("/phpPaginas/bdExecuta.php", { sql: sqlSel, intOperacao: global_int_operacaoSelect }, function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                novaPasta = obj.resultados[0].pasta * 1 + 1;
            }
            //--depois de pegar a próxima pasta, fazer a inserção do número       
            let sqlInsert = `INSERT INTO tabpastas
        (redator_tabpessoas, cliente_tabclientes,pasta,
           materia, resumo,valor_hono,responsavel_tabpessoas, area_tabareas,
           documentacao,int_status)
           VALUES (?,?,?,?,?,?,?,?,?,?)`;
            //os dados abaixo têm de estar na mesma ordem das ?...
            //...da esquerda para a direita  na sentença de update
            let arrayValores = [intRedator, intCliente, novaPasta, materia,resumo,valorHono,
                intResp, intArea, doc, intStatus];
            let tripa = fPrepara(arrayValores);
            //console.log(sqlInsert+" ====>>>> "+sqlInsert+" "+tripa);
         
            //-------------------post----------------
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */            
            jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsert, tripa: tripa }, function (retorno) {
                //console.log(retorno);
                if (retorno * 1 > 0) {
                    jQuery("#idSpaPasRegNum").text(novaPasta);
                    objSpa.css({ "color": "green" });
                    objSpa.text("Gravado com sucesso");
                    jQuery(".claInputPasReg").val("");
                    fCarregaClientes();//recarrega o novo cliente em todas as páginas
                    fGravaLog(siglaNaMaquina + " Insert pasta nova: " + sqlInsert + " " + tripa);
                } else {
                    objSpa.css({ "color": "red" });
                    objSpa.text("HOUVE UM PROBLEMA com a gravação");
                    fGravaLog(siglaNaMaquina + "  PROBLEMA: Insert pasta nova: " + sqlInsert + " " + tripa);
                }//if retorno
            });//post  
        });//post 
    }catch (e){
        //console.log(e);
    }
    });//idBtnPasRegSalvar click
    //---------------------------------------------
    jQuery("#idSelPasPesCli").change(function () {
        //selecionando pastas de acordo com o cliente
        let limpezaCache = new Date();
        let idCliente = jQuery(this).val() * 1;
        let objSel = jQuery("#idSelPasPesPas");
        fSelecionaPastas(idCliente,objSel);
        //-------
        let objTab = jQuery("#idTabPasPesResultado");
        objTab.empty();
       // jQuery("#idSelPasPesPas option[value='0']").prop('selected', true);
        //-------
        let sql = `SELECT c.cliente,p.id,p.pasta,p.materia,p.resumo,g.pessoa as responsavel,
 a.area,p.int_status,p.documentacao  
 FROM tabpastas p 
 INNER JOIN tabpessoas g 
 ON p.responsavel_tabpessoas = g.id 
 INNER JOIN tabareas a 
 ON p.area_tabareas = a.id 
 INNER JOIN tabclientes c 
 ON p.cliente_tabclientes = c.id 
 WHERE p.cliente_tabclientes = `+ idCliente + ` 
 ORDER BY p.pasta desc`;
        //-------
        let concatena = '';
        let concatenaPDF = '';
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    if(i==0){
                        let cliente = obj.resultados[i].cliente;
                    concatena = concatena + '<tr><td colspan="7"><h2>'+cliente+'</h2></td></tr>';
                    concatenaPDF = concatenaPDF + '<tr><td colspan="6"><h2>'+cliente+'</h2></td></tr>';
                    concatena =concatena + '<tr><th>id</th><th>Pasta</th><th>Matéria</th><th>Resumo</th><th>Responsável</th><th>Área</th><th>Doc</th><th>Status</th></tr>';
                    concatenaPDF =concatenaPDF + '<tr><th>Pasta</th><th>Matéria</th><th>Resumo</th><th>Responsável</th><th>Área</th><th>Doc</th><th>Status</th></tr>';
                    }//if i
            
                    let idLido = obj.resultados[i].id;
                    let pasta = obj.resultados[i].pasta;
                    let materia = obj.resultados[i].materia;
                    let resumo = obj.resultados[i].resumo;
                    let responsavel = obj.resultados[i].responsavel;
                    let area = obj.resultados[i].area;
                    let doc = obj.resultados[i].documentacao;
                    let linkDocumento =`<a href="`+ doc +`?`+limpezaCache+`" target="_blank">`+doc+`</a>`;
                    if(doc =='x') linkDocumento='-';
                    let intStatus = obj.resultados[i].int_status;
                    concatena = concatena + `<tr><td>` + idLido + `</td>
             <td>`+ pasta + `</td><td>` + materia + `</td><td>`+resumo+`</td>
             <td>`+ responsavel + `</td><td>` + area + `</td><td title="Carta de honorários e afins">`+linkDocumento+`</td>
             <td>`+ intStatus + `</td>
             </tr>`;
         
             concatenaPDF = concatenaPDF + `<tr><td>`+ pasta + `</td><td>` + materia + `</td><td>`+resumo+`</td>
             <td>`+ responsavel + `</td><td>` + area + `</td><td title="Carta de honorários e afins">`+linkDocumento+`</td>
             <td>`+ intStatus + `</td>
             </tr>`;
                }//for i
            }//if retorno.lenth
            objTab.append(concatena);
            jQuery("#idTAPasPesPDF").val("<table>"+concatenaPDF+"</table>");
        }, function (respostaErrada) {
            console.log("idSelPasPesCli change",frespostaErrada);
        }).catch(function (e) {
            console.log("idSelPasPesCli catch",e);
        });//fExecutaBD
    });//idSelPasPesCli
//-------------------------------------------------------------------
jQuery("#idSelPasConsCli").change(function () {
    //selecionando pastas do conserto de pastas de acordo com o cliente
    let limpezaCache = new Date();
    let idCliente = jQuery(this).val() * 1;
    let objSel = jQuery("#idSelPasConsPas");
    fSelecionaPastas(idCliente,objSel);
});//idSelPasConsCli
  //---------------------------------------------
    jQuery("#idSelPasPesPas").change(function () {
        //selecionando a pasta, recupera o cliente e os dados da pasta selecionada
        //jQuery("#idSelPasPesCli option[value='0']").prop('selected', true);
        let limpezaCache=new Date();
        let idPasta = jQuery(this).val() * 1;
        let objTab = jQuery("#idTabPasPesResultado");
        objTab.empty();
        //-------
        let sql = `SELECT p.id,p.pasta,p.materia,p.resumo,g.pessoa as responsavel,
    a.area,p.int_status,p.documentacao,c.cliente   
    FROM tabpastas p INNER JOIN tabpessoas g 
    ON p.responsavel_tabpessoas = g.id 
    INNER JOIN tabareas a 
    ON p.area_tabareas = a.id 
    INNER JOIN tabclientes c 
    ON p.cliente_tabclientes = c.id 
    WHERE p.id = `+ idPasta + ` 
    ORDER BY p.pasta desc`;
        //-------
       let concatena = `<tr><th>id</th><th>Cliente</th><th>Pasta</th>
       <th>Matéria</th><th>Resumo</th><th>Responsável</th><th>Área</th>
       <th>Doc</th><th>Status</th></tr>`;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */       
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let idLido = obj.resultados[i].id;
                    let cliente = obj.resultados[i].cliente;
                    let pasta = obj.resultados[i].pasta;
                    let materia = obj.resultados[i].materia;
                    let resumo = obj.resultados[i].resumo;
                    let responsavel = obj.resultados[i].responsavel;
                    let area = obj.resultados[i].area;
                    let doc = obj.resultados[i].documentacao;
                    let intStatus = obj.resultados[i].int_status;
                    concatena = concatena + `<tr><td>` + idLido + `</td>
                <td>`+ cliente + `</td>
                <td>`+ pasta + `</td><td>` + materia + `</td><td>`+resumo+`</td>
                <td>`+ responsavel + `</td><td>` + area + `</td><td title="Carta de honorários e afins"><a href="`+ doc +`?`+limpezaCache+`" target="_blank">`+doc+`</a></td>
                <td>`+ intStatus + `</td>
                </tr>`;
                }//for i
            }//if retorno.lenth
            objTab.append(concatena);
            jQuery("#idTAPasPesPDF").val("<table>"+concatena+"</table>");
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
    });//idSelPasPesPas
     //---------------------------------------------
     jQuery("#idSelPasConsPas").change(function () {
        //selecionando a pasta, recupera os dados da pasta selecionada
        let idPasta = jQuery(this).val() * 1;
        //-------
        let sql = `SELECT p.id,p.pasta,p.materia,p.resumo,p.responsavel_tabpessoas as responsavel,
    p.area_tabareas as area,p.int_status,p.documentacao,p.valor_hono 
    FROM tabpastas p 
    WHERE p.id = `+ idPasta;
    //console.log(sql);
        //-------
      /*
            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */       
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            //console.log('retorno',retorno);
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                    let materia = obj.resultados[i].materia;
                    let resumo = obj.resultados[i].resumo;
                    let responsavel = obj.resultados[i].responsavel;
                    let valorHono = obj.resultados[i].valor_hono;
                    let area = obj.resultados[i].area;
                    let intStatus = obj.resultados[i].int_status;
                    jQuery("#idTxtPasConsMate").val(materia);
                    jQuery("#idSelPasConsResp option[value='"+responsavel+"']").prop('selected', true);
                    jQuery("#idTAPasConsResumo").val(resumo);
                    jQuery("#idNumPasConsVaH").val(valorHono);
                    jQuery("#idSelPasConsArea option[value='"+area+"']").prop('selected', true);
                    jQuery("#idSelPasConsSitu option[value='"+intStatus+"']").prop('selected', true);
            }//if retorno.lenth
        }, function (respostaErrada) {
        console.log("idSelPasConsPas",respostaErrada);
        }).catch(function (e) {
            console.log("catch",e);
        });//fExecutaBD
    });//idSelPasConsPas
    //---------------------------------------------
    jQuery("#idBtnExpeRegMapa").click(function () {
        let enderecoCompleto = jQuery("#idTxtExpeRegEnC").val();
        fTraduzEnderecoEmMapa(enderecoCompleto);
    });//idBtnExpeRegMapa click
    //---------------------------------------------------
    jQuery(document).on("change","#idSelFatuAdmFaturas",function (){
        let idNota = jQuery("option:selected",this).val();
        fSelecionaNotaPorFatura(idNota);
    });//idSelFatuAdmFaturas change
//---------------------------------------------------------
jQuery(document).on("change","#idSelFatuAdmCli",function (){
let idCli = jQuery("option:selected",this).val();
let intStatus = jQuery('input:radio[name=namRadFatuAdmSel]:checked').val();
fSelecionaNotasPorCliente(idCli,intStatus);
});//idSelFatuAdmCli change
//---------------------------------------------------------
jQuery(document).on("change","input[name='namRadFatuAdmSel']",function (){
    let idCli = jQuery("#idSelFatuAdmCli option:selected").val();
    let intStatus = jQuery('input:radio[name=namRadFatuAdmSel]:checked').val();
    fSelecionaNotasPorCliente(idCli,intStatus);
});//input type radio namRadFatuAdmSel
//---------------------------------------------------------
jQuery(document).on("click",".claBtnFatuApr",function (){
    //Aprovar fatura / aprova faturamento
    let idFatura = jQuery(this).attr("id");
        //----pega o cliente e a fatura
    let objTab = jQuery("#idTabFatuAdmTab");
    objTab.find('tr').each(function (i, el) {
        let tds = jQuery(this).find('td');
        let cliente = tds.eq(1).text();
        let pasta = tds.eq(2).text();
        let materia = tds.eq(3).text();
        let faturado = tds.eq(5).text();
        let vencimento = tds.eq(7).text();
        let descricao = tds.eq(8).text();
        let valor  = tds.eq(9).text();
        let emailRedator = tds.eq(14).text();
             if(cliente.length>10){
            //-----
            let texto = `Fatura do Cliente `+cliente+`, cobrada de `+faturado+`,
            da pasta `+pasta+` (`+materia+`), referente a `+descricao+`, no valor de `+valor+` 
            com vencimento em `+vencimento+` 
            foi aprovada com sucesso`;
            fAprovaReprovaFaturamento(emailRedator,idFatura,texto,"3","aprovação");
                return false;//para pular fora e parar o each
             }//if
     });//objTab find
       });//claBtnFatuApr click
//---------------------------------------------------------
jQuery(document).on("click",".claBtnFatuRep",function (){
    //Reprovar uma fatura / reprova faturamento
let idFatura = jQuery(this).attr("id");
    //----pega o cliente e a fatura
    let objTab = jQuery("#idTabFatuAdmTab");
    objTab.find('tr').each(function (i, el) {
        let tds = jQuery(this).find('td');
             let cliente = tds.eq(1).text();
             let pasta = tds.eq(2).text();
             let materia = tds.eq(3).text();
             let faturado = tds.eq(5).text();
             let vencimento = tds.eq(7).text();
             let descricao = tds.eq(8).text();
             let valor  = tds.eq(9).text();
             let emailRedator = tds.eq(14).text();
             if(cliente.length>10){
            //-----
            let texto = `Fatura do Cliente `+cliente+`, cobrada de `+faturado+`,
            da pasta `+pasta+` (`+materia+`), referente a `+descricao+`, no valor de `+valor+`,
            com vencimento em `+vencimento+` foi REPROVADA`;
            fAprovaReprovaFaturamento(emailRedator,idFatura,texto,"7", "REPROVAÇÃO");
                return false;//para pular fora e parar o each
             }//if
     });//objTab find
});//claBtnFatuRep click
//--------------------------------------------------------
jQuery(document).on("change","#idSelExpePesSol",function (){
    let objTab = jQuery('#idTabExpePesPeP');
    objTab.empty();
});//idSelExpePesSol change
//----------------------------------------------------------
jQuery(document).on("click","#idBtnExpePesPeP",function (){
let idSol = jQuery("#idSelExpePesSol option:selected").val();
let daI = jQuery("#idDatExpePesDaI").val();
let daF = jQuery("#idDatExpePesDaF").val();
let objTab = jQuery('#idTabExpePesPeP');
objTab.empty();
//---
let sql = `SELECT e.id, p1.pessoa as redator, p2.pessoa as solicitante, int_natureza, descricao, 
data_agendada, aos_cuidados, endereco, obs, data_insercao, 
status 
FROM tabexpedicao e 
INNER JOIN tabpessoas p1 
ON e.redator_tabpessoas = p1.id 
INNER JOIN tabpessoas p2 
ON e.solicitante_tabpessoas = p2.id 
WHERE e.solicitante_tabpessoas = `+idSol;
//---
let concatena=`<tr><th>SOLICITANTE</th><th>NATUREZA</th><th>DESCRIÇÃO</th><th>DATA AGENDADA</th>
<th>AOS CUIDADOS</th><th>ENDEREÇO</th><th>OBS</th><th>DATA DA INSERÇÃO</th><th>REDATOR</th><th>STATUS</th></tr>`;
//---
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
let intOperacao = global_int_operacaoSelect;
let tripa = "";
fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
if (retorno.length > 20) {
    let obj = JSON.parse(retorno);
    let i = 0;
    for (i; i < obj.resultados.length; i++) {
        let idLido = obj.resultados[i].id;
        let redator = obj.resultados[i].redator;
        let solicitante = obj.resultados[i].solicitante;
        //---
        let intNatureza= obj.resultados[i].int_natureza;
        let natureza="";
        switch (intNatureza*1){
            case 1:
            natureza="Correspondência";
                break;
                case 2:
                    natureza="Bancos";
                    break;
                    case 3:
                        natureza="Outros";
                        break;
        }//switch
        //---
        let descricao = obj.resultados[i].descricao;
        let dataAgendada = obj.resultados[i].data_agendada;
        let aosCuidados = obj.resultados[i].aos_cuidados;
        let endereco = obj.resultados[i].endereco;
        let obs = obj.resultados[i].obs;
        let dataInsercao = obj.resultados[i].data_insercao;
        let status = obj.resultados[i].status;
        let statusTexto="";
        let estiloStatus="background-color:initial;";
        switch (status*1){
        case 1:
        statusTexto="Rascunho";
        break;
        case 2:
        statusTexto="Pendente";
        estiloStatus="background-color:yellow;";

        break;
        case 3:
        statusTexto="Atendido";
        estiloStatus="background-color:green;";
        break;
        case 7:
        statusTexto="Cancelado";
        estiloStatus="background-color:tomato";
        break;
        }//switch
        //---
        concatena = concatena+`<tr><td>`+solicitante+`</td><td>`+natureza+`</td><td>`+descricao+`</td><td>`+dataAgendada+`</td>
        <td>`+aosCuidados+`</td><td>`+endereco+`</td><td>`+obs+`</td><td>`+dataInsercao+`</td>
        <td>`+redator+`</td><td style="`+estiloStatus+`">`+statusTexto+`</td></tr>`
    }//for i
    objTab.append(concatena);
}//if retorno
}, function (respostaErrada) {
//console.log(respostaErrada);
}).catch(function (e) {
//console.log(e);
});//fExecutaBD
//---
});//idBtnExpePesPeP click
//----------------------------------------------------------
jQuery(document).on("click","#idBtnExpeAdmPeP",function (){
//Administrando expedição (pesquisando)
let intStatus = jQuery('input:radio[name=namRadExpeAdmSel]:checked').val();
let idRedator = jQuery("#idSpaLogNaMaquinaId").text();
let idSolicitante = jQuery("#idSelExpeAdmSol option:selected").val();
let daI = jQuery("#idDatExpeAdmDaI").val();
let daF = jQuery("#idDatExpeAdmDaF").val();
let objTab = jQuery("#idTabExpePes");
objTab.empty();
//---montando as cláusulas-----------C
//---cláusula default
let clausulaWhere=`WHERE e.data_insercao >= '`+daI+`'  
AND e.data_insercao <= '`+daF+`' `;
//--
if (intStatus*1==0 && idSolicitante*1==0){
    //quero todas do redator
    clausulaWhere = clausulaWhere +`AND e.redator_tabpessoas = `+idRedator+` `;
}
if (intStatus*1==0 && idSolicitante*1>0){
    //quero todas do solicitante
    clausulaWhere = clausulaWhere +`AND e.solicitante_tabpessoas = `+idSolicitante+` `;
}
//--
if (intStatus*1==2 && idSolicitante*1==0){
    //quero pendentes do redator
    clausulaWhere = clausulaWhere +`
    AND e.status = `+intStatus+` 
    AND e.redator_tabpessoas = `+idRedator+` `;
}
if (intStatus*1==2 && idSolicitante*1>0){
    //quero pendentess do solicitante
    clausulaWhere = clausulaWhere +`
    AND e.status = `+intStatus+` 
    AND e.solicitante_tabpessoas = `+idSolicitante+` `;
}
//--
if (intStatus*1==3 && idSolicitante*1==0){
    //quero todas ATENDIDAS do redator
    clausulaWhere = clausulaWhere +`
    AND e.status = `+intStatus+` 
    AND e.redator_tabpessoas = `+idRedator+` `;
}
if (intStatus*1==3 && idSolicitante*1>0){
    //quero todas as ATENDIDAS do solicitante
    clausulaWhere = clausulaWhere +`
    AND e.status = `+intStatus+` 
    AND e.solicitante_tabpessoas = `+idSolicitante+` `;
}
//--
if (intStatus*1==7 && idSolicitante*1==0){
    //quero todas canceladas do redator
    clausulaWhere = clausulaWhere +`
    AND e.status = `+intStatus+` 
    AND e.redator_tabpessoas = `+idRedator+` `;
}
if (intStatus*1==7 && idSolicitante*1>0){
    //quero todas as canceladas do solicitante
    clausulaWhere = clausulaWhere +`
    AND e.status = `+intStatus+` 
    AND e.solicitante_tabpessoas = `+idSolicitante+` `;
}
//-----------------------------------/C
let concatena=`<tr><th></th><th>SOLICITANTE</th><th>NATUREZA</th><th>DESCRIÇÃO</th><th>DATA AGENDADA</th>
<th>AOS CUIDADOS</th><th>ENDEREÇO</th><th>OBS</th><th>DATA DA INSERÇÃO</th><th>REDATOR</th><th>STATUS</th></tr>`;
//---
let sql = `SELECT e.id,p1.pessoa as redator,p2.pessoa as solicitante,e.int_natureza,e.descricao,
e.data_agendada,e.aos_cuidados,e.endereco,e.obs,e.data_insercao,e.status 
FROM tabexpedicao e 
INNER JOIN tabpessoas p1 
ON e.redator_tabpessoas = p1.id 
INNER JOIN tabpessoas p2 
ON e.solicitante_tabpessoas = p2.id `
+clausulaWhere+` 
ORDER BY e.data_insercao`;
//---
//console.log("sql da seleção da expedição",sql);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
let intOperacao = global_int_operacaoSelect;
let tripa = "";
fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
    //console.log("retorno da seleção de expedição",retorno);
    if (retorno.length > 20) {
        let obj = JSON.parse(retorno);
        let i = 0;
        for (i; i < obj.resultados.length; i++) {
            let idLido = obj.resultados[i].id;
        let redator = obj.resultados[i].redator;
        let solicitante = obj.resultados[i].solicitante;
        //---
        let intNatureza= obj.resultados[i].int_natureza;
        let natureza="";
        switch (intNatureza*1){
            case 1:
            natureza="Correspondência";
                break;
                case 2:
                    natureza="Bancos";
                    break;
                    case 3:
                        natureza="Outros";
                        break;
        }//switch
        //---
        let descricao = obj.resultados[i].descricao;
        let dataAgendada = obj.resultados[i].data_agendada;
        let aosCuidados = obj.resultados[i].aos_cuidados;
        let endereco = obj.resultados[i].endereco;
        let obs = obj.resultados[i].obs;
        let dataInsercao = obj.resultados[i].data_insercao;
        let status = obj.resultados[i].status;
        let statusTexto="";
        let estiloStatus="background-color:initial;";
        switch (status*1){
        case 1:
        statusTexto="Rascunho";
        break;
        case 2:
        statusTexto="Pendente";
        estiloStatus="background-color:yellow;";

        break;
        case 3:
        statusTexto="Atendido";
        estiloStatus="background-color:green;";
        break;
        case 7:
        statusTexto="Cancelado";
        estiloStatus="background-color:tomato";
        break;
        }//switch
        //---
        concatena = concatena+`<tr><td>
        <button type="button" id="`+idLido+`" class="btn btn-warning claBtnExpSta" title="Alterar status do pedido de id `+idLido+`">Alterar este</button></td>
        <td>`+solicitante+`</td><td>`+natureza+`</td><td>`+descricao+`</td><td>`+dataAgendada+`</td>
        <td>`+aosCuidados+`</td><td>`+endereco+`</td><td>`+obs+`</td><td>`+dataInsercao+`</td>
        <td>`+redator+`</td><td style="`+estiloStatus+`">`+statusTexto+`</td></tr>`
        }//for i
        objTab.append(concatena);
    }//if retorno

}, function (respostaErrada) {
    //console.log(respostaErrada);
}).catch(function (e) {
    //console.log(e);
});//fExecutaBD
});//idBtnExpeAdmPeP click
//------------------------------------------------------------
jQuery(document).on("change","#idSelSisSQLPes",function (){
    let objTA = jQuery("#idTASisSQLIndices");
    let objTAConf = jQuery("#idTASisSQLConfere");
    let tabelaId = jQuery("option:selected",this).val();
    //---Oculta o campo de cláusula ON e mostra se for selecionado mais de uma tabela
    let objTAON = jQuery("#idTASisSQLCamposON");
    objTAON.prop("disabled",true);
    //---

    let tabelaNome = jQuery("option:selected",this).prop('title');

let preserva = objTA.val();
//---se tiver mais de uma vírgula, libera o campo da cláusula ON
let qtdVirg = (preserva.match(/,/g) || []).length;
if(qtdVirg>0){
    objTAON.prop("disabled",false);//libera
}//if qtdVirg
//---
let preservaConf = objTAConf.val();
objTA.val(preserva+tabelaId+",");
objTAConf.val(preservaConf+tabelaNome+",");
 //---se a escolha for '0', vai limpar os campos
 if(tabelaId*1==0){
    objTA.val('');
    objTAConf.val('');
}//if tabelaId
});//idSelSisSQLPes change
//-----------------------------------------------------------
jQuery(document).on("click","#idBtnSisSQLExecuta",function (){
//mostra como ficará a chamada jQuery post para passar para a página phoMontagem.php o que será enviada ao banco de dados
let instrucao = jQuery("#idSelSisSQLOperacao option:selected").val();
let indicesTabelas = jQuery("#idTASisSQLIndices") .val();
//---retirar a última vírgula dos índices das tabelas
let tamanho = indicesTabelas.length;
indicesTabelas = indicesTabelas.substring(0,tamanho-1);
let ons = jQuery("#idTASisSQLCamposON").val();
//---retirar as última vírgula do ONS e inverter a ordem inserida
tamanho = ons.length;
ons = ons.substring(0,tamanho);
//ons = ons.split(",").reverse().join(",");
//---contar quantos elementos têm na cláusula where
let clausulaW = jQuery("#idTASisSQLCamposW").val();
let valoresW = jQuery("#idTASisSQLCamposWV").val();
//retirar a última vírgula da clausulaW
tamanho = clausulaW.length;
clausulaW = clausulaW.substring(0,tamanho);
valoresW = valoresW.substring(0,tamanho);
//transformar em array
let arrayClausulaW=clausulaW.split(",");
let arrayClausulaValoresW=valoresW.split(",");
let qtdElementos = (clausulaW.match(/,/g) || []).length+1;//1 vírgula = 2 elementos
//criando prefixo para cada um dos campos do where
let camposWhere="";
let valoresWhere="";
let i=0;
for(i;i<qtdElementos;i++){
camposWhere = camposWhere+"t"+i+"."+arrayClausulaW[i]+",";
valoresWhere = valoresWhere+arrayClausulaValoresW[i]+",";
}//for i
//inverter a ordem dos campos where
//camposWhere = camposWhere.split(",").reverse().join(",");
//valoresWhere = valoresWhere.split(",").reverse().join(",");
camposWhere = camposWhere.split(",").reverse().join(",");
valoresWhere = valoresWhere.split(",").reverse().join(",");
//como huver reverse, agora a primeira vírgula é que tem de ser retirada
camposWhere= camposWhere.substring(1);//a partir do segundo caracter
valoresWhere = valoresWhere.substring(1);


//---
let concatena =`let instrucao="`+instrucao+`"; 
        let tabs = '`+indicesTabelas+`';//cliente,pasta (na ordem lógica de encadeamento)
        let ons = '`+ons+`';
         let camposW='`+camposWhere+`';//WHERE: o índice 't' da referência da tabela tem de seguir a posição: t0 na primeira, t1 na segunda
        let valoresW = "`+valoresWhere+`";//WHERE:valores na ordem inversa da da variável tabs e tantas posições quantos forem as dos 'ons'
        jQuery.post("phpPaginas/phpMontagem.php",{operacao:instrucao,tripaIndiceTab:tabs,conexoes:ons,limitacoes:camposW,limitacoesVal:valoresW},function (retorno){
            alert (retorno);
        });//post`;
        jQuery("#idTASisSQLMontado").val(concatena);
});//idBtnSisSQLExecuta click
//------------------------------------------------------------
jQuery(document).on("click","#idBtnBCExecuta",function (){
    //confere cep
    let cep = jQuery("#idTxtBCCEP").val();
    let arrayValores = [cep];
    let objCep = new Correio(1,arrayValores);
    objCep.setConfereCEP("#idTabBCResposta");
});//idBtnBCExecuta click
//---------------------
jQuery(document).on("click","#idBtnCorSedCalcular",function (){
    //calcula frete sedex,carta,pac
    let objTab = jQuery("#idTabCorSedTabela");
    objTab.empty();
    let tipo = jQuery("#idSelCorTipo option:selected").val();
    let formato = jQuery("#idSpaCorSedFormato").text();
    let peso = jQuery("#idNumCorSedPeso").val();
    let comprimento = jQuery("#idNumCorSedComprimento").val();
    let largura = jQuery("#idNumCorSedLargura").val();
    let altura = jQuery("#idNumCorSedAltura").val();
    let cepOrigem = jQuery("#idTxtCorSedCepOrigem").val();
    let cepDestino = jQuery("#idTxtCorSedCepDestino").val();
    let maoPropria = jQuery("#idSelCorSedMao option:selected").val();
    if(maoPropria=='-1') maoPropria='0';
    let avisoRecebimento = jQuery("#idSelCorSedAR option:selected").val();
    if(avisoRecebimento=='-1') avisoRecebimento='0';
    let intProsseguir=0;
    if(peso*1>0 && comprimento*1 > 0 && largura*1>0 && altura *1 > 0 && cepOrigem.length>0 && cepDestino.length>0) intProsseguir=1;
        jQuery.post("phpPaginas/phpCorreios.php",
    {operacao:2,
    tipoRemessa:tipo,
    formato:formato,
    CEPOrigem:cepOrigem,
    CEPDestino:cepDestino,
    maoPropria:maoPropria,
    avisoRecebimento:avisoRecebimento,
    peso:peso,
    comprimento:comprimento,
    largura:largura,
    altura:altura,
        },
    function (retorno){
        objTab.append(retorno);
    });//phpCorreios
    
    //---
});//idBtnCorSedCalcular click
//-------------------------------------------------------
jQuery( "#dialog" ).dialog({
    height: "auto",
    width: 500
});
//--------------------------------------------------------
jQuery("#idBtnUsuarioSalvar").click(function () {
    //Salvando pessoa nova que não tem login e entrando como usuario
    let emailCoord = jQuery("#idHidTxtUsuarioEmailCoor").val();
    let siglaNaMaquina = jQuery("#idSpaLogNaMaquinaSigla").text();
    let objSpa = jQuery("#idSpaUsuarioAvi");
    objSpa.text('');
    objSpa.css({ "color": "initial" });
    let cpf = jQuery("#idTxtUsuarioCPF").val();
    //let sigla = jQuery("#idTxtUsuarioSigla").val().toUpperCase();
    let sigla="sigla ?";
    let senha = sigla.toLowerCase();
    let intRedator = jQuery("#idSpaLogNaMaquinaId").text();
    let pessoa = jQuery("#idTxtUsuarioNome").val().toUpperCase();
    let corpo = "Por favor, a pessoa de nome "+pessoa+" registrou-se e pede sua avaliação para lhe dar nível de acesso, email corporativo, taxa-padrão e outras providências e ativá-la, se for o caso";
    let intSexo = jQuery("#idTxtUsuarioSexo option:selected").val();
    let intCategoria = jQuery("#idSelUsuarioCat option:selected").val();
    //let intFaixa = jQuery("#idSelUsuarioFaixa option:selected").val();
    let intFaixa = 0; 
    let intFilial = jQuery("#idSelUsuarioFil option:selected").val();
    let nascimento = jQuery("#idDatUsuarioNasc").val();
    let identidade = jQuery("#idTxtUsuarioIden").val();
    let telefone = jQuery("#idTxtUsuarioTel").val();
    let celular = jQuery("#idTxtUsuarioCel").val();
    let cep = jQuery("#idTxtUsuarioECE").val();
    let intTipoLog = jQuery("#idSelUsuarioETL option:selected").val();
    let logradouro = jQuery("#idTxtUsuarioEnL").val().toUpperCase();
    let numero = jQuery("#idNumUsuarioEnN").val();
    let complemento = jQuery("#idTxtUsuarioEnC").val().toUpperCase();
    let bairro = jQuery("#idTxtUsuarioEnB").val().toUpperCase();
    let cidade = jQuery("#idTxtUsuarioECi").val().toUpperCase();
    let estado = jQuery("#idTxtUsuarioEEs").val().toUpperCase();
    let intPais = jQuery("#idSelUsuarioEPa option:selected").val();
    //---O início da vigência da taxa-padrão é gravada na tabela de taxa padrão, mais abaixo
    //let taxa = jQuery("#idNumUsuarioTaP").val();
    let taxa = 0;
    //---
    //let intAcesso = jQuery("#idSelUsuarioNiv option:selected").val();
    let intAcesso=2;
    //let intStatus = jQuery("#idSelUsuarioSit option:selected").val();
    let intStatus=1;
    //let email = jQuery("#idTxtUsuarioEmP").val().toLowerCase();
    let email="@escribaoffice.com.br";
    
    let emailExterno = jQuery("#idTxtUsuarioEmX").val().toLowerCase();
    let foto = '/imagens/' + sigla.toLowerCase() + ".png";//as fotos são sigla com extensão png
    //---
    let intPassa = 0;
    if (intStatus * 1 > 1 && cpf.length > 0 && sigla.length > 0 && pessoa.length > 0
        && intSexo * 1 > 0 && intCategoria * 1 > 0 && intFilial * 1 > 0
        && nascimento.length > 0 && identidade.length > 0 && telefone.length > 0
        && celular.length > 0 && cep.length > 0 && intTipoLog * 1 > 0 && logradouro.length > 0
        && numero.length > 0 && complemento.length > 0 && bairro.length > 0 && cidade.length > 0
        && estado.length > 0 && intPais * 1 > 0 && taxa * 1 > 0 && intAcesso * 1 > 0
        && email.length > 0) {
        intPassa = 1;//tudo certo pode passar
    }
    if (intStatus * 1 == 1) {
        intPassa = 1;//pode passar mesmo sem preencher tudo porque é rascunho.
        //Entretanto, por segurança extra: mesmo sendo rascunho, ...
        //...pelo menos o nome e sigla tem de ter
        if (pessoa.length == 0 && sigla.length == 0) intPassa = 0;
    }//if intStatus
    if (intPassa == 1) {
        let sqlInsert = `INSERT 
    INTO tabpessoas 
    (redator_tabpessoas,pessoa,sigla,senha,faixa_tabfaixas,categoria_tabcategorias,
    filial_tabfiliais,nascimento,identidade,int_sexo,
    cpf,telefone,celular,cep,tipo_tabtiposlogradouro,logradouro,
    numero,complemento,bairro,cidade,estado,pais_tabpaises,
    acesso_tabacessos,int_status,email,email_externo,foto) 
    VALUES 
    (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        //os dados abaixo têm de estar na mesma ordem das ?...
        //...da esquerda para a direita  na sentença de update
        let arrayValores = [intRedator, pessoa, sigla, senha, intFaixa, intCategoria,
            intFilial, nascimento, identidade, intSexo,
            cpf, telefone, celular, cep, intTipoLog, logradouro, numero,
            complemento, bairro, cidade, estado, intPais, intAcesso,
            intStatus, email, emailExterno, foto];
        let tripa = fPrepara(arrayValores);
        //console.log("no salvamneto da pessoa: "+ sqlInsert+"  ====>>>> "+sqlInsert+" "+tripa);
        //-------------------post----------------
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsert, tripa: tripa }, function (retorno) {
            //console.log("Salvando a pessoa: "+retorno);
            if (retorno * 1 > 0) {
                jQuery(".claInputPesReg").val("");
                fCarregaTodasPessoas(2);//recarrega a nova pessoa em todas as páginas
                fGravaLog(siglaNaMaquina + " Insert pessoa nova: " + sqlInsert + " " + tripa);
                let sqlInsertT = `INSERT 
    INTO tabtaxaspadrao  
    (profissional_tabpessoas,valor,int_status) 
    VALUES 
    (?,?,?,?,?,?,?)`;
                //os dados abaixo têm de estar na mesma ordem das ?...
                //...da esquerda para a direita  na sentença de update
                let idPes = retorno * 1;
                let arrayValoresT = [idPes, taxa, intStatus];
                let tripaT = fPrepara(arrayValoresT);
                //console.log("INSERÇÃO DE TAXA-PADRÃO: "+tripaT);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */                
                jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsertT, tripa: tripaT }, function (retornoT) {
                    //console.log("Será que isto é o número do ID da pessoa recém-inserida?: "+retorno);
                    if (retornoT * 1 > 0) {
                        //---------------------------------------------------------------------------/A
                        objSpa.css({ "color": "green" });
                        objSpa.text("Gravado com sucesso");
                        fGravaLog(siglaNaMaquina + " Insert taxa-padrão depois de pessoa nova: " + sqlInsert + " " + tripa);
                        fEnviaEmail(emailCoord,"Registro de Pessoa nova a confirmar "+pessoa,corpo,"");
                    } else {
                        alert("HOUVE UM PROBLEMA com a gravação da taxa-padrão. A pessoa foi criada normalmente.")
                        fGravaLog(siglaNaMaquina + "  PROBLEMA: Insert taxa-padrão depois de pessoa nova: " + sqlInsert + " " + tripa);
                    }//if retornoT 
                });//post T
            } else {
                objSpa.css({ "color": "red" });
                objSpa.text("HOUVE UM PROBLEMA com a gravação da pessoa");
                fGravaLog(siglaNaMaquina + "   PROBLEMA: Insert pessoa nova: " + sqlInsert + " " + tripa);
            }//if retorno
        });//post
    } else {
        alert(`Só é possível salvar com parte dos 
campos sem preenchimento se a situação 
for marcada explicitamente como Rascunho. E, mesmo assim, pelo menos o nome e sigla deverão ser indicados.`);
    }//if intPode==1
});//idBtnUsuarioSalvar
//-----------------------------------------------------------
jQuery(document).on("change","#idSelSistConsPesPen",function (){
//quando o admin seleciona um nome na lista de usuários pendentes de confirmação, o change seleciona a lista geral,...
//..para forçar o preenchimento dos campos
let idPessoa = jQuery("option:selected",this).val();
jQuery("#idSelSistConsPesPro option[value='"+idPessoa+"']").prop('selected', true);
jQuery("#idSelSistConsPesPro").trigger("change");
});//idSelSistConsPesPen change
//-----------------------------------------------------------
jQuery(document).on("click",".claBtnExpSta",function (){
    //altera o status do pedido da Expedição
let idLido = jQuery(this).attr("id");
document.cookie = "idPedido=" + idLido;
window.open("../paginas/expedicao.html","exped","width=600,height=400");
});//claBtnExpSta click
//------------------------------------------------------------
jQuery(document).on("blur","#idTxtAlmoFornCPFCNPJ",function (){
    fLimpaFornecedores();
let cpfCnpj = jQuery(this).val();
let objBtn = jQuery("#idBtnAlmoFornSalvar");
objBtn.prop("disabled",false);
objBtn.prop("title","");
let objSpa = jQuery("#idSpaAlmoFornAviso");
objSpa.text('');
//---Verifica agora se o CPF/CNPJ está correto
jQuery.post("/phpPaginas/bdExecuta.php", { cpfCnpj: cpfCnpj, intOperacao: 6 }, function (retorno) {
    //console.log("retorno do tete do cpf",retorno);
    if (retorno * 1 == 0) {
        objBtn.prop("disabled", true);
            objSpa.text("Reveja o CPF/CNPJ preenchido. A sequência numérica não está correta. CPFs têm 11 dígitos; CNPJs 14.");
            objBtn.prop("title", "Bloqueado por erro de preenchimento no CPF/CNPJ");
    }else{
        //já que o CPF/CNPJ está correto, verificar se já existe este fornecedor no banco de dados
        fVerificaExistenciaCPFCNPJFornecedor(cpfCnpj);//se existir ele marca o hidden como 1 (e carrega os campos), do contrário zero
    }//if retorno
    });//post
//---
});//idTxtAlmoFornCPDFCNPJ
//-------------------------------------------------------------
jQuery(document).on("click","#idBtnAlmoFornSalvar",function (){
    //salvando um novo fornecedor ou fazendo update
    let siglaRedator = jQuery("#idSpaLogNaMaquinaSigla").text();
    let idRedator = jQuery("#idSpaLogNaMaquinaId").text();
    let nomeForn=jQuery("#idTxtAlmoFornNomeF").val();
    let cpfCnpj = jQuery("#idTxtAlmoFornCPFCNPJ").val();
    let email = jQuery("#idTxtAlmoFornEmail").val();
    let telF=jQuery("#idTxtAlmoFornTelef").val();
    let cepF=jQuery("#idTxtAlmoFornCEP").val();
    let tipoL=jQuery("#idSelAlmoFornTipoLog option:selected").val();
    let lograd = jQuery("#idTxtAlmoFornLog").val();
    let numero = jQuery("#idNumAlmoFornNum").val();
    let comple = jQuery("#idTxtAlmoFornComp").val();
    let bairro = jQuery("#idTxtAlmoFornBai").val();
    let cidade = jQuery("#idTxtAlmoFornCid").val();
    let estado = jQuery("#idTxtAlmoFornEst").val();
    let pais = jQuery("#idSelAlmoFornPais option:selected").val();
    let nomeCon = jQuery("#idTxtAlmoFornContato").val();
    let telCon = jQuery("#idTxtAlmoFornTelCon").val();
    let celCon = jQuery("#idTxtAlmoFornCelCon").val();
    let status = jQuery("#idSelAlmoFornStatus option:selected").val();
    if(nomeForn.length>0 && cpfCnpj.length>0 && telF.length>0 && lograd.length>0){
    let intInsOuUpdate=jQuery("#idHidAlmoFornUpdate").val();//populado na f verifica existência fornecedor
    if (intInsOuUpdate*1==0){
        //é insert de um novo fornecedor porque o cpf/cnpj não existe
        let sqlInsert = `INSERT INTO tabfornecedores(redator_tabpessoas, fornecedor, cpfcnpj, email, 
            telefone, cep, tipo_tabtiposlogradouro, 
            logradouro, numero, complemento, bairro, cidade, estado, pais_tabpaises, contato, telefone_contato, 
            celular_contato,status) 
            VALUES (?,?,?,?,?,?,?,?,?,?,
            ?,?,?,?,?,?,?,?)`;
           //console.log("insert de faturado: ",sqlInsert);
           let arrayValores = [idRedator,nomeForn,cpfCnpj,email,telF,cepF,tipoL,lograd,
            numero,comple,bairro,cidade,estado,pais,nomeCon,telCon,celCon,status];
            let tripa = fPrepara(arrayValores);
            //console.log(arrayValores);
            //console.log(sqlInsert+" ====>>>> "+sqlInsert+" "+tripa);
            //-------------------post----------------
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */            
            jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsert, tripa: tripa }, function (retorno) {
                //console.log("retorno do insert   ",retorno);
                if (retorno * 1 > 0) {
                    alert ("Fornecedor salvo com sucesso");
                    fGravaLog(siglaRedator + " Insert tabela de fornecedores: " + sqlInsert + " " + tripa);
                } else {
                    fGravaLog(siglaRedator + "  PROBLEMA: Insert tabela fornecedores: " + sqlInsert + " " + tripa);
                }//if retorno
            });//post  
    }else{
        //é update do fornecedor
        let sqlUpdate = `UPDATE tabfornecedores SET fornecedor=?,cpfcnpj=?,email=?,
        telefone=?,cep=?,tipo_tabtiposlogradouro=?,
        logradouro=?,numero=?,complemento=?,
        bairro=?,cidade=?,estado=?,
        pais_tabpaises=?,contato=?,telefone_contato=?,
        celular_contato=?,data_edicao=?,status=? 
        WHERE cpfcnpj = ?`;
        //console.log("fAprovaReprovaFaturamento: ",sqlUpdate);
        //console.log("dentro de fAprovaReprovaFaturamento",destinatarios);
        let dataEdicao = new Date().toLocaleString();
           let arrayValores = [nomeForn,cpfCnpj,email,telF,cepF,tipoL,lograd,numero,
            comple,bairro,cidade,estado,pais,nomeCon,telCon,celCon,dataEdicao,status,cpfCnpj];
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */            
           let intOperacao = global_int_operacaoUpdateDelete;
           let tripa = fPrepara(arrayValores);
           fExecutaBD(intOperacao, sqlUpdate, tripa).then(function (retorno) {
               if (retorno * 1 > 0) {
                alert ("Atualizado o fornecedor com sucesso");
                fGravaLog(siglaRedator + " UPDATE tabela de fornecedores com sucesso: " + sqlUpdate+ " " + tripa);
               }else{
                alert ("Houve um problema com a atualização do fornecedor: "+retorno);
                fGravaLog(siglaRedator + " UPDATE tabela de fornecedores com PROBLEMAS: " + sqlUpdate + " " + tripa);
               }
            });//fexecutaBD
    }//if intInsOuUpdate
}else{
    alert ("Preencha todos os campos, por favor");
}//if nomeForn
});//idBtnAlmoFornSalvar click
//---------------------------------------------------------------
jQuery(document).on("change","#idSelAlmoCompNat",function (){
    //ao trocar a natureza do material na compra do almoxarifado
    let idNat = jQuery("option:selected",this).val();
    let objSel = jQuery("#idSelAlmoCompMat");
    objSel.empty();
    let concatena = '<option value="0" title="0">...</option>';
    let sql = `SELECT id,material 
    FROM tabalmomat 
    WHERE natureza_tabalmonat = `+idNat;
    //------
                                                                  /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let idLido = obj.resultados[i].id;
                let material = obj.resultados[i].material;
                concatena = concatena + '<option value="' + idLido + '" title="' + idLido + '">' + material + '</option>';
            }//for i
        }//if retorno
        objSel.append(concatena);
    }, function (respostaErrada) {
        //console.log("fCarregAlmoMaterial",respostaErrada);
    }).catch(function (e) {
        //console.log("fCarregaAlmoMaterial catch",e);
    });//fExecutaBD
 
});//idSelAlmoCompNat change
//--------------------------------------------------------------------------
jQuery(document).on("click","#idBtnAlmoCompSalC",function (){
    //salva compras(insert ou update) para o almoxarifado
    let contador=0;
    let intInsUp = jQuery("#idHidAlmoCompFlag").val();//será insert ou update (0=insert)
    let siglaRedator = jQuery("#idSpaLogNaMaquinaSigla").text();
    let idRedator = jQuery("#idSpaLogNaMaquinaId").text();
    let nf = jQuery("#idTxtAlmoCompNF").val();
    let idMaterial = jQuery("#idSelAlmoCompMat option:selected").val();
    let dataCompra = jQuery("#idDatAlmoCompData").val();
    let qtd = jQuery("#idNumAlmoCompQtd").val();
    let idForn = jQuery("#idSelAlmoCompForn option:selected").val();
    let intStatus = jQuery("#idSelAlmoCompStatus option:selected").val();
    if(nf.length>0 && idMaterial*1>0 && dataCompra.length > 0 && qtd*1 > 0 && idForn *1 > 0){
    if(intInsUp*1==0){
        //insert
        let sqlInsert = `INSERT INTO tabcompras (redator_tabpessoas,material_tabalmomat,data_compra,
            quantidade,fornecedor_tabfornecedores,nota_fiscal) 
              VALUES(?,?,?,?,?,?)`;
        let arrayValores = [idRedator,idMaterial,dataCompra,qtd,idForn,nf];
        let tripa = fPrepara(arrayValores);
        //console.log(sqlInsert+" ====>>>> "+tripa);
        //console.log("arrayValores",arrayValores);
        //-------------------post----------------
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsert, tripa: tripa }, function (retorno) {
            //console.log("retorno do insert TS: " + retorno);
            if (retorno * 1 > 0) {
                alert("Inseriu com sucesso");
                fGravaLog(siglaRedator + " Insert compras almoxarifado: " + sqlInsert + " " + tripa);
            } else {
                fGravaLog(siglaRedator + " PROBLEMA: Insert compras almoxarifado: " + sqlInsert + " " + tripa);
            }//if retorno
        });//post        
    }else{
        //update
        let sqlUpdate = `UPDATE tabcompras SET redator_tabpessoas=?,
        material_tabalmomat=?,data_compra=?,quantidade=?,fornecedor_tabfornecedores=?,
        nota_fiscal=?,data_edicao=?,int_status=?  
        WHERE nota_fiscal = ?`;
        let dataEdicao = new Date().toLocaleString();        
           let arrayValores = [idRedator,idMaterial,dataCompra,qtd,idForn,nf,dataEdicao,intStatus,nf];
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */           
           let intOperacao = global_int_operacaoUpdateDelete;
           let tripa = fPrepara(arrayValores);
           //console.log("ArrayValores",arrayValores);
           fExecutaBD(intOperacao, sqlUpdate, tripa).then(function (retorno) {
            //console.log("retorno",retorno);
               if (retorno * 1 > 0) {
                   contador++;
                   let objTab = jQuery("#idTabSistDespPesTab");
                   objTab.empty();
                   fGravaLog(siglaRedator + " UPDATE compras com sucesso: " + sqlUpdate + " " + tripa);
               }else{
                fGravaLog(siglaRedator + " UPDATE compras com problema: " + sqlUpdate + " " + tripa);
               }//if
           }).then(function () {
               alert("Fez " + contador + " alterações");
           });//fExecutaBD
    }//if intInsUp
    }else{
        alert ("Preencha todos os campos antes de salvar, por favor");
    }//if nf
});//idBtnAlmoCompSalC click
//---------------------------------------------------------------------------
jQuery(document).on("blur","#idTxtAlmoCompNF",function (){
//procura nas compras esta nota fiscal para ver se é insert ou update
fLimpaCompras();
let numeroNF = jQuery(this).val();
let sql = `SELECT c.id, n.id as idNatureza, m.id as idMaterial,a.id as idApresentacao,
c.data_compra,c.quantidade,a.apresentacao,f.id as idFornecedor, 
c.nota_fiscal,c.obs,c.int_status  
    FROM tabcompras c 
    INNER JOIN tabalmomat m 
    ON c.material_tabalmomat = m.id 
    INNER JOIN tabalmonat n 
    ON m.natureza_tabalmonat = n.id 
    INNER JOIN tabalmoapres a 
    ON m.apresentacao_tabalmoapres  = a.id 
    INNER JOIN tabfornecedores f 
    ON c.fornecedor_tabfornecedores = f.id 
    WHERE nota_fiscal = '`+numeroNF+`'`;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */    
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    //console.log(sql);
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        //console.log("retorno da busca por compras",retorno);
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            if(obj.resultados.length>0) {
                //é update. Vai preencher os campos 
                let idNatureza =obj.resultados[i].idNatureza;
                let idMaterial = obj.resultados[i].idMaterial;
                let dataCompra = obj.resultados[i].data_compra;
                let qtd = obj.resultados[i].quantidade;
                 let idApr = obj.resultados[i].idApresentacao;
                 let apresentacao = obj.resultados[i].apresentacao;
                let idForn = obj.resultados[i].idFornecedor;
                let nf = obj.resultados[i].nota_fiscal;
                let intStatus = obj.resultados[i].int_status;
                //--
                jQuery("#idSelAlmoCompNat option[value='"+idNatureza+"']").prop('selected', true);
                jQuery("#idTxtAlmoCompNF").val(nf);
                jQuery("#idSelAlmoCompMat option[value='"+idMaterial+"']").prop('selected', true);
                //console.log("idMaterial",idMaterial);
                jQuery("#idDatAlmoCompData").val(dataCompra);
                jQuery("#idNumAlmoCompQtd").val(qtd);
                jQuery("#idSpaNumAlmoCompApre").text(apresentacao);
                jQuery("#idSelAlmoCompForn option[value='"+idForn+"']").prop('selected', true);
                jQuery("#idHidAlmoCompFlag").val("1");//marca 1 neste hidden para indicar que, se for salvar, será update
                jQuery("#idSelAlmoCompStatus option[value='"+intStatus+"']").prop('selected', true);
                jQuery("#idSelAlmoCompForn").trigger("change");
            }else{
                alert ("Verifique as compras. O retorno trouxe resultados, mas o parse do JSON diz que não");
            }//if obj
        }else{
            //é insert
            //alert ("é insert");
            jQuery("#idHidAlmoCompFlag").val("0");//marca 0 neste hidden para indicar que será insert
        }//if retorno
    }, function (respostaErrada) {
        //console.log("idTxtAlmoCompNF blur",respostaErrada);
    }).catch(function (e) {
        //console.log("idTxtAlmoCompNF blur catch",e);
    });//fExecutaBD
});//idTxtAlmoCompNF blur
//------------------------------------------------------------------
jQuery(document).on("change","#idSelAlmoCompForn",function (){
let idForn = jQuery("option:selected",this).val();
let nomeFornecedor = jQuery("option:selected",this).text().toUpperCase();
let objTab = jQuery("#idTabAlmoCompReP");
objTab.empty();
//alert ("idForn"+idForn);
let concatena = '';
        let sql = `SELECT c.id,g.pessoa as redator,m.material,m.natureza_tabalmonat as idNatureza,
        c.redator_tabpessoas as idRedator,c.material_tabalmomat as idMaterial,
        m.apresentacao_tabalmoapres as idApres,c.fornecedor_tabfornecedores as idForn,
        c.data_compra,c.quantidade,
        a.apresentacao,c.nota_fiscal,c.int_status 
        FROM tabcompras c 
        INNER JOIN tabalmomat m 
        ON c.material_tabalmomat = m.id 
        INNER JOIN tabpessoas g 
        ON c.redator_tabpessoas = g.id 
        INNER JOIN tabalmoapres a 
        ON m.apresentacao_tabalmoapres = a.id 
        WHERE c.fornecedor_tabfornecedores = `+idForn;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        //console.log("sql da compforn",sql);
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            //console.log("retorno do idSelAlmoCompForn change",retorno);
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    if(i==0){
                       concatena=concatena+`<tr><th colspan="8">Compras com este Fornecedor: `+nomeFornecedor+`</th></tr>`;
                       concatena=concatena + `<tr><th>id</th>
                        <th>Redator</th><th>Material</th>
                        <th>Data</th><th>Quantidade</th><th>Apresentação</th>
                        <th>Nota Fiscal</th><th>Status</th></tr>`;
                    }//if i==0
                    let idLido = obj.resultados[i].id;
                    let redator = obj.resultados[i].redator;
                    let idRedator = obj.resultados[i].idRedator;
                    let material = obj.resultados[i].material;
                    let idNatureza = obj.resultados[i].idNatureza;
                    let idMaterial = obj.resultados[i].idMaterial;
                    let dataCompra = obj.resultados[i].data_compra;
                    let qtd = obj.resultados[i].quantidade;
                    let apres = obj.resultados[i].apresentacao;
                    let idApres = obj.resultados[i].idApres;
                    let notaFiscal = obj.resultados[i].nota_fiscal;
                    let intStatus = obj.resultados[i].int_status;
                    let idForn = obj.resultados[i].idForn;
                    concatena = concatena + `<tr><td><input type="checkbox" id="`+idLido+`" 
                    class="claFornTab" data-redator="`+idRedator+`" 
                    data-material="`+idMaterial+`" data-fornecedor = "`+idForn+`" data-nf = "`+notaFiscal+`"
                    data-apres = "`+idApres+`" data-datacompra = "`+dataCompra+`" data-qtd="`+qtd+`" 
                    data-status ="`+intStatus+`"  data-natureza = "`+idNatureza+`" 
                    title="`+idLido + `"></td>
                    <td>` + redator + `</td><td>` + material+ `</td>
                    <td>`+ dataCompra + `</td><td>` + qtd + `</td><td>` + apres + `</td>
                    <td>`+ notaFiscal + `</td><td>` + intStatus + `</td>
                    </tr>`;
                }//for i
            }//if retorno
            objTab.append(concatena);
        }, function (respostaErrada) {
            //console.log("idSelAlmoCompForn",respostaErrada);
        }).catch(function (e) {
            //console.log("idSelAlmoCompForn catch",e);
        });//fExecutaBD

});//idSelAlmoCompForn change
//-------------------------------------------------------------------
jQuery(document).on("change",".claFornTab",function (){
let booMarcado = jQuery(this).is(":checked");
if(booMarcado){
//marcado
let idCompra = jQuery(this).attr("id");
let objChk= jQuery(this);
//console.log(objInp);//isto serve pra gente ver no log como está a estrutura do objeto e aí se descobre que é um array único '[0]' e com as propriedades dataset e vídeo e questao
let idRed=objChk[0].dataset.redator;
let idMat=objChk[0].dataset.material;
let idForn=objChk[0].dataset.fornecedor;
let nf=objChk[0].dataset.nf;
let idApr=objChk[0].dataset.apres;
let dataCompra=objChk[0].dataset.datacompra;
let qtd=objChk[0].dataset.qtd;
let intStatus=objChk[0].dataset.status;
let idNatureza=objChk[0].dataset.natureza;
//---
jQuery("#idTxtAlmoCompNF").val(nf);

jQuery("#idSelAlmoCompNat option[value='"+idNatureza+"']").prop('selected', true);
jQuery("#idSelAlmoCompMat option[value='"+idMat+"']").prop('selected', true);
jQuery("#idDatAlmoCompData").val(dataCompra);
jQuery("#idNumAlmoCompQtd").val(qtd);
jQuery("#idSelAlmoCompApr option[value='"+idApr+"']").prop('selected', true);
jQuery("#idSelAlmoCompForn option[value='"+idForn+"']").prop('selected', true);
jQuery("#idSelAlmoCompStatus option[value='"+intStatus+"']").prop('selected', true);
jQuery("#idHidAlmoCompFlag").val(1);//põe 1 porque é para, se salvar, fazer update
}//if booMarcado
});//claFornTab change
//------------------------------------------------------------
jQuery(document).on("change","#idSelSistNTECliA",function (){
    let idCli = jQuery("option:selected",this).val();
let objSel = jQuery("#idSelSistNTEPasA");
fSelecionaPastas(idCli,objSel);
});//idSelSistNTECliA change
//------------------------------------------------------------
jQuery(document).on("change","#idSelTimSistNTECli",function (){
    let idCli = jQuery("option:selected",this).val();
let objSel = jQuery("#idSelTimSistNTEPas");
fSelecionaPastas(idCli,objSel);
});//idSelTimSistNTECli change
//------------------------------------------------------------
jQuery(document).on("change","#idSelPasAdmUpCli",function (){
    //área de admin de pasta: upload de carta de honorários
let idCliente = jQuery("option:selected", this).val();
let objSel = jQuery("#idSelPasAdmUpPas");
fSelecionaPastas(idCliente,objSel);
});//idSelPasAdmUpCli change
//---------------------------------------------------------------
jQuery(document).on("click","#idBtnPasAdmUpDoc",function (){
//executa upload de carta de honorários
let contador=0;
let siglaRedator = jQuery("#idSpaLogNaMaquinaSigla").text();
let idPasta = jQuery("#idSelPasAdmUpPas option:selected").val();
if(idPasta != ''){
  document.cookie = "pasta =" + idPasta;
let minhaJanela = window.open("../paginas/uploadHono.html","upload","width=600,height=400");
//--agora que fez o upload, fazer atualização da referência no campo doc
let sqlUpdate = `UPDATE tabpastas    
set documentacao = ?  
WHERE id = ?`;
   let arrayValores = ['/docs/'+idPasta+'.pdf',idPasta];
                                                                 /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
   let intOperacao = global_int_operacaoUpdateDelete;
   let tripa = fPrepara(arrayValores);
   fExecutaBD(intOperacao, sqlUpdate, tripa).then(function (retorno) {
       if (retorno * 1 > 0) {
           contador++;
           fGravaLog(siglaRedator + " UPDATE na tabela pastas com sucesso: " + sqlUpdate + " " + tripa);
       }else{
        fGravaLog(siglaRedator + " UPDATE na tabela pastas com problema: " + sqlUpdate + " " + tripa);
       }//if
   }).then(function () {
       alert("Fez " + contador + " alterações");
   });//fExecutaBD
}else{
alert ("Escolha uma pasta, antes de fazer o upload");
}//if sigla
});//idBtnPasAdmUpDoc
//-----------------------------------------------------
jQuery(document).on("click","#idBtnFCEnviarEmail",function (){
//fale conosco
let nome = jQuery("#idTxtFCNome").val();
let assunto = jQuery("#idTxtFCAssunto").val();
let email = jQuery("#idTxtFCEmail").val();
let telefone = jQuery("#idTxtFCTel").val();
let corpo = "A pessoa de nome "+nome+", telefone "+telefone+", email "+email+", deseja falar sobre o assunto em questão";
let copiar=email;//manda para o email da pessoa uma cópia também.
fEnviaEmail("mensageiro@escribaoffice.com.br",assunto,corpo,copiar);
});//idBtnFCEnviarEmail click
//-----------------------------------------------------
jQuery(document).on("click",".claBtnBerDeleta",function (){
//deleta na tabela de berçário a linha do timesheet em rascunho que não se quer mais
let idTS = jQuery(this).attr("id");
let idRedator = jQuery("#idSpaLogNaMaquinaId").text();
let siglaRedator = jQuery("#idSpaLogNaMaquinaSigla").text();
fApagaRascunhoBercario(idTS,idRedator,siglaRedator);
});//claBtnBerDeleta click
//------------------------------------------------------
jQuery(document).on("click",".claBtnBerConfirma",function (){
    //confirma na tabela de berçário a linha do timesheet em rascunho
    let idTS = jQuery(this).attr("id");
    let idRedator = jQuery("#idSpaLogNaMaquinaId").text();
    let siglaRedator = jQuery("#idSpaLogNaMaquinaSigla").text();
    fConfirmaRascunhoBercario(idTS,idRedator,siglaRedator);
    });//claBtnBerConfirma click
//---------------------------------------------------------
jQuery(document).on("change","#idSelProSisCli",function (){
//alimenta o select com as pastas do cliente na administração de processos
        //---
        jQuery(".claLimpaAdmPro").val('');
        jQuery(".claLimpaAdmProSel option[value='0']").prop('selected', true);
        //---
jQuery("#idSelProSisResp option[value='0']").prop('selected', true);//resseta a seleção do responsável
jQuery("#idSpaProSisMat").text('');//resseta matéria
jQuery("#idSelProSisPrE option[value='0']").prop('selected', true);//resseta a seleção do processo

let idCliente = jQuery("option:selected", this).val();
let objSel = jQuery("#idSelProSisPas");
fSelecionaPastas(idCliente,objSel);
});//idSelProSisCli
//---------------------------------------------------------
jQuery(document).on("change","#idSelProSisPas",function (){
//selecionando um file e listando seus processos na alteração dos processos
        //---
        jQuery(".claLimpaAdmPro").val('');
        jQuery(".claLimpaAdmProSel option[value='0']").prop('selected', true);
        //---
jQuery("#idSelProSisResp option[value='0']").prop('selected', true);//resseta a seleção do responsável
jQuery("#idSpaProSisMat").text('');//resseta matéria
jQuery("#idSelProSisPrE option[value='0']").prop('selected', true);//resseta a seleção do processo
let objSelPro = jQuery("#idSelProSisPrE");
objSelPro.empty();
let objSpa = jQuery("#idSpaProSisMat");
//---
let materia =jQuery("#idSelProSisPas").find('option:selected').data('materia');
objSpa.text(materia);
//---
let idPas = jQuery("option:selected", this).val();
let sql = `SELECT p.id,p.original  
FROM tabprocessos p  
WHERE p.pasta_tabpastas = `+ idPas + ` ORDER BY p.original`;
//console.log("sql ",sql);
let concatena = '<option value="0" title="0">...</option>';
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
let intOperacao = global_int_operacaoSelect;
let tripa = "";
//console.log("sql em change idSelproSispas",sql);
fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
    //console.log("retorno em change idSelProSisPas",retorno);
    if (retorno.length > 20) {
        let obj = JSON.parse(retorno);
        //--
        let materia = obj.resultados[0].materia;
        //--
        let i = 0;
        for (i; i < obj.resultados.length; i++) {
            let original = obj.resultados[i].original;
            let idLido = obj.resultados[i].id;
            concatena = concatena + '<option value="' + idLido + '" title="' + idLido + '">' + original + '</option>';
        }//for
        objSelPro.append(concatena);
        objSpa.text(materia);
    }//if retorno
}, function (respostaErrada) {
    //console.log(respostaErrada);
}).catch(function (e) {
    //console.log(e);
});//fExecutaBD
});//idSelProSisPas change
//----------------------------------------------------------------
jQuery(document).on("change","#idSelProSisPrE",function (){
    jQuery("#idSelProSisResp option[value='0']").prop('selected', true);
        jQuery("#idTxtProSisJul").val('');
        jQuery("#idTxtProSisNuO").val('');
        jQuery("#idSelProSisOrgao option[value='0']").prop('selected', true);
        jQuery("#idSelProSisOrS option[value='0']").prop('selected', true);
        //---
    let idPro = jQuery("option:selected",this).val();
    fSelecionaDadosProcesso(idPro);
});//idSelProSisPre
//---------------------------------------------------------------
jQuery(document).on("click","#idBtnAlmRegNatSalv",function (){
//salvando/criando natureza
let siglaRedator = jQuery("#idSpaLogNaMaquinaSigla").text();
let nomeNat = jQuery("#idTxtAlmRegNatNome").val();
if(nomeNat !=''){
nomeNat = nomeNat.toUpperCase();
let sqlInsert = `INSERT INTO tabalmonat 
(natureza)
   VALUES (?)`;
   //console.log("insert de natureza almoxarifado",sqlInsert);
   let arrayValores = [nomeNat];
    let tripa = fPrepara(arrayValores);
    //console.log(arrayValores);
    //console.log(sqlInsert+" ====>>>> "+sqlInsert+" "+tripa);
    //-------------------post----------------
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */    
    jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsert, tripa: tripa }, function (retorno) {
        //console.log("retorno do insert   ",retorno);
        if (retorno * 1 > 0) {
            fCarregaAlmoNaturezas();
            alert ("Natureza salva com sucesso");
            fGravaLog(siglaRedator + " Insert tabela natureza do almoxarifado: " + sqlInsert + " " + tripa);
        } else {
            fGravaLog(siglaRedator + "  PROBLEMA: Insert tabela natureza do almoxarifado: " + sqlInsert + " " + tripa);
        }//if retorno
    });//post  
}else{
    alert ("Antes de salvar, digite um nome para a natureza");
}//if nomeNat
});//idBtnAlmRegNatSalv click
//--------------------------------------------------------------
jQuery(document).on("click","#idBtnAlmRegApresSalv",function (){
    //salvando/criando apresentação de produto/material de almoxarifado
    let siglaRedator = jQuery("#idSpaLogNaMaquinaSigla").text();
    let nomeApres= jQuery("#idTxtAlmRegApresNome").val();
    if(nomeApres !=''){
    nomeApres = nomeApres.toUpperCase();
    let sqlInsert = `INSERT INTO tabalmoapres  
    (apresentacao)
       VALUES (?)`;
       //console.log("insert de apresentação almoxarifado",sqlInsert);
       let arrayValores = [nomeApres];
        let tripa = fPrepara(arrayValores);
        //console.log(arrayValores);
        //console.log(sqlInsert+" ====>>>> "+sqlInsert+" "+tripa);
        //-------------------post----------------
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsert, tripa: tripa }, function (retorno) {
            //console.log("retorno do insert   ",retorno);
            if (retorno * 1 > 0) {
                fCarregaAlmoApresentacao();
                alert ("Apresentação salva com sucesso");
                fGravaLog(siglaRedator + " Insert tabela tabapresentacao do almoxarifado: " + sqlInsert + " " + tripa);
            } else {
                fGravaLog(siglaRedator + "  PROBLEMA: Insert tabela tabapresentacao do almoxarifado: " + sqlInsert + " " + tripa);
            }//if retorno
        });//post  
    }else{
        alert ("Antes de salvar, digite um nome para a apresentação");
    }//if nomeApres
    });//idBtnAlmRegApresSalv click
    //--------------------------------------------------------
    jQuery(document).on("click","#idBtnAlmRegMatSalv",function (){
        //salvado criando novo material de almoxarifado
        let siglaRedator = jQuery("#idSpaLogNaMaquinaSigla").text();
        let idNatureza = jQuery("#idSelAlmRegNat option:selected").val();
        let nomeMat = jQuery("#idTxtAlmRegMatNome").val();
        let idApres = jQuery("#idSelAlmRegApres option:selected").val();
        let saldo =  0;
        if(nomeMat !=''){
            nomeMat = nomeMat.toUpperCase();
            let sqlInsert = `INSERT INTO tabalmomat   
            (natureza_tabalmonat,material,apresentacao_tabalmoapres,saldo)
               VALUES (?,?,?,?)`;
               //console.log("insert de apresentação almoxarifado",sqlInsert);
               let arrayValores = [idNatureza,nomeMat,idApres,saldo];
                let tripa = fPrepara(arrayValores);
                //console.log(arrayValores);
                //console.log(sqlInsert+" ====>>>> "+sqlInsert+" "+tripa);
                //-------------------post----------------
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */                
                jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsert, tripa: tripa }, function (retorno) {
                    //console.log("retorno do insert   ",retorno);
                    if (retorno * 1 > 0) {
                        fCarregaAlmoMaterial();
                        alert ("Material salvo com sucesso");
                        fGravaLog(siglaRedator + " Insert tabela tabalmomat do almoxarifado: " + sqlInsert + " " + tripa);
                    } else {
                        fGravaLog(siglaRedator + "  PROBLEMA: Insert tabela tabalmomat do almoxarifado: " + sqlInsert + " " + tripa);
                    }//if retorno
                });//post  
            }else{
                alert ("Antes de salvar, digite um nome para  material");
            }//if nomeMat
    });//idBtnAlmRegMatSalv click
//----------------------------------------------------------]
jQuery(document).on("click","#idBtnProSisSalvar",function (){
//update de um processo pelo administrador
let siglaRedator = jQuery("#idSpaLogNaMaquinaSigla").text();
let idPro = jQuery("#idSelProSisPrE option:selected").val();
let idResp = jQuery("#idSelProSisResp option:selected").val();
let julgO = jQuery("#idTxtProSisJul").val();
let numOri = jQuery("#idTxtProSisNuO").val();
let subDivO = jQuery("#idSelProSisOrS option:selected").val();
let julgR =jQuery("#idTxtProSisJuR").val();
let numR = jQuery("#idTxtProSisNuR").val();
let subDivR = jQuery("#idSelProSisReS option:selected").val();
let obs = jQuery("#idTAProSisObs").val();
if (idPro*1>0 && idResp*1>0 && julgO !="" && numOri !="" && subDivO*1>0){
    let sqlUpdate = `UPDATE tabprocessos     
    SET  responsavel_tabpessoas=?,subdivisao=?,julgador=?,original=?,subdivisao_r=?,
    julgador_recurso=?,numero_recurso=?,obs=?,data_edicao=?,int_status=?   
    WHERE id = ?`;
    let dataEdicao = new Date().toLocaleString();
       let arrayValores = [idResp,subDivO,julgO,numOri,subDivR,julgR,numR,obs,dataEdicao,2,idPro];
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */       
       let intOperacao = global_int_operacaoUpdateDelete;
       let tripa = fPrepara(arrayValores);
       fExecutaBD(intOperacao, sqlUpdate, tripa).then(function (retorno) {
           if (retorno * 1 > 0) {
            alert ("Alterou o processo "+numOri+" com sucesso");
            fGravaLog(siglaRedator + " update tabprocessos: " + sqlUpdate + " " + tripa);
           }else{
            alert ("Houve um problema com atualização do processo: "+retorno);
            fGravaLog(siglaRedator + "  PROBLEMA: update tabela tabprocessos: " + sqlUpdate + " " + tripa);
           }//if retorno
        });//fexecutaBD
}else{
    alert ("Pelo menos, os dados completos da primeira instância exigem preenchimento");
}//if idPro
});//idBtnProSisSalvar click
//--------------------------------------------------------------
jQuery(document).on("blur","#idTxtSistConsPesECE",function (){
let idTxtBlur = jQuery(this).attr("id");
let intCEP = jQuery(this).val();
if (!isNaN(intCEP)) {
    fBuscaEnderecoDandoCEP(intCEP, idTxtBlur);
} else {
    alert("O CEP exige apenas algarismos e com 8 dígitos");
}//if
});//idTxtSistConsPesECE blur
//-------------------------------------------------------------
jQuery(document).on("blur","#idTAFatuRegTeC",function (){
    //tira plics do texto da fatura
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTAFatuRegTeC blur
//-------------------------------------------------------------
jQuery(document).on("blur","#idTxtFatuNoFNNC",function (){
    //tira plics contato faturado
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtFatuNoFNNC blur
//-------------------------------------------------------------
jQuery(document).on("blur","#idTxtFatuNoFNNF",function (){
    //tira plics faturado
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtFatuNoFNNF blur
//------------------------------------------------------------
jQuery(document).on("blur","#idTxtProAdmSubNovo",function (){
//retira plics de nova divisão de órgão
let objTxt = jQuery(this);
fTiraPlics(objTxt);
});//idTxtProAdmSubNovo blur
//------------------------------------------------------------
jQuery(document).on("blur","#idTxtProAdmOrgNovo",function (){
    //retira plics de novo órgão
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtProAdmOrgNovo blur
//------------------------------------------------------------
jQuery(document).on("blur","#idSpaAlmoRegApr",function (){
    //retira plics de nova apresentação de material de almo
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idSpaAlmoRegApr blur
//-------------------------------------------------------------
jQuery(document).on("blur","#idTxtSistConsPesNome",function (){
    //retira plics de alteração de pessoa
        let objTxt = jQuery(this);
        fTiraPlics(objTxt);
});//idTxtSistConsPesNome blur
//-------------------------------------------------------------
jQuery(document).on("blur","#idTxtSistConsPesEnL",function (){
    //retira plics de alteração de pessoa logradouro
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtSistConsPesEnL blur
//-------------------------------------------------------------
jQuery(document).on("blur","#idTxtSistConsPesEnB",function (){
    //retira plics de alteração de pessoa bairro
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtSistConsPesEnB blur
//-------------------------------------------------------------
jQuery(document).on("blur","#idTxtSistConsPesECi",function (){
    //retira plics de alteração de pessoa cidade
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtSistConsPesECi blur
//-------------------------------------------------------------
jQuery(document).on("blur","#idTxtSistConsPesEnC",function (){
    //retira plics de alteração de pessoa complemento
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtSistConsPesEnC blur
//-------------------------------------------------------------
jQuery(document).on("blur","#idTxtSistConsPesEma",function (){
    //Consertando pessoa/ validando email
    let objEma = jQuery("#idTxtSistConsPesEma");
    let email = objEma.val();
    email = fValidarEmail(email);
   //console.log("Email verificado",email);
});//idTxtSistConsPesEma blur
//-------------------------------------------------------------
jQuery(document).on("blur","#idTxtSistConsPesEmax",function (){
   //Consertando pessoa/ validando email
   let objEma = jQuery("#idTxtSistConsPesEmax");
   let email = objEma.val();
   email = fValidarEmail(email);
  //console.log("Email externo verificado",email);
});//idTxtSistConsPesEmax blur
//-------------------------------------------------------------
jQuery(document).on("blur","#idTxtCliConsRaz",function (){
    //retira plics de conserto cliente
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtCliConsRaz blur
//--------------------------------------------------------------
jQuery(document).on("blur","#idTxtCliConsEnC",function (){
    //retira plics de conserto cliente complemento
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtCliConsEnC blur
//--------------------------------------------------------------
jQuery(document).on("blur","#idTxtCliConsNoC",function (){
    //retira plics de conserto cliente contato
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtCliConsNoC blur
//--------------------------------------------------------------
jQuery(document).on("blur","#idTAExpeRegDesc",function (){
//tira plics de salvamento de descrição de expedição
let objTxt = jQuery(this);
fTiraPlics(objTxt);
});//idTAExpeRegDesc blur
//--------------------------------------------------------------
jQuery(document).on("blur","#idTxtExpeRegAoC",function (){
    //tira plics de salvamento de aos cuidados
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtExpeRegAoC blur
    //--------------------------------------------------------------
jQuery(document).on("blur","#idTxtExpeRegEnC",function (){
    //tira plics de salvamento de endereço
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtExpeRegEnC blur
//--------------------------------------------------------------
jQuery(document).on("blur","#idTAExpeRegObs",function (){
    //tira plics de salvamento de obs
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTAExpeRegObs blur
//---------------------------------------------------------------
jQuery(document).on("blur","#idTATimSistAltDesc",function (){
    //tira plics timesheet alteração descrição
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTATimSistAltDesc blur
//---------------------------------------------------------------
jQuery(document).on("blur","#idTxtProRegJul",function (){
    //tira plics registro de processo julgador
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtProRegJul blur
//---------------------------------------------------------------
jQuery(document).on("blur","#idTxtProRegJuR",function (){
    //tira plics registro de processo julgador recurso
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtProRegJuR blur
//---------------------------------------------------------------
jQuery(document).on("blur","#idTAProRegObs",function (){
    //tira plics registro de processo obs
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTAProRegObs blur
//---------------------------------------------------------------
jQuery(document).on("blur","#idTxtPasAltMatTroc",function (){
    //tira plics alteração de área de uma pasta
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtPasAltMatTroc blur
//----------------------------------------------------------------
jQuery(document).on("blur","#idTATimRegTexto",function (){
    //tira plics registro de timesheet texto
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTATimRegTexto blur
//--------------------------------------------------------------
jQuery(document).on("blur","#idTADespRegDesc",function (){
    //tira plics registro de despesa texto
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTADespRegDesc blur
//--------------------------------------------------------------
jQuery(document).on("blur","#idTxtCronoRegRef",function (){
    //tira plics cronológica registro ref
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtCronoRegRef blur
//--------------------------------------------------------------
jQuery(document).on("blur","#idTxtCronoRegAten",function (){
    //tira plics cronológica registro atenção de
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtCronoRegAten blur
//-------------------------------------------------------------
jQuery(document).on("blur","#idTxtPesRegNome",function (){
    //tira plics registro pessoa nome
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtPesRegNome blur
//-------------------------------------------------------------
jQuery(document).on("blur","#idTxtPesRegEnL",function (){
    //tira plics registro pessoa logradouro
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtPesRegEnL blur
//------------------------------------------------------------
jQuery(document).on("blur","#idTxtPesRegEnC",function (){
    //tira plics registro pessoa complemento
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtPesRegEnC blur
//-----------------------------------------------------------
jQuery(document).on("blur","#idTxtCliRegRaz",function (){
    //tira plics registro cliente nome
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtCliRegRaz blur
//-----------------------------------------------------------
jQuery(document).on("blur","#idTxtCliRegEmC",function (){
    let objEma = jQuery("#idTxtCliRegEmC");
    let email = objEma.val();
    email = fValidarEmail(email);
   //console.log("Email cliente verificado",email);
});//idTxtCliRegEmC blur
//----------------------------------------------------------
jQuery(document).on("blur","#idTxtPesRegEmX",function (){
    let objEma = jQuery("#idTxtPesRegEmX");
    let email = objEma.val();
    email = fValidarEmail(email);
   //console.log("Email pessoa verificado",email);
});//idTxtPesRegEmX blur
//-----------------------------------------------------------
jQuery(document).on("blur","#idTxtCliRegEnL",function (){
    //tira plics registro cliente logradouro
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtCliRegEnL blur
//---------------------------------------------------------
jQuery(document).on("blur","#idTxtCliRegEnB",function (){
    //tira plics registro cliente bairro
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtCliRegEnB blur
//---------------------------------------------------------
jQuery(document).on("blur","#idTxtCliRegEnC",function (){
    //tira plics registro cliente cidade
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtCliRegEnC blur
//---------------------------------------------------------
jQuery(document).on("blur","#idTxtCliRegNoo",function (){
    //tira plics registro cliente contato
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtCliRegNoo blur
//---------------------------------------------------------
jQuery(document).on("blur","#idTxtPasRegMate",function (){
    //tira plics registro pasta matéria
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtPasRegMate blur
//---------------------------------------------------------
jQuery(document).on("blur","#idTxtUsuarioNome",function (){
    //tira plics registro nova pessoa sem login
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtUsuarioNome blur
//---------------------------------------------------------
jQuery(document).on("blur","#idTxtUsuarioEnL",function (){
    //tira plics registro nova pessoa sem login logradouro
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtUsuarioEnL blur
//----------------------------------------------------------
jQuery(document).on("blur","#idTxtUsuarioEnC",function (){
    //tira plics registro nova pessoa sem login complemento
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtUsuarioEnC blur
//----------------------------------------------------------
jQuery(document).on("blur","#idTxtAlmoFornNomeF",function (){
    //tira plics registro fornecedor almoxar
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtAlmoFornNomeF blur
//----------------------------------------------------------
jQuery(document).on("blur","#idTxtAlmoFornLog",function (){
    //tira plics registro fornecedor almoxar logradouro
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtAlmoFornLog blur
//----------------------------------------------------------
jQuery(document).on("blur","#idTxtAlmoFornContato",function (){
    //tira plics registro fornecedor almoxar contato
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtAlmoFornContato blur
//-----------------------------------------------------------
jQuery(document).on("blur","#idTxtAlmRegNatNome",function (){
    //tira plics registro natureza almox
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtAlmRegNatNome blur
//-----------------------------------------------------------
jQuery(document).on("blur","#idTxtAlmRegApresNome",function (){
    //tira plics registro apres almox
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtAlmRegApresNome blur
//-----------------------------------------------------------
jQuery(document).on("blur","#idTxtAlmRegMatNome",function (){
    //tira plics registro material almox
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTxtAlmRegMatNome blur
//-------------------------------------------------------------
jQuery(document).on("blur","#idTxtProSisJul",function (){
//tira plics administrando processos
let objTxt = jQuery(this);
fTiraPlics(objTxt);
});//idTxtProSisJul blur
//-------------------------------------------------------------
jQuery(document).on("blur","#idTxtProSisJuR",function (){
    //tira plics administrando processos julgador 2
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
    });//idTxtProSisJuR blur
//-----------------------------------------------------------------
jQuery(document).on("blur","#idTAFatuRegObs",function (){
        //tira plics redigir fatura obs
    let objTxt = jQuery(this);
    fTiraPlics(objTxt);
});//idTAFatuRegObs blur
//------------------------------------------------------------------
jQuery(document).on("blur","#idTxtAlmoFornEmail",function (){
    let objEma = jQuery("#idTxtAlmoFornEmail");
    let email = objEma.val();
    email = fValidarEmail(email);
});//idTxtAlmoFornEmail blur
//------------------------------------------------------------------
jQuery(document).on("click","#idBtnFatuRegPTS",function (){
//procura timesheets na redação de uma nota de honorários
let totalPadrao=0;
let totalEspecial=0;
let objTab = jQuery("#idTabFatuRegTTS");
objTab.empty();
let objSpaP = jQuery("#idSpaFatuRegVTP");
objSpaP.text('0.00');
let objSpaE = jQuery("#idSpaFatuRegVTE");
objSpaE.text('0.00');
let pastaPrincipal = jQuery("#idSelFatuRegPas option:selected").text();//tem de ser text porque a busca pela pasta e não pelo id
if(pastaPrincipal *1 > 0){
let tripaPastas = jQuery("#idTxtFatuRegFPA").val();//tripa de files adicionais que vem separada por vírgulas (texto, não id)
tripaPastas = pastaPrincipal +","+tripaPastas;//pondo o file principal como primeiro da lista
tripaPastas = tripaPastas.replace(/,$/,"");//se não tiver pastas adicionais, tira a última vírgula
//--de posse de todos os files envolvidos, procurar no banco de dados no intervalo de dados
let dataInicial = jQuery("#idDatFatuRegTSI").val();
let dataFinal = jQuery("#idDatFatuRegTSF").val();
//console.log(dataInicial+" e "+dataFinal);
let tripaIDsTS = "";
let objTS = jQuery("#idHidFatuRegTSOK");//guarda a tripa de ids de TS a baixar pela cobrança
objTS.val(0);
let sql = `SELECT t.id,t.uts,t.taxa_padrao,t.taxa_especial,t.uts*t.taxa_padrao as volume_padrao,
t.uts*t.taxa_especial as volume_especial,
g.sigla as sigla_profissional,g.pessoa as nome_profissional,t.data_trabalhada,t.descricao,
f.pasta,f.materia,c.cliente 
FROM tabts t 
INNER JOIN tabpessoas g 
ON t.profissional_tabpessoas = g.id 
INNER JOIN tabpastas f 
ON t.pasta_tabpastas = f.id 
INNER join tabclientes c 
ON f.cliente_tabclientes = c.id 
WHERE f.pasta IN (`+tripaPastas+`) 
AND t.data_trabalhada >='`+dataInicial+`' AND t.data_trabalhada <= '`+dataFinal+`' 
AND t.int_status = 2`;
//console.log(sql);
//---
let concatena = `<tr><th></th><th>Cliente</th><th>Pasta</th><th>Matéria</th><th>Data</th><th>Descrição</th>
<th>Prof</th><th>Uts</th><th>Taxa Padrão</th><th>Valor Padrão</th><th>Taxa Especial</th><th>Valor Especial</th></tr>`;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
let intOperacao = global_int_operacaoSelect;
let tripa = "";
fExecutaBD(intOperacao, sql, tripa).then(function (retornoT) {
    //console.log("retornoT",retornoT);
    if (retornoT.length > 20) {
        let objT = JSON.parse(retornoT);
        let i = 0;
        //console.log("qtd registros",objT.resultados.length+" / "+objT);
        for (i; i < objT.resultados.length; i++) {
            let idLido = objT.resultados[i].id;
            tripaIDsTS = tripaIDsTS + idLido+",";
            let cliente = objT.resultados[i].cliente;
            let pasta = objT.resultados[i].pasta;
            let materia = objT.resultados[i].materia;
            let dataTrabalhada = objT.resultados[i].data_trabalhada;
            let descricao = objT.resultados[i].descricao;
            let prof = objT.resultados[i].sigla_profissional;
            let uts = objT.resultados[i].uts;
            let taxaPadrao = objT.resultados[i].taxa_padrao;
            let taxaEspecial = objT.resultados[i].taxa_especial;
            let volumePadrao = objT.resultados[i].volume_padrao;
            totalPadrao = totalPadrao + volumePadrao*1;
            let volumeEspecial = objT.resultados[i].volume_especial;
            totalEspecial = totalEspecial + volumeEspecial*1;
        concatena = concatena + `<tr><td><input type="checkbox" id="`+idLido+`" class="claFatuManejaTS" value="`+idLido+`" 
        title="Retira/Inclui este timesheet `+idLido+`" checked></td><td>`+cliente+`</td><td>`+pasta+`</td><td>`+materia+`</td>
           <td>`+dataTrabalhada+`</td><td>`+descricao+`</td><td>`+prof+`</td><td>`+uts+`</td><td>`+taxaPadrao+`</td>
           <td>`+volumePadrao+`</td><td>`+taxaEspecial+`</td><td>`+volumeEspecial+`</td></tr>`;
        }//for i
    }//if retornoT
   // //console.log("concatena",concatena);
   objSpaP.text(totalPadrao);
   objSpaE.text(totalEspecial);
   //---Popular o valor a cobrar na fatura como sugestão pelo valor dos TS
   let objHono= jQuery("#idNumFatuRegVNH");
   let valorHonoExistente = objHono.val();
   if(valorHonoExistente.length == 0 || valorHonoExistente*1 == 0){
    //o honorário está vazio, vai pôr o valor padrão ou o valor especial
    objHono.val(totalPadrao);//valor default
    if(totalEspecial*1>0) objHono.val(totalEspecial);//substitui pelo valor especial
   }//if isNaN
   //---
    objTab.append(concatena);
    //tirando a última vírgula da tripa de ids de ts
    tripaIDsTS=tripaIDsTS.replace(/,$/,"");
    objTS.val(tripaIDsTS);
}, function (respostaErrada) {
    //console.log("erro",respostaErrada);
}).catch(function (e) {
    //console.log("erro catch",e);
});//fExecutaBD
}else{
    alert ("É necessário escolher um Cliente e uma pasta, antes de pressionar este botão");
}//if pastaPrincipal
});//idBtnFatuRegPTS click
//---------------------------------------------------------------
jQuery(document).on("click","#idBtnProRegPushRefresh",function (){
//faz um refresh para saber se chegou algum email no push dos andamentos
let email = jQuery("#idTxtProRegPushEmail").val();
let senha = jQuery("#idPasProRegPushSenha").val();
let lidoNaoLido = jQuery('input[type=radio][name=namRadProRegPush]:checked').prop('value')
let objTab = jQuery("#idTabProRegAndaPush");
objTab.empty();
jQuery.post("../phpPaginas/phpPush.php",{endEmail:email,pasEmail:senha,lidoNaoLido:lidoNaoLido},function (retorno){
objTab.append(retorno);
 });//post
});//idBtnProRegPushRefresh click
//---------------------------------------------------------------
jQuery(document).on("change",".claFatuManejaTS",function (){
//Na redação do faturamento, quando se clica na tabela de coleta de TS, tira ou inclui o TS da vez
fRecalculaTS();
});//claFatuManejaTS change
//---------------------------------------------------------------
jQuery(document).on("click","#idBtnLembretesAlarmeOnOff",function (){
    let objImg=jQuery("#idImgLembretesPng");
let nomeArquivoImagem = objImg.prop("src");
//console.log("nome do arquivo de imagem",nomeArquivoImagem);
if(nomeArquivoImagem=='https://escribaoffice.com.br/sons/alarme_on.png'){
objImg.prop("src","sons/alarme_off.png");
objImg.prop("title","Alarme DESATIVADO");
jQuery("#idHidLembretesInibeAlarme").val(1);//desativa o som do alarme
//console.log("DESATIVOU o alarme");
}else{
    objImg.prop("src","sons/alarme_on.png");
    objImg.prop("title","Alarme Ativado");
    jQuery("#idHidLembretesInibeAlarme").val(0);//Ativa o som do alarme
   //console.log("Ativou o alarme");
}//if nomeArquivoImagem
});//idBtnLembretesAlarmeOnOff click
//---------------------------------------------------------------
jQuery(document).on("click","#idBtnLembreteSalvar",function (){
    let intUpdate=jQuery("#idHidLembreUpdate").val();//se for >0 é update, zero é insert
    let idRedator = jQuery("#idSpaLogNaMaquinaId").text();
    let siglaNaMaquina = jQuery("#idSpaLogNaMaquinaSigla").text();
    let tipo = jQuery('input:radio[name=namRadLembreTipo]:checked').val();
    let dataInicio = jQuery("#idDatLembreteInicio").val();
    let alarmeAte = jQuery("#idDatLembreteFim").val();
    //--
    dataInicio = dataInicio.replace(/T/,' ');//as datas de input type datalocal tem um T no meio. Pôr um espaço no lugar
    alarmeAte = alarmeAte.replace(/T/,' ');
    //--
    let texto = jQuery("#idTALembreteTexto").val();
    texto = texto.replace(/\r?\n|\r/g, "");
    let participantes=jQuery("#idSelLembretePart option:selected").map(function(){ return this.title}).get().join(",");
    if(participantes.length>0){
    participantes = participantes.toUpperCase();
    }//if participantes
    if(dataInicio.length>0 && alarmeAte.length>0 && texto.length>0){
        if(intUpdate*1==0){
        let sqlInsert = `INSERT INTO tablembretes  
            (lembrete,data_inicio,data_final,tipo,redator_tabpessoas,participantes)
               VALUES (?,?,?,?,?,?)`;
               //console.log("insert de lembrete: ",sqlInsert);
               let arrayValores = [texto,dataInicio,alarmeAte,tipo,idRedator,participantes];
                let tripa = fPrepara(arrayValores);
                //console.log(sqlInsert+" ====>>>> "+sqlInsert+" "+tripa);
                //-------------------post----------------
                                                /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */                
                jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsert, tripa: tripa }, function (retorno) {
                    //console.log("retorno do insert   ",retorno);
                    if (retorno * 1 > 0) {
                        alert ("Novo lembrete salvo com sucesso");
                        fGravaLog(siglaNaMaquina + " Insert tabela de lembretes: " + sqlInsert + " " + tripa);
                        fLimpaCamposLembrete();
                        fCarregaLembretes(2);
                    } else {
                        alert ("Houve um problema com o salvamento do lembrete");
                        fGravaLog(siglaNaMaquina + "  PROBLEMA: Insert tabela lembretes: " + sqlInsert + " " + tripa);
                    }//if retorno
                });//post  
            }else{
                //é atualização do lembrete antigo e modifica para ATIVO
                let sqlUpdate = `UPDATE tablembretes 
                SET lembrete = ?,
                data_inicio = ?,
                data_final = ?,
                tipo = ?,
                participantes = ?,
                status = 2  
                WHERE id = ?`;
                   let arrayValores = [texto,dataInicio,alarmeAte,tipo,participantes,intUpdate];
                            /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
                            global_int_operacaoSelect=11;
                            global_int_operacaoInsert=41;
                            global_int_operacaoUpdateDelete=31;
                                */   
                   let intOperacao = global_int_operacaoUpdateDelete;
                   let tripa = fPrepara(arrayValores);
                   fExecutaBD(intOperacao, sqlUpdate, tripa).then(function (retorno) {
                       if (retorno * 1 > 0) {
                        alert ("Lembrete alterado com sucesso");
                       fGravaLog(siglaNaMaquina + " update tablembretes com sucesso: " + sqlUpdate + " " + tripa);
                       fLimpaCamposLembrete();
                       fCarregaLembretes(2);
                       }else{
                        alert ("Houve um problema com a atualização do lembrete");
                        fGravaLog(siglaNaMaquina + " update tablembrestes com PROBLEMAS: " + sqlUpdate + " " + tripa);
                       }
                    });//fexecutaBD
                
            }//if intUpdate
    }else{
        alert ("Informe todos os campos, antes de salvar");
    }//if dataInicio
});//idBtnLembreteSalvar click
//---------------------------------------------------------
jQuery(document).on("click",".claBtnLembreteStatus",function (){
    let siglaRedator = jQuery("#idSpaLogNaMaquinaSigla").text();
    let idLembrete = jQuery(this).attr("id");
    let objInp = jQuery(this);
    let intFuturoStatus=objInp[0].dataset.futuro;
    let msg="";
    switch(intFuturoStatus*1){
    case 21:
        msg="Para ativo, ponha 2; para rascunho ponha 1";
        intFuturoStatus= prompt (msg,1);
    break;
    case 17:
        msg="Para cancelar, ponha 7; para rascunho ponha 1";
        intFuturoStatus= prompt (msg,1);
    break;
    }//switch
    if(intFuturoStatus*1 == 1 || intFuturoStatus*1 == 2 || intFuturoStatus*1 == 7){
        let sqlUpdate = `UPDATE tablembretes     
        SET  status = ?  
        WHERE id = ?`;
           let arrayValores = [intFuturoStatus,idLembrete];
                    /*
                    //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
                    global_int_operacaoSelect=11;
                    global_int_operacaoInsert=41;
                    global_int_operacaoUpdateDelete=31;
                        */   
           let intOperacao = global_int_operacaoUpdateDelete;
           let tripa = fPrepara(arrayValores);
           fExecutaBD(intOperacao, sqlUpdate, tripa).then(function (retorno) {
               if (retorno * 1 > 0) {
                alert ("Lembrete alterado com sucesso");
               fGravaLog(siglaRedator + " update tablembretes com sucesso: " + sqlUpdate + " " + tripa);
               fCarregaLembretes(2);
               }else{
                alert ("Houve um problema com a atualização do lembrete");
                fGravaLog(siglaRedator + " update tablembrestes com PROBLEMAS: " + sqlUpdate + " " + tripa);
               }
            });//fexecutaBD
    }else{
        alert ("Operação de alteração cancelada");
    }//if intFuturoStatus
});//claBtnLembreteStatus click
//----------------------------------------------------------------
jQuery(document).on("blur","#idDatLembreteFim",function (){
//se a data do fim do alarme for menor ou igual que a data inicial, não deixa salvar
let objBtn = jQuery("#idBtnLembreteSalvar");
objBtn.prop("disabled",false);
objBtn.prop("title","");
//--
let fimAlarme = jQuery(this).val();//yyyy-mm-dd hh:mm:ss
let anoA = fimAlarme.substring(0,4);
let mesA = fimAlarme.substring(5,7);
let diaA = fimAlarme.substring(8,10);
let horaA = fimAlarme.substring(11,13);
let minutosA = fimAlarme.substring(14,16);
let segundosA = fimAlarme.substring(17,19);
//--
let dataInicio = jQuery("#idDatLembreteInicio").val();//yyyy-mm-dd hh:mm:ss
let anoI = dataInicio.substring(0,4);
let mesI = dataInicio.substring(5,7);
let diaI = dataInicio.substring(8,10);
let horaI = dataInicio.substring(11,13);
let minutosI = dataInicio.substring(14,16);
let segundosI = dataInicio.substring(17,19);
//--
let miliA = new Date(anoA,mesA*1-1,diaA,horaA,minutosA,segundosA).getTime();
let miliI = new Date(anoI,mesI*1-1,diaI,horaI,minutosI,segundosI).getTime();
let diferenca = miliA*1-miliI;
let intPodeRegistrar=1;
if(diferenca*1>900000) {
    alert("O alarme continuará a lembrar-lhe do compromisso mesmo que a data e hora vigentes estejam 15 minutos além da hora inicial.");
}//if diferenca
//---
if(miliI>=miliA){
alert ("A data do término do alarme não pode ser igual ou inferior à do início do lembrete");
objBtn.prop("disabled",true);
objBtn.prop("title","Botão bloqueado porque a data do término do alarme é inferior ou igual à data do lembrete");
}//if miliI
});//idDatLembreteFim blur
//----------------------------------------------------
jQuery(document).on("click",".claBtnLembEdita",function (){
let idLido=  jQuery(this).attr("id");
jQuery("#idHidLembreUpdate").val(idLido);//quando este hidden está >0 é porque é atualização. (Depois de salvar, volta a zero)
let objInp = jQuery(this);
let tipo=objInp[0].dataset.tipo;
let texto = objInp[0].dataset.texto;
let participantes = objInp[0].dataset.participantes;
jQuery("#idSpaLembretePartSel").text(participantes);
jQuery("input:radio[name=namRadLembreTipo]").val([tipo]);
jQuery("#idTALembreteTexto").val(texto);
//marcando a select multiple
jQuery("#idSelLembretePart option:selected").prop("selected", false);
jQuery.each(participantes.split(","), function(i,e){
    jQuery("#idSelLembretePart option[title='" + e + "']").prop("selected", true);
});
});//claBtnLembEdita click
//---------------------------------------------------------------
jQuery(document).on("change","#idSelLembretePart",function (){
    //mostra os participantes selecionados fora do select
    var concatena=jQuery("option:selected",this).map(function(){ return this.title }).get().join(",");
    jQuery("#idSpaLembretePartSel").text(concatena);
});//idSelLembretePart
//---------------------------------------------------------------
jQuery(document).on("click","#idBtnPasConsSalvar",function (){
//salvar alteração de pasta
let siglaRedator = jQuery("#idSpaLogNaMaquinaSigla").text();
let idRedator = jQuery("#idSpaLogNaMaquinaId").text();
//let idCliente = jQuery("#idSelPasConsCli option:selected").val();
let idPasta = jQuery("#idSelPasConsPas option:selected").val();
let materia = jQuery("#idTxtPasConsMate").val();
let documentacao = 'x';
let idResp = jQuery("#idSelPasConsResp option:selected").val();
let resumo = jQuery("#idTAPasConsResumo").val();
let valorHono = jQuery("#idNumPasConsVaH").val();
let idArea = jQuery("#idSelPasConsArea option:selected").val();
let intStatus = jQuery("#idSelPasConsSitu option:selected").val();
//---
let sqlUpdate = `UPDATE tabpastas     
SET redator_tabpessoas =?,materia=?,resumo=?,responsavel_tabpessoas=?,area_tabareas=?,
documentacao=?,valor_hono=?, data_edicao = ?, int_status = ? 
WHERE id = ?`;
//console.log("fAprovaReprovaFaturamento: ",sqlUpdate);
//console.log("dentro de fAprovaReprovaFaturamento",destinatarios);
let dataEdicao = new Date().toLocaleString();
   let arrayValores = [idRedator,materia,resumo,idResp,idArea,documentacao,valorHono,dataEdicao,intStatus,idPasta];
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */   
   let intOperacao = global_int_operacaoUpdateDelete;
   let tripa = fPrepara(arrayValores);
   fExecutaBD(intOperacao, sqlUpdate, tripa).then(function (retorno) {
       if (retorno * 1 > 0) {
        alert ("Alterou a pasta com sucesso");
       fGravaLog(siglaRedator + " update tabpastas com sucesso: " + sqlUpdate + " " + tripa);
       }else{
        alert ("Houve um problema a atualização da pasta");
        fGravaLog(siglaRedator + " update tabpastas com PROBLEMAS: " + sqlUpdate + " " + tripa);
       }
    });//fexecutaBD
});//idBtnPasConsSalvar click
//----------------------------------------------------------------
jQuery("#idSpaProAdmOrgPai").hover(function(){
    let objJa = jQuery(".claProcOrgJaReg");
     objJa.fadeOut( 100 );
     objJa.fadeIn( 200 );
});
//------------------------------------------------------------------
jQuery(document).on("change","#idChkLembreteTodos",function (){
    //se for 
    let intStatus= jQuery("#idChkLembreteTodos:checked").val();

    if(typeof intStatus == "undefined") {
        intStatus=2;//ver só os do dia
    }else{
        intStatus=0;//ver todos
    }//if intStatus
    console.log("no change do checkbox",intStatus);
    fCarregaLembretes(intStatus);
});//
//--------------------------------------------------------------------
jQuery(document).on("click","#btnBi",function (){
window.open("https://datastudio.google.com/embed/reporting/9b29d7df-aec6-4c2d-9ba9-eebf3735161d/page/eua5C", "bi");
});//btnBi
//--------------------------------------------------------------------
jQuery(document).on("change","#idSelAlmoFornLista",function (){
//mudando o nome do fornecedor, preenche o cpf/cnpj para alguma alteração
let cpfCnpj = jQuery(this).find('option:selected').data('cpf');
jQuery("#idTxtAlmoFornCPFCNPJ").val(cpfCnpj);
});//idSelAlmoFornLista change
//--------------------------------------------------------------------
jQuery(document).on("click","#idSelLembretesAtivos",function (){
    fCarregaLembretes(2);//faz um refresh em qualquer botão clicado, recarregando algum lembrete
});//idSelLembretesAtivos click
});//ready ============================================================READY
//================================FUNÇÕES
function fEnviaEmail(destinatarios,assunto,corpo,copiar){
    //alert ("Dentro de fEnviaEmail: "+destinatarios);
    jQuery.post("phpPaginas/phpEnviaEmail.php",{destinatarios:destinatarios,assunto:assunto,corpo:corpo,copiar:copiar},function (retorno){
        alert (retorno);
       });
}//fEnviaEmail
//--------------------------------------------------------------
function fAprovaReprovaFaturamento(destinatarios,idFatura,texto,status,rotulo){
    let siglaRedator = jQuery("#idSpaLogNaMaquinaSigla").text();
let sqlUpdate = `UPDATE tabfaturamento    
SET  status = ?, data_edicao = ?  
WHERE id = ?`;
//console.log("fAprovaReprovaFaturamento: ",sqlUpdate);
//console.log("dentro de fAprovaReprovaFaturamento",destinatarios);
let dataEdicao = new Date().toLocaleString();
   let arrayValores = [status,dataEdicao,idFatura];
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */   
   let intOperacao = global_int_operacaoUpdateDelete;
   let tripa = fPrepara(arrayValores);
   fExecutaBD(intOperacao, sqlUpdate, tripa).then(function (retorno) {
       if (retorno * 1 > 0) {
        alert (rotulo+" da fatura com sucesso");
        jQuery("#idSelFatuAdmFaturas option[value='0']").prop('selected', true);
       jQuery("#idSelFatuAdmFaturas").trigger("change");
       fEnviaEmail(destinatarios,rotulo+" da fatura com sucesso",texto,"");
       fCarregaNotasPendentesAprovacao();
       fGravaLog(siglaRedator + " update tabfaturamento com sucesso: " + sqlUpdate + " " + tripa);
       }else{
        alert ("Houve um problema com a "+rotulo+": "+retorno);
        fGravaLog(siglaRedator + " update tabfaturamento com PROBLEMAS: " + sqlUpdate + " " + tripa);
       }
    });//fexecutaBD
//---
}//fAprovaReprovaFaturamento
//-----------------------------------------------------------------
function fSugereDatas(){
//esta função sugere na carga do javascript datas elásticas nos campos que são tipo 'date'
let objDataHoje = new Date();
let dataFinal=objDataHoje.toLocaleDateString();//dd/mm/aaaa
let diaF=dataFinal.substring(0,2);
let mesF=dataFinal.substring(3,5);
let anoF=dataFinal.substring(6);
//--data inicial
jQuery("#idDatSistConsPesDVi").val('1900-01-01');
jQuery("#idDatTimPesDaI").val('1900-01-01');
jQuery("#idDatTimSistDaI").val('1900-01-01');
jQuery("#idDatSistNTEPDiA").val('1900-01-01');
jQuery("#idDatTimSistNTEPDi").val('1900-01-01');
jQuery("#idDatDespPesDaI").val('1900-01-01');
jQuery("#idDatSistDespPesDaI").val('1900-01-01');
jQuery("#idDatExpePesDaI").val('1900-01-01');
jQuery("#idDatExpeAdmDaI").val('1900-01-01');
jQuery("#idDatAlmoPesDaI").val('1900-01-01');
jQuery("#idDatFatuRegTSI").val('1900-01-01');
//data final
jQuery("#idDatSistConsPesDVf").val(anoF+"-"+mesF+"-"+diaF);
jQuery("#idDatTimPesDaF").val(anoF+"-"+mesF+"-"+diaF);
jQuery("#idDatTimSistDaF").val(anoF+"-"+mesF+"-"+diaF);
jQuery("#idDatSistNTEPDfA").val(anoF+"-"+mesF+"-"+diaF);
jQuery("#idDatTimSistNTEPDf").val(anoF+"-"+mesF+"-"+diaF);
jQuery("#idDatDespPesDaF").val(anoF+"-"+mesF+"-"+diaF);
jQuery("#idDatSistDespPesDaF").val(anoF+"-"+mesF+"-"+diaF);
jQuery("#idDatExpePesDaF").val(anoF+"-"+mesF+"-"+diaF);
jQuery("#idDatExpeAdmDaF").val(anoF+"-"+mesF+"-"+diaF);
jQuery("#idDatAlmoPesDaF").val(anoF+"-"+mesF+"-"+diaF);
jQuery("#idDatFatuRegTSF").val(anoF+"-"+mesF+"-"+diaF);

}//fSugereDatas
//------------------------------------------------
    function fCarregaOrgaos(){
    let objSel1 = jQuery("#idSelProRegOrgao");//primeira instância
    objSel1.empty();
    let objSel2 = jQuery("#idSelProRegOrR");//segunda instância
    objSel2.empty();
    let objSel3 = jQuery("#idSelProAdmOrgExist");//todas
    objSel3.empty();
    let objSel4 = jQuery("#idSelProSisOrgao");//primeira instância
    objSel4.empty();
    let objSel5 = jQuery("#idSelProSisOrR");//segunda isntância
    objSel5.empty();
    //--
    let concatena = '<option value="0" title="0">...</option>';
    let concatenaR = '<option value="0" title="0">...</option>';
    let concatenaT = '<option value="0" title="0">...</option>';
    //--
    let sql=`SELECT id,orgao,instancia    
    FROM taborgaos 
    ORDER BY orgao`;
    //---
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */    
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        //console.log("retorno da carga de órgãos",retorno);
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
           // //console.log("obj",obj);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let idLido = obj.resultados[i].id;
                let orgao = obj.resultados[i].orgao;
                let instancia = obj.resultados[i].instancia;
                //console.log("em fCarregaorgaos, instancia",instancia+" / "+i);
                if(instancia*1==1){
                concatena = concatena + '<option value="' + idLido + '" title="id '+idLido+' e Instância ' + instancia + '">' + orgao + '</option>';
                }
                if(instancia*1>1){
                    concatenaR = concatenaR + '<option value="' + idLido + '" title="id '+idLido+' e Instância ' + instancia + '">' + orgao + '</option>';
                }
                //todas as instâncias
                concatenaT = concatenaT + '<option value="' + idLido + '" title="id '+idLido+' e Instância ' + instancia + '">' + orgao + '</option>';
            }//for i
        }//if retorno
        objSel1.append(concatena);
        objSel2.append(concatenaR);
        objSel3.append(concatenaT);
        objSel4.append(concatena);
        objSel5.append(concatenaR);
        //console.log("concatena",concatena);
        //console.log("concatenaR",concatenaR);
        //console.log("concatenaT",concatenaT);
    }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
}//fCarregaOrgaos
//---------------------------------------------
function fCarregaPessoasAdmin() {
    let objSel = jQuery("#idSelSistConsPesPro");
    objSel.empty();
    let objSelPen = jQuery("#idSelSistConsPesPen");
    objSelPen.empty();
    var concatena = '<option value="0" title="0">&nbsp;</option>';
    var concatenaPen = '<option value="0" title="0">&nbsp;</option>';
    let sql = `SELECT id,pessoa,sigla,int_status   
    FROM tabpessoas 
    ORDER BY pessoa`;
    //---
                                                                  /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let idLido = obj.resultados[i].id;
                let pessoa = obj.resultados[i].pessoa.trim();
                let sigla = obj.resultados[i].sigla.trim();
                let intStatus = obj.resultados[i].int_status;
                concatena = concatena + '<option value="' + idLido + '" title="' + sigla + '">' + pessoa + '</option>';
                if(intStatus*1==1){
                    concatenaPen = concatenaPen + '<option value="' + idLido + '" title="' + sigla + '">' + pessoa + '</option>';
                }//if intStatus
            }//for i
        }//if retorno
        objSel.append(concatena);
        objSelPen.append(concatenaPen);
    }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
}//fCarregaPessoasAdmin
//------------------------------------------
function fCarregaTodasPessoas(intStatus) {
    //alert ("Entrou em fCarregaTodasPessoas "+intStatus);
    let objHidEma = jQuery("#idHidTxtPesRegEmailCoor");//pessoas que são coordenadoras, lista de emails
    let objHidUsuarioEma = jQuery("#idHidTxtUsuarioEmailCoor");//pessoas que são coordenadoras, lista de emails
    let arrayObjSel = [];
    arrayObjSel[0] = jQuery("#idSelPesPesPro");
    arrayObjSel[1] = jQuery("#idSelCliRegResp");
    arrayObjSel[2] = jQuery("#idSelPasRegResp");
    arrayObjSel[3] = jQuery("#idSelProRegResp");
    arrayObjSel[4] = jQuery("#idSelCronoRegResp");
    arrayObjSel[5] = jQuery("#idSelCronoPesResp");
    arrayObjSel[6] = jQuery("#idSelTimRegProf");
    arrayObjSel[7] = jQuery("#idSelTimPesPrD");
    arrayObjSel[8] = jQuery("#idSelDespRegApr");
    arrayObjSel[9] = jQuery("#idSelExpeRegSol");
    arrayObjSel[10] = jQuery("#idSelExpePesSol");
    arrayObjSel[11] = jQuery("#idSelAlmoRegSol");
    arrayObjSel[12] = jQuery("#idSelAlmoPesSol");
    arrayObjSel[13] = jQuery("#idSelCliPesRespC");
    arrayObjSel[14] = jQuery("#idSelPasAltRespTroc");
    arrayObjSel[15] = jQuery("#idSelTimSistPrD");
    arrayObjSel[16] = jQuery("#idSelTimSistAltProf");
    arrayObjSel[17] = jQuery("#idSelTimSistTransProf");
    arrayObjSel[18] = jQuery("#idSelTimSistNTEProf");
    arrayObjSel[19] = jQuery("#idSelPesSistUpPro");
    arrayObjSel[20] = jQuery("#idSelSistNTEProfA");
    arrayObjSel[21] = jQuery("#idSelCliConsRespC");
    arrayObjSel[22] = jQuery("#idSelFatuRegApN");
    arrayObjSel[23] = jQuery("#idSelExpeAdmSol");
    arrayObjSel[24] = jQuery("#idSelProSisResp");
    arrayObjSel[25] = jQuery("#idSelLembretePart");
    arrayObjSel[26] = jQuery("#idSelPasConsResp");
       //--
    let emailCoordenadores ="";
    var concatena = '<option value="0" title="0">&nbsp;</option>';
    let sql = `SELECT id,pessoa,sigla,email,acesso_tabacessos   
    FROM tabpessoas 
    WHERE int_status = `+ intStatus + ` 
    ORDER BY pessoa`;
    //---
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */    
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    //console.log("intOperacao na carga de pessoas, teria de wer 11 para os admins",intOperacao);
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
      //  //console.log("retorno em fExecuta",retorno);
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let idLido = obj.resultados[i].id;
                let pessoa = obj.resultados[i].pessoa.trim();
                let sigla = obj.resultados[i].sigla.trim();
                let intAcesso = obj.resultados[i].acesso_tabacessos;
                let email = obj.resultados[i].email;
                if(intAcesso*1==3 || intAcesso*1==5){ 
                emailCoordenadores=emailCoordenadores + email+";";
                }//if intacesso
                concatena = concatena + '<option value="' + idLido + '" title="' + sigla + '" data-sigla="'+sigla+'">' + pessoa + '</option>';
            }//for i
              //---carregados dados da consulta, popular todas as selects indicadas
        let j = 0;
        for (j; j < arrayObjSel.length; j++) {
            arrayObjSel[j].empty();
            arrayObjSel[j].append(concatena);
           //console.log("Populando lista j",j+" "+concatena);
        }//for j
        //populando o hidden com a lista de emails e retirando a última vírgula
        objHidEma.val(emailCoordenadores.replace(/;$/,""));
        objHidUsuarioEma.val(emailCoordenadores.replace(/;$/,""));
        fCarregaPessoasAdmin();//carrega também as pessoas que estão pendentes de aprovação pelo admin
        }else{
            //console.log("retorno não encontrado?",retorno);
        }//if retorno
      }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
}//fCarregaTodasPessoas
//------------------------------------------
function fCarregaClientes() {
    let intStatus = 2;//só as ativas
    let arrayObjSel = [];
    arrayObjSel[0] = jQuery("#idSelPesCliCli");
    arrayObjSel[1] = jQuery("#idSelPasRegCli");
    arrayObjSel[2] = jQuery("#idSelPasPesCli");
    arrayObjSel[3] = jQuery("#idSelPasRegCli");
    arrayObjSel[4] = jQuery("#idSelCronoRegCli");
    arrayObjSel[5] = jQuery("#idSelCronoPesCli");
    arrayObjSel[6] = jQuery("#idSelProRegCli");
    arrayObjSel[7] = jQuery("#idSelProPesCli");
    arrayObjSel[8] = jQuery("#idSelProRegAndaCli");
    arrayObjSel[9] = jQuery("#idSelTimRegCli");
    arrayObjSel[10] = jQuery("#idSelTimPesCli");
    arrayObjSel[11] = jQuery("#idSelDespRegCli");
    arrayObjSel[12] = jQuery("#idSelDespPesCli");
    arrayObjSel[13] = jQuery("#idSelFatuRegCli");
    arrayObjSel[14] = jQuery("#idSelFatuPesCli");
    arrayObjSel[15] = jQuery("#idSelPasAltCliTroc");
    arrayObjSel[16] = jQuery("#idSelTimSistCli");
    arrayObjSel[17] = jQuery("#idSelTimSistTransCli");
    arrayObjSel[18] = jQuery("#idSelTimSistNTECli");
    arrayObjSel[19] = jQuery("#idSelDashGCli");
    arrayObjSel[20] = jQuery("#idSelConsCliCli");
    arrayObjSel[21] = jQuery("#idSelSistNTECli");
    arrayObjSel[22] = jQuery("#idSelSistNTECliA");
    arrayObjSel[23] = jQuery("#idSelSistDespCli");
    arrayObjSel[24] = jQuery("#idSelFatuAdmCli");
    arrayObjSel[25] = jQuery("#idSelPasAdmUpCli");
    arrayObjSel[26] = jQuery("#idSelProSisCli");
    arrayObjSel[27] = jQuery('#idSelPasConsCli');
    //--
    let concatena = '<option value="0" title="0">&nbsp;</option>';
    let sql = `SELECT id,cliente   
    FROM tabclientes 
    WHERE int_status = `+ intStatus;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */    
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let idLido = obj.resultados[i].id;
                let cliente = obj.resultados[i].cliente;
                concatena = concatena + '<option value="' + idLido + '" title="' + idLido + '">' + cliente + '</option>';
            }//for i
        }//if retorno
        //---carregados dados da consulta, popular todas as selects indicadas
        let j = 0;
        for (j; j < arrayObjSel.length; j++) {
            arrayObjSel[j].empty();
            arrayObjSel[j].append(concatena);
            //console.log(concatena);
        }//for j
    }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
}//fCarregaClientes
//-------------------------------------------
function fCarregaClientesTodos() {

    let arrayObjSel = [];
    arrayObjSel[0] = jQuery("#idSelConsCliCli");
        //--
    let concatena = '<option value="0" title="0">&nbsp;</option>';
    let sql = `SELECT id,cliente   
    FROM tabclientes ORDER BY cliente`;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */    
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let idLido = obj.resultados[i].id;
                let cliente = obj.resultados[i].cliente;
                concatena = concatena + '<option value="' + idLido + '" title="' + idLido + '">' + cliente + '</option>';
            }//for i
        }//if retorno
        //---carregados dados da consulta, popular todas as selects indicadas
        let j = 0;
        for (j; j < arrayObjSel.length; j++) {
            arrayObjSel[j].empty();
            arrayObjSel[j].append(concatena);
            //console.log(concatena);
        }//for j
    }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
}//fCarregaClientesTodos
//-------------------------------------------
function fCarregaCategorias() {
    let intStatus = 2;//só as ativas
    let arrayObjSel = [];
    arrayObjSel[0] = jQuery("#idSelPesRegCat");
    arrayObjSel[1] = jQuery("#idSelPesPesCat");
    arrayObjSel[2] = jQuery("#idSelSistConsPesCat");
    arrayObjSel[3] = jQuery("#idSelUsuarioCat");
    //--
    var concatena = '<option value="0" title="0">&nbsp;</option>';
    let sql = `SELECT id,categoria  
    FROM tabcategorias
    WHERE int_status = `+ intStatus;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */    
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let idLido = obj.resultados[i].id;
                let categoria = obj.resultados[i].categoria;
                concatena = concatena + '<option value="' + idLido + '" title="' + idLido + '">' + categoria + '</option>';
            }//for i
        }//if retorno
        //---carregados dados da consulta, popular todas as selects indicadas
        let j = 0;
        for (j; j < arrayObjSel.length; j++) {
            arrayObjSel[j].empty();
            arrayObjSel[j].append(concatena);
            //console.log(concatena);
        }//for j
    }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
}//fCarregaCategorias
//--------------------------------------------
function fCarregaFiliais() {
    let intStatus = 2;//só as ativas
    let arrayObjSel = [];
    arrayObjSel[0] = jQuery("#idSelPesRegFil");
    arrayObjSel[1] = jQuery("#idSelPesPesFil");
    arrayObjSel[2] = jQuery("#idSelCliRegFil");
    arrayObjSel[3] = jQuery("#idSelCliPesFil");
    arrayObjSel[4] = jQuery("#idSelSistConsPesFil");
    arrayObjSel[5] = jQuery("#idSelCliConsFil");
    arrayObjSel[6] = jQuery("#idSelUsuarioFil");
    //--
    var concatena = '<option value="0" title="0">&nbsp;</option>';
    let sql = `SELECT id,filial  
    FROM tabfiliais
    WHERE int_status = `+ intStatus;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */    
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let idLido = obj.resultados[i].id;
                let filial = obj.resultados[i].filial;
                concatena = concatena + '<option value="' + idLido + '" title="' + idLido + '">' + filial + '</option>';
            }//for i
        }//if retorno
        //---carregados dados da consulta, popular todas as selects indicadas
        let j = 0;
        for (j; j < arrayObjSel.length; j++) {
            arrayObjSel[j].empty();
            arrayObjSel[j].append(concatena);
            //console.log(concatena);
        }//for j
    }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
}//fCarregaFiliais
//--------------------------------------------
function fCarregaNiveisAcesso() {
    let intStatus = 2;//só as ativas
    let arrayObjSel = [];
    arrayObjSel[0] = jQuery("#idSelPesRegNiv");
    arrayObjSel[1] = jQuery("#idSelPesPesNiv");
    arrayObjSel[2] = jQuery("#idSelSistConsPesNiv");
    //--
    var concatena = '<option value="0" title="0">&nbsp;</option>';
    let sql = `SELECT id,acesso  
    FROM tabacessos
    WHERE int_status = `+ intStatus;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */   
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let idLido = obj.resultados[i].id;
                let acesso = obj.resultados[i].acesso;
                let selecionar = "";
                if (acesso == "Autor") selecionar = "selected";
                concatena = concatena + '<option value="' + idLido + '" title="' + idLido + '" ' + selecionar + '>' + acesso + '</option>';
            }//for i
        }//if retorno
        //---carregados dados da consulta, popular todas as selects indicadas
        let j = 0;
        for (j; j < arrayObjSel.length; j++) {
            arrayObjSel[j].empty();
            arrayObjSel[j].append(concatena);
            //console.log(concatena);
        }//for j
    }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
}//fCarregaNiveisAcesso
//-----------------------------------------------
function fCarregaTiposLogradouro() {
    let intStatus = 2;//só as ativas
    let arrayObjSel = [];
    arrayObjSel[0] = jQuery("#idSelCliRegETL");
    arrayObjSel[1] = jQuery("#idSelCliPesETL");
    arrayObjSel[2] = jQuery("#idSelPesRegETL");
    arrayObjSel[3] = jQuery("#idSelPesPesETL");
    arrayObjSel[4] = jQuery("#idSelFatuNoFETL");
    arrayObjSel[5] = jQuery("#idSelSistConsPesETL");
    arrayObjSel[6] = jQuery("#idSelCliConsETL");
    arrayObjSel[7] = jQuery("#idSelUsuarioETL");
    arrayObjSel[8] = jQuery("#idSelAlmoFornTipoLog");

    //--
    var concatena = '<option value="0" title="0">&nbsp;</option>';
    let sql = `SELECT id,tipo  
    FROM tabtiposlogradouro
    WHERE int_status = `+ intStatus;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */    
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let idLido = obj.resultados[i].id;
                let tipo = obj.resultados[i].tipo;
                let selecionado = "";
                if (tipo == "Rua") selecionado = "selected";
                concatena = concatena + '<option value="' + idLido + '" title="' + idLido + '" ' + selecionado + '>' + tipo + '</option>';
            }//for i
        }//if retorno
        //---carregados dados da consulta, popular todas as selects indicadas
        let j = 0;
        for (j; j < arrayObjSel.length; j++) {
            arrayObjSel[j].empty();
            arrayObjSel[j].append(concatena);
            //console.log(concatena);
        }//for j
    }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
}//fCarregaTiposLogradouro
//-----------------------------------------------
function fCarregaAlmoNaturezas() {
    let intStatus = 2;//só as ativas
    let arrayObjSel = [];
    arrayObjSel[0] = jQuery("#idSelAlmoRegNat");
    arrayObjSel[1] = jQuery("#idSelAlmoCompNat");
    arrayObjSel[2] = jQuery("#idSelAlmRegNat");
    //--
    var concatena = '<option value="0" title="0">&nbsp;</option>';
    let sql = `SELECT id,natureza  
FROM tabalmonat 
WHERE int_status = `+ intStatus+` 
ORDER BY natureza`;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let idLido = obj.resultados[i].id;
                let natureza = obj.resultados[i].natureza;
                concatena = concatena + '<option value="' + idLido + '" title="' + idLido + '">' + natureza + '</option>';
            }//for i
        }//if retorno
        //---carregados dados da consulta, popular todas as selects indicadas
        let j = 0;
        for (j; j < arrayObjSel.length; j++) {
            arrayObjSel[j].empty();
            arrayObjSel[j].append(concatena);
            //console.log(concatena);
        }//for j
    }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
}//fCarregaAlmoNaturezas
//-----------------------------------------------
function fCarregaPaises() {
    let intStatus = 2;//só as ativas
    let arrayObjSel = [];
    arrayObjSel[0] = jQuery("#idSelPesRegEPa");
    arrayObjSel[1] = jQuery("#idSelPesPesEPa");
    arrayObjSel[2] = jQuery("#idSelCliRegEPa");
    arrayObjSel[3] = jQuery("#idSelCliPesEPa");
    arrayObjSel[4] = jQuery("#idSelFatuNoFPais");
    arrayObjSel[5] = jQuery("#idSelSistConsPesEPa");
    arrayObjSel[6] = jQuery("#idSelUsuarioEPa");
    arrayObjSel[7] = jQuery("#idSelAlmoFornPais");
    arrayObjSel[8] = jQuery("#idSelCliConsEPa");
    //--
    var concatena = '<option value="0" title="0">&nbsp;</option>';
    let sql = `SELECT id,numero,pais  
FROM tabpaises 
WHERE int_status = `+ intStatus;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let idLido = obj.resultados[i].id;
                let numero = obj.resultados[i].numero;
                let pais = obj.resultados[i].pais;
                let selecionado = "";
                if (numero == 55) selecionado = "selected";
                concatena = concatena + '<option value="' + idLido + '" title="' + idLido + '" ' + selecionado + '>' + pais + '</option>';
            }//for i
        }//if retorno
        //---carregados dados da consulta, popular todas as selects indicadas
        let j = 0;
        for (j; j < arrayObjSel.length; j++) {
            arrayObjSel[j].empty();
            arrayObjSel[j].append(concatena);
            //console.log(concatena);
        }//for j
    }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
}//fCarregaPaises
//--------------------------------------------------
function fCarregaAreasAtuacao(intStatus) {
    //---carrega as áreas de acordo com a cláusula
    let clausula = ``;
    if (intStatus > 0) {
        clausula = `WHERE int_status = ` + intStatus;
    }
    //-----------
    let arrayObjSel = [];
    arrayObjSel[0] = jQuery("#idSelPasRegArea");
    arrayObjSel[1] = jQuery("#idSelPasAltAreaTroc");
    arrayObjSel[2] = jQuery("#idSelPasConsArea");
    //--
    var concatena = '<option value="0" title="0">&nbsp;</option>';
    let sql = `SELECT id,area   
FROM tabareas `+ clausula;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let idLido = obj.resultados[i].id;
                let area = obj.resultados[i].area;
                concatena = concatena + '<option value="' + idLido + '" title="' + idLido + '">' + area + '</option>';
            }//for i
        }//if retorno
        //---carregados dados da consulta, popular todas as selects indicadas
        let j = 0;
        for (j; j < arrayObjSel.length; j++) {
            arrayObjSel[j].empty();
            arrayObjSel[j].append(concatena);
            //console.log(concatena);
        }//for j
    }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
}//fCarregaAreasAtuacao
//---------------------------------------------------
function fCarregaAreasAtuacaoAlteracao(intStatus) {
    //---carrega as áreas de acordo com a cláusula
    let clausula = ``;
    if (intStatus > 0) {
        clausula = `WHERE int_status = ` + intStatus;
    }
    //-----------
    let arrayObjSel = [];
    arrayObjSel[0] = jQuery("#idSelPasAltSistAreas");
    //--
    var concatena = '<option value="0" title="0">&nbsp;</option>';
    let sql = `SELECT id,area   
FROM tabareas `+ clausula;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let idLido = obj.resultados[i].id;
                let area = obj.resultados[i].area;
                concatena = concatena + '<option value="' + idLido + '" title="' + idLido + '">' + area + '</option>';
            }//for i
        }//if retorno
        //---carregados dados da consulta, popular todas as selects indicadas
        let j = 0;
        for (j; j < arrayObjSel.length; j++) {
            arrayObjSel[j].empty();
            arrayObjSel[j].append(concatena);
            //console.log(concatena);
        }//for j
    }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
}//fCarregaAreasAtuacaoAlteracao
//---------------------------------------------------
function fCarregaPastas() {
    let intStatus = 2;//só as ativas
    let arrayObjSel = [];
    arrayObjSel[0] = jQuery("#idSelPasPesPas");
    arrayObjSel[1] = jQuery("#idSelTimSistTransPas");
    arrayObjSel[2] = jQuery("#idSelTimSistNTEPas");
    //arrayObjSel[3] = jQuery("#idSelSistNTEPasA");

    //--
    var concatena = '<option value="0" title="0">&nbsp;</option>';
    let sql = `SELECT id,pasta   
FROM tabpastas 
WHERE int_status = `+ intStatus;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let idLido = obj.resultados[i].id;
                let pasta = obj.resultados[i].pasta;
                concatena = concatena + '<option value="' + idLido + '" title="' + idLido + '">' + pasta + '</option>';
            }//for i
        }//if retorno
        //---carregados dados da consulta, popular todas as selects indicadas
        let j = 0;
        for (j; j < arrayObjSel.length; j++) {
            arrayObjSel[j].empty();
            arrayObjSel[j].append(concatena);
            //console.log(concatena);
        }//for j
    }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
}//fCarregaPastas
//---------------------------------------------------
function fBuscaEnderecoDandoCEP(intCEP, idTxtBlur) {
    //console.log(idTxtBlur+" na função");
    let objSpa1 = jQuery("#idSpaPesRegAvi");
    let objSpa11 = jQuery("#idSpaUsuarioAvi");
    let objSpa2 = jQuery("#idSpaCliRegAvi");
    let objSpa3 = jQuery("#idSpaFatuRegAvi");
    let objSpa4 = jQuery("#idSpaAlmoFornAviso");
    //--
    let objTxt1 = jQuery("#idTxtExpeRegEnC");
    //--
    
    if (idTxtBlur == "idTxtSistConsPesECE") {
        //limpa os campos de endereço da pessoa admin
        jQuery("#idTxtSistConsPesEnL").val('');
        jQuery("#idTxtSistConsPesEnB").val('');
        jQuery("#idTxtSistConsPesECi").val('');
        jQuery("#idTxtSistConsPesEEs").val('');
    }//if
    if (idTxtBlur == "idTxtAlmoFornCEP") {
        objSpa4.text('');
        objSpa4.css({ "color": "initial" });
        //limpa os campos de endereço da pessoa
        jQuery("#idTxtAlmoFornLog").val('');
        jQuery("#idTxtAlmoFornBai").val('');
        jQuery("#idTxtAlmoFornCid").val('');
        jQuery("#idTxtAlmoFornEst").val('');
    }//if
    if (idTxtBlur == "idTxtPesRegECE") {
        objSpa1.text('');
        objSpa1.css({ "color": "initial" });
        //limpa os campos de endereço da pessoa
        jQuery("#idTxtPesRegEnL").val('');
        jQuery("#idTxtPesRegEnB").val('');
        jQuery("#idTxtPesRegECi").val('');
        jQuery("#idTxtPesRegEEs").val('');
    }//if
    if (idTxtBlur == "idTxtUsuarioECE") {
        objSpa1.text('');
        objSpa1.css({ "color": "initial" });
        //limpa os campos de endereço da pessoa
        jQuery("#idTxtUsuarioEnL").val('');
        jQuery("#idTxtUsuarioEnB").val('');
        jQuery("#idTxtUsuarioECi").val('');
        jQuery("#idTxtUsuarioEEs").val('');
    }//if
    if (idTxtBlur == "idTxtCliRegECE") {
        //limpa os campos de endereço do cliente
        //console.log("Limpando os campos input do cliente novo");
        objSpa2.text('');
        objSpa2.css({ "color": "initial" });
        jQuery("#idTxtCliRegEnL").val('');
        jQuery("#idTxtCliRegEnB").val('');
        jQuery("#idTxtCliRegECi").val('');
        jQuery("#idTxtCliRegEEs").val('');
    }//if
    if (idTxtBlur == "idTxtFatuNoFCEP") {
        //limpa os campos de endereço do novo faturado
        objSpa3.text('');
        objSpa3.css({ "color": "initial" });
        jQuery("#idTxtFatuNoFLog").val('');
        jQuery("#idTxtFatuNoFBai").val('');
        jQuery("#idTxtFatuNoFCid").val('');
        jQuery("#idTxtFatuNoFUF").val('');
    }//if
     //---
    let minhaUrl = 'https://webservice.kinghost.net/web_cep.php?auth=f519c80183605296420bb499fa7da1e0&formato=json&cep=' + intCEP;
    //console.log("minhaUrl",minhaUrl);
    jQuery.get(minhaUrl, function (retorno) {
        //console.log("retorno",retorno);
        let objRes = JSON.parse(retorno);
        //  //console.log("UF",objRes.uf);
        if (retorno.length > 138) {
            let tipoLog = objRes.tipo_logradouro;
            //console.log(tipoLog);
            
            if (idTxtBlur == 'idTxtSistConsPesECE') {
                //preenche campos de endereço da pessoa admin
                jQuery("#idSelSistConsPesETL").val( jQuery('option:contains("'+tipoLog+'")').val() );
                jQuery("#idTxtSistConsPesEnL").val(objRes.logradouro);
                jQuery("#idTxtSistConsPesEnB").val(objRes.bairro);
                jQuery("#idTxtSistConsPesECi").val(objRes.cidade);
                jQuery("#idTxtSistConsPesEEs").val(objRes.uf);
            }//if
            if (idTxtBlur == 'idTxtAlmoFornCEP') {
                //preenche campos de endereço do fornecedor
                jQuery("#idSelAlmoFornTipoLog").val( jQuery('option:contains("'+tipoLog+'")').val() );
                jQuery("#idTxtAlmoFornLog").val(objRes.logradouro);
                jQuery("#idTxtAlmoFornBai").val(objRes.bairro);
                jQuery("#idTxtAlmoFornCid").val(objRes.cidade);
                jQuery("#idTxtAlmoFornEst").val(objRes.uf);
            }//if
            if (idTxtBlur == 'idTxtPesRegECE') {
                //preenche campos de endereço de uma pessoa
                jQuery("#idSelPesRegETL").val( jQuery('option:contains("'+tipoLog+'")').val() );
                jQuery("#idTxtPesRegEnL").val(objRes.logradouro);
                jQuery("#idTxtPesRegEnB").val(objRes.bairro);
                jQuery("#idTxtPesRegECi").val(objRes.cidade);
                jQuery("#idTxtPesRegEEs").val(objRes.uf);
            }//if
            if (idTxtBlur == 'idTxtUsuarioECE') {
                //preenche campos de endereço de uma pessoa
                jQuery("#idSelUsuarioETL").val( jQuery('option:contains("'+tipoLog+'")').val() );
                jQuery("#idTxtUsuarioEnL").val(objRes.logradouro);
                jQuery("#idTxtUsuarioEnB").val(objRes.bairro);
                jQuery("#idTxtUsuarioECi").val(objRes.cidade);
                jQuery("#idTxtUsuarioEEs").val(objRes.uf);
            }//if
            if (idTxtBlur == "idTxtCliRegECE") {
                //preenche campos de endereço do cliente
                //console.log("Preenchendo os campos do cliente novo "+retorno.logradouro);
                //jQuery("#idSelCliPesETL").val(tipoLog);
                 jQuery("#idSelCliRegETL").val( jQuery('option:contains("'+tipoLog+'")').val() );
                jQuery("#idTxtCliRegEnL").val(objRes.logradouro);
                jQuery("#idTxtCliRegEnB").val(objRes.bairro);
                jQuery("#idTxtCliRegECi").val(objRes.cidade);
                jQuery("#idTxtCliRegEEs").val(objRes.uf);

            }//if            
            if (idTxtBlur == "idTxtFatuNoFCEP") {
                //preenche campos de endereço do novo faturado
                //jQuery("#idSelFatuNoFETL").val(tipoLog);
               //console.log("tipoLog",tipoLog);
                jQuery("#idSelFatuNoFETL").val( jQuery('option:contains("'+tipoLog+'")').val() );
                jQuery("#idTxtFatuNoFLog").val(objRes.logradouro);
                jQuery("#idTxtFatuNoFBai").val(objRes.bairro);
                jQuery("#idTxtFatuNoFCid").val(objRes.cidade);
                jQuery("#idTxtFatuNoFUF").val(objRes.uf);
            }
            if (idTxtBlur == "idTxtExpeRegEnC") {
                //preenche campos de endereço expedição
               //console.log("tipoLog",tipoLog);
                jQuery("#idTxtExpeRegEnC").val(tipoLog+" "+objRes.logradouro+" "+objRes.bairro+" "+objRes.cidade+" "+objRes.uf);
            }
        } else {
            if (idTxtBlur == "idTxtPesRegECE") {
                objSpa1.text("Endereço não encontrado para o cep " + intCEP);
                objSpa1.css({ "color": "red" });
            }//if
            if (idTxtBlur == "idTxtUsuarioECE") {
                objSpa11.text("Endereço não encontrado para o cep " + intCEP);
                objSpa11.css({ "color": "red" });
            }//if
            if (idTxtBlur == "idTxtCliRegECE") {
                objSpa2.text("Endereço não encontrado para o cep " + intCEP);
                objSpa2.css({ "color": "red" });
            }//if
            if (idTxtBlur == "idTxtFatuNoFCEP") {
                objSpa3.text("Endereço não encontrado para o cep " + intCEP);
                objSpa3.css({ "color": "red" });
            }//if
            if (idTxtBlur == "idTxtExpeRegCEP") {
                objTxt1.val("Endereço não encontrado para o cep " + intCEP);
            }//if
            
            if (idTxtBlur == "idTxtAlmoFornCEP") {
                objSpa4.text("Endereço não encontrado para o cep " + intCEP);
                objSpa4.css({ "color": "red" });
            }//if
        }//if restorno
        /*
         * bairro: "Carlos Prates"
cidade: "Belo Horizonte"
logradouro: "Santa Quitéria"
resultado: "1"
resultado_txt: "sucesso - cep completo"
tipo_logradouro: "Rua"
uf: "MG"
         */
    });//get
}//fBuscaEnderecoDandoCEP
//--------------------------------------------
function fPrepara(arrayValores) {
    //a quantidade de campos tem de ser a mesma...
    //..quantidade de ? na sentença sql
    var tripa = "";
    let i = 0;
    for (i; i < arrayValores.length; i++) {
        let valorVez = arrayValores[i];
        tripa = tripa + valorVez + "#@#";
    }//for
    //---retirar um delimitador em excesso
    //console.log("tripa intacta: "+tripa);
    let ultimoDelimitador = tripa.lastIndexOf("#@#");
    tripa = tripa.substring(0, ultimoDelimitador);
    //console.log(ultimoDelimitador);
    //console.log("Tripa limpa: "+tripa);
    return tripa;
}//fPrepara
//--------------------------------------------
async function fVerificaExistenciaCPF(cpf) {
    let sql = `SELECT *  
    FROM tabpessoas 
    WHERE  cpf = '`+ cpf + `'`;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */    
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let pessoa = obj.resultados[0].pessoa;
            fCallbackRetornaPessoa(pessoa);
        } else {
            fCallbackRetornaPessoa("0");
        }//if retorno
    }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
}//fIntVerificaSigla
//-----------------------------------
function fVerificaExistenciaCPFCNPJFornecedor(cpfCnpj) {
    let objHid = jQuery("#idHidAlmoFornUpdate");
    let sql="";
        sql = `SELECT *  
        FROM tabfornecedores 
        WHERE  cpfcnpj = '`+ cpfCnpj+`'`;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        //console.log("retorno do fVerificaExistenciaCPFCNPJForncedor",retorno);
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let fornecedor = obj.resultados[0].fornecedor;
            fCallbackRetornaFornecedor(fornecedor);
            objHid.val(1);//marca que existe, logo é update
            fPreencheCamposFornecedor(cpfCnpj);
        } else {
            fCallbackRetornaFornecedor("0");
            objHid.val(0);//marca que não existe, logo será insert
        }//if retorno
    }, function (respostaErrada) {
        //console.log("função fVerificaExistenciaCPFCNPJFornecedor",respostaErrada);
    }).catch(function (e) {
        //console.log("função fVerificaExistenciaCPFCNPJFornecedor catch",e);
    });//fExecutaBD
}//fIntVerificaSigla
//-----------------------------------
function fCallbackRetornaFornecedor(fornecedor) {
   // var objBtn = jQuery("#idBtnAlmoFornSalvar");
    if (fornecedor != "0") {
        alert("Este CPF/CNPJ Já pertence a " + fornecedor + ". Carregando os dados para alteração (se for o caso).");
        //objBtn.prop("disabled", true);//tranca o botão de salvamento
        //objBtn.prop("title", "Botão desabilitado porque a sigla ou o CPF/CPNJ já existe para outro fornecedor");
    }
}//fCallbackRetornaPessoa
//---------------------------------------------
function fCallbackRetornaPessoa(pessoa) {
    var objBtn = jQuery("#idBtnPesRegSalvar");
    if (pessoa != "0") {
        alert("Há um erro de repetição na inserção do CPF. Já pertence a " + pessoa + " e não pode haver repetição.");
        objBtn.prop("disabled", true);//tranca o botão de salvamento
        objBtn.prop("title", "Botão desabilitado porque a sigla ou o CPF já existe para outra pessoa");
    }
}//fCallbackRetornaPessoa
//---------------------------------------------
async function fVerificaCPFCNPJClienteFaturado(cpfCnpj, clienteOuFaturado) {
    let sql = "";
    if (clienteOuFaturado == "cliente") {
        sql = `SELECT *  
        FROM tabclientes
        WHERE cpfcnpj = '`+ cpfCnpj + `'`;
    }
    if (clienteOuFaturado == "faturado") {
        sql = `SELECT *  
            FROM tabfaturados
            WHERE cpfcnpj_faturado = '`+ cpfCnpj + `'`;
    }
    //console.log(cpfCnpj);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */    
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        if (retorno.length > 20) {
            let pessoa = "";
            let obj = JSON.parse(retorno);
            if (clienteOuFaturado == "cliente") {
                pessoa = obj.resultados[0].cliente;
            }
            if (clienteOuFaturado == "faturado") {
                pessoa = obj.resultados[0].faturado;
            }
            fCallbackRetornaNome(pessoa);
        } else {
            fCallbackRetornaNome("0");
        }//if retorno
    }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
}//fIntVerificaCPFCNPJ
//-----------------------------------
function fCallbackRetornaNome(pessoa) {
    var objBtn = jQuery("#idBtnCliRegSalvar");
    if (pessoa != "0") {
        alert("Há um erro de repetição na inserção do CPF ou CNPJ. Já pertence a " + pessoa + " e não pode haver repetição.");
        objBtn.prop("disabled", true);//tranca o botão de salvamento
        objBtn.prop("title", "Botão desabilitado porque a sigla ou o CPF já existe para outra pessoa");
    }
}//fCallbackRetornanOME
//-------------------------------------
function fCarregaAnosCrono() {
    let objData = new Date();
    let ano = objData.getFullYear();
    let objSel = jQuery("#idSelCronoPesAno");
    objSel.empty();
    var concatena = '<option value="0" title="0"></option>';
    for (i = ano; i > ano - 3; i--) {
        concatena = concatena + '<option value="' + i + '">' + i + '</option>';
    }
    objSel.append(concatena);
}//fCarregaAnosCrono
//-------------------------------------
function fConverteDataHumanaEmMilissegundosDELETAR(strData) {
    //esta função retorna 19 dígitos
    if (strData.length == 19) {
        ano = strData.substring(0, 4) * 1;
        mes = strData.substring(5, 7) * 1;
        dia = strData.substring(8, 10) * 1;
        hora = strData.substring(11, 13) * 1;
        minuto = strData.substring(14, 16) * 1;
        segundo = strData.substring(17, 19) * 1;
        //console.log("Viu que eram 19 dígitos "+ano+ " "+mes+ " "+dia+" "+hora+" "+minuto+" "+segundo);
        if (dia > 0 && dia < 32 && mes > 0 && mes < 13 && hora < 24 && minuto < 60 && segundo < 60) {
            mes = mes - 1;//para compensar o que pensa o javascript
            //  //console.log("Vai fazer o cálculo: "+ano + " " + mes + " " + dia);
            //--
            let d = new Date(ano, mes, dia, hora, minuto, segundo);
            var n = d.getTime();
            return n;//sucesso
        } else {
            return -2;//data mal formada
        }//if dia
    } else {
        return -1;//não foram preenchidos 19 dígitos
    }//if strData
}//fConverteDataHumanaEmMilissegundos
//-------------------------------------
function fconverteMilissegundosEmDataHumanaDELETAR(intMili) {
    //para recuperar a data a partir do milissegundo n.toLocaleDateString();
    let d = new Date(intMili);
    let dataHumana = d.toLocaleDateString();
    return dataHumana;
}//fConverteMilissegundosemDataHumana
//---------------------------------------
function fMontaSQL(clausula) {

}//fMontaSQL
//----------------------------------------------------
function fPegaDataAtualNoFormatoAmericano(){
let dataObj = new Date();
let ano = dataObj.getFullYear();
let mes = dataObj.getMonth()+1;
let dia = dataObj.getDate();
let horas = dataObj.getHours();
let minutos = dataObj.getMinutes();
let segundos = dataObj.getSeconds();
if(mes.toString().length==1) mes="0"+mes;
if(dia.toString().length==1) dia="0"+dia;
if(horas.toString().length==1) horas="0"+horas;
if(minutos.toString().length==1) minutos ="0"+minutos;
if(segundos.toString().length==1) segundos="0"+segundos;
return ano+"-"+mes+"-"+dia+" "+horas+":"+minutos+":"+segundos;
}//fPegaDataAtualNoFormatoAmericano

//----------------------------------------------------
function fCarregaAreasAtuacaoAlteracao(intStatus) {
    //---carrega as áreas de acordo com a cláusula
    let clausula = ``;
    if (intStatus > 0) {
        clausula = `WHERE int_status = ` + intStatus;
    }
    //-----------
    let arrayObjSel = [];
    arrayObjSel[0] = jQuery("#idSelPasAltSistAreas");
    //--
    var concatena = '<option value="0" title="0">&nbsp;</option>';
    let sql = `SELECT id,area,int_status   
FROM tabareas `+ clausula;
    //console.log(sql);
                                                                  /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let idLido = obj.resultados[i].id;
                let area = obj.resultados[i].area;
                let intStatus = obj.resultados[i].int_status;
                let agregado = "";
                if (intStatus == 1) {
                    agregado = "*";
                }
                if (intStatus > 2) {
                    agregado = "**";
                }
                concatena = concatena + '<option value="' + idLido + '" title="' + idLido + '">' + area + agregado + '</option>';
            }//for i
        }//if retorno
        //---carregados dados da consulta, popular todas as selects indicadas
        let j = 0;
        for (j; j < arrayObjSel.length; j++) {
            arrayObjSel[j].empty();
            arrayObjSel[j].append(concatena);
            //console.log(concatena);
        }//for j
    }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
}//fCarregaAreasAtuacaoAlteracao
//---------------------------------------------------
function fProcessa(intBlocoOrigem, objTab, idCli, idPasta, idProf, intBaixadas,dataInicial,dataFinal) {
    //console.log("intBaixadas",intBaixadas);
    var sql = "x";
    //------------------------------------------------------------------BLOCO CLIENTE
    //----selecionados todos os timesheet do cliente, tão-somente cliente.
    //console.log("idCli: "+idCli+" idPasta: "+idPasta+" dataInicial: "+dataInicial+" dataFinal: "+dataFinal+" idProf: "+idProf+" intBaixadas:"+intBaixadas);
    if (idCli * 1 > 0 && idPasta * 1 == 0 && idProf * 1 == 0 && intBaixadas == 0) {
         //alert ("Entrou na escolha de somente cliente");
        sql = `SELECT t.id,c.cliente,p.pasta,p.materia,g.pessoa,
     t.data_trabalhada,t.descricao,t.uts,t.taxa_padrao,t.taxa_especial,
     t.numero_nh,t.data_nh,t.int_status
                     FROM tabts t 
                     INNER JOIN tabpastas p 
                     ON t.pasta_tabpastas = p.id 
                     INNER JOIN tabclientes c 
                     ON p.cliente_tabclientes = c.id 
                     INNER JOIN tabpessoas g 
                     ON t.profissional_tabpessoas = g.id 
                     WHERE c.id = `+ idCli + ` 
                     AND t.data_trabalhada >= '`+dataInicial+`' AND t.data_trabalhada <= '`+dataFinal+`' 
                     AND t.int_status < 3`;
    }//escolheu só cliente  
    //console.log("sql",sql);
    //----selecionados todos os timesheet do cliente e datas.
    if (idCli * 1 > 0 && idPasta * 1 == 0  && idProf * 1 == 0 && intBaixadas == 0) {
        sql = `SELECT t.id,c.cliente, p.pasta,p.materia,t.data_trabalhada,t.descricao,
     g.pessoa,t.uts,t.taxa_padrao,t.taxa_especial,t.numero_nh,t.data_nh,t.int_status 
     FROM tabpastas p 
     INNER JOIN tabclientes c 
     ON p.cliente_tabclientes = c.id 
     INNER JOIN tabts t 
     ON t.pasta_tabpastas = p.id 
     INNER JOIN tabpessoas g 
     ON t.profissional_tabpessoas = g.id 
     WHERE t.int_status < 3 
     AND t.data_trabalhada >= '`+dataInicial+`' AND t.data_trabalhada <= '`+dataFinal+`' 
     AND c.id = `+ idCli;
    }//escolheu cliente e datas  
    //----selecionados todos os timesheet do cliente e profissional.
    if (idCli * 1 > 0 && idPasta * 1 == 0  && idProf * 1 > 0 && intBaixadas == 0) {
        sql = `SELECT t.id,c.cliente, p.pasta,p.materia,t.data_trabalhada,t.descricao,
         g.pessoa,t.uts,t.taxa_padrao,t.taxa_especial,t.numero_nh,t.data_nh,t.int_status 
         FROM tabpastas p 
         INNER JOIN tabclientes c 
         ON p.cliente_tabclientes = c.id 
         INNER JOIN tabts t 
         ON t.pasta_tabpastas = p.id 
         INNER JOIN tabpessoas g 
         ON t.profissional_tabpessoas = g.id 
         WHERE t.int_status < 3  
         AND t.data_trabalhada >= '`+dataInicial+`' AND t.data_trabalhada <= '`+dataFinal+`' 
         AND c.id = `+ idCli + `                 
         AND g.id = `+ idProf;
    }//escolheu cliente e prof 
        //----selecionados todos os timesheet do cliente e profissional e baixadas
        if (idCli * 1 > 0 && idPasta * 1 == 0  && idProf * 1 > 0 && intBaixadas > 0) {
            sql = `SELECT t.id,c.cliente, p.pasta,p.materia,t.data_trabalhada,t.descricao,
             g.pessoa,t.uts,t.taxa_padrao,t.taxa_especial,t.numero_nh,t.data_nh,t.int_status 
             FROM tabpastas p 
             INNER JOIN tabclientes c 
             ON p.cliente_tabclientes = c.id 
             INNER JOIN tabts t 
             ON t.pasta_tabpastas = p.id 
             INNER JOIN tabpessoas g 
             ON t.profissional_tabpessoas = g.id 
             WHERE t.int_status < 7   
             AND t.data_trabalhada >= '`+dataInicial+`' AND t.data_trabalhada <= '`+dataFinal+`' 
             AND c.id = `+ idCli + `                 
             AND g.id = `+ idProf;
        }//escolheu cliente e prof e baixadas


//----selecionados todos os timesheet só do profissional.
if (idCli*1 == 0 && idPasta * 1 == 0  && idProf * 1 > 0 && intBaixadas == 0) {
    sql = `SELECT t.id,c.cliente, p.pasta,p.materia,t.data_trabalhada,t.descricao,
     g.pessoa,t.uts,t.taxa_padrao,t.taxa_especial,t.numero_nh,t.data_nh,t.int_status 
     FROM tabpastas p 
     INNER JOIN tabclientes c 
     ON p.cliente_tabclientes = c.id 
     INNER JOIN tabts t 
     ON t.pasta_tabpastas = p.id 
     INNER JOIN tabpessoas g 
     ON t.profissional_tabpessoas = g.id 
     WHERE t.int_status < 3  
     AND t.data_trabalhada >= '`+dataInicial+`' AND t.data_trabalhada <= '`+dataFinal+`' 
     AND g.id = `+ idProf;
}//escolheu só prof 
    //----selecionados todos os timesheet só profissional e baixadas
    if (idCli*1 == 0 && idPasta * 1 == 0  && idProf * 1 > 0 && intBaixadas > 0) {
        sql = `SELECT t.id,c.cliente, p.pasta,p.materia,t.data_trabalhada,t.descricao,
         g.pessoa,t.uts,t.taxa_padrao,t.taxa_especial,t.numero_nh,t.data_nh,t.int_status 
         FROM tabpastas p 
         INNER JOIN tabclientes c 
         ON p.cliente_tabclientes = c.id 
         INNER JOIN tabts t 
         ON t.pasta_tabpastas = p.id 
         INNER JOIN tabpessoas g 
         ON t.profissional_tabpessoas = g.id 
         WHERE t.int_status < 7   
         AND t.data_trabalhada >= '`+dataInicial+`' AND t.data_trabalhada <= '`+dataFinal+`' 
         AND g.id = `+ idProf;
    }//escolheu só prof e baixadas



    //----selecionados todos os timesheet do cliente e baixadas
    if (idCli * 1 > 0 && idPasta * 1 == 0 && idProf * 1 == 0 && intBaixadas > 0) {
        sql = `SELECT t.id,c.cliente,p.pasta,p.materia,g.pessoa,
     t.data_trabalhada,t.descricao,t.uts,t.taxa_padrao,t.taxa_especial,
     t.numero_nh,t.data_nh,t.int_status
                     FROM tabts t 
                     INNER JOIN tabpastas p 
                     ON t.pasta_tabpastas = p.id 
                     INNER JOIN tabclientes c 
                     ON p.cliente_tabclientes = c.id 
                     INNER JOIN tabpessoas g 
                     ON t.profissional_tabpessoas = g.id 
                     WHERE c.id = `+ idCli + ` 
                     AND t.data_trabalhada >= '`+dataInicial+`' AND t.data_trabalhada <= '`+dataFinal+`' 
                     AND t.int_status > 0`;
    }//escolheu só cliente e baixadas
    //----selecionados todos os timesheet do cliente e datas e baixadas.
    if (idCli * 1 > 0 && idPasta * 1 == 0 && idProf * 1 == 0 && intBaixadas > 0) {
        sql = `SELECT t.id,c.cliente, p.pasta,p.materia,t.data_trabalhada,t.descricao,
         g.pessoa,t.uts,t.taxa_padrao,t.taxa_especial,t.numero_nh,t.data_nh,t.int_status 
         FROM tabpastas p 
         INNER JOIN tabclientes c 
         ON p.cliente_tabclientes = c.id 
         INNER JOIN tabts t 
         ON t.pasta_tabpastas = p.id 
         INNER JOIN tabpessoas g 
         ON t.profissional_tabpessoas = g.id 
         WHERE t.int_status > 0  
         AND t.data_trabalhada >= '`+dataInicial+`' AND t.data_trabalhada <= '`+dataFinal+`' 
         AND c.id = `+ idCli;
    }//escolheu cliente e datas e baixadas    
    //----selecionados todos os timesheet do cliente e profissional.
    if (idCli * 1 > 0 && idPasta * 1 == 0  && idProf * 1 > 0 && intBaixadas > 0) {
        sql = `SELECT t.id,c.cliente, p.pasta,p.materia,t.data_trabalhada,t.descricao,
         g.pessoa,t.uts,t.taxa_padrao,t.taxa_especial,t.numero_nh,t.data_nh,t.int_status 
         FROM tabpastas p 
         INNER JOIN tabclientes c 
         ON p.cliente_tabclientes = c.id 
         INNER JOIN tabts t 
         ON t.pasta_tabpastas = p.id 
         INNER JOIN tabpessoas g 
         ON t.profissional_tabpessoas = g.id 
         WHERE p.id IN (SELECT DISTINCT pasta_tabpastas FROM tabts) 
         AND t.int_status > 0  
         AND t.data_trabalhada >= '`+dataInicial+`' AND t.data_trabalhada <= '`+dataFinal+`' 
         AND c.id = `+ idCli + ` 
         AND g.id = `+ idProf;
    }//escolheu cliente e prof e baixadas  
    //------------------------------------------------------------------------/BLOCO CLIENTE
    //--------------------------------------------------------INICIO BLOCO DAS PASTAS
    //----selecionados todos os timesheet pela pasta, tão-somente pasta.
    if (idPasta * 1 > 0 && idProf * 1 == 0 && intBaixadas == 0) {
        sql = `SELECT t.id,c.cliente, p.pasta,p.materia,t.data_trabalhada,t.descricao,
         g.pessoa,t.uts,t.taxa_padrao,t.taxa_especial,t.numero_nh,t.data_nh,t.int_status 
         FROM tabpastas p 
         INNER JOIN tabclientes c 
         ON p.cliente_tabclientes = c.id 
         INNER JOIN tabts t 
         ON t.pasta_tabpastas = p.id 
         INNER JOIN tabpessoas g 
         ON t.profissional_tabpessoas = g.id 
         WHERE t.int_status < 3   
         AND t.data_trabalhada >= '`+dataInicial+`' AND t.data_trabalhada <= '`+dataFinal+`' 
         AND p.id = `+ idPasta;
    }//escolheu só pasta
    //----selecionados todos os timesheet pela pasta e datas.
    if (idPasta * 1 > 0 & idProf * 1 == 0 && intBaixadas == 0) {
        sql = `SELECT t.id,c.cliente, p.pasta,p.materia,t.data_trabalhada,t.descricao,
         g.pessoa,t.uts,t.taxa_padrao,t.taxa_especial,t.numero_nh,t.data_nh,t.int_status 
         FROM tabpastas p 
         INNER JOIN tabclientes c 
         ON p.cliente_tabclientes = c.id 
         INNER JOIN tabts t 
         ON t.pasta_tabpastas = p.id 
         INNER JOIN tabpessoas g 
         ON t.profissional_tabpessoas = g.id 
         WHERE t.int_status < 3   
         AND t.data_trabalhada >= '`+dataInicial+`' AND t.data_trabalhada <= '`+dataFinal+`' 
         AND p.id = `+ idPasta;
    }//escolheu só pasta e datas
    //----selecionados todos os timesheet pela pasta e prof
    if (idPasta * 1 > 0 && idProf * 1 > 0 && intBaixadas == 0) {
        sql = `SELECT t.id,c.cliente, p.pasta,p.materia,t.data_trabalhada,t.descricao,
         g.pessoa,t.uts,t.taxa_padrao,t.taxa_especial,t.numero_nh,t.data_nh,t.int_status 
         FROM tabpastas p 
         INNER JOIN tabclientes c 
         ON p.cliente_tabclientes = c.id 
         INNER JOIN tabts t 
         ON t.pasta_tabpastas = p.id 
         INNER JOIN tabpessoas g 
         ON t.profissional_tabpessoas = g.id 
         WHERE t.int_status < 3    
         AND t.data_trabalhada >= '`+dataInicial+`' AND t.data_trabalhada <= '`+dataFinal+`' 
         AND p.id = `+ idPasta + ` 
         AND g.id = `+ idProf;
    }//escolheu só pasta e prof                
    //----selecionados todos os timesheet pela pasta e baixadas
    if (idPasta * 1 > 0 && idProf * 1 == 0 && intBaixadas > 0) {
        sql = `SELECT t.id,c.cliente, p.pasta,p.materia,t.data_trabalhada,t.descricao,
         g.pessoa,t.uts,t.taxa_padrao,t.taxa_especial,t.numero_nh,t.data_nh,t.int_status 
         FROM tabpastas p 
         INNER JOIN tabclientes c 
         ON p.cliente_tabclientes = c.id 
         INNER JOIN tabts t 
         ON t.pasta_tabpastas = p.id 
         INNER JOIN tabpessoas g 
         ON t.profissional_tabpessoas = g.id 
         WHERE t.int_status > 0    
         AND t.data_trabalhada >= '`+dataInicial+`' AND t.data_trabalhada <= '`+dataFinal+`' 
         AND p.id = `+ idPasta;
    }//escolheu  pasta e baixadas
    //----selecionados todos os timesheet pela pasta e datas e baixa
    if (idPasta * 1 > 0 && idProf * 1 == 0 && intBaixadas > 0) {
        sql = `SELECT t.id,c.cliente, p.pasta,p.materia,t.data_trabalhada,t.descricao,
         g.pessoa,t.uts,t.taxa_padrao,t.taxa_especial,t.numero_nh,t.data_nh,t.int_status 
         FROM tabpastas p 
         INNER JOIN tabclientes c 
         ON p.cliente_tabclientes = c.id 
         INNER JOIN tabts t 
         ON t.pasta_tabpastas = p.id 
         INNER JOIN tabpessoas g 
         ON t.profissional_tabpessoas = g.id 
         WHERE t.int_status > 0    
         AND t.data_trabalhada >= '`+dataInicial+`' AND t.data_trabalhada <= '`+dataFinal+`' 
         AND p.id = `+ idPasta;
    }//escolheu só pasta e datas e baixada      
    //----selecionados todos os timesheet pela pasta e prof e baixa
    if (idPasta * 1 > 0 && idProf * 1 > 0 && intBaixadas > 0) {
        sql = `SELECT t.id,c.cliente, p.pasta,p.materia,t.data_trabalhada,t.descricao,
         g.pessoa,t.uts,t.taxa_padrao,t.taxa_especial,t.numero_nh,t.data_nh,t.int_status 
         FROM tabpastas p 
         INNER JOIN tabclientes c 
         ON p.cliente_tabclientes = c.id 
         INNER JOIN tabts t 
         ON t.pasta_tabpastas = p.id 
         INNER JOIN tabpessoas g 
         ON t.profissional_tabpessoas = g.id 
         WHERE t.int_status > 0    
         AND t.data_trabalhada >= '`+dataInicial+`' AND t.data_trabalhada <= '`+dataFinal+`' 
         AND g.id = `+ idProf + ` 
         AND p.id = `+ idPasta;
    }//escolheu só pasta e prof   e baixa
    //----selecionados todos os timesheet pela pasta e datas e profissional
    if (idPasta * 1 > 0  && idProf * 1 > 0 && intBaixadas == 0) {
        sql = `SELECT t.id,c.cliente, p.pasta,p.materia,t.data_trabalhada,t.descricao,
         g.pessoa,t.uts,t.taxa_padrao,t.taxa_especial,t.numero_nh,t.data_nh,t.int_status 
         FROM tabpastas p 
         INNER JOIN tabclientes c 
         ON p.cliente_tabclientes = c.id 
         INNER JOIN tabts t 
         ON t.pasta_tabpastas = p.id 
         INNER JOIN tabpessoas g 
         ON t.profissional_tabpessoas = g.id 
         WHERE t.int_status < 3    
         AND t.data_trabalhada >= '`+dataInicial+`' AND t.data_trabalhada <= '`+dataFinal+`' 
         AND p.id = `+ idPasta + ` 
         AND g.id = `+ idProf;
    }//escolheu só pasta e datas e profissional
    //----selecionados todos os timesheet pela pasta e datas e profissional e baixa
    if (idPasta * 1 > 0 && idProf * 1 > 0 && intBaixadas > 0) {
        sql = `SELECT t.id,c.cliente, p.pasta,p.materia,t.data_trabalhada,t.descricao,
         g.pessoa,t.uts,t.taxa_padrao,t.taxa_especial,t.numero_nh,t.data_nh,t.int_status 
         FROM tabpastas p 
         INNER JOIN tabclientes c 
         ON p.cliente_tabclientes = c.id 
         INNER JOIN tabts t 
         ON t.pasta_tabpastas = p.id 
         INNER JOIN tabpessoas g 
         ON t.profissional_tabpessoas = g.id 
         WHERE t.int_status > 0  
         AND t.data_trabalhada >= '`+dataInicial+`' AND t.data_trabalhada <= '`+dataFinal+`' 
         AND p.id = `+ idPasta + ` 
         AND g.id = `+ idProf;
    }//escolheu só pasta e datas e profissional e baixa
    //-------------------------------------------------------------/BLOCO DAS PASTAS
    //-------------------------------------INICIO BLOCO SEM PASTAS (SEM CLIENTE)
    //----selecionados todos os timesheet pelas datas e profissional
    if (typeof idPasta == "undefined" && idProf * 1 > 0 && intBaixadas == 0) {
        sql = `SELECT t.id,c.cliente, p.pasta,p.materia,t.data_trabalhada,t.descricao,
         g.pessoa,t.uts,t.taxa_padrao,t.taxa_especial,t.numero_nh,t.data_nh,t.int_status 
         FROM tabpastas p 
         INNER JOIN tabclientes c 
         ON p.cliente_tabclientes = c.id 
         INNER JOIN tabts t 
         ON t.pasta_tabpastas = p.id 
         INNER JOIN tabpessoas g 
         ON t.profissional_tabpessoas = g.id 
         WHERE t.int_status < 3       
         AND t.data_trabalhada >= '`+dataInicial+`' AND t.data_trabalhada <= '`+dataFinal+`' 
         AND g.id = `+ idProf;
    }//escolheu só datas e profissional 
    //----selecionados todos os timesheet pelas datas e profissional e baixa
    if (typeof idPasta == "undefined" && idProf * 1 > 0 && intBaixadas > 0) {
        sql = `SELECT t.id,c.cliente, p.pasta,p.materia,t.data_trabalhada,t.descricao,
                 g.pessoa,t.uts,t.taxa_padrao,t.taxa_especial,t.numero_nh,t.data_nh,t.int_status 
                 FROM tabpastas p 
                 INNER JOIN tabclientes c 
                 ON p.cliente_tabclientes = c.id 
                 INNER JOIN tabts t 
                 ON t.pasta_tabpastas = p.id 
                 INNER JOIN tabpessoas g 
                 ON t.profissional_tabpessoas = g.id 
                 WHERE t.int_status > 0       
                 AND t.data_trabalhada >= '`+dataInicial+`' AND t.data_trabalhada <= '`+dataFinal+`' 
                 AND g.id = `+ idProf;
    }//escolheu só datas e profissional e baixa 
    //------------------------------------------/BLOCO SEM PASTAS
    //console.log("sql",sql);
    if (sql != "x") {
        //pode fazer a consulta
        if (intBlocoOrigem == 1) {
            var concatena = `<tr><th>Cliente</th><th>Pasta</th><th>Assunto/Matéria</th><th>Data</th><th>Descrição</th>
<th>Prof</th><th>Uts</th><th>Taxa</th><th>Valor</th><th>Baixa</th><th>Data baixa</th><th>Status</th></tr>`;
        }//if intBlocoOrigem==1
        if (intBlocoOrigem == 2) {
            var concatena = `<tr><th>Escolha</th><th>Cliente</th><th>Pasta</th><th>Assunto</th><th>Data</th><th>Descrição</th>
        <th>Prof</th><th>Uts</th><th>Taxa</th><th>Valor</th><th>Baixa</th><th>Data baixa</th><th>Status</th></tr>`;
        }//if intBlocoOrigem==2
                                                                      /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let idLido = obj.resultados[i].id;
                    let cliente = obj.resultados[i].cliente;
                    let pasta = obj.resultados[i].pasta;
                    let materia = obj.resultados[i].materia;
                    let dataT = obj.resultados[i].data_trabalhada;
                    let texto = obj.resultados[i].descricao;
                    let pessoa = obj.resultados[i].pessoa;
                    let uts = obj.resultados[i].uts;
                    let taxaPad = obj.resultados[i].taxa_padrao;
                    let taxaEsp = obj.resultados[i].taxa_especial;
                    let taxa = taxaPad;
                    let valor = uts * taxaPad;
                    let estiloTE = 'background-color:initial';
                    let tituloTE = '';
                    //console.log(taxaEsp);
                    if (taxaEsp > 0) {
                        valor = uts * taxaEsp;
                        taxa = taxaEsp;
                        estiloTE = "background-color:yellow";
                        tituloTE = "Taxa especial";
                    }
                    valor = parseFloat(valor).toFixed(2);
                    //--
                    let estilo = "";
                    let nh = obj.resultados[i].numero_nh;
                    let dataNH = obj.resultados[i].data_nh;
                    if (dataNH == "0000-00-00") dataNH = "";
                    if (nh.length > 0) estilo = "color:red;";
                    //--
                    let intStatus = obj.resultados[i].int_status;
                    let estiloStatus="background-color:initial;color:initial";
                    let rotuloStatus="Pendente";
                    switch (intStatus*1) {
                        case 1:
                        estiloStatus="background-color:yellow;";
                        rotuloStatus="Rascunho";
                        break;
                        case 2:
                            estiloStatus="background-color:green;color:white;";
                        break;
                        case 3:
                            estiloStatus="background-color:blue;color:white;";
                            rotuloStatus="Baixado/Cobrado";
                            break;
                        case 7:
                            estiloStatus="background-color:red;color:white;";
                            rotuloStatus="Cancelado";
                            break;
                    }//switch estiloStatus
                    if (intBlocoOrigem == 1) {
                        concatena = concatena + `<tr><td>` + cliente + `</td><td>` + pasta + `</td><td>` + materia + `</td>
     <td>`+ dataT + `</td><td>` + texto + `</td><td>` + pessoa + `</td><td>` + uts + `</td>
     <td style="`+ estiloTE + `" title="` + tituloTE + `">` + taxa + `</td><td style="` + estiloTE + `">` + valor + `</td>
     <td style="` + estilo + `">` + nh + `</td><td style="` + estilo + `">` + dataNH + `</td>
     <td style="`+estiloStatus+`">` + rotuloStatus + `</td></tr>`;
                    }//if blocoOrigem==1
                    if (intBlocoOrigem == 2) {
                        concatena = concatena + `<tr><td><input type="checkbox" id="` + idLido + `" title="` + idLido + `" 
                 class="claTSAssist" value="`+ idLido + `"></td>
                 <td>` + cliente + `</td><td>` + pasta + `</td><td>` +
                            materia + `</td>
     <td>`+ dataT + `</td><td>` + texto + `</td><td>` + pessoa + `</td><td>` + uts + `</td>
     <td style="`+ estiloTE + `" title="` + tituloTE + `">` + taxa + `</td><td style="` + estiloTE + `">` + valor + `</td><td style="` + estilo + `">` + nh + `</td>
     <td style="` + estilo + `">` +
                            dataNH + `</td><td style="`+estiloStatus+`">` + rotuloStatus + `</td></tr>`;
                    }//if blocoOrigem==2
                }//for
                if (concatena.length == 208) {
                    concatena = concatena + '<tr><th colspan="13" style="background-color:white;color:red;">Não há resultados nesta combinação de pesquisa. Se quiser incluir as baixadas, marque a \'checkbox\' correspondente.</th></tr>';
                }
                objTab.append(concatena);
                //---preenche com o pdf dos timesheets 1
                 jQuery("#idTATimPesPDF").val('<table>'+concatena+'</table>');;
            } else {
                if (concatena.length == 208) {
                    concatena = concatena + '<tr><th colspan="13" style="background-color:white;color:red;">Não há resultados nesta combinação de pesquisa. Se quiser incluir as baixadas, marque a \'checkbox\' correspondente.</th></tr>';
                }
                objTab.append(concatena);
                //---preenche com o pdf dos timesheets 2
                jQuery("#idTATimPesPDF").val('<table>'+concatena+'</table>');;
            }//if retorno
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
    } else {
        //combinação de consultas não programada
        alert("Combinação de consulta não programada");
    }
}//fProcessa
//---------------------------------------------
function fPegaTaxaPadrao(idProf) {

}//fPegaTaxaPadrao
//---------------------------------------------
function fPegaTaxaEspecial(idCliente, idPasta, idProf) {

}//fPegaTAxaEspecial
//---------------------------------------------
function fFoo() {

}//fFoo
//---------------------------------------------
async function fFazUpdateBaixarReativar(intBaixReativ, arrayIds, justif, dataBaixa) {
    //---fazer um loop nos ids e fazer update no banco de dados
    let siglaNaMaquina = jQuery("#idSpaLogNaMaquinaSigla").text();
    var ultimoIndice = arrayIds.length;
    ultimoIndice = ultimoIndice - 1;
    //---

    var i = 0;
    for (i; i < arrayIds.length; i++) {
        let idVez = arrayIds[i];
        let sqlUpdate = `UPDATE tabts 
    SET data_edicao = now(),numero_nh = ?,data_nh=?, int_status = ? 
    WHERE id = ?`;
        //console.log(sqlUpdate);
        let arrayValores = [justif, dataBaixa, intBaixReativ, idVez];
        let tripa = fPrepara(arrayValores);
        //console.log(tripa);
        //console.log("passagem do i: "+i);
        //------------------post
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */        
        await jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoUpdateDelete, sqlUpdate: sqlUpdate, tripa: tripa }, function (retorno) {
            //  //console.log("Valor do retorno: "+retorno);
            if (retorno * 1 > 0) {
                //   //console.log("Valor de i: "+ i + " "+ultimoIndice);
                fMostraResultadoBaixa(i, ultimoIndice);
                fGravaLog(siglaNaMaquina + "  Baixa de Timesheet: " + sqlUpdate + " " + tripa);
            } else {
                alert("Houve um problema com a atualização do timesheet");
                fGravaLog(siglaNaMaquina + "  PROBLEMA: Baixa de Timesheet: " + sqlUpdate + " " + tripa);
            }//if retorno
        });//post
    }//for i
}//fFazUpdateBaixarReativar
//----------------------------------------------------
function fMostraResultadoBaixa(i, ultimoIndice) {
    if (i == ultimoIndice) {
        jQuery("#idBtnTimSistPesq").trigger("click");
        alert("Timesheet alterado com sucesso! Veja a tabela novamente. Automaticamente ela mostra a alteração");
    }//if i
}//fMostraResultadoBaixa
//----------------------------------------------------
function fLimpaCamposDetectandoElemento(idPaiSemTralha) {
    let arrayElementos = [];
    let i = 0;
    arrayElementos = document.getElementById(idPaiSemTralha).querySelectorAll("input");
    for (i; i < arrayElementos.length; i++) {
        arrayElementos[i].value = "";
    }//for i
    //jQuery(".claLimpaPes option[value='0']").prop('selected', true);
    jQuery(".claLimpaImg").prop("src", "/imagens/interroga.png");
}//fLimpaCamposDetectandoElemento
//----------------------------------------------------   
function fGravaLog(linhaAGravar) {
    //console.log(linhaAGravar);
    jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: 9, linhaAGravar: linhaAGravar }, function (retorno) {
        //console.log(retorno);
    });//post
}//fGravaLog
//-----------------------------------------------------
function fSelecionaCliente(idCliente) {
    let sql = `SELECT *  
    FROM tabclientes  
    WHERE id = `+ idCliente;
                                                                  /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retornoCli) {
       //console.log("retornoCli na fSelecionaCliente",retornoCli+", com o comprimento "+retornoCli.length);
        if (retornoCli.length > 20) {
            let objCli = JSON.parse(retornoCli);
            let cliente = objCli.resultados[0].cliente;
            let intResp = objCli.resultados[0].resp_tabpessoas;
            let intFilial = objCli.resultados[0].filial_tabfiliais;
            let intTipoPessoa = objCli.resultados[0].int_tipopessoa;
            let cpfcnpj = objCli.resultados[0].cpfcnpj;
            let identidade = objCli.resultados[0].identidade;
            let email = objCli.resultados[0].email;
            let telefone = objCli.resultados[0].telefone;
            let celular = objCli.resultados[0].celular;
            let cep = objCli.resultados[0].cep;
            let tipoLogr = objCli.resultados[0].int_tabtiposlogradouro;
            let logradouro = objCli.resultados[0].logradouro;
            let numero = objCli.resultados[0].numero;
            let complemento = objCli.resultados[0].complemento;
            let bairro = objCli.resultados[0].bairro;
            let cidade = objCli.resultados[0].cidade;
            let estado = objCli.resultados[0].estado;
            let intPais = objCli.resultados[0].pais_tabpaises;
            let contato = objCli.resultados[0].contato;
            let telefoneContato = objCli.resultados[0].telefone_contato;
            let celularContato = objCli.resultados[0].celular_contato;
            let intStatus = objCli.resultados[0].int_status;
            //--
            jQuery("#idTxtCliPesRaz").val(cliente);
            jQuery("#idSelCliPesRespC option[value='" + intResp + "']").prop('selected', true);
            jQuery("#idSelCliPesFil option[value='" + intFilial + "']").prop('selected', true);
            jQuery("#idSelCliPesTiPC option[value='" + intTipoPessoa + "']").prop('selected', true);
            jQuery("#idTxtCliPesCPFCNPJ").val(cpfcnpj);
            jQuery("#idTxtCliPesIdent").val(identidade);
            jQuery("#idTxtCliPesEmC").val(email);
            jQuery("#idTxtCliPesTel").val(telefone);
            jQuery("#idTxtCliPesCel").val(celular);
            jQuery("#idSelCliPesETL").text(tipoLogr);
            jQuery("#idTxtCliPesEnL").val(logradouro);
            jQuery("#idNumCliPesEnN").val(numero);
            jQuery("#idTxtCliPesEnC").val(complemento);
            jQuery("#idTxtCliPesEnB").val(bairro);
            jQuery("#idTxtCliPesECi").val(cidade);
            jQuery("#idTxtCliPesEEs").val(estado);
            jQuery("#idSelCliPesTiPC option[value='" + intTipoPessoa + "']").prop('selected', true);
            jQuery("#idSelCliPesEPa option[value='" + intPais + "']").prop('selected', true);
            jQuery("#idTxtCliPesECE").val(cep);
            jQuery("#idTxtCliPesNoC").val(contato);
            jQuery("#idTxtCliPesTeC").val(telefoneContato);
            jQuery("#idTxtCliPesCeC").val(celularContato);
            jQuery("#idSelCliPesSta option[value='" + intStatus + "']").prop('selected', true);
       }else{
         //console.log("retornoCli na fSelecionaCliente não achou",retornoCli);
        }//if retorno
    }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
}//fSelecionaCliente
//----------------------------------------------------
function fSelecionaConsCliente(idCliente) {
    let sql = `SELECT *  
    FROM tabclientes  
    WHERE id = `+ idCliente;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */    
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let cliente = obj.resultados[0].cliente;
            let intResp = obj.resultados[0].resp_tabpessoas;
            let intFilial = obj.resultados[0].filial_tabfiliais;
            let intTipoPessoa = obj.resultados[0].int_tipopessoa;
            let cpfcnpj = obj.resultados[0].cpfcnpj;
            let identidade = obj.resultados[0].identidade;
            let email = obj.resultados[0].email;
            let telefone = obj.resultados[0].telefone;
            let celular = obj.resultados[0].celular;
            let cep = obj.resultados[0].cep;
            let tipoLogr = obj.resultados[0].int_tabtiposlogradouro;
            let logradouro = obj.resultados[0].logradouro;
            let numero = obj.resultados[0].numero;
            let complemento = obj.resultados[0].complemento;
            let bairro = obj.resultados[0].bairro;
            let cidade = obj.resultados[0].cidade;
            let estado = obj.resultados[0].estado;
            let intPais = obj.resultados[0].pais_tabpaises;
            let contato = obj.resultados[0].contato;
            let telefoneContato = obj.resultados[0].telefone_contato;
            let celularContato = obj.resultados[0].celular_contato;
            let intStatus = obj.resultados[0].int_status;
            //--
            jQuery("#idTxtCliConsRaz").val(cliente);
            jQuery("#idSelCliConsRespC option[value='" + intResp + "']").prop('selected', true);
            jQuery("#idSelCliConsFil option[value='" + intFilial + "']").prop('selected', true);
            jQuery("#idSelCliConsTiPC option[value='" + intTipoPessoa + "']").prop('selected', true);
            jQuery("#idTxtCliConsCPFCNPJ").val(cpfcnpj);
            jQuery('#idTxtCliConsIdent').val(identidade);
            jQuery("#idTxtCliConsEmC").val(email);
            jQuery("#idTxtCliConsTel").val(telefone);
            jQuery("#idTxtCliConsCel").val(celular);
            jQuery("#idSelCliConsETL").text(tipoLogr);
            jQuery("#idTxtCliConsEnL").val(logradouro);
            jQuery("#idNumCliConsEnN").val(numero);
            jQuery("#idTxtCliConsEnC").val(complemento);
            jQuery("#idTxtCliConsEnB").val(bairro);
            jQuery("#idTxtCliConsECi").val(cidade);
            jQuery("#idTxtCliConsEEs").val(estado);
            jQuery("#idSelCliConsTiPC option[value='" + intTipoPessoa + "']").prop('selected', true);
            jQuery("#idSelCliConsEPa option[value='" + intPais + "']").prop('selected', true);
            jQuery("#idTxtCliConsECE").val(cep);
            jQuery("#idTxtCliConsNoC").val(contato);
            jQuery("#idTxtCliConsTeC").val(telefoneContato);
            jQuery("#idTxtCliConsCeC").val(celularContato);
            jQuery("#idSelCliConsSta option[value='" + intStatus + "']").prop('selected', true);
        }//if retorno
    }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
}//fSelecionaConsCliente
//---------------------------------------------
var mymap = null;
var meuMarcador = null;
function fCarregaMapa(latitude, longitude) {
    jQuery("#mapid").remove();
    jQuery("#idDivMapa").html('<div id="mapid"></div>');
    mymap = L.map('mapid').setView([latitude, longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);
}//fCarregaMapa
//---------------------------------------------
function fMarcaPontoMapa(latitude, longitude, rotulo) {
    //mymap = L.map('mapid').setView([latitude, longitude], 13);
    meuMarcador = new L.marker([latitude, longitude], { "draggable": "true" });
    meuMarcador.addTo(mymap)
        .bindPopup(rotulo)
        .openPopup();
}
//------------------------------------------------
function fTraduzEnderecoEmMapa(endereco) {
    let objTA = jQuery("#idTAExpeRegObs");
    objTA.val("");
    rua = "End aproximado";
    endereco = fRetiraAcentos(endereco);
    let endRotulo = endereco;
    endereco = endereco.replace(/\s/g, "%20");
    // jQuery.getJSON( "https://nominatim.openstreetmap.org/search/rua%20santa%20quiteria%20,carlos%20prates%20,belo%20horizonte%20,MG%20,brazil?format=json&addressdetails=1&limit=1&polygon_svg=1", function( retorno ) {
    //   //console.log(endereco);
    jQuery.getJSON("https://nominatim.openstreetmap.org/search/" + endereco + "?format=json&addressdetails=1&limit=1&polygon_svg=1", function (retorno) {
        if (retorno.length > 0) {
            latMedia = (retorno[0].boundingbox[0] * 1 + retorno[0].boundingbox[1] * 1) / 2;
            lonMedia = (retorno[0].boundingbox[2] * 1 + retorno[0].boundingbox[3] * 1) / 2;
            fCarregaMapa(latMedia, lonMedia);
            fMarcaPontoMapa(latMedia, lonMedia, endRotulo);
            let objSpa =jQuery("#idSpaExpeRegLegenda");
            objSpa.text(endRotulo);
        } else {
            objTA.val(`Mapa não encontrado para este endereço. Tente alterar parte do texto. 
            Às vezes, uma rua com o nome, por exemplo, 'Álvaro de Miranda' no mapa pode estar grafada como 'Álvaro Miranda'.
            Outro exemplo, 'Praça da Confederação Suíça' pode estar como 'Praça Confederação Suíça.`);
        }
    });//getJSON
}//fTraduzEnderecoEmMapa
//----------------------------------------------
function fRetiraAcentos(palavra) {
    if (typeof palavra != "undefined") {
        let invalido = /[°"§%()\[\]{}=\\?´`'#<>|,;.:+_-]+/g;
        palavra = palavra.replace(invalido, " ");
        let intPosicao = palavra.indexOf("\n");
        if (intPosicao > -1) {
            palavra = palavra.replace(/\n/g, " ");
        }
        let intPos = palavra.indexOf("(");
        let intPos2 = palavra.indexOf(")");
        if (intPos > -1) palavra = palavra.replace(/\(/g, "-");
        if (intPos2 > -1) palavra = palavra.replace(/\)/g, "-");
        let com_acento = 'áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ';
        let sem_acento = 'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC';
        nova = '';
        for (i = 0; i < palavra.length; i++) {
            if (com_acento.search(palavra.substr(i, 1)) >= 0) {
                nova += sem_acento.substr(com_acento.search(palavra.substr(i, 1)), 1);
            }
            else {
                nova += palavra.substr(i, 1);
            }
        }
    } else {
        nova = "-";
    }
    //---
    return nova;
}//fRetiraAcentos
//------------------------------------------
//function fCarregaSubdivisao(idOrgao){
function fCarregaSubdivisao(){
let objSel1 = jQuery("#idSelProRegOrS");
objSel1.empty();
let objSel2 = jQuery("#idSelProRegReS");
objSel2.empty();
let objSel =jQuery("#idSelProAdmOrgDivExist");
objSel.empty();
let objSelS =jQuery("#idSelProSisOrS");
objSelS.empty();
let objSelR = jQuery("#idSelProSisReS");
objSelR.empty();


let concatena =  '<option value="0" title="0">...</option>';
let concatenaR =  '<option value="0" title="0">...</option>';
//let sql = `SELECT * FROM taborgaossubdivisao WHERE orgao_taborgaos = ` + idOrgao;
let sql = `SELECT s.id,s.divisao,o.instancia  
FROM taborgaossubdivisao s 
INNER JOIN taborgaos o 
where s.orgao_taborgaos = o.id 
ORDER BY o.instancia,s.divisao`;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            //console.log("retorno em fCarregaSubvidivisao",retorno);
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let idLido = obj.resultados[i].id;
                    let divisao= obj.resultados[i].divisao;
                    let instancia = obj.resultados[i].instancia;
                    if(instancia*1==1){
                    concatena = concatena + '<option value="' + idLido + '" title="' + idLido + '">' + divisao + '</option>';
                    }
                    if(instancia*1==2){
                        concatenaR = concatenaR + '<option value="' + idLido + '" title="' + idLido + '">' + divisao + '</option>';
                        }
                }//for
            }//if retorno
            objSel1.append(concatena);
            objSel2.append(concatenaR);
            objSel.append(concatena);
            objSelS.append(concatena);
            objSelR.append(concatenaR);
        }, function (resposta) {
            //console.log("Em fCarregaSubdivisao",resposta);
        }).catch(function (e) {
            //console.log("Em fCarregaSubdivisao catch",e);
        });//fExecutaBD
}//fCarregaSubdivisao
//-----------------------------------------------------------
/*
function fCarregaSubdivisaoRecurso(idOrgao){
    //subdivisões de recurso
    let objSel =jQuery("#idSelProSisReS");
    objSel.empty();
    let concatena =  '<option value="-1" title="-1">...</option>';
    let sql = `SELECT * FROM taborgaossubdivisao WHERE orgao_taborgaos = ` + idOrgao;
            let intOperacao = "1";
            let tripa = "";
            fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
                //console.log("retorno em fCarregaSubvidivisao",retorno);
                if (retorno.length > 20) {
                    let obj = JSON.parse(retorno);
                    let i = 0;
                    for (i; i < obj.resultados.length; i++) {
                        let idLido = obj.resultados[i].id;
                        let divisao= obj.resultados[i].divisao;
                        concatena = concatena + '<option value="' + idLido + '" title="' + idLido + '">' + divisao + '</option>';
                    }//for
                }//if retorno
                objSel.append(concatena);
            }, function (resposta) {
                //console.log("Em fCarregaSubdivisaoRecurso",resposta);
            }).catch(function (e) {
                //console.log("Em fCarregaSubdivisaoRecurso catach",e);
            });//fExecutaBD
    }//fCarregaSubdivisaoRecurso
    */
    //-----------------------------------------------------------
function fMontaGraficoPie(idCli){
     let arrayValoresTS=[['Situação', 'Volume R$']];
    let sql = `SELECT int_status,sum(uts*taxa_padrao) as volume 
    FROM tabts 
    WHERE pasta_tabpastas
    IN  (SELECT id FROM tabpastas WHERE cliente_tabclientes = `+idCli+`)
	GROUP BY int_status`;
    //console.log("sql na no gráfico pie",sql);
                                                                  /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
     let intOperacao = global_int_operacaoSelect;
     let tripa = "";
     fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
         if (retorno.length > 20) {
             let obj = JSON.parse(retorno);
             let i = 0;
             for (i; i < obj.resultados.length; i++) {
                 let intStatus = obj.resultados[i].int_status;
                 let volume = obj.resultados[i].volume;
                 //console.log("intstatus",intStatus);
                 if(intStatus*1==2) {
                    arrayValoresTS.push(["Ativos",volume*1]);
                 }

                 if(intStatus*1==3) {
                    arrayValoresTS.push(["Baixados",volume*1]);
                    }
             }//for i
                //GRAFICOS
//console.log("arrayValoresTS",arrayValoresTS);
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(fDesenhaGrafico);

function fDesenhaGrafico() {

  var data = google.visualization.arrayToDataTable(arrayValoresTS);

  var options = {
    title: 'Timesheet',
    is3D:true,
    pieSliceText: 'value-and-percentage',
    legend: {position: 'none'},
    height:400
  };

  var chart = new google.visualization.PieChart(document.getElementById('myChart'));

  chart.draw(data, options);
}//fDesenhaGrafico
         } else {
             //alert("Este Cliente não tem TS");
         }//if retorno
     }, function (resposta) {
         alert ("erro");
         //console.log(respostaErrada);
     }).catch(function (e) {
         //console.log("catch no gráfico Pie: ",e.message);
     });//fExecutaBD
}//fMontaGraficoPie
//--------------------------------------------------------------
function fMontaGraficoLinha(idCli){
    let arrayValoresTS=[['Ano', 'Volume R$']];
    let sql = `SELECT EXTRACT( YEAR FROM data_trabalhada ) as ano,  sum(uts*taxa_padrao) as volume 
    FROM tabts 
    WHERE pasta_tabpastas
    IN  (SELECT id FROM tabpastas WHERE cliente_tabclientes = `+idCli+`) 
    GROUP BY ano 
    ORDER BY data_trabalhada`;
    //console.log("sql na no gráfico linha",sql);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */    
     let intOperacao = global_int_operacaoSelect;
     let tripa = "";
     fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
         if (retorno.length > 20) {
             let obj = JSON.parse(retorno);
             let i = 0;
             for (i; i < obj.resultados.length; i++) {
                 let ano = obj.resultados[i].ano;
                 let volume = obj.resultados[i].volume;
                    arrayValoresTS.push([ano,volume*1]);
             }//for i
                //GRAFICOS
                google.charts.load('current',{packages:['corechart']});
                google.charts.setOnLoadCallback(drawChart);
                
                function drawChart() {
                // Set Data
                var data = google.visualization.arrayToDataTable(arrayValoresTS);
                // Set Options
                var options = {
                  title: 'Timesheets',
                  hAxis: {title: 'Ano'},
                  vAxis: {title: 'Valores'},
                  legend: 'none',
                  height:400
                };
                // Draw
                var chart = new google.visualization.ColumnChart(document.getElementById('myChart2'));
                chart.draw(data, options);
                }
         } else {
             //alert("Este Cliente não tem TS");
         }//if retorno
     }, function (resposta) {
         alert ("erro");
         //console.log(respostaErrada);
     }).catch(function (e) {
         //console.log("catch no gráfico linha: ",e.message);
     });//fExecutaBD
}//fMontaGraficoLinha
//-----------------------------------------------------------
function fExecutaBD(intOperacao, sql, tripa) {
    let url = '/phpPaginas/bdExecuta.php';
    //---passa a instrução e as variáveis de acordo com operação
    let params = "";
    if(intOperacao == 1 || intOperacao == 10 || intOperacao == 11) params = 'sql=' + sql + '&intOperacao=' + intOperacao + "&tripa=" + tripa;//se for intOperacao=1
    if (intOperacao == 3 || intOperacao==31) params = 'sqlUpdate=' + sql + '&intOperacao=' + intOperacao + "&tripa=" + tripa;
    if (intOperacao == 4 || intOperacao==41) params = 'sqlInsert=' + sql + '&intOperacao=' + intOperacao + "&tripa=" + tripa;
    //----------
        return new Promise(function (resolve, reject) {
            const http = new XMLHttpRequest();
            http.open('POST', url, true);
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            http.send(params);
            http.onreadystatechange = function () {
                //console.log(http.readyState+" "+http.status);
                if (http.readyState == 4 && http.status == 200) {
                    //  //console.log("respondeu "+http.responseText);
                    resolve(http.responseText);
                }//if http
            }//onreadystate
        });//return
}//fExecutaBD
//---------------------------------------------------
function fCarregaNotasPendentesAprovacao(){
    let objSel= jQuery("#idSelFatuAdmFaturas");
    objSel.empty();
    //---
    let sql = `SELECT f.id,c.cliente,p.pasta,p.materia,
    g.pessoa as redator,f.valor   
    FROM tabfaturamento f 
    INNER JOIN tabpastas p 
    ON f.principal_tabpastas = p.id 
    INNER JOIN tabclientes c 
    ON p.cliente_tabclientes = c.id 
    INNER JOIN tabpessoas g 
    ON f.redator_tabpessoas = g.id 
    WHERE f.status = 2 
    ORDER BY c.cliente`;
    let concatena = `<option value="0" title="0">...</option>`;
    //console.log("sql na lista de notas a cobrar",sql);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */    
     let intOperacao = global_int_operacaoSelect;
     let tripa = "";
     fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
         if (retorno.length > 20) {
             let obj = JSON.parse(retorno);
             let i = 0;
             for (i; i < obj.resultados.length; i++) {
                let id = obj.resultados[i].id;
                let cliente = obj.resultados[i].cliente;
                let pasta = obj.resultados[i].pasta;
                let materia =  obj.resultados[i].materia;
                let valor = obj.resultados[i].valor;
                let redator = obj.resultados[i].redator;
                let tituloSel = pasta+` (`+materia+`)        [Pedido feito por `+redator+`]`;
                concatena = concatena +`<option value="`+id+`" title="`+tituloSel+`">`+cliente+` ($`+valor+`)</option>`;
             }//for i
            objSel.append(concatena);
            }//if retorno
        });//fexecutaBD
}//fCarregaNotasPendentesAprovacao
//----------------------------------------------------------------
function fSelecionaNotasPorCliente(idCliente,intStatus){
    let objTab = jQuery("#idTabFatuAdmTab");
    objTab.empty();
    //---
    let sql = `SELECT f.id,c.cliente,p.pasta,p.materia,f.pastas_adicionais,t.faturado,
    t.contato,f.vencimento,f.descricao,f.valor,f.obs,g.pessoa as redator,h.pessoa as aprovador,f.status  
    FROM tabfaturamento f 
    INNER JOIN tabpastas p 
    ON f.principal_tabpastas = p.id 
    INNER JOIN tabfaturados t 
    ON f.faturado_tabfaturados = t.id 
    INNER JOIN tabclientes c 
    ON p.cliente_tabclientes = c.id 
    INNER JOIN tabpessoas g 
    ON f.redator_tabpessoas = g.id 
    INNER JOIN tabpessoas h 
    ON f.aprovador_tabpessoas = h.id 
    WHERE f.status = `+intStatus+` 
    AND c.id = `+idCliente+` 
    ORDER BY c.cliente`;
    if(intStatus=='0'){
        //refaz a busca para todas
        sql = `SELECT f.id,c.cliente,p.pasta,p.materia,f.pastas_adicionais,t.faturado,
    t.contato,f.vencimento,f.descricao,f.valor,f.obs,g.pessoa as redator,h.pessoa as aprovador,f.status  
    FROM tabfaturamento f 
    INNER JOIN tabpastas p 
    ON f.principal_tabpastas = p.id 
    INNER JOIN tabfaturados t 
    ON f.faturado_tabfaturados = t.id 
    INNER JOIN tabclientes c 
    ON p.cliente_tabclientes = c.id 
    INNER JOIN tabpessoas g 
    ON f.redator_tabpessoas = g.id 
    INNER JOIN tabpessoas h 
    ON f.aprovador_tabpessoas = h.id 
    AND c.id = `+idCliente+` 
    ORDER BY c.cliente`;
    }//if intStatus == 0
    let concatena = `<tr><th>Aprovar</th><th>Cliente</th><th>Pasta</th><th>Matéria</th><th>Pastas Adicionais</th><th>Faturado</th>
    <th>Contato</th><th>Vencimento</th><th>Descrição</th><th>Valor</th><th>Obs</th><th>Aprovador</th><th>Redator</th><th>Status</th></tr>`;
   //console.log("sql na lista de notas",sql);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */   
     let intOperacao = global_int_operacaoSelect;
     let tripa = "";
     fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        //console.log("Retorno da troca dos rádios na admin do faturamento",retorno);
         if (retorno.length > 20) {
             let obj = JSON.parse(retorno);
             let i = 0;
             for (i; i < obj.resultados.length; i++) {
                let id = obj.resultados[i].id;
                let cliente = obj.resultados[i].cliente;
                let pasta = obj.resultados[i].pasta;
                let materia =  obj.resultados[i].materia;
                let adicionais = obj.resultados[i].pastas_adicionais;
                let faturado = obj.resultados[i].faturado;
                let contato = obj.resultados[i].contato;
                let vencimento = obj.resultados[i].vencimento;
                let descricao = obj.resultados[i].descricao;
                let valor = obj.resultados[i].valor;
                let obs = obj.resultados[i].obs;
                let aprovador = obj.resultados[i].aprovador;                
                let redator = obj.resultados[i].redator;
                let status = obj.resultados[i].status;
                //---
                let estilo ="background-color:initial;color:initial";
                let traducao="";
                switch (status * 1) {
                    case 1:
                        traducao = "Rascunho";
                        estilo = "background-color:yellow";
                        break;
                    case 2:
                        traducao = "Pendente";
                        estilo = "background-color:green;color:white;";
                        break;
                    case 3:
                        estilo = "background-color:blue;color:white;";
                        traducao = "Aprovada";
                        break;
                        case 4:
                            estilo = "background-color:tomato;color:black;";
                            traducao = "Liquidada";
                            break;                        
                    case 7:
                        traducao = "Cancelado";
                        estilo = "background-color:red;color:white;";
                        break;
                }//switch
                //---
                if(intStatus*1 == 2){
                    //como é a cobrar, já oferece o botão de aprovação
                concatena = concatena + `<tr><td><button type="button" id="`+id+`" 
                class="btn btn-success claBtnFatuApr" title="Aprovando fatura de identificador `+id+`">Sim</button>
                <button type="button" id="`+id+`" 
                class="btn btn-danger claBtnFatuRep" title="Reprovando fatura de identificador `+id+`">Não</button></td>
                <td>`+cliente+`</td><td>`+pasta+`</td><td>`+materia+`</td><td>`+adicionais+`</td>
                <td>`+faturado+`</td><td>`+contato+`</td><td>`+vencimento+`</td><td>`+descricao+`</td><td>`+valor+`</td>
                <td>`+obs+`</td><td>`+aprovador+`</td><td>`+redator+`</td><td style="`+estilo+`">`+traducao+`</td></tr>`;
                }else{
                    concatena = concatena +`<tr><td></td>
                <td>`+cliente+`</td><td>`+pasta+`</td><td>`+materia+`</td><td>`+adicionais+`</td>
                <td>`+faturado+`</td><td>`+contato+`</td><td>`+vencimento+`</td><td>`+descricao+`</td><td>`+valor+`</td>
                <td>`+obs+`</td><td>`+aprovador+`</td><td>`+redator+`</td><td style="`+estilo+`">`+traducao+`</td></tr>`;
                }//if intStatus
             }//for i
            objTab.append(concatena);
            }//if retorno
        });//fexecutaBD
}//fSelecionaNotasPorCliente
//----------------------------------------------------------------
function fSelecionaNotaPorFatura(idNota){
    let objTab = jQuery("#idTabFatuAdmTab");
    objTab.empty();
    //---
    let sql = `SELECT f.id,c.cliente,p.pasta,p.materia,f.pastas_adicionais,t.faturado,
    t.contato,f.vencimento,f.descricao,f.valor,f.obs,g.pessoa as redator,h.pessoa as aprovador,f.status, 
    g.email as email_redator   
    FROM tabfaturamento f 
    INNER JOIN tabpastas p 
    ON f.principal_tabpastas = p.id 
    INNER JOIN tabfaturados t 
    ON f.faturado_tabfaturados = t.id 
    INNER JOIN tabclientes c 
    ON p.cliente_tabclientes = c.id 
    INNER JOIN tabpessoas g 
    ON f.redator_tabpessoas = g.id 
    INNER JOIN tabpessoas h 
    ON f.aprovador_tabpessoas = h.id 
    WHERE f.id = `+idNota;
    let concatena = `<tr><th>Aprovar</th><th>Cliente</th><th>Pasta</th><th>Matéria</th><th>Pastas Adicionais</th><th>Faturado</th>
    <th>Contato</th><th>Vencimento</th><th>Descrição</th><th>Valor</th><th>Obs</th><th>Aprovador</th><th>Redator</th><th>Status</th><th>Email Redator</th></tr>`;
    //console.log("sql na lista de notas",sql);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */    
     let intOperacao = global_int_operacaoSelect;
     let tripa = "";
     fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        //console.log("retorno",retorno);
         if (retorno.length > 20) {
             let obj = JSON.parse(retorno);
             let i = 0;
             for (i; i < obj.resultados.length; i++) {
                let id = obj.resultados[i].id;
                let cliente = obj.resultados[i].cliente;
                let pasta = obj.resultados[i].pasta;
                let materia =  obj.resultados[i].materia;
                let adicionais = obj.resultados[i].pastas_adicionais;
                let faturado = obj.resultados[i].faturado;
                let contato = obj.resultados[i].contato;
                let vencimento = obj.resultados[i].vencimento;
                let descricao = obj.resultados[i].descricao;
                let valor = obj.resultados[i].valor;
                let obs = obj.resultados[i].obs;
                let aprovador = obj.resultados[i].aprovador;                
                let redator = obj.resultados[i].redator;
                let status = obj.resultados[i].status;
                let emailRedator = obj.resultados[i].email_redator;
                concatena = concatena + `<tr><td><button type="button" id="`+id+`" 
                class="btn btn-success claBtnFatuApr" title="Aprovando fatura de identificador `+id+`">Sim</button>
                <button type="button" id="`+id+`" 
                class="btn btn-danger claBtnFatuRep" title="Reprovando fatura de id `+id+`">Não</button></td>
                <td>`+cliente+`</td><td>`+pasta+`</td><td>`+materia+`</td><td>`+adicionais+`</td>
                <td>`+faturado+`</td><td>`+contato+`</td><td>`+vencimento+`</td><td>`+descricao+`</td><td>`+valor+`</td>
                <td>`+obs+`</td><td>`+aprovador+`</td><td>`+redator+`</td><td>`+status+`</td><td>`+emailRedator+`</td></tr>`;
             }//for i
            objTab.append(concatena);
            }//if retorno
        });//fexecutaBD
}//fSelecionaNotaPorFatura
class Correio{
	constructor (intNumeroServico,arrayValores){
		let tripaCep = "";
		let tripaSedex="";
		switch (intNumeroServico){
		case 1:
			//conferir CEP
			tripaCep = arrayValores[0];
			this.endereco="https://webservice.kinghost.net/web_cep.php?"+
			"auth=f519c80183605296420bb499fa7da1e0&formato=json&cep="+tripaCep;
			break;
		case 2:
			//calcula frete sedex
			this.endereco="https://webservice.kinghost.net/web_frete.php?auth="+arrayValores[0];
			this.endereco = this.endereco+"&tipo="+arrayValores[1]+"&formato="+arrayValores[2];
			this.endereco = this.endereco+"&peso="+arrayValores[3]+"&cm_comprimento="+arrayValores[4];
			this.endereco = this.endereco+"&cm_largura="+arrayValores[5]+"&cm_altura="+arrayValores[6];
			this.endereco = this.endereco+"&cep_origem="+arrayValores[7]+"&cep_destino="+arrayValores[8];
			if(arrayValores[9]=="S"){
				//tem mão-própria
				this.endereco = this.endereco+"&mao_propria="+arrayValores[9];
			}//if arrayValores 8
			if(arrayValores[10]=="S"){
				//tem aviso de recebimennto (AR)
				this.endereco = this.endereco+"&aviso_de_recebimento="+arrayValores[10];
			}//if arrayValores 8
			break;
		case 3:
			//calcula frete carta
		case 4:
			//calcula frete PAC
			break;
		}//switch
	}//constructor
	//--------------------------
	setConfereCEP (idTabela){
		jQuery(idTabela).empty();//limpa a tabela da vez
		let myHeaders = new Headers();
		let myInit = { method: 'GET',
		               headers: myHeaders,
		               mode: 'cors',
		               cache: 'default' };
		let myRequest = new Request(this.endereco, myInit);

		fetch(myRequest)
		.then(function(response){
			return response.json();
		}).then(function(data){
			//console.log(data);
			let concatena ='<tr><th>Tipo</th><th>Logradouro</th><th>Bairro</th>';
			concatena = concatena + '<th>Cidade</th><th>UF</th></tr>';
			 concatena = concatena+'<tr><td>'+data.tipo_logradouro+'</td><td>'+data.logradouro+'</td><td>'+data.bairro+'</td>';
				concatena = concatena + '<td>'+data.cidade+'</td><td>'+data.uf+'</td></tr>';
		    jQuery(idTabela).append(concatena);
		  });
	}//setConfereCEP
	//------------------------------
	setCalculaSedex (idTabela){
		jQuery(idTabela).empty();//limpa a tabela da vez
		//console.log("no sedex",this.endereco);
		jQuery.get(this.endereco,function (resposta){
			//console.log("no sedex dentro do get",resposta);
		});//jquery get
		let myHeaders = new Headers();
        myHeaders.append("Access-Control-Allow-Headers","Authorization, Content-Type");
        myHeaders.append("Access-Control-Allow-Origin", "*");
		let myInit = { method: 'GET',
		               headers: myHeaders,
		               mode: 'cors',
		               cache: 'default' };
		let myRequest = new Request(this.endereco, myInit);
	
		fetch(myRequest)
		.then(function(response){
			return response.json();
		}).then(function(data){
			//console.log(data);
			/*
			let concatena ='<tr><th>Tipo</th><th>Logradouro</th><th>Bairro</th>';
			concatena = concatena + '<th>Cidade</th><th>UF</th></tr>';
			 concatena = concatena+'<tr><td>'+data.tipo_logradouro+'</td><td>'+data.logradouro+'</td><td>'+data.bairro+'</td>';
				concatena = concatena + '<td>'+data.cidade+'</td><td>'+data.uf+'</td></tr>';
		    jQuery(idTabela).append(concatena);
		    */
		    
		  });
	}//setCalculaSedex
}//Correio
//random function you want to call
//-----------------------------------------------------------------
/*
function fPegaEmailDestinatario(idFatura){
   // alert ("id Fatura "+idFatura);
    let emailPessoa="x";
    let sql = `SELECT email FROM tabpessoas p 
    INNER JOIN tabfaturamento f 
    WHERE p.id = f.redator_tabpessoas 
    AND f.id = ` + idFatura;
     let intOperacao = "1";
     let tripa = "";
     //console.log("sql dentro de fpegaEmailDestinatario",sql);
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
         if (retorno.length > 20) {
             let obj = JSON.parse(retorno);
               emailPessoa = obj.resultados[0].email;
         } else {
             alert("Esta nota não tem redator");
         }//if retorno
         //console.log("dentro de fPegaEmailDestinatario:",emailPessoa);
       return emailPessoa;
     }, function (resposta) {
         return resposta;
         //console.log(respostaErrada);
     }).catch(function (e) {
        return "catch: "+e;
         //console.log(e);
     });//fExecutaBD
}//fPegaEmailDestinatario
*/
function fMostraTodas(){
    //lista todas as crono do cliente, independentemente de pasta e de ano 
    jQuery("#idSelCronoPesAno option[value='0']").prop('selected', true);
    let objTab = jQuery("#idTabCronoPesResultado");
    objTab.empty();
    let intCliente = jQuery("#idSelCronoPesCli option:selected").val();
    //console.log("intTodos e intCliente",intTodos+"/"+intCliente);
        let estilo = "background-color:yellow";
        let concatena = `<tr><th>No. carta</th><th>Cliente</th>
    <th>Pasta</th><th>Assunto/Matéria</th>
    <th>Resp</th><th>Ref</th><th>Atenção</th>
    <th>Ano</th><th>Status</th></tr>`;
        let sql = `SELECT c.cliente,p.pasta,p.materia,g.pessoa as responsavel,
    r.id,r.atencao,r.referencia,r.ano,r.int_status,r.responsavel_tabpessoas,r.pasta_tabpastas   
    FROM tabclientes c INNER JOIN tabpastas p 
    ON p.cliente_tabclientes = c.id 
    INNER JOIN tabcrono r 
    ON r.pasta_tabpastas  = p.id 
    INNER JOIN tabpessoas g 
    ON r.responsavel_tabpessoas = g.id 
    WHERE c.id = `+ intCliente;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */    
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
            if (retorno.length > 20) {
                let obj = JSON.parse(retorno);
                let i = 0;
                for (i; i < obj.resultados.length; i++) {
                    let idLido = obj.resultados[i].id;
                    let cliente = obj.resultados[i].cliente;
                    let pasta = obj.resultados[i].pasta;
                    let materia = obj.resultados[i].materia;
                    let resp = obj.resultados[i].responsavel;
                    let ano = obj.resultados[i].ano;
                    let ref = obj.resultados[i].referencia;
                    let atencao = obj.resultados[i].atencao;
                    let intStatus = obj.resultados[i].int_status;
                    //--
                    let idPasta = obj.resultados[i].pasta_tabpastas;
                    let nomeArquivo ='<a href="/docs/c_'+idPasta+'.pdf" target="_blank">'+idLido+'</a>';
                    concatena = concatena + `<tr><td>` + nomeArquivo + `</td>
                    <td style="`+ estilo + `">` + cliente + `</td><td>` + pasta + `</td>
                    <td>`+ materia + `</td><td>` + resp + `</td><td>` + ref + `</td>
                    <td>`+ atencao + `</td><td>` + ano + `</td>
                    <td>` + intStatus + `</td>
                    </tr>`;
                }//for i
            }//if retorno
            objTab.append(concatena);
        }, function (respostaErrada) {
            //console.log(respostaErrada);
        }).catch(function (e) {
            //console.log(e);
        });//fExecutaBD
}//fMostraTodas
//------------------------------------------------------------
function fInsereAndamento(siglaRedator,intProcesso, dataAnda, textoAndamento, intMesmaPosicao,idRedator, prazo1, prazo2){
    let sqlInsert = `INSERT INTO tabandamentos (processo_tabprocessos, data_andamento, 
        andamento, mesma_posicao,redator_tabpessoas,data_prazo1,data_prazo2) 
          VALUES(?,?,?,?,?,?,?)`;
    //  //console.log("sqlInsert: "+sqlInsert);
    //os dados abaixo têm de estar na mesma ordem das ?...
    //...da esquerda para a direita  na sentença de insert
    let arrayValores = [intProcesso, dataAnda, textoAndamento, intMesmaPosicao,idRedator, prazo1, prazo2];
    let tripa = fPrepara(arrayValores);
    //console.log(sqlInsert+" ====>>>> "+tripa);
    //-------------------post----------------
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */    
    jQuery.post("/phpPaginas/bdExecuta.php", { intOperacao: global_int_operacaoInsert, sqlInsert: sqlInsert, tripa: tripa }, function (retorno) {
        //console.log("retorno do insert TS: " + retorno);
        if (retorno * 1 > 0) {
            alert("Inseriu com sucesso");
            fGravaLog(siglaRedator + " Insert andamento: " + sqlInsert + " " + tripa);
        } else {
            fGravaLog(siglaRedator + " PROBLEMA: Insert andamento: " + sqlInsert + " " + tripa);
        }//if retorno
    });//post
}//fInsereAndamento
//---------------------------------------------------------------------
function fCriaPdf(concatena){
    let siglaRedator = jQuery("#idSpaLogNaMaquinaSigla").text();
   jQuery.post("phpPaginas/phpCompondoPDF.php",{corpo:concatena,siglaRedator:siglaRedator},function(retorno){
let caminhoArquivo="pdfs/"+retorno+"?"+new Date();
//console.log("caminhoArquivo",caminhoArquivo);
window.open("https://escribaoffice.com.br/"+caminhoArquivo,"pdf");
});
}//fCriaPdf
//-------------------------------------------------------------------
async function fOBJProcuraDadosFile(idFile){
    let sql = `SELECT c.cliente,c.id as idCliente,p.id,p.materia,
    g.pessoa as responsavel  
    FROM tabpastas p 
    INNER JOIN tabclientes c 
    ON p.cliente_tabclientes = c.id 
    INNER JOIN tabpessoas g 
    ON p.responsavel_tabpessoas = g.id 
    WHERE p.id = `+ idFile;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */    
        let intOperacao = global_int_operacaoSelect;
        let tripa = "";
        let idLido = '';
        let cliente = '';
        let pasta = '';
        let materia = '';
        let resp = '';
        let intStatus ='';
        let obj={};
        await jQuery.post('/phpPaginas/bdExecuta.php',{ intOperacao: intOperacao,sql:sql},function(retorno){
            if (retorno.length > 20) {
                 obj = JSON.parse(retorno);
                 //console.log(obj);
                 return obj;
              }
             
        });//post
}//fOBJProcuraDadosFile
//-----------------------------------------------------------
function fCarregaAlmoxarifadoPendentes(intPendentes){
let objTab = jQuery("#idTabAlmoAdmPedi");
objTab.empty();
let sql = `SELECT a.id, g.pessoa as redator,h.pessoa as solicitante,m.material,
n.natureza, a.quantidade,a.data_insercao,a.int_status 
FROM tabalmo a 
INNER JOIN tabalmomat m 
ON a.material_tabalmomat = m.id 
INNER JOIN tabalmonat n 
ON m.natureza_tabalmonat = n.id 
INNER JOIN tabpessoas g 
ON a.redator_tabpessoas = g.id 
INNER JOIN tabpessoas h 
ON a.solicitante_tabpessoas = h.id 
WHERE a.int_status = 2 
ORDER BY g.pessoa, a.data_insercao`;
//---
if(intPendentes*1==1){
    //pendentes e atendidos
sql = `SELECT a.id, g.pessoa as redator,h.pessoa as solicitante,m.material,
n.natureza, a.quantidade,a.data_insercao,a.int_status 
FROM tabalmo a 
INNER JOIN tabalmomat m 
ON a.material_tabalmomat = m.id 
INNER JOIN tabalmonat n 
ON m.natureza_tabalmonat = n.id 
INNER JOIN tabpessoas g 
ON a.redator_tabpessoas = g.id 
INNER JOIN tabpessoas h 
ON a.solicitante_tabpessoas = h.id 
WHERE a.int_status = 2 OR a.int_status = 3 
ORDER BY g.pessoa, a.data_insercao`;
}
if(intPendentes*1==2){
//incluindo os pendentes, atendidos, cancelados e rascunho.    
sql = `SELECT a.id, g.pessoa as redator,h.pessoa as solicitante,m.material,
n.natureza, a.quantidade,a.data_insercao,a.int_status 
FROM tabalmo a 
INNER JOIN tabalmomat m 
ON a.material_tabalmomat = m.id 
INNER JOIN tabalmonat n 
ON m.natureza_tabalmonat = n.id 
INNER JOIN tabpessoas g 
ON a.redator_tabpessoas = g.id 
INNER JOIN tabpessoas h 
ON a.solicitante_tabpessoas = h.id 
ORDER BY g.pessoa, a.data_insercao`;
}
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    let concatena = `<tr><th>id</th><th>Redator</th><th>Solicitante</th>
    <th>Material</th><th>Natureza</th><th>Quantidade</th>
    <th>Data do pedido</th><th>Situação</th></tr>`;
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        //console.log("retorno de almoxarifado",retorno);
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let idLido = obj.resultados[i].id;
                let redator = obj.resultados[i].redator;
                let solicitante = obj.resultados[i].solicitante;
                let material = obj.resultados[i].material;
                let natureza = obj.resultados[i].natureza;
                let quantidade = obj.resultados[i].quantidade;
                let dataInsercao = obj.resultados[i].data_insercao;
                let intStatus= obj.resultados[i].int_status;
                let estilo="background-color:initial;color:initial;";
                switch (intStatus * 1) {
                    case 1:
                        traducao = "Rascunho";
                        estilo = "background-color:yellow";
                        break;
                    case 2:
                        traducao = "Pendente";
                        estilo = "background-color:green;color:white;";
                        break;
                    case 3:
                        estilo = "background-color:blue;color:white;";
                        traducao = "Atendido";
                        break;
                    case 7:
                        traducao = "Cancelado";
                        estilo = "background-color:red;color:white;";
                        break;
                }//switch
                concatena = concatena + `<tr><td><input type="checkbox" id="` + idLido + `" class="claChkPed" value="`+idLido+`" title="`+idLido+`"></td>
                <td>` + redator + `</td><td>` + solicitante + `</td>
                <td>`+ material + `</td><td>` + natureza + `</td><td>` + quantidade + `</td>
                <td>`+ dataInsercao + `</td><td style="`+ estilo + `">` +traducao + `</td>
                </tr>`;
                //console.log("concatena do almo",concatena);
            }//for i
        }//if retorno
        objTab.append(concatena);
    }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
}//fCarregaAlmoxarifadoPendentes
//-------------------------------------------------------------------
function fPreencheCamposFornecedor(cpfCnpj){
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */    
    intOperacao = global_int_operacaoSelect;
    tripa = "";
    let sql = `SELECT f.fornecedor,f.cpfcnpj,f.email,f.telefone,f.cep,
    f.tipo_tabtiposlogradouro,f.logradouro,f.numero,f.complemento,f.bairro,f.cidade,
    f.estado,f.pais_tabpaises,f.contato,f.telefone_contato,f.celular_contato,
    f.status 
    FROM tabfornecedores f 
    WHERE cpfcnpj = '`+cpfCnpj+`'`;
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
     //console.log("retorno",retorno);
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
             let fornecedor = obj.resultados[i].fornecedor;
             let cpfCnpj = obj.resultados[i].cpfcnpj;
             let email = obj.resultados[i].email;
             let telefone = obj.resultados[i].telefone;
             let cep = obj.resultados[i].cep;
             let tipoL = obj.resultados[i].tipo_tabtiposlogradouro;
             let lograd = obj.resultados[i].logradouro;
             let numero = obj.resultados[i].numero;
             let complemento = obj.resultados[i].complemento;
             let bairro = obj.resultados[i].bairro;
             let cidade = obj.resultados[i].cidade;
             let estado = obj.resultados[i].estado;
             let pais = obj.resultados[i].pais_tabpaises;
             let nomeCon = obj.resultados[i].contato;
             let telCon = obj.resultados[i].telefone_contato;
             let celCon = obj.resultados[i].celular_contato;
             let status = obj.resultados[i].status;
//---
jQuery("#idTxtAlmoFornNomeF").val(fornecedor);
jQuery("#idTxtAlmoFornCPFCNPJ").val(cpfCnpj);
jQuery("#idTxtAlmoFornEmail").val(email);
jQuery("#idTxtAlmoFornTelef").val(telefone);
jQuery("#idTxtAlmoFornCEP").val(cep);
jQuery("#idSelAlmoFornTipoLog option[value='"+tipoL+"']").prop('selected', true);
jQuery("#idTxtAlmoFornLog").val(lograd);
jQuery("#idNumAlmoFornNum").val(numero);
jQuery("#idTxtAlmoFornComp").val(complemento);
jQuery("#idTxtAlmoFornBai").val(bairro);
jQuery("#idTxtAlmoFornCid").val(cidade);
jQuery("#idTxtAlmoFornEst").val(estado);
jQuery("#idSelAlmoFornPais option[value='"+pais+"']").prop('selected', true);
jQuery("#idTxtAlmoFornContato").val(nomeCon);
jQuery("#idTxtAlmoFornTelCon").val(telCon);
jQuery("#idTxtAlmoFornCelCon").val(celCon);
jQuery("#idSelAlmoFornStatus option[value='"+status+"']").prop('selected', true);
//---
}//if retorno
    }, function (respostaErrada) {
        //console.log("fPreencheCamposFornecedor",respostaErrada);
    }).catch(function (e) {
        //console.log("fPreencheCamposFornecedor catch",e);
    });//fExecutaBD
}//fPreencheCamposFornecedor
//--------------------------------------------------------
function fLimpaFornecedores(){
    jQuery(".claLimpaForn").val('');
}//fLimpaFornecedores
//--------------------------------------------------------
function fCarregaFornecedores(){
    //carrega os fornecedores ativos
    let objSel = jQuery("#idSelAlmoCompForn");
    objSel.empty();
    let objSelF = jQuery("#idSelAlmoFornLista");
    objSelF.empty();
    let concatena = '<option value="0" title="0">...</option>';
    let concatenaF = '<option value="0" title="0">...</option>';
    let sql = `SELECT id,fornecedor,status,cpfcnpj  
    FROM tabfornecedores`;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */   
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        //console.log("retorno",retorno);
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let idLido = obj.resultados[i].id;
                let fornecedor = obj.resultados[i].fornecedor;
                let status = obj.resultados[i].status;
                let cpfCnpj = obj.resultados[i].cpfcnpj;
                if(status*1==2){
                concatena = concatena + '<option value="' + idLido + '" title="' + idLido + '">' + fornecedor + '</option>';
                }
                concatenaF = concatenaF + '<option value="' + idLido + '" title="' + idLido + '" data-cpf="'+cpfCnpj+'">' + fornecedor + '</option>';
                //console.log("concatenaF",concatenaF);
            }//for i
        }//if retorno
        objSel.append(concatena);
        objSelF.append(concatenaF);
    }, function (respostaErrada) {
        //console.log("fcarregafornecedors",respostaErrada);
    }).catch(function (e) {
        //console.log("fcarregafornecedores catch",e);
    });//fExecutaBD
}//fCarregaFornecedores
//---------------------------------------------------------
function fCarregaAlmoMaterial(){
    let objSel = jQuery("#idSelAlmoCompMat");
    objSel.empty();
    let concatena = '<option value="0" title="0">...</option>';
    let sql = `SELECT id,material 
    FROM tabalmomat 
    WHERE int_status = 2`;
    //------
                                                                  /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let idLido = obj.resultados[i].id;
                let material = obj.resultados[i].material;
                concatena = concatena + '<option value="' + idLido + '" title="' + idLido + '">' + material + '</option>';
            }//for i
        }//if retorno
        objSel.append(concatena);
    }, function (respostaErrada) {
        //console.log("fCarregaAlmoMaterial",respostaErrada);
    }).catch(function (e) {
        //console.log("fCarregaAlmoMaterial catch",e);
    });//fExecutaBD
}//fCarregaAlmoMaterial
//-----------------------------------------------------------
function fLimpaCompras(){
//almoxarifado compras limpa campos
//jQuery(".claLimpaCompras").val('');
//jQuery(".claLimpaCompras").text('');
jQuery(".claLimpaCompras option[value='0']").prop('selected', true);
jQuery("input[type=number].claLimpaCompras").val('');
jQuery("input[type=date].claLimpaCompras").val('');
jQuery("#idSpaNumAlmoCompApre").text('');
}//fLimpaCompras
//-----------------------------------------------------------
function fSelecionaPastas(idCli,objSel){
    objSel.empty();
    let concatena = '<option value="0" title="0"></option>';
    let sql = `SELECT * FROM tabpastas WHERE cliente_tabclientes = ` + idCli;
   //console.log("sql na despsa",sql);
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */   
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let id = obj.resultados[i].id;
                let pasta = obj.resultados[i].pasta;
                let materia = obj.resultados[i].materia;
                let responsavel = obj.resultados[i].responsavel_tabpessoas;
        concatena = concatena + `<option value="` + id + `" 
        title="` + materia + `" data-responsavel="`+responsavel+`" 
        data-materia ="` + materia + `">` + pasta + `</option>`;
            }//for i
        } else {
            alert("Este cliente não tem pasta");
        }//if retorno
        objSel.append(concatena);
    }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
}//fSelecionaPastas
//-----------------------------------------------------------------
function fPegaRascunhosPreencheTabela(intRedator,objTab){
    let concatena =`<tr><th></th><th>Cliente</th><th>Pasta</th><th>Assunto/Matéria</th><th>Data</th><th>Descrição</th>
    <th>Prof</th><th>Uts</th><th>Taxa</th><th>Valor</th><th>Baixa</th><th>Data baixa</th><th>Status</th><th></th></tr>`;
    let sql = `SELECT t.id,c.cliente,p.pasta,p.materia,g.pessoa,
    t.data_trabalhada,t.descricao,t.uts,t.taxa_padrao,t.taxa_especial,
    t.numero_nh,t.data_nh,t.int_status
                    FROM tabts t 
                    INNER JOIN tabpastas p 
                    ON t.pasta_tabpastas = p.id 
                    INNER JOIN tabclientes c 
                    ON p.cliente_tabclientes = c.id 
                    INNER JOIN tabpessoas g 
                    ON t.profissional_tabpessoas = g.id 
                    WHERE t.redator_tabpessoas = `+intRedator+`
                    AND t.int_status = 1`;
//--------------------- 
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */                   
                    let intOperacao = global_int_operacaoSelect;
                    let tripa = "";
                    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
                        if (retorno.length > 20) {
                            let obj = JSON.parse(retorno);
                            let i = 0;
                            for (i; i < obj.resultados.length; i++) {
                                let idLido = obj.resultados[i].id;
                                let cliente = obj.resultados[i].cliente;
                                let pasta = obj.resultados[i].pasta;
                                let materia = obj.resultados[i].materia;
                                let dataT = obj.resultados[i].data_trabalhada;
                                let texto = obj.resultados[i].descricao;
                                let pessoa = obj.resultados[i].pessoa;
                                let uts = obj.resultados[i].uts;
                                let taxaPad = obj.resultados[i].taxa_padrao;
                                let taxaEsp = obj.resultados[i].taxa_especial;
                                let taxa = taxaPad;
                                let valor = uts * taxaPad;
                                let estiloTE = 'background-color:initial';
                                let tituloTE = '';
                                //console.log(taxaEsp);
                                if (taxaEsp > 0) {
                                    valor = uts * taxaEsp;
                                    taxa = taxaEsp;
                                    estiloTE = "background-color:yellow";
                                    tituloTE = "Taxa especial";
                                }
                                valor = parseFloat(valor).toFixed(2);
                                //--
                                let estilo = "";
                                let nh = obj.resultados[i].numero_nh;
                                let dataNH = obj.resultados[i].data_nh;
                                if (dataNH == "0000-00-00") dataNH = "";
                                if (nh.length > 0) estilo = "color:red;";
                                //--
                                let intStatus = obj.resultados[i].int_status;
                                let estiloStatus="background-color:initial;color:initial";
                                let rotuloStatus="Pendente";
                                switch (intStatus*1) {
                                    case 1:
                                    estiloStatus="background-color:yellow;";
                                    rotuloStatus="Rascunho";
                                    break;
                                    case 2:
                                        estiloStatus="background-color:green;color:white;";
                                    break;
                                    case 3:
                                        estiloStatus="background-color:blue;color:white;";
                                        rotuloStatus="Baixado/Cobrado";
                                        break;
                                    case 7:
                                        estiloStatus="background-color:red;color:white;";
                                        rotuloStatus="Cancelado";
                                        break;
                                }//switch estiloStatus
                                    concatena = concatena + `<tr>
                                    <td>
                                    <button type="button" id="`+idLido+`" class="claBtnBerConfirma btn btn-success">Confirmar</button>
                                    </td>
                                    <td>` + cliente + `</td><td>` + pasta + `</td><td>` + materia + `</td>
                 <td>`+ dataT + `</td><td>` + texto + `</td><td>` + pessoa + `</td><td>` + uts + `</td>
                 <td style="`+ estiloTE + `" title="` + tituloTE + `">` + taxa + `</td><td style="` + estiloTE + `">` + valor + `</td>
                 <td style="` + estilo + `">` + nh + `</td><td style="` + estilo + `">` + dataNH + `</td>
                 <td style="`+estiloStatus+`">` + rotuloStatus + `</td>
                 <td><button type="button" id="`+idLido+`" class="claBtnBerDeleta btn btn-danger">Deletar</button></td></tr>`;
                            }//for
                          } else {
                                concatena = concatena + '<tr><th colspan="13" style="background-color:white;color:red;">Não há rascunhos a confirmar.</th></tr>';
                        }//if retorno
                        objTab.append(concatena);
                    }, function (respostaErrada) {
                        //console.log("fPegaRascunhoPreencheTabela",respostaErrada);
                    }).catch(function (e) {
                        //console.log("fPegaRascunhoPreencheTabela catch",e);
                    });//fExecutaBD
}//fPegaRascunhosPreencheTabela
//---------------------------------------------------------
function fApagaRascunhoBercario(idTS,intRedator,siglaNaMaquina){
    let contador=0;
    let sqlUpdate = `UPDATE tabts
    SET  int_status = 7, 
    data_edicao = ? 
    WHERE id = ?`;
    //console.log("update de faturado: ",sqlUpdate);
    let dataEdicao = new Date().toLocaleString();
       let arrayValores = [dataEdicao,idTS];
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */       
       let intOperacao = global_int_operacaoUpdateDelete;
       let tripa = fPrepara(arrayValores);
       fExecutaBD(intOperacao, sqlUpdate, tripa).then(function (retorno) {
           if (retorno * 1 > 0) {
            contador=1;
           // alert ("Rascunho deletado com sucesso");
            let objTabBer = jQuery("#idTabTimRegBer");//tabela-berçário para rascunhos
            objTabBer.empty();
            fPegaRascunhosPreencheTabela(intRedator,objTabBer);
               fGravaLog(siglaNaMaquina + " UPDATE tabela ts com sucesso: " + sqlUpdate + " " + tripa);
           }else{
            fGravaLog(siglaNaMaquina + " UPDATE órgão na ts com problema: " + sqlUpdate + " " + tripa);
           }//if
       }).then(function () {
           alert("Fez " + contador + " alterações");
       });//fExecutaBD
}//fApagaRascunhoBercario
//---------------------------------------------------------
function fConfirmaRascunhoBercario(idTS,intRedator,siglaNaMaquina){
    let contador=0;
    let sqlUpdate = `UPDATE tabts
    SET  int_status = 2, 
    data_edicao = ? 
    WHERE id = ?`;
    //console.log("update de faturado: ",sqlUpdate);
    let dataEdicao = new Date().toLocaleString();
       let arrayValores = [dataEdicao,idTS];
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */       
       let intOperacao = global_int_operacaoUpdateDelete;
       let tripa = fPrepara(arrayValores);
       fExecutaBD(intOperacao, sqlUpdate, tripa).then(function (retorno) {
           if (retorno * 1 > 0) {
            contador=1;
            //alert ("Rascunho CONFIRMADO com sucesso");
            let objTabBer = jQuery("#idTabTimRegBer");//tabela-berçário para rascunhos
            objTabBer.empty();
            fPegaRascunhosPreencheTabela(intRedator,objTabBer);
               fGravaLog(siglaNaMaquina + " UPDATE tabela ts com sucesso: " + sqlUpdate + " " + tripa);
           }else{
            fGravaLog(siglaNaMaquina + " UPDATE órgão na ts com problema: " + sqlUpdate + " " + tripa);
           }//if
       }).then(function () {
           alert("Fez " + contador + " alterações");
       });//fExecutaBD
}//fConfirmaRascunhoBercario
//-------------------------------------------------------------
function fSelecionaDadosProcesso(idProcesso){
    //na administração do processo, quando seleciona um processo põe os dados sobre ele nos campos certos
    //---
    jQuery(".claLimpaAdmPro").val('');
    jQuery(".claLimpaAdmProSel option[value='0']").prop('selected', true);
    //---
let sql = `SELECT g.id as idresponsavel,p.julgador,p.original,p.subdivisao,
p.obs,o.id as idorg 
FROM tabprocessos p 
INNER JOIN tabpessoas g  
ON p.responsavel_tabpessoas = g.id 
INNER JOIN taborgaossubdivisao s1 
ON s1.id = p.subdivisao 
INNER JOIN taborgaos o 
ON s1.orgao_taborgaos = o.id 
AND p.id = `+idProcesso;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
let intOperacao = global_int_operacaoSelect;
let tripa = "";
//console.log("fSelecionaResponsavelprocesso",sql);
fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
    //console.log("retorno de fSelecionaResponsavelprocesso 1",retorno);
    if (retorno.length > 20) {
        let obj = JSON.parse(retorno);
        let idResp = obj.resultados[0].idresponsavel;
        let julgador = obj.resultados[0].julgador;
        let original = obj.resultados[0].original;
        //--
        let idOrg = obj.resultados[0].idorg;
        let idSub = obj.resultados[0].subdivisao;
        //---
        let obs = obj.resultados[0].obs;
        jQuery("#idSelProSisResp option[value='"+idResp+"']").prop('selected', true);
        jQuery("#idTxtProSisJul").val(julgador);
        jQuery("#idTxtProSisNuO").val(original);
        jQuery("#idSelProSisOrS option[value='"+idSub+"']").prop('selected', true);
        jQuery("#idSelProSisOrgao option[value='"+idOrg+"']").prop('selected', true);
        //console.log("obs",obs);
        jQuery("#idTAProSisObs").val(obs);
    } else {
        alert("Este processo não tem responsável");
    }//if retorno
    //---------------agora pega os dados do recurso-----------------------fExecutaBD2
    sql = `SELECT p.julgador_recurso,p.numero_recurso,p.subdivisao_r,
o.id as idorg_r 
FROM tabprocessos p 
INNER JOIN taborgaossubdivisao s1 
ON s1.id = p.subdivisao_r 
INNER JOIN taborgaos o 
ON s1.orgao_taborgaos = o.id 
AND p.id = `+idProcesso;
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        //console.log("retorno de fSelecionaResponsavelprocesso 2",retorno);
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
             let julgadorR = obj.resultados[0].julgador_recurso;
            let numeroR = obj.resultados[0].numero_recurso;
            //---
            let idOrgR = obj.resultados[0].idorg_r;
            let idSubR = obj.resultados[0].subdivisao_r;
            //--
            jQuery("#idTxtProSisJuR").val(julgadorR);
            jQuery("#idTxtProSisNuR").val(numeroR);
            jQuery("#idSelProSisReS option[value='"+idSubR+"']").prop('selected', true);
            //console.log("órgão de recurso",idOrgR);
            jQuery("#idSelProSisOrR option[value='"+idOrgR+"']").prop('selected', true);
        }//if retorno
       
    }, function (respostaErrada) {
        //console.log("fSelecionaDadosProcesso 2",respostaErrada);
    }).catch(function (e) {
        //console.log("fSelecionaDadosProcesso 2 catch",e);
    });//fExecutaBD
    //------------------------------------------------------------------/fExecutaBD2
}, function (respostaErrada) {
    //console.log("fSelecionaDadosProcesso 1",respostaErrada);
}).catch(function (e) {
    //console.log("fSelecionaDadosProcesso 1 catch",e);
});//fExecutaBD
}//fSelecionaDadosProcesso
//--------------------------------------------------------------------------------
function fCarregaAlmoApresentacao(){
    let intStatus = 2;//só as ativas
    let arrayObjSel = [];
    arrayObjSel[0] = jQuery("#idSelAlmRegApres");
    //--
    var concatena = '<option value="0" title="0">&nbsp;</option>';
    let sql = `SELECT id,apresentacao   
FROM tabalmoapres  
WHERE int_status = `+ intStatus+` 
ORDER BY apresentacao`;
                                                              /*
                            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
                */
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let idLido = obj.resultados[i].id;
                let apresentacao = obj.resultados[i].apresentacao;
                concatena = concatena + '<option value="' + idLido + '" title="' + idLido + '">' + apresentacao + '</option>';
            }//for i
        }//if retorno
        //---carregados dados da consulta, popular todas as selects indicadas
        let j = 0;
        for (j; j < arrayObjSel.length; j++) {
            arrayObjSel[j].empty();
            arrayObjSel[j].append(concatena);
            //console.log(concatena);
        }//for j
    }, function (respostaErrada) {
        //console.log(respostaErrada);
    }).catch(function (e) {
        //console.log(e);
    });//fExecutaBD
}//fCarregaAlmoApresentacao
//---------------------------------------------------------------
function fTiraPlics(objTxt){
    //esta função tira plics para o que vai ser enviado para o banco de dados e repõe o texto original sem eles
    let texto = objTxt.val();
    texto = texto.replace(/\'/g,'"');
    objTxt.val(texto);
}//fTiraPlics
//---------------------------------------------------------------
function fValidarEmail(email){
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
  {
    return (true)
  }
    alert("Este email não é válido! Por favor, entre com um endereço correto")
    return (false)
}//fValidarEmail
//-----------------------------------------------------------------
function fRecalculaTS(){
    /* 
    *EXIGE QUE A TABELA idTabFatuRegTTS TENHA O VALOR PADRÃO NA 10a COLUNA (índice 9)  
    E O VALOR ESPECIAL NA COLUNA 12 (índice 11)
    
    Esta função percorre a tabela de timesheets na redação de uma nova fatura...
    ...procurando ver quais as linhas que estão marcadas e somar seus valores
    ...e vai populando um HIDDEN com a lista de ids das UTS a considerar. Quando for 
    ...enviar a fatura para aprovação, automaticamente faz-se um update nos TS marcando...
    ...status de baixa e pondo o número da nh na coluna
    */
   objHid = jQuery("#idHidFatuRegTSOK");//guardando a tripa de ids válido para a baixa da cobrança
   objHid.val('');
   let concatenaHid="";
   let objSpaP=jQuery("#idSpaFatuRegVTP");
   objSpaP.text(0);
   let objSpaE=jQuery("#idSpaFatuRegVTE");
   objSpaE.text(0);
   let totalPadrao=0;
   let totalEspecial=0;
    jQuery('#idTabFatuRegTTS tr').each(function() {
        let efetivo = jQuery(this).find("td").eq(0).find("input[type='checkbox']:checked");
        //se efetivo for diferente de undefined, é para considerar o volume desta linha
        let valorPadrao = jQuery(this).find("td").eq(9).text();
        let valorEspecial = jQuery(this).find("td").eq(11).text();
        //console.log('Dentro do loop antes do teste',efetivo.attr("id")+" / "+valorPadrao+" / "+valorEspecial);        
if(typeof efetivo.attr("id") !== "undefined"){
    totalPadrao = totalPadrao + valorPadrao*1;
    totalEspecial = totalEspecial + valorEspecial*1;
    concatenaHid = concatenaHid + efetivo.attr("id")+",";
    //console.log('Dentro do loop válido',efetivo.attr("id")+" / "+valorPadrao+" / "+valorEspecial+" / hidden "+concatenaHid);
}//if typeof
         });//each
         objSpaP.text(totalPadrao);
         objSpaE.text(totalEspecial);
         concatenaHid = concatenaHid.replace(/,$/,"");//tirando a vírgula extra
         objHid.val(concatenaHid);
}//fRecalculaTS
function fLimpaCamposFaturamento(){
jQuery(".claLimpaRegFatu").val("");
jQuery(".claLimpaRegFatuSpa").text("");
jQuery(".claLimpaRegFatuSel option[value='0']").prop('selected', true);
jQuery(".claLimpaRegFatuTab").empty();
fSugereDatas();//repõe a sugestão de datas
fDataFutura(5,"#idDatFatuRegVen");//repõe a sugestão data do boleto com mais 5 dias
};//fLimpaCamposFaturamento
//-------------------------------------------------------------
function fDataFutura(qtdDias,idDatComTralha){
    //sugere uma data à frente na quantidade de dias informada, para pôr num input type date
    let objDataHoje = new Date();
    let hojeMiliss=objDataHoje.getTime();
    let dataFinal=objDataHoje.toLocaleDateString();//dd/mm/aaaa
    let dia=dataFinal.substring(0,2);
    let mes=dataFinal.substring(3,5);
    let ano=dataFinal.substring(6,10);
    //quatro dias são 4 * (1 dia em milissegundos)
    let umDia=3600*24*1000;
    let diasMili=hojeMiliss + (qtdDias*umDia);
    let objNovaData = new Date(diasMili);
    if(objNovaData.getDay()==0){
        //se a nova data cair num domingo, vai mais um dia (para segunda)
        diasMili=hojeMiliss + ((qtdDias+1)*umDia);
        objNovaData = new Date(diasMili);
    }
    if(objNovaData.getDay()==6){
             //se a nova data cair num sábado vai mais dois dias (para segunda)
        diasMili=hojeMiliss + ((qtdDias+2)*umDia);
        objNovaData = new Date(diasMili);
    }
    let dataInicial=objNovaData.toLocaleDateString();//dd/mm/aaaa
    let diaI=dataInicial.substring(0,2);
    let mesI=dataInicial.substring(3,5);
    let anoI=dataInicial.substring(6,10);
    let dataFutura = anoI+"-"+mesI+"-"+diaI;
    jQuery(idDatComTralha).val(dataFutura);
    //console.log(dataFutura);
}//fDataFutura
//-------------------------------------------------------
function myTimer() {
    jQuery("#idSpaLembreteAlarme").hide();
    let ativaDesativaAlarme= jQuery("#idHidLembretesInibeAlarme").val();
  const d = new Date();
  document.getElementById("timer").innerHTML = d.toLocaleTimeString();
  //---vigiando se existe uma data e hora que precise alarmar
  let objSpa = jQuery("#idSpaLembreteAlarme");
  objSpa.css({"background-color":"initial","color":"initial"});
  objSpa.text("");
let milissegundosAgora = d.getTime();
  let i=0;
  for(i;i<global_arrayObj_lembretes.length;i++){
    let dataInicio = global_arrayObj_lembretes[i].inicio;//yyyy-mm-dd hh:mm:ss
    let anoInicial = dataInicio.substring(0,4);
    let mesInicial = dataInicio.substring(5,7)*1-1;//para compensar que mês janeiro = 0 para o javascript
    let diaInicial = dataInicio.substring(8,10);
    let horaInicial = dataInicio.substring(11,13);
    let minutosInicial = dataInicio.substring(14,16);
    let segundosInicial = dataInicio.substring(17,19);
    let miliSegI = new Date(anoInicial,mesInicial,diaInicial,horaInicial,minutosInicial,segundosInicial).getTime();
    //--
    let dataFinal = global_arrayObj_lembretes[i].fim;//yyyy-mm-dd hh:mm:ss
    let anoFinal = dataFinal.substring(0,4);
    let mesFinal = dataFinal.substring(5,7)*1-1;//para compensar que mês janeiro = 0 para o javascript
    let diaFinal = dataFinal.substring(8,10);
    let horaFinal = dataFinal.substring(11,13);
    let minutosFinal = dataFinal.substring(14,16);
    let segundosFinal = dataFinal.substring(17,19);
    let miliSegF = new Date(anoFinal,mesFinal,diaFinal,horaFinal,minutosFinal,segundosFinal).getTime();
    //dataInicio, milissegundos marcados e milissegundos agora:  2022-10-29 00:00:00/1667012400000 / 1667043083440
   //console.log("dataInicio, milissegundos marcados e milissegundos agora: ",dataInicio+"/"+miliSegI+" / "+milissegundosAgora);
    if(milissegundosAgora*1 >= miliSegI*1 && milissegundosAgora*1 <= miliSegF*1){
    let lembrete = global_arrayObj_lembretes[i].lembrete;
    objSpa.css({"background-color":"red","color":"white"});
    objSpa.text(lembrete+" às "+horaInicial+":"+minutosInicial);
    jQuery("#idSpaLembreteAlarme").show();
    if(ativaDesativaAlarme*1==0){
        //se tiver zero toca.
    const audio = new Audio("../sons/beep.wav");
    audio.play();
    }//if global_alarme
   // alert ("Atenção para o lembrete: "+lembrete+" às "+d.toLocaleTimeString());
    }//if mili
  }//for i
}//myTimer
//----------------------------------------------------
function fTestaLogAdmin(senha){
    //Se for o admin autenticado aqui, libera a página, mas com o banco de teste
    let objTxtSigla = jQuery("#idTxtLogSigla");
    let objTxtSenha = jQuery("#idPasLogSenha");
    let objSpaNomeNaMaq = jQuery("#idSpaLogNaMaquinaNome");
    let objSpaSiglaNaMaq = jQuery("#idSpaLogNaMaquinaSigla");
    let objSpaIdNaMaq = jQuery("#idSpaLogNaMaquinaId");
    sql = `SELECT id,pessoa,sigla,acesso_tabacessos 
    FROM tabpessoas 
    WHERE  sigla = 'admin'  
    AND senha COLLATE latin1_general_cs = '`+ senha + `' 
    AND int_status=2`;
    let intOperacao = 10;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        //console.log("retorno",retorno);
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let idPessoa = obj.resultados[0].id;
            let pessoa = obj.resultados[0].pessoa;
            let sigla = obj.resultados[0].sigla;
            global_Int_NivelNaMaquina = obj.resultados[0].acesso_tabacessos;
            //console.log("global",global_Int_NivelNaMaquina);
            objSpaNomeNaMaq.text(pessoa);
            objSpaSiglaNaMaq.text(sigla);
            objSpaIdNaMaq.text(idPessoa);
            //com asterisco libera todos os filhos
            jQuery(".claRotulo").hide();
            jQuery("#idDivUsuario").hide();//bloco do usuário que não tem sigla
            jQuery("#idDivLogin").hide();
            jQuery(".claDivTextoCapa").hide();
            jQuery(".claDivFaleConosco").hide();
            //--
            jQuery("#idDivLiberarBloco *").prop("disabled", false);
            jQuery("#idDivLiberarBloco").show();
            jQuery(".gridLembreteHome *").prop("disabled", false);
            jQuery(".gridLembreteHome").show();
            jQuery("#idDivLogout").show();
            jQuery(".dropdown").show();
            jQuery(".botao1").show();
            jQuery(".botao12").show();
            jQuery(".botao13").show();
            //--
            objTxtSigla.val('');
            objTxtSenha.val('');
            //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
            global_int_operacaoSelect=11;
            global_int_operacaoInsert=41;
            global_int_operacaoUpdateDelete=31;
            fCargaTotal();//inicializa como admin
        } else {
            alert("Não autenticado");
        }//if retorno
        //console.log("ins: "+global_int_operacaoInsert+" sel: "+global_int_operacaoSelect+" update: "+global_int_operacaoUpdateDelete);
    }, function (respostaErrada) {
        //console.log("Erro em fTestaLogAdmin",respostaErrada);
    }).catch(function (e) {
        //console.log("Erro em fTestaLogAdmin catch",e);
    });//fExecutaBD
}//fTestaLogAdmin
//-------------------------------------------------------
function fCargaTotal(){
    //-------inicializações----------------------------------A
    fSugereDatas();//em todos os formulários que tenham pesquisas por data, já preenche os campos de data com uma sugestão
    fCarregaPessoasAdmin();//todas as pessoas na tela de administrador de pessoas
    fCarregaTodasPessoas(2);//carregando as ativas
    fCarregaClientes();//carregando os clientes ativos
    fCarregaClientesTodos();
    fCarregaCategorias();
    fCarregaFiliais();
    fCarregaNiveisAcesso();
    fCarregaTiposLogradouro();
    fCarregaPaises();
    fCarregaAlmoNaturezas();
    fCarregaAlmoMaterial();
    fCarregaAlmoApresentacao();
    fCarregaAreasAtuacao(2);//só ativas
    fCarregaAreasAtuacaoAlteracao(0);//carregar tudo
    fCarregaPastas();
    fCarregaAnosCrono();
    fCarregaFornecedores();
    fCarregaOrgaos();
    fCarregaSubdivisao();
    setInterval(myTimer, 1000);
    jQuery("#dataHoje").text(new Date().toLocaleDateString());
    fCarregaLembretes(2);
    //jQuery(".claTelaLembrete").hide();
    //jQuery("#idDivLembretes").hide();
}//fCargaTotal
//---------------------------------------------------------------
function fCarregaLembretes(statusPassado){
    //selecionando lembretes do usuário na máquina
    global_arrayObj_lembretes=[];
    let clausulaStatus="";
    if(statusPassado*1 == 2){
        clausulaStatus=`AND l.status = `+statusPassado+` `;
    }
    let dataHoraAgora = fPegaDataAtualNoFormatoAmericano();
    //console.log("dataHoraAgora",dataHoraAgora);
    let idRedator = jQuery("#idSpaLogNaMaquinaId").text() * 1;
    let objTabL = jQuery("#idTabLembretes");
    objTabL.empty();
    let objSel= jQuery("#idSelLembretesAtivos");
    objSel.empty();
    //-------
    let concatena = '';
    let concatenaLemb = '';
    //-------
    //dd/mm/aaaa
    let dataHoje = jQuery("#dataHoje").text();
    let dia = dataHoje.substring(0,2);
    let mes = dataHoje.substring(3,5);
    let ano = dataHoje.substring(6,10);
    dataHoje = ano+"-"+mes+"-"+dia;
    let sql ="";
    if(statusPassado*1==2){
        //somente os do dia
    sql = `SELECT l.id, l.lembrete, l.data_inicio, l.data_final, l.tipo, p.pessoa, 
    l.participantes, l.status  
    FROM tablembretes l 
    INNER JOIN tabpessoas p 
    ON p.id = l.redator_tabpessoas  
    WHERE p.id = `+ idRedator + ` AND DATE (LEFT(l.data_inicio,10)) >= DATE('`+dataHoje+`')   
    `+clausulaStatus+` 
    ORDER BY l.data_inicio`;
    }else{
        //é para ver todos os lembretes do redator, em qualquer dia e em qualquer status
        sql = `SELECT l.id, l.lembrete, l.data_inicio, l.data_final, l.tipo, p.pessoa, 
        l.participantes, l.status  
        FROM tablembretes l 
        INNER JOIN tabpessoas p 
        ON p.id = l.redator_tabpessoas  
        WHERE p.id = `+ idRedator + `  
        ORDER BY l.data_inicio`;
    }//if intTodos
    //console.log("Data Hoje: ",sql);
        /*
        //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
        global_int_operacaoSelect=11;
        global_int_operacaoInsert=41;
        global_int_operacaoUpdateDelete=31;
            */        
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    concatena =concatena + `<tr><th>id</th><th>Redator</th><th>Tipo</th><th>Data Compromisso</th><th>Alarme até</th>
    <th>Lembrete</th><th>Participantes</th><th>Alterar</th></tr>`;
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        //console.log("Retorno: ",retorno);
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
            let participantes = obj.resultados[i].participantes;
            let id = obj.resultados[i].id;
            let lembrete = obj.resultados[i].lembrete;
            let nomeRedator = obj.resultados[i].pessoa;
            let data_inicio = obj.resultados[i].data_inicio;
            let statusLembretes = obj.resultados[i].status;
            //---
            let tipo = obj.resultados[i].tipo;
            let txtTipo ="";
            let estiloTipo="background-color:initial";
            switch (tipo*1){
                case 1:
                txtTipo = "Lembrete";
                break;
                case 2:
                    txtTipo = "AUDIÊNCIA";
                    estiloTipo="background-color:yellow";
                break;
            }//switch
            //---
            let estilo = "border:initial";
            let tituloEstilo = "";
            switch (statusLembretes*1){
                case 1:
                    estilo="border:2px solid yellow;";
                    tituloEstilo="Em rascunho";
                    break;
                    case 2:
                    estilo="border:2px solid green;";
                    tituloEstilo="Ativo";
                    break;
                    case 7:
                    estilo="border:2px solid red;";
                    tituloEstilo="Cancelado";
                    break;
            }//switch
            if(statusLembretes*1==2){
            if(data_inicio.substring(0,10)==dataHoraAgora.substring(0,10)){
                //aaaa-mm-dd hh:mm:ss
                let hora = data_inicio.substring(11);
                concatenaLemb = concatenaLemb+'<option value="'+id+'">'+lembrete+' às '+hora+' horas</option>';
            }//if data_inicio
            }//if statusLembretes
            let txtRotulo="";
            let intFuturoStatus=0;
            switch(statusLembretes*1){
                case 1:
                    txtRotulo="Ativar/Rascunho";
                    intFuturoStatus=21;
                    break;
                case 2:
                    txtRotulo="Cancelar/Rascunho";
                    intFuturoStatus=17;
                break;
                case 7:
                    txtRotulo="Reativar/Rascunho";
                    intFuturoStatus=21;
                break;
            }//switch
            let data_final = obj.resultados[i].data_final;
            global_arrayObj_lembretes.push({"id":idRedator,"inicio":data_inicio,"lembrete":lembrete,"fim":data_final});            
            concatena = concatena + `<tr><td><button type="button" id="` + id + `" 
            class="btn btn-warning btn-sm claBtnLembEdita" 
            data-tipo="`+tipo+`" data-texto="`+lembrete+`" data-participantes="`+participantes+`"
            title="Altera este lembrete">`+id+`</button></td>
                                    <td>`+ nomeRedator + `</td><td style="`+estiloTipo+`">`+txtTipo+`</td><td>` + data_inicio + `</td><td>`+ data_final + `</td>
                                    <td>`+ lembrete + `</td><td>` + participantes + `</td>
                                    <td><button type="button" id="`+id+`" 
                                    class="btn btn-sm claBtnLembreteStatus" 
                                    data-futuro="`+intFuturoStatus+`" style="`+estilo+`" 
                                    title="`+tituloEstilo+`">`+txtRotulo+`</button></td>
                                    </tr>`;
        }//for i
        }//if retorno.lenth
        objTabL.append(concatena);
        //---passa o concatenaLemb para outra função porque vai juntar os lembretes deste usuário na máquina...
        //...com os participantes citados. Esta nova função procura todos os lembretes que constem na lista...
        //...de participantes
        fAdicionaCitados(concatenaLemb);
     }, function (respostaErrada) {
        //console.log("Erro em fCarregaLembretes",respostaErrada);
    }).catch(function (e) {
        //console.log("Erro em fCarregaLembretes catch",e);
    });//fExecutaBD
} //fechamento função lembretes
//---------------------------------------------------------------
function fLimpaCamposLembrete(){
jQuery(".claLimpaCampoLemb").val("");
jQuery("#idSelLembretePart option[value='0']").prop('selected', true);
jQuery("#idHidLembreUpdate").val(0);//quando este hidden está >0 é porque é atualização. (Depois de salvar, volta a zero)
jQuery("#idSelLembretePart option:selected").prop("selected", false);//limpando seleções anteriores
jQuery("input:radio[name=namRadLembreTipo]").val([1]);
jQuery("#idBtnLembretes").trigger("click");
jQuery("#idSpaLembretePartSel").text('');
}//fLimpaCamposLembrete
//---------------------------------------------------------------
function fAdicionaCitados(concatenaLemb){
    //esta função rola todos os lembretes, mas só pega os ativos e que, em participantes, a sigla na máquina conste...
    //...mas em registros que o próprio que está na máquina criou
    //...Também adiciona na global para que o alarme também toque para o participante inserido por outro redator
    let siglaNaMaquina = jQuery().text();
    let idNaMaquina = jQuery("#idSpaLogNaMaquinaId").text();
    let objSel= jQuery("#idSelLembretesAtivos");//aqui não vai ter empty porque quero adicionaro ao que já existe na select
    let dataHoraAgora = fPegaDataAtualNoFormatoAmericano();
    let sql = `SELECT l.id, l.lembrete, l.data_inicio, l.data_final, l.tipo,p.pessoa,p.sigla,
    l.participantes,l.redator_tabpessoas  
    FROM tablembretes l 
    INNER JOIN tabpessoas p 
    ON l.redator_tabpessoas  = p.id 
    WHERE DATE (LEFT(l.data_inicio,10)) >= DATE('`+dataHoje+`')   
    AND status = 2 
    AND l.redator_tabpessoas <> `+idNaMaquina+` 
    ORDER BY l.data_inicio`;
    //console.log("sql",sql);
        /*
        //---As operações passadas ao PHP 1,3 e 4 são substituídas pora 11,31 e 41 para acessar o banco de teste
        global_int_operacaoSelect=11;
        global_int_operacaoInsert=41;
        global_int_operacaoUpdateDelete=31;
            */        
    let intOperacao = global_int_operacaoSelect;
    let tripa = "";
    fExecutaBD(intOperacao, sql, tripa).then(function (retorno) {
        //console.log("Retorno: ",retorno);
        if (retorno.length > 20) {
            let obj = JSON.parse(retorno);
            let i = 0;
            for (i; i < obj.resultados.length; i++) {
                let id = obj.resultados[i].id;
                let idRedator = obj.resultados[i].redator_tabpessoas;
                let pessoa = obj.resultados[i].pessoa;
                let sigla = obj.resultados[i].sigla;
                let participantes = obj.resultados[i].participantes;
                let lembrete = obj.resultados[i].lembrete;
                let data_inicio = obj.resultados[i].data_inicio;
                let data_final = obj.resultados[i].data_final;
                  if(participantes.indexOf(siglaNaMaquina)*1 > -1){
                    //só pega os de hoje e que a sigla na máquina esteja na lista de participantes
                    if(data_inicio.substring(0,10)==dataHoraAgora.substring(0,10)){
                        //aaaa-mm-dd hh:mm:ss
                        let hora = data_inicio.substring(11);
                        concatenaLemb = concatenaLemb+`<option value="`+id+`" 
                        title="Lembrete criado por `+sigla+` (`+pessoa+`)">`+lembrete+` às `+hora+` horas (*)</option>`;
                        //também põe no array de alarmes o que foi marcado por outra pessoa que não esteja na máquina...
                        //...mas que pôs como participante a pessoa que está na máquina
                        global_arrayObj_lembretes.push({"id":idRedator,"inicio":data_inicio,"lembrete":lembrete,"fim":data_final}); 
                      }//if data_inicio
                    }//if statusLembretes
                }//for
        }//if retorno
        objSel.append(concatenaLemb);
    }, function (respostaErrada) {
        console.log("Erro em fAdicionaCitados",respostaErrada);
    }).catch(function (e) {
        console.log("Erro em fAdicionaCitados catch",e);
    });//fExecutaBD

}//fAdicionaCitados

