import XLSX from 'xlsx';

export default {

    processXcel(inputFile) {

        const tempfilereader = new FileReader()
        return new Promise((resolve, reject) => {
            tempfilereader.onerror = () => {
                tempfilereader.abort()
                reject(new DOMException('Problem parsing input file.'))
            }

            tempfilereader.onload = (evt) => {
                let data = new Uint8Array(evt.target.result)
                let workbook = XLSX.read(data, { type: 'array'})
                const serialList = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1'])
                resolve(serialList)
            }

            tempfilereader.readAsArrayBuffer(inputFile)

        })

    }

}