var token = "1261473229:AAHS8Nn9brWcznT36NWDIy_-FZXSspYQpDs";
var telegramUrl = "https://api.telegram.org/bot" + token;
var webAppUrl = "https://script.google.com/macros/s/AKfycbxC9c_MupcBp6d1JY0c6SXUJq7dafaFXbpHgH57ylrxxpa1GYY/exec";
var ssId = "1xRXWLCwZEmY_hXdvrNc1UfbkIJNcIOFPBjMC2HkShaU";

function doGet(request) {
  if(request.parameters.laman == "home") {
    return homePage();
  } else if(request.parameters.laman == "dataTeknisi") {
    return HtmlService.createTemplateFromFile("data-teknisi").evaluate();
  } else if(request.parameters.laman == "totalOrder") {
    return HtmlService.createTemplateFromFile("total-order").evaluate();
  } else if(request.parameters.laman == "datel") {
    return HtmlService.createTemplateFromFile("datel").evaluate();
  } else {
    return HtmlService.createTemplateFromFile("error404").evaluate();
  }
}

function homePage() {
  var template = HtmlService.createTemplateFromFile('index') //menampilkan file index ke dashboard
  var pageData = template.evaluate() 
  .setTitle("Dashboard Lapor Gangguan") 
  .addMetaTag("viewport","width=device-width, initial-scale=1") 
  .setSandboxMode(HtmlService.SandboxMode.IFRAME)
  .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
  return pageData;
}

/* @Include JavaScript and CSS Files */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}
/* @Process Form */
function processForm(formObject) {
  var url = "https://docs.google.com/spreadsheets/d/1xRXWLCwZEmY_hXdvrNc1UfbkIJNcIOFPBjMC2HkShaU/edit#gid=0";
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("Data");
  
  ws.appendRow([,
                ,
                ,
                ,
                formObject.no_pelanggan,
                formObject.no_hp,
                formObject.nama,
                formObject.alamat,
                formObject.detail_aduan]);
}

function setWebhook() {
  var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
   Logger.log(response.getContentText());
}

function sendText(chatId, text, keyBoard, key,key_conf) {
  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(chatId),
      text: text,
      parse_mode: "HTML",
      reply_markup: JSON.stringify(keyBoard,key,key_conf)
    }
  };
  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
}

function Rec_Proses(Sheet,SheetTrans,id_sender,data,SheetCounter){
  var iddata=0;
  var idtrans=getIdTransaksi(SheetCounter,"trans");
  SheetTrans.appendRow([idtrans,id_sender,data,1]);
  if(data=="lapor"){
        iddata=getIdTransaksi(SheetCounter,"data");
        set1Key(SheetTrans,0,idtrans,iddata,7);
  }
  return iddata;
}

function getIdTransaksi(SheetCounter,tbl_data){
    if(tbl_data=="trans"){
        var counter =SheetCounter.getDataRange().getCell(2, 1).getValue();
        SheetCounter.getDataRange().getCell(2, 1).setValue(counter+1);
    }else{
        var counter =SheetCounter.getDataRange().getCell(2, 2).getValue();
        SheetCounter.getDataRange().getCell(2, 2).setValue(counter+1);
    }
    return counter+1
}

function get1Key(Sheet,klm1,key1,rslt_klm,lr){
  var rows_data = Sheet.getDataRange().getValues();
  var result="zonk";
  if(lr===undefined){
    for (var a = 0; a < rows_data.length; a++){          
      if(rows_data[a][klm1]==key1){
          result=Sheet.getDataRange().getCell(a+1, rslt_klm).getValue();
          break;
      }
    }
  }else{
    for(var i = rows_data.length-1; i >= 0; i--){
        if(rows_data[i][klm1]==key1){
          result=Sheet.getDataRange().getCell(i+1, rslt_klm).getValue();
          break;
        }
    }
  }
  return result; 
}

