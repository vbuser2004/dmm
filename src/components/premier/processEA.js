import ExcelJS from "exceljs/dist/es5/exceljs.browser";
// import { saveAs } from 'file-saver';

export default {

    async getEAData(workbook) {
        let worksheet = workbook.getWorksheet('EA NEW PLACEMENTS');
        let blankList = [1];
        let deviceList = [];
        let orderCount = 0;

        //const materialRow = worksheet.getRow(2);
        const materialCol = worksheet.getColumn('C');

        // save for future - if need to get 'address' of cell
        // worksheet.getRow(5).getCell(5)._address
        // worksheet.getCell('I4').value = billingMonth;
        // worksheet.getCell('H4').value = await this.getPriorMonth(billingMonth);

        materialCol.eachCell({ includeEmpty: true }, function(cell, rowNumber) {
            if(rowNumber > 1){
                if(cell.value === null){
                    blankList.push(rowNumber);
                }
            }
        })
        blankList.push(worksheet.rowCount + 1);
        // console.log('List: ' + blankList);
        // console.log('Length: ' + blankList[181]);
        // Cycle through array of null values to get device details
        let i; 
        for (i = 0; i < blankList.length - 1; i++) {
            let device = {
                itemList: []
            }                
            // First check to make sure not duplicate null values
            if(worksheet.getCell(`C${blankList[i] + 1}`).value !== null) {
                if(worksheet.getCell(`C${blankList[i] + 1}`).value.trim() !== '') {
                    if( (i+1) < blankList.length ){
                        orderCount++
                        // Get Header
                        device.number = worksheet.getCell(`F${blankList[i] + 1}`).value
                        device.location = worksheet.getCell(`I${blankList[i] + 1}`).value
                        device.department = worksheet.getCell(`J${blankList[i] + 1}`).value
                        device.room = worksheet.getCell(`K${blankList[i] + 1}`).value
                        device.address = worksheet.getCell(`L${blankList[i] + 1}`).value
                        device.city = worksheet.getCell(`M${blankList[i] + 1}`).value
                        device.state = worksheet.getCell(`N${blankList[i] + 1}`).value
                        device.zip = worksheet.getCell(`O${blankList[i] + 1}`).value
                        device.contact = worksheet.getCell(`P${blankList[i] + 1}`).value
                        device.phone = worksheet.getCell(`Q${blankList[i] + 1}`).value
                        device.orderCount = orderCount
                    }
                }
    
                let x;
                for (x = blankList[i] + 1; x < blankList[i+1]; x++){
                    device.itemList.push(worksheet.getCell(`C${x}`).value);
                }
                deviceList.push(device);
            }
        }
        return deviceList;

    },
    async getWorkbook(workbookFile) {

        const tempfilereader = new FileReader()
        tempfilereader.readAsArrayBuffer(workbookFile)

        return new Promise(resolve => {
            tempfilereader.onload = async () => {
                const buffer = tempfilereader.result;
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(buffer)
     
                resolve(workbook)
            }
        })
    }
}