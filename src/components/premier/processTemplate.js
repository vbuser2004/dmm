// import ExcelJS from "exceljs/dist/es5/exceljs.browser";

export default {

    async fillInTemplate(workbook, eaData) {

        let worksheet = workbook.getWorksheet('SOV');

        // Pull out EA Data and insert into file
        worksheet.getCell('B13').value = this.checkIfNull(eaData.location) + ' - ' + this.checkIfNull(eaData.department);
        worksheet.getCell('B14').value = eaData.address;
        worksheet.getCell('B15').value = eaData.city + ', ' + eaData.state + '  ' + eaData.zip;
        worksheet.getCell('J13').value = this.checkIfNull(eaData.contact);
        worksheet.getCell('J14').value = this.checkIfNull(eaData.phone);

        let i; 
        let rowNum = 26;
        for (i = 0; i < eaData.itemList.length - 1; i++) {
            worksheet.getCell(`B${rowNum}`).value = eaData.itemList[i]
            rowNum++ 
        }        
        const newFile = workbook.xlsx.writeBuffer()
                    .then(function(data) {
                        const blob = new Blob([data], 
                        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })                                            
                        return { name: `Premier - ${eaData.orderCount}-${eaData.itemList[0]}.xlsx`, input: blob }
        })
        return newFile;
        
    },
    checkIfNull(item) {
        if(item) {
            return item;
        } else {
            return '';
        }

    }
}