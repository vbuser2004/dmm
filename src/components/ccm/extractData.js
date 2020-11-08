// Extract data from csv file
const Papa = require('papaparse');


const getFileDetails = async (file) => {

    let fileInfo =  await getModelSerial(file.name)
    fileInfo.file = file;

    return fileInfo
}

async function getModelSerial(fileName) {

    const nameWords = fileName.split('_');

    const model = nameWords[1]
    const serial = nameWords[2].slice(0, nameWords[2].length - 2)
    const readDate = nameWords[3].slice(0, 8)
    const fileLocation = fileName
    //console.log(model + ' ' + serial + ' ' + readDate);

    return {
        model,
        serial,
        readDate,
        fileLocation,
        logData: []
    }


}


const getLogData = async (fileData) => {

    const tempfilereader = new FileReader()
    // const csvFile = tempfilereader.readAsText(fileData.file);
    // const csvData = csvFile.toString();
    let subList = []

    return new Promise(resolve => {
        tempfilereader.onload = (evt) => {
            console.log('File: ' + evt.target.result);
            Papa.parse(evt.target.result, {
                skipEmptyLines: true,
                delimiter: ',',
                dynamicTyping: true,
                header: true,
                complete: results => {
    
                    results.data.map(async (accountList) => {
                        // First assign values
                        const accountName = accountList['User Name']
                        const copyMono = accountList['Copy:Black & White:Pages used']
                        const copyColor = accountList['Copy:Full Color:Pages used']
                        const printMono = accountList['Printer:Black & White:Pages used']
                        const printColor = accountList['Printer:Full Color:Pages used']
    
                        if(copyMono + copyColor + printMono + printColor > 0) {
                            subList.push({accountName, copyMono, copyColor, printMono, printColor })
                        }  
                    })
                    
                    resolve(subList);
                }
            })
        }
        tempfilereader.readAsText(fileData.file);
    })

}

module.exports = {
    getFileDetails,
    getLogData
}