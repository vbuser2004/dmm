<template>
    <v-container>
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


    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    </v-container>
    
</template>
<script>
import processEA from '@/components/premier/processEA.js';

export default {
    metaInfo: {
    title: "Premier"
  },
  data() {
    return {
      overlay: false,
      eaEDF: null
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
        // console.log('EA DATA: ' + JSON.stringify(this.eaData, null, ' ' ));
      }
    },
      async getTemplate() {
        // Get Premier Template File

      }
  }

}
</script>