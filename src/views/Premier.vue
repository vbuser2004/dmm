<template>
    <v-container>
      <v-card tile class="d-flex d-flex-row auto">
      <v-card outlined class="flex-grow-1 flex-shrink-0 align-self-start ma-2">
        <v-card-title>
          Upload Base Spreadsheets
        </v-card-title>
        <v-card-text>
          <v-file-input
            ref="eaedf"
            v-model="eaEDF"
            clearable
            @change="geteaEDF"
            show-size
            label="EA Spreadsheet"
            accept=".xlsx"
            placeholder="Select the EA Spreadsheet File"
          ></v-file-input>
          <v-divider></v-divider>
          <v-file-input
            ref="tfile"
            v-model="tfile"
            clearable
            @change="getTemplateFile"
            show-size
            label="Template File"
            accept=".xlsx"
            placeholder="Select the Order Template File"
          ></v-file-input>
              <v-container>
                <v-btn
                  class="ma-1"
                  :loading="processingDataFiles"
                  @click="processFiles"
                  :disabled="!eaData || !templateFile"
                  outlined
                  color="primary"
                >Process Meters</v-btn>
                <v-btn class="ma-1" @click="reset" outlined color="secondary">Reset</v-btn>
                          <div v-if="processingDataFiles" class="mt-2">
            <v-progress-linear :value="getPercentage()" color="success" height="20px">
                    <span class="white--text d-none d-md-inline">
                        File Progress {{ getPercentage() }}%
                    </span>
            </v-progress-linear>
          </div>
              </v-container>
        </v-card-text>
      </v-card>
      <v-card outlined tile class="ma-2" >
        <v-card-title>
          Details for Verification
        </v-card-title>
        <v-card-text>
          <p>Please review the list below after uploading the EA spreadsheet. The Device # column is what was entered in the EA
            spreadsheet, and the Count column is a running total. If these do not match
            there is a potential issue with the processing (and they are listed in red text).
            <span class="red--text">It is also recommended that you verify EACH spreadsheet prior to processing to confirm accuracy!</span>
          </p>
          <div v-if="eaData">
            <h3>Total Devices: {{ eaData.length }}</h3>
              <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          Device #
                        </th>
                        <th class="text-left">
                          Count
                        </th>
                        <th class="text-left">
                          Model
                        </th>
                        <th class="text-left">
                          Department
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(dev, idx) in eaData" :key="idx"
                        :class="getNum(dev.number) === dev.orderCount ? '' : 'red--text'"
                      >
                        <td>{{ dev.number }}</td>
                        <td>{{ dev.orderCount }}</td>
                        <td>{{ dev.itemList[0] }}</td>
                        <td>{{ dev.department }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                </div>
        </v-card-text>
      </v-card>
      </v-card>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    </v-container>
    
</template>
<script>
import processEA from '@/components/premier/processEA.js';
import processTemplate from '@/components/premier/processTemplate.js';
import { downloadZip } from 'client-zip/index.js';
import { saveAs } from 'file-saver';

export default {
    metaInfo: {
    title: "Premier"
  },
  data() {
    return {
      overlay: false,
      processingDataFiles: false,
      eaEDF: null,
      eaData: null,
      tfile: null,
      templateFile: null,
      currentNumber: 0,
      fileList: []
    } 
  },
  methods: {
      async geteaEDF() {
        // Get completed EA Spreadsheet
        if (this.eaEDF != null) {
            this.overlay = true;
            this.baseWorkbook = await processEA.getWorkbook(this.eaEDF);
            this.eaData = await processEA.getEAData(this.baseWorkbook);
            this.overlay = false;
        } else {
          this.eaData = null;
        }
    },
    async getTemplateFile() {
        // Get Premier Template File
        if(this.tfile){
          this.templateFile = await processEA.getWorkbook(this.tfile);
        }
    },
    async processFiles() {
      // Process data
      this.processingDataFiles = true;
      let i;
      for(i=0; i < this.eaData.length - 1; i++){
        this.fileList.push(await processTemplate.fillInTemplate(this.templateFile, this.eaData[i]));
        this.currentNumber = this.eaData[i].orderCount
      }

      const content = await downloadZip(this.fileList).blob()
      saveAs(content, "Premier Orders.zip");

      this.processingDataFiles = false;
    },
    reset() {
        this.tfile = null;
        this.templateFile = null;
        this.premierTemplate = null;
        this.eaEDF = null;
        this.eaData = null;
        this.overlay = false;
        this.processingDataFiles = false;
    },
    getNum(listNum) {
      if(listNum === null) {
        return 'NA'
      } else {
        return listNum
      }
    },
    getPercentage() { 
      const calcPercent = (
      (this.currentNumber /
          this.eaData.length) * 100
      ).toFixed(0);

      if(calcPercent > 0) {
         return calcPercent;
      } else {
        return 0;
      }
    }

  }

}
</script>