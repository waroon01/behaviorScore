function doGet(e) {
  return HtmlService.createTemplateFromFile('index').evaluate()
      .setTitle('kanan')
      .addMetaTag('viewport', 'width=device-width , initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}

function include(file){
  return HtmlService.createHtmlOutputFromFile(file).getContent()
}

function getScriptURL() {
  return ScriptApp.getService().getUrl();
}

//set ตัวแปร ชื่อชีต ไอดีโฟลเดอร์
const ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("STDDATA")
const sskanan = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("kanan")
const ssDropdownA = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DropdownA")
const ssDropdownB = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DropdownB")
const ssUser = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("User")
const folder = DriveApp.getFolderById("1CI2jGmsde61bw-8kCvKWKeX5L-lOpknY") //เปลี่ยนไอดีโฟลเดอร์



function getData(){
  const data = ss.getDataRange().getDisplayValues()
  return data

}

function mainData_B(obj){
  Logger.log(obj)
  try {
    if(obj.idlist === ""){
      appendKanan(obj)
    }else{
      updateData(obj)
    return getDataKanan(obj.idstd)

    }
  }
  catch(err) {
    console.log(err.message) 
  }
  finally {
    return getDataKanan(obj.idstd)
  }
}

function appendKanan(obj){
  Logger.log(obj.upImg_std)
  let ucFile
      if(obj.upImg_std.length > 0){        
        const file = folder.createFile(obj.upImg_std).getId()
        ucFile = "https://lh3.googleusercontent.com/d/"+file
      }else{
        ucFile = ""
      }
  const temestamp = Utilities.formatDate(new Date(), "GMT+7", "dd-MM-yyyy HH:mm:ss" );
  sskanan.appendRow([ temestamp,obj.datekanan, obj.idstd, obj.namestd, obj.typetitle, obj.listkanan, obj.scorebad, new Date().getTime(), obj.teacher,obj["switch-one"], ucFile ])

  return 
}

function updateData(obj){

  const idlist = obj.idlist
  const rowUpdate = searchByindexOf(idlist)
  Logger.log(rowUpdate)

  let imgLink = sskanan.getRange(rowUpdate,sskanan.getLastColumn()).getValue() //ระวังเปลี่ยนด้วยครับ หากรูปไม่ใช่คอลัมภ์สุดท้าย
  let oldLink = imgLink

  if(obj.upImg_std.length > 0){
    const file = folder.createFile(obj.upImg_std).getId()
    imgLink = "https://lh3.googleusercontent.com/d/"+file  
  }

    if(oldLink !== ""){
      deleteOldFile(oldLink)
    }

  const temestamp = Utilities.formatDate(new Date(), "GMT+7", "dd-MM-yyyy HH:mm:ss" );
      sskanan.getRange(rowUpdate,1,1,sskanan.getLastColumn()).setValues(
      [
        [
        temestamp,        
        obj.datekanan,
        obj.idstd,
        obj.namestd,
        obj.typetitle,
        obj.listkanan,
        obj.scorebad,
        obj.idlist,
        obj.teacher,
        obj["switch-one"],
        imgLink
        ]
      ]
    )
    return
}

// https:/    /    lh3.googleusercontent.com   /   d    /

function deleteOldFile(oldLink){
  let idFile = oldLink.split("/")[4] 
  Logger.log(idFile)
  DriveApp.getFileById(idFile).setTrashed(true);
}

function getDataKanan(idsearch){
  let datalist = sskanan.getRange(1, 1, sskanan.getLastRow(), sskanan.getLastColumn()).getDisplayValues()
  const dataA = getData()
    const listSTD = dataA.filter((f)=>{ return f[0] === idsearch})
    console.log(listSTD)
    let arrrlist = []
    let arrkanan = []

    listSTD.map(([ id, name, classroom, room ] )=>{     
    let record = {}
            record['id'] = id
            record['name'] = name
            record['classroom'] = classroom
            record[ 'room' ] = room

    const listkanan = datalist.filter((f)=>{ return f[2] === idsearch})
        listkanan.map(([timestamp, datekanan, stdid, stdname, title, detial, kanan, idlist, teacher, kanantype, imgstd ] )=>{
      let kananOBJ = {}
          kananOBJ['timestamp'] = timestamp
          kananOBJ['datekanan'] = datekanan
          kananOBJ['stdid'] = stdid
          kananOBJ['stdname'] = stdname
          kananOBJ['title'] = title
          kananOBJ['detial'] = detial
          kananOBJ['kanan'] = kanan
          kananOBJ['idlist'] = idlist
          kananOBJ['teacher'] = teacher
          kananOBJ['kanantype'] = kanantype
          kananOBJ['imgstd'] = imgstd


          arrkanan.push(kananOBJ)
        })
          record['kananlist'] = arrkanan
          arrrlist.push(record)
    })
        console.log(arrrlist)
        return arrrlist
}


function getDataDropDownMain(){
  let arrDropdownMain = []
  let dropdownMainObj = {}
      dropdownMainObj["listmainA"] = getDataDropDownA()
      dropdownMainObj["listmainB"] = getDataDropDownB()
  
  arrDropdownMain.push(dropdownMainObj)    
  console.log(arrDropdownMain)
  return arrDropdownMain
}



function getDataDropDownA(){
  let textOpt = ssDropdownA.getDataRange().getDisplayValues()
  // Logger.log(textOpt)
  let arrDropdown = []
    textOpt.map(([ listA ] )=>{ 
      let dropdownObj = {}
            dropdownObj['listA'] = listA
            arrDropdown.push(dropdownObj)
    })
        // console.log(arrDropdown)
        return arrDropdown
}

function getDataDropDownB(){
  let textOpt = ssDropdownB.getDataRange().getDisplayValues()
  // Logger.log(textOpt)
  let arrDropdown = []
    textOpt.map(([ listB ] )=>{ 
      let dropdownObj = {}
            dropdownObj['listB'] = listB
            arrDropdown.push(dropdownObj)
    })
        // console.log(arrDropdown)
        return arrDropdown
}


function deleterowKanan(idlist){
  const rowUpdate = searchByindexOf(idlist)
  const idsearch = sskanan.getRange(rowUpdate,3).getDisplayValue()
  let oldLink = sskanan.getRange(rowUpdate,sskanan.getLastColumn()).getValue() //ระวังเปลี่ยนด้วยครับ หากรูปไม่ใช่คอลัมภ์สุดท้าย
  if(oldLink !== ""){
    deleteOldFile(oldLink)
  }
  Logger.log(idsearch)
  sskanan.deleteRow(rowUpdate)
  return getDataKanan(idsearch)
}

function searchByindexOf(keys){     
    const dataBeforeSearch = sskanan.getRange(2,1,sskanan.getLastRow()-1,sskanan.getLastColumn()).getDisplayValues()
     var idCol = dataBeforeSearch.map(function(r){return r[7];});
     var posIndex = idCol.indexOf(keys);
     var rowindex = posIndex === -1 ? 0 : posIndex + 2

    return rowindex
}

function showUpdateKanan(idlist){
  const rowUpdate = searchByindexOf(idlist)
  const datashow = sskanan.getRange(rowUpdate,1,1,sskanan.getLastColumn()).getDisplayValues()
  return datashow
}


function sendNotify(imgFile){
const token = "Your Token Line NotiFy" //chang Token notify

  /** Base64 to BLOB  */
  const splitBase = imgFile.split(',')
  const type = splitBase[0].split(';')[0].replace('data:', '')
	const byteCharacters = Utilities.base64Decode(splitBase[1])
  const img = Utilities.newBlob(byteCharacters, type)
        img.setName("gggg.png")
  
  /** Save image to drive */
  const folder = DriveApp.getFolderById('Your id folder') //change Id Folder
        folder.createFile(img)
  
  /** Send line notify */
  const msgData = {
    "imageFile": img,
    "message": "รายงานการตัดคะแนนพฤติกรรม"
    };    
  const options = {
    "method": "post",
    "payload": msgData,
    "headers": {
        "Authorization": "Bearer " + token
    }
  }
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);

}


function checkLogin( enteredUsername,enteredPassword ){
  const users = ssUser.getRange(2, 1, ssUser.getLastRow()-1, ssUser.getLastColumn()).getDisplayValues()
  Logger.log(users)

let loggedIn = false;
let rowx = 0
let displayName
let pic
for (let i = 0; i < users.length; i++) {
  let user = users[i];
  
  if (user[0] === enteredUsername && user[1] === enteredPassword) {
    loggedIn = true;
    displayName = user[2]
    pic = user[3]
    break;
  }
}
  
  let objLogin = {}
      objLogin.status = loggedIn
      objLogin.displayName = displayName
      objLogin.pic = pic

// Logger.log(rowx)
// if (loggedIn) {
//   console.log('Login successful!');
// } else {
//   console.log('Login failed');
// }
return objLogin
}




