// import ExcelJS from "exceljs/dist/es5/exceljs.browser";
import { format } from "date-fns";

export default {

    async fillInTemplate(workbook, eaData, purchaseType, maintananceType) {
        // Get Worksheet from workbook
        let worksheet = workbook.getWorksheet('SOV');
        this.clearWorksheet(worksheet);

        // Add images for purchase and maintenance options
        const checkBoxBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAABuUlEQVQ4T2NkgIGd/7kZXr9jhvOJYYgK/WVwZ/wKUsoIVr/q439i9OFUE8bPyMgAcsmHj18oMkiAn4eRYclbPgYW5o8UGfTnLz/EIGYmog06587LsPThL4beGz8Rdv/9BzXoPwNRBh105WOwE2cBGxBz9CvD0vtQwxgZoAb9/U/QoK1OvAxeMmxwV2ht/MBw/eNfCJ+ZEWrQj794DVriwMsQrcwBN8R00weGM69/I7zGwczPyDDpLR8Dxx+4QW7SbAzl+lwMzts+gBW2mPAwVBtywTV5bPvAsPPpL9S4+cECNYj5F9ggXWEWhkvhImBFM699Zzj49CfDMlcBuKa8I58ZJl8Cpz9U8JcNZNBtPoZ/nGCDXOQ4GHYHCmNNCd3nvjCUHcYRAkzfoQb9YIeriNXhZljkKYRi2LIb3xmiN7/BndQ4fvIzMjTc5mNgZUWxqtSSn6HLEeKlrXe+M/iseoU/vf7+DTXoH2aC7HEXZjCTZmewm/eMcKJnAiVIkIu+/yOYjvCaxsnEz8hQ8oKb4e87yjItsxAPpBjJukxZMTJNlxFiEAjEXuRm+PedtIKNifMvw2J9cMICAOeEkqO9giZCAAAAAElFTkSuQmCC"
        const checkBox = workbook.addImage({
            base64: checkBoxBase64,
            extension: 'png',
          });

          if(purchaseType === 'lease') {
            worksheet.addImage(checkBox, {
                tl: { col: 11.7, row: 9.1 },
                ext: { width: 18, height: 18 }
              });
          } else {
            worksheet.addImage(checkBox, {
                tl: { col: 10.2, row: 9.1 },
                ext: { width: 18, height: 18 }
              });

          }

          if(maintananceType === 'cpc'){
            worksheet.addImage(checkBox, {
                tl: { col: 10.2, row: 17.1 },
                ext: { width: 18, height: 18 }
              });
          } else if(maintananceType === 'zone1') {
            worksheet.addImage(checkBox, {
                tl: { col: 10.2, row: 18.1 },
                ext: { width: 18, height: 18 }
              });
          } else {
            worksheet.addImage(checkBox, {
                tl: { col: 10.2, row: 19.1 },
                ext: { width: 18, height: 18 }
              });
          }

        // Pull out EA Data and insert into file
        worksheet.getCell('B13').value = this.checkIfNull(eaData.location) + ' - ' + this.checkIfNull(eaData.department);
        worksheet.getCell('B14').value = eaData.address;
        worksheet.getCell('B15').value = eaData.city + ', ' + eaData.state + '  ' + eaData.zip;
        worksheet.getCell('J13').value = this.checkIfNull(eaData.contact);
        worksheet.getCell('J14').value = this.checkIfNull(eaData.phone);
        worksheet.getCell('L6').value = format(Date.now(), "MM/dd/yyyy");

        let i; 
        let rowNum = 26;
        for (i = 0; i < eaData.itemList.length; i++) {
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

    },
    clearWorksheet(worksheet) {

        worksheet.getCell('B13').value = null;
        worksheet.getCell('B14').value = null;
        worksheet.getCell('B15').value = null;
        worksheet.getCell('J13').value = null;
        worksheet.getCell('J14').value = null;
        worksheet.getCell('L6').value = null;

        let i; 
        for (i = 26; i < 37; i++) {
            worksheet.getCell(`B${i}`).value = null;
        }                

    }
}