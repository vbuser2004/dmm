const ExcelJS = require('exceljs');
const xref = require('./xref.json')

const genFile = async (completedData, billingMonth) => {

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('./ccm-base.xlsx');

    let worksheet = workbook.getWorksheet('Monthly Detail');

    let accountList = []
    let serialList = []

    const accountRow = worksheet.getRow(2);
    const serialCol = worksheet.getColumn('C');

    //save for future - if need to get 'address' of cell
    //worksheet.getRow(5).getCell(5)._address

    worksheet.getCell('I4').value = billingMonth;
    worksheet.getCell('H4').value = await getPriorMonth(billingMonth);

    accountRow.eachCell(function(cell, colNumber) {
        
        if(colNumber > 10 && colNumber < 144 ) {
            accountList.push({ account: cell.value, c: colNumber });
        }

    })

    accountList.map((item, idx) => {
        if (idx < accountList.length -1){
            if(item.account === accountList[idx + 1 ].account ) {
                accountList.splice(idx + 1, 1);
            }
        }
    })

    serialCol.eachCell(function(cell, rowNumber) {
        if(rowNumber > 4 && rowNumber < 159) {

            if(cell.value !== 'SERIAL' || cell.value !== null){
                if(worksheet.getRow(rowNumber + 1).getCell('D').value  === 'COLOR'){
                    serialList.push({
                        model: worksheet.getRow(rowNumber).getCell('B').value,
                        serial: cell.value, 
                        color: true,
                        r: rowNumber
                   })
                } else {
                    serialList.push({
                        model: worksheet.getRow(rowNumber).getCell('B').value,
                        serial: cell.value, 
                        color: false,
                        r: rowNumber
                   })
                }
        }
       }
    })

    serialList.map((device, idx) => {
        if(!device.serial){
            serialList.splice(idx, 1)
        }
    })
  
    return new Promise(resolve => {

        completedData.map(async (device) => {
            const serialObj = serialList.filter(obj => obj.serial == device.serial);
            
            device.logData.map(async (accMeters) => {
                const searchXRef = xref.find(obj => obj.sub == accMeters.accountName)
                let accountObj = []

                if(searchXRef){
                     accountObj = accountList.filter(obj => obj.account.toLowerCase() == searchXRef.accountName.toLowerCase())
                }else {
                     accountObj = accountList.filter(obj => obj.account.toLowerCase() == accMeters.accountName.toLowerCase() );
                }

                // Now enter the meter data
                if(accountObj.length > 0){

                    const monoRow = worksheet.getRow(serialObj[0].r);
                    const colorRow = worksheet.getRow(serialObj[0].r + 1);

                    if(!serialObj[0].color){
                        monoRow.getCell(accountObj[0].c).value = accMeters.copyMono;
                        monoRow.getCell(accountObj[0].c + 1).value = accMeters.printMono;
                    } else {
                        monoRow.getCell(accountObj[0].c).value = accMeters.copyMono;
                        monoRow.getCell(accountObj[0].c + 1).value = accMeters.printMono;
                        colorRow.getCell(accountObj[0].c).value = accMeters.copyColor;
                        colorRow.getCell(accountObj[0].c + 1).value = accMeters.printColor;
                    }
                } else {
                    console.log('Missing: ' + device.serial + ' - ' + JSON.stringify(accMeters))
                }
            })
        })

        resolve(workbook.xlsx.writeFile(`Chatham County Meters - ${billingMonth}.xlsx`))

    })

}

const getPriorMonth = async (billingMonth) =>{
    
    if(billingMonth === 'January') return 'December'
    if(billingMonth === 'February') return 'January'
    if(billingMonth === 'March') return 'February'
    if(billingMonth === 'April') return 'March'
    if(billingMonth === 'May') return 'April'
    if(billingMonth === 'June') return 'May'
    if(billingMonth === 'July') return 'June'
    if(billingMonth === 'August') return 'July'
    if(billingMonth === 'September') return 'August'
    if(billingMonth === 'October') return 'September'
    if(billingMonth === 'November') return 'October'
    if(billingMonth === 'December') return 'November'

}


module.exports = {
    genFile
}