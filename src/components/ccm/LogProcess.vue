<template>
  <v-container>
    <v-container>
      <v-card outlined tile>
          <v-card-text>              
            <v-select 
                 v-model="billingMonth"
                  :items="selectMonths"
                  item-text="val"
                  item-value="id"
                  label="Billing Month"
                  title="Billing Month" 
                 placeholder="Select Billing Month" />
          <v-file-input
            ref="ccmBase"
            v-model="ccmBase"
            :clearable="true"
            @change="getccmBase"
            show-size
            label="Blank Base Meter Sheet"
            accept=".xlsx"
            placeholder="Select blank Base Meter Sheet File"
          ></v-file-input>

                <v-btn outlined class="mb-5" color="primary" @click="removeFiles"
                ><v-icon>mdi-close-circle-outline</v-icon> Clear All Files</v-btn
              >
               <v-btn outlined class="ml-4 mb-5" color="success" @click="processFiles" :disabled="fileCount == 0 || billingMonth == null">
                   <v-icon>mdi-check</v-icon> Process Files
               </v-btn>

                <div>
                    <h3>Files: {{ fileCount }} </h3>                    
                </div>


            <VueDropZone 
                ref="logDropZone"
                id="logDropZone"
                :options="getDropZoneOptions"
                :useCustomSlot="true"
                class="mt-10"
                v-on:vdropzone-files-added="filesAdded"
                v-on:vdropzone-removed-file="fileRemoved"
            >
             <div class="dropzone-custom-content">
                  <h3 class="dropzone-custom-title">
                    Drag and drop Log Files
                  </h3>
                  <div class="subtitle">
                    ...or click to select a file from your computer
                  </div>
                </div>
            </VueDropZone>          
          </v-card-text>
      </v-card>
    </v-container>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

  </v-container>
</template>

<script>
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import extractData from './extractData.js';
import createXlsx from './createXlsx.js';

export default {
    components: {
        VueDropZone: vue2Dropzone
    },
      data: () => ({
          overlay: false,
          ccmBase: null,
          fileCount: 0,
          billingMonth: null,
          baseWorkbook: null,
          fileList: [],
          selectMonths: [
            { id: "January", val: "January"},
            { id: "February", val: "February"},
            { id: "March", val: "March"},
            { id: "April", val: "April"},
            { id: "May", val: "May"},
            { id: "June", val: "June"},
            { id: "July", val: "July"},
            { id: "August", val: "August"},
            { id: "September", val: "September"},
            { id: "October", val: "October"},
            { id: "November", val: "November"},
            { id: "December", val: "December"},
            ]
  }),
  methods: {
      removeFiles() {
          this.$refs.logDropZone.removeAllFiles();
          this.fileCount = 0;
          this.billingMonth = null;
          this.ccmBase = null;

      },
      fileRemoved() {
          this.fileList = this.$refs.logDropZone.getQueuedFiles();
          this.fileCount = this.fileList.length
          if(this.fileCount == 0) {
            this.billingMonth = null;
          }
      },
      async getccmBase() {
      if (this.ccmBase != null) {
        this.overlay = true;
        this.baseWorkbook = await createXlsx.getWorkbook(this.ccmBase);
        this.overlay = false;
      }
    },
     async processFiles() {

      const completedData = await Promise.all(
        this.fileList.map(async (file) => {        
            const fileData = await extractData.getFileDetails(file);
            const log = await extractData.getLogData(fileData);
            fileData.logData = [...log];
            return fileData
        })
    )
   
   
      await createXlsx.genFile(this.baseWorkbook, completedData, this.billingMonth);
      this.removeFiles();

    },
    filesAdded() {
        this.fileList = this.$refs.logDropZone.getQueuedFiles();
        this.fileCount = this.fileList.length;

    }
  },
    computed: {
     getDropZoneOptions() {
      return {
        url: 'http://error.nolink',
        maxFileSize: 0.5,
        maxFiles: 100,
        addRemoveLinks: true,
        autoProcessQueue: false,
        acceptedFiles: 'text/csv, .csv'
      };
    }
    }

}
</script>