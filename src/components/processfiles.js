import XLSX from 'xlsx';
import moment from 'moment';

export default {

    processXcel(inputFile, useDefVal = false) {
        let serialList = null
        const tempfilereader = new FileReader()
        return new Promise((resolve, reject) => {
            tempfilereader.onerror = () => {
                tempfilereader.abort()
                reject(new DOMException('Problem parsing input file.'))
            }

            tempfilereader.onload = (evt) => {
                let data = new Uint8Array(evt.target.result)
                let workbook = XLSX.read(data, { type: 'array'})
                if(useDefVal){
                    serialList = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1'], {defval: ''})
                } else {
                    serialList = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1'])                        
                }

                resolve({ serialList, workbook })
            }

            tempfilereader.readAsArrayBuffer(inputFile)

        })

    },
    updateXcel(workbook, meterList, micasList, techList ) {

        const recordCount = meterList.length

        let counter = 2

        return new Promise((resolve) => {

            // Get Worksheet from Workbook
                let worksheet = workbook.Sheets['Sheet1']
                let range = {s: {r:0, c: 0}, e: {r: (recordCount + 10), c: 12}}
                worksheet['!ref'] = XLSX.utils.encode_range(range)

                do {
                    let sscell = 'F' + String(counter)
                    let nscell = 'F' + String(counter+1)
                    let escell = 'E' + String(counter)
                    let searchSerial, nextSerial, micasMeter, searchId, mm = null
                    if(worksheet[sscell] !== undefined){
                        searchId = worksheet[escell].v.toString()
                        searchSerial = worksheet[sscell].v.toString()
                    }
                    if(worksheet[nscell] !== undefined){
                        nextSerial = worksheet[nscell].v.toString()
                    }
                 
                    if(searchSerial != null || undefined){

                        if(searchSerial.charAt(0) === '0'){
                            mm = micasList.filter(x => x['Serial Number'].toString() == searchSerial.substring(1))
                        } else {
                            mm = micasList.filter(x => x['Serial Number'].toString() == searchSerial)
                        } 
                    }

                    if(mm != undefined && mm.length > 0){
                        if(mm.length > 1) {
                            micasMeter = mm.find(x => x['Machine Code'] == searchId)
                        } else {
                            micasMeter = mm[0]
                        }


                        let lscell = 'L' + String(counter)
                        let lncell = 'L' + String(counter+1)
                        if(nextSerial == searchSerial){
                            let monocell = { v: micasMeter['Monochrome Count'], t:'n'}
                            let colorcell = { v: micasMeter['Color Count'], t:'n'}
                            worksheet[lscell] = monocell
                            worksheet[lncell] = colorcell
                            counter = counter + 2
                        } else {
                            let monocell = { v: micasMeter['Monochrome Count'], t:'n'}
                            worksheet[lscell] = monocell
                            counter++
                        }
                    } else {
                        counter++
                    }
                }

                while(counter <= (recordCount + 1) )

                // Process Tech Meter List
                techList.forEach((read) => {
                    const serialToSearch = read.Serial
                    const results = meterList.filter(x => String(x['Serial #']) == serialToSearch)
                    if(results.length > 0){
                        const monoMeter = read['Current Mono']
                        const colorMeter = read['Current Color']
                        if(results.length == 1){ //mono only
                            if(results[0]['Row #'] !== undefined) {
                                const rowNumMono = results[0]['Row #']
                                const mcell = 'L' + String(rowNumMono+1)
                                worksheet[mcell] = { v: monoMeter, t:'n'}
                            }
                        } else { //mono and color
                            if(results[0]['Row #'] !== undefined && results[1]['Row #'] !== undefined) {
                                const rowNumMono = results[0]['Row #']
                                const rowNumColor = results[1]['Row #']
                                const mcell = 'L' + String(rowNumMono+1)
                                const ccell = 'L' + String(rowNumColor+1)
                                worksheet[mcell] = { v: monoMeter, t:'n'}
                                worksheet[ccell] = { v: colorMeter, t:'n'}
                            }
                        }
                    }
                })
                resolve(XLSX.writeFile(workbook, `SHARP COMPLETED MR List ${moment().format('MMMM YYYY')}.xlsx`))
            })
    }
}