function get2Key(Sheet,klm1,klm2,key1,key2,rslt_klm){
  var rows_data = Sheet.getDataRange().getValues();
  var result="zonk";
  
  for (var a = 0; a < rows_data.length; a++){              
      if(rows_data[a][klm1]==key1 && rows_data[a][klm2]==key2){
          result=Sheet.getDataRange().getCell(a+1, rslt_klm).getValue();
          break;
      }
  }
  return result; 
}

function getOtentik(SheetUser,id_callback){
  var user=SheetUser.getDataRange().getValues();
  var otentik=false;
  for(var i=0;i<user.length;i++){
    if(user[i][1]==id_callback){
      otentik=true;
      break;
    }
  }
  return otentik;
}

function set1Key(Sheet,klm1,key1,setVal,rslt_klm){
  var rows_data = Sheet.getDataRange().getValues();
  var result="zonk";
  
  for (var a = 0; a < rows_data.length; a++){            
      if(rows_data[a][klm1]==key1){
          Sheet.getDataRange().getCell(a+1, rslt_klm).setValue(setVal);
          result="done";
          break;
      }
  }
  return result; 
}

function set2Key(Sheet,klm1,klm2,key1,key2,rslt_klm,setVal){
  var rows_data = Sheet.getDataRange().getValues();
  var result="zonk";
  
  for (var a = 0; a < rows_data.length; a++){        
      if(rows_data[a][klm1]==key1 && rows_data[a][klm2]==key2){
          Sheet.getDataRange().getCell(a+1, rslt_klm).setValue(setVal);
          result="done";
          break;
      }
  }
  return result; 
}

function set1K3P(Sheet,klm1,key1,val1,target1,val2,target2,val3,target3){
  var rows_data = Sheet.getDataRange().getValues();
  var result="zonk";
  
  for (var a = 0; a < rows_data.length; a++){          
      if(rows_data[a][klm1]==key1){
          Sheet.getDataRange().getCell(a+1, target1).setValue(val1);
          Sheet.getDataRange().getCell(a+1, target2).setValue(val2);
          Sheet.getDataRange().getCell(a+1, target3).setValue(val3);
          result="done";
          break;
      }
  }
  return result; 
}

function set1K2P(Sheet,klm1,key1,val1,target1,val2,target2){
  var rows_data = Sheet.getDataRange().getValues();
  var result="zonk";
  
  for (var a = 0; a < rows_data.length; a++){          
      if(rows_data[a][klm1]==key1){
          Sheet.getDataRange().getCell(a+1, target1).setValue(val1);
          Sheet.getDataRange().getCell(a+1, target2).setValue(val2);
          result="done";
          break;
      }
  }
  return result; 
}

function delIDTrans(Sheet,idTrans){
  var result="zonk";
  var rangeVals=Sheet.getDataRange().getValues();
  for(var i = rangeVals.length-1; i >= 0; i--){
     if(rangeVals[i][0] === idTrans){
        Sheet.deleteRow(i+1);
        var result="done";
     }
  }  
  return result;
}

function getData(Sheet,klm1,key1){
  var rows_data = Sheet.getDataRange().getValues();
  var lc = Sheet.getDataRange().getLastColumn();
  var result="";
  
  for (var a = 0; a < rows_data.length; a++){
      if(rows_data[a][klm1]==key1){      
          for (var b = 0; b < lc; b++){
              var header=Sheet.getDataRange().getCell(1, b+1).getValue();
              var dataCell=Sheet.getDataRange().getCell(a+1, b+1).getValue();            
              result=result+"# "+ header+" : "+dataCell+"\n";               
          }  
           break;      
      }     
  }
  if(result==""){
      result="zonk"
  }
  return result; 
}

function getData2K4R(Sheet,klm1,key1,klm2,key2,C1,C2,C3,C4)
{
  var rows_data = Sheet.getDataRange().getValues();
  var result="";
  for (var a = 0; a < rows_data.length; a++){
      if(rows_data[a][klm1]==key1 && rows_data[a][klm2]==key2){  
          var b =Sheet.getDataRange().getCell(1, C1).getValue();
          var c= Sheet.getDataRange().getCell(a+1, C1).getValue();
          var d=Sheet.getDataRange().getCell(1, C2).getValue(); 
          var e= Sheet.getDataRange().getCell(a+1, C2).getValue();
          var f=Sheet.getDataRange().getCell(1, C3).getValue(); 
          var g= Sheet.getDataRange().getCell(a+1, C3).getValue();
          var h=Sheet.getDataRange().getCell(1, C4).getValue(); 
          var i= Sheet.getDataRange().getCell(a+1, C4).getValue();
          result="# "+b+">"+c+" # "+d+">"+e+" # "+f+">"+g+" # "+h+">"+i+"\n";     
      }
  }
  return result;
}

//------------------------program utama----------------------

function doPost(e) {
  //parse user data
  var contents = JSON.parse(e.postData.contents);
  //set spreadsheet 
  var SheetData =  SpreadsheetApp.openById(ssId).getSheetByName("Data");
  var SheetTransaksi =SpreadsheetApp.openById(ssId).getSheetByName("transaksi");
  var SheetUser=SpreadsheetApp.openById(ssId).getSheetByName("user");
  var SheetTehnisi=SpreadsheetApp.openById(ssId).getSheetByName("tehnisi");
  var SheetCounter=SpreadsheetApp.openById(ssId).getSheetByName("counter");
  var idTrans=0;
  var menu="";
  var keyBoard = {
        "inline_keyboard": [
          [{
            "text": "Lapor Gangguan",
            'callback_data': 'lapor'
          }],
           [{
            "text": "Cek Progress Gangguan",
            'callback_data': 'progres'
          }],
          [{
            "text":"Update",
            'callback_data':'update'
          }]

          ]
  };
  var key = {
        "inline_keyboard": [
          [{
            "text": "Create Tiket",
            'callback_data': 'admcreat'
          }],
          [{
            "text": "Progress",
            'callback_data': 'admprogres'
          }],
           [{
            "text":"Pending",
            'callback_data':'admpending'
          }],
          [{
            "text":"Close Order",
            'callback_data':'admclose'
          }],
          [{
            "text": "Kembali",
            'callback_data': 'admback'
          }]

          ]
  };
  
   var key_conf = {
        "inline_keyboard": [
          [{
            "text": "YA",
            'callback_data': 'conf_ya'
          }],
           [{
            "text": "TIDAK",
            'callback_data': 'conf_td'
          }]
          ]
  };
  
  if (contents.callback_query) {
    var id_callback = contents.callback_query.from.id;
    var user_name = contents.callback_query.from.username;
    var name=contents.callback_query.from.first_name;
    var data = contents.callback_query.data;
    idTrans=get1Key(SheetTransaksi,1,id_callback,1);
    if (data == 'lapor'){
      var idData= Rec_Proses(SheetData,SheetTransaksi,id_callback,data,SheetCounter);
      SheetData.appendRow([idData,new Date(),id_callback,user_name]);
      sendText(id_callback,"1. Masukkan data nomor Indihome : " );  
      }else if (data == 'progres') {
      Rec_Proses(SheetData,SheetTransaksi,id_callback,data,SheetCounter);
      sendText(id_callback,"Masukkan data nomor Indihome yang di laporkan :  ");  
      }else if (data == 'update') {
      var ot_adm = getOtentik(SheetUser,id_callback);
      var ot_tech= getOtentik(SheetTehnisi,id_callback)
      if(ot_adm || ot_tech){  
        Rec_Proses(SheetData,SheetTransaksi,id_callback,data,SheetCounter);
        sendText(id_callback,"Silakan pilih menu update :",key);
      }else{
        sendText(id_callback,"Maaf fitur ini hanya digunakan oleh Admin",keyBoard );
      }
      }else if(data=="admcreat"){
        set1Key(SheetTransaksi,1,id_callback,data,5);
        sendText(id_callback,"----Inbok WO Create Tiket----");
        var inbokTiket=getData(SheetData,9,"CR TIKET");
        if(inbokTiket!="zonk"){
            sendText(id_callback,inbokTiket)
            sendText(id_callback,"Masukkan ID datanya :  ");
        }else{
            delIDTrans(SheetTransaksi,idTrans);
            sendText(id_callback,"Semua aduan telah tertiket, Terimakasih atas dedikasinya!");
            sendText(id_callback,keyBoard);
        }
      }else if(data=="admprogres"||data=="admclose" ||data=="admpending"){    
        set1Key(SheetTransaksi,1,id_callback,data,5);
        sendText(id_callback,"----Inbok WO untuk anda----");
        var tele_name=get1Key(SheetTehnisi,1,id_callback,2);
        var inbokTiket=getData(SheetData,12,tele_name);       
        sendText(id_callback,inbokTiket)
        sendText(id_callback,"Masukkan ID datanya :  ");
    }else if(data=="conf_ya"){
        sendText(id_callback,"Silahkan pilih menu update lainnya",key);
    }else if(data=="conf_td"){
        delIDTrans(SheetTransaksi,idTrans);
        sendText(id_callback,"Terimakasih atas kerja samanya :) ",keyBoard);
    }else if(data=="admback"){
        delIDTrans(SheetTransaksi,idTrans);
        sendText(id_callback,"Hallo "+name+" ! Selamat datang di pelaporan gangguan Indihome",keyBoard);
    }  
  }else if (contents.message){
    var id_message = contents.message.from.id; 
    var text = contents.message.text; 
    var firstName = contents.message.from.first_name;
    var lastName = contents.message.from.last_name;
    var id = contents.message.chat.id;
    idTrans=get1Key(SheetTransaksi,1,id_message,1);
    if(text === "/start" || text==="batal"){
        //sendText(id_message,"id Transaksimu adalah "+idTrans);
        if(idTrans!=undefined || idTrans!=0){
          delIDTrans(SheetTransaksi,idTrans);
        }
        sendText(id_message, "Hallo " + firstName +  ", Selamat datang di pelaporan gangguan Indihome. Silakan pilih menu : ",keyBoard);
    }else{
       //------dialog proses lapor---------    
        var rowTransaksi=get1Key(SheetTransaksi,1,id_message,3);
        //move id transaksi di bawah content
        var Step=get1Key(SheetTransaksi,1,id_message,4); 
        if(rowTransaksi=="lapor"){
          var idData=get1Key(SheetTransaksi,1,id_message,7);
          if(Step==1){
              //update step menjadi 2
              set1Key(SheetTransaksi,0,idTrans,2,4);
              set1Key(SheetData,0,idData,text,5);
              sendText(id_message, "2. No HP : ");
          }else if(Step==2){
              //update step menjadi 3
              set1Key(SheetTransaksi,1,id_message,3,4);
              set1Key(SheetData,0,idData,text,6);
              sendText(id_message, "3. Nama : ");
          }else if(Step==3){
              //update step menjadi 4
              set1Key(SheetTransaksi,1,id_message,4,4);
              set1Key(SheetData,0,idData,text,7);
              sendText(id_message, "4. Alamat : ");
          }else if(Step==4){
              //update step menjadi 5
              set1Key(SheetTransaksi,1,id_message,5,4);
              set1Key(SheetData,0,idData,text,8);
              sendText(id_message, "5. Detail Keluhan : ");
          }else if(Step==5){
              //update step menjadi 6
              set1Key(SheetTransaksi,1,id_message,6,4);
              set1K2P(SheetData,0,idData,text,9,"CR TIKET",10);
              delIDTrans(SheetTransaksi,idTrans);
              sendText(id_message,"Terimakasih, laporanmu telah kami simpan dan akan segera ditindaklanjuti");
              sendText(id_message,"Cek progress status laporanmu dengan fitur Cek Progress Gangguan yaa",keyBoard);
          }
        }else if(rowTransaksi=="progres"){
            var id_ggn=get1Key(SheetData,4,text,1,"last");
            var prog_ggn=getData(SheetData,0,id_ggn);//mendapatkan data berdasar id data di kolom pertama
            if(prog_ggn!="zonk"){
                sendText(id_message,"Hallo "+firstName+"!  Status laporanmu dengan nomor "+text+" saat ini :  \n"+prog_ggn,keyBoard);
            }
            else{
                sendText(id_message,"Hallo "+firstName+"!  Mohon maaf laporanmu dengan nomor "+text+" TIDAK DITEMUKAN datanya",keyBoard);
            }
            delIDTrans(SheetTransaksi,idTrans);
        }else if(rowTransaksi=="update"){
            var rowSubTrans=get1Key(SheetTransaksi,1,id_message,5);
            var tempData=get1Key(SheetTransaksi,0,idTrans,6);
            if(rowSubTrans=="admcreat"){
                if (Step==1){ //step untuk memasukkan id data
                    set1K3P(SheetTransaksi,0,idTrans,2,4,rowSubTrans,5,text,6);
                    sendText(id_message, "Masukkan nomor create tiketnya ( INXXXXXX ) :  ");
                }else if (Step==2){ //step untuk memasukkan data creat tiket
                    set1K2P(SheetData,0,tempData,text,11,"BLM ORDER",10);//isi nomor tiket dan Update jd blm order di sheet data
                    set1K2P(SheetTransaksi,0,idTrans,1,4,"",6);//ubah Step menjadi 1 , tempdata menjadi kosong untuk kembali ke menu update
                    sendText(id_message, "Input tiket lagi?",key_conf);         
                }
            }else if(rowSubTrans=="admprogres"){
                if (Step==1){ //step untuk memasukkan id data tiket ke temporary
                    set1K3P(SheetTransaksi,0,idTrans,2,4,rowSubTrans,5,text,6);//update step jadi 2
                    sendText(id_message, "Masukkan ID datanya :  ");
                }else if (Step==2){ //step untuk memasukkan tehnisi ke ke sheet data
                    set1Key(SheetData,0,tempData,"PROGRES",10)
                    sendText(id_message, "Selamat bekerja, semoga dimudahkan dan dilancarkan ",keyBoard);
                    delIDTrans(SheetTransaksi,idTrans);
                }
            }else if(rowSubTrans=="admpending"){
              if(Step==1){
                    set1K3P(SheetTransaksi,0,idTrans,2,4,rowSubTrans,5,text,6);
                    sendText(id_message, "Masukan ID datanya: ");
              }else if(Step==2){
                    set1Key(SheetData,0,tempData,"PENDING",10)
                    sendText(id_message, "Tetap semangat.. semoga segera dilakukan progres.",keyBoard);
                    delIDTrans(SheetTransaksi,idTrans);
              }
            }else if(rowSubTrans=="admclose"){
                if (Step==1){ //step untuk memasukkan id data tiket ke temporary
                    set1K3P(SheetTransaksi,0,idTrans,2,4,rowSubTrans,5,text,6);//update step jadi 2
                    sendText(id_message, "Masukkan ID datanya :  ");
                }else if (Step==2){ //step untuk memasukkan tehnisi ke ke sheet data
                    set1Key(SheetData,0,tempData,"CLOSE",10)
                    sendText(id_message, "Terimakasih atas usahanya! Progress tiket berikutnya?",key_conf);
                    set1Key(SheetTransaksi,0,idTrans,"",6)      
                }  
            }
        }    
     }//end jika bukan /start
  }
}