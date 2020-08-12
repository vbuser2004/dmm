<template>
  <v-container>
    <v-container>
      <v-card width="450px" outlined tile>
        <v-container>
          <v-file-input
            ref="mrlist"
            v-model="mrFile"
            :clearable="false"
            @change="getmrFile"
            show-size
            label="Blank MR List"
            accept=".xlsx"
            placeholder="Select .xlsx File Provided By Customer"
          ></v-file-input>
        </v-container>
        <v-subheader v-show="mrCount">{{ mrCount }}</v-subheader>
      </v-card>
    </v-container>
    <v-container>
      <v-card width="450px" outlined>
        <v-container>
          <v-file-input
            ref="micaslist"
            :clearable="false"
            v-model="micasFile"
            @change="getmicasFile"
            show-size
            label="MICAS Meter List"
            accept=".xlsx, .xls, .csv"
            placeholder="Select MICAS Device Status File"
          ></v-file-input>
        </v-container>
        <v-subheader v-show="micasCount">{{ micasCount }}</v-subheader>
        <div>
          <v-progress-linear
            height="8px"
            color="green"
            :active="micasBar"
            indeterminate
          />
        </div>
      </v-card>
    </v-container>
    <v-container>
      <v-card width="450px" outlined>
        <v-container>
          <v-file-input
            ref="techlist"
            v-model="techFile"
            :clearable="false"
            @change="gettechFile"
            show-size
            label="Technician Manual Meter File"
            accept=".xlsx, .xls, .csv"
            placeholder="Select Tech Manual Meter File"
          ></v-file-input>
        </v-container>
        <v-subheader v-show="techCount">{{ techCount }}</v-subheader>
      </v-card>
    </v-container>
    <v-container>
      <v-btn
        class="ma-2"
        :loading="loading"
        @click="processMeters"
        :disabled="isValidFiles"
        outlined
        color="primary"
        >Process Meters</v-btn
      >
      <v-btn class="ma-2" @click="reset" outlined color="secondary"
        >Reset</v-btn
      >
    </v-container>
  </v-container>
</template>

<script>
import processfiles from './processfiles';

export default {
  name: 'app',
  data() {
    return {
      loading: false,
      mrFile: null,
      micasFile: null,
      techFile: null,
      meterList: [],
      micasList: [],
      techList: [],
      mrCount: null,
      micasCount: null,
      techCount: null,
      resultPackage: {},
      workbook: null,
      micasBar: false,
    };
  },
  methods: {
    async getmrFile() {
      this.mrCount = null;
      if (this.mrFile != null) {
        this.resultPackage = await processfiles.processXcel(this.mrFile);
        this.meterList = this.resultPackage.serialList;
        this.workbook = this.resultPackage.workbook;
        //console.log("Meters: " + JSON.stringify(this.meterList));
        this.mrCount = `${this.meterList.length.toLocaleString()} total records`;
      }
    },
    async getmicasFile() {
      this.micasCount = null;
      if (this.micasFile != null) {
        this.micasBar = true;
        this.resultPackage = await processfiles.processXcel(this.micasFile);
        this.micasList = this.resultPackage.serialList;
        //console.log('Micas: ' + JSON.stringify(this.micasList))
        this.micasBar = false;
        this.micasCount = `${this.micasList.length.toLocaleString()} total records`;
      }
    },
    async gettechFile() {
      this.techCount = null;
      if (this.techFile != null) {
        this.resultPackage = await processfiles.processXcel(
          this.techFile,
          true
        );
        this.techList = this.resultPackage.serialList;
        //console.log('TechList: ' + JSON.stringify(this.techList))
        this.techCount = `${this.techList.length.toLocaleString()} total records`;
      }
    },
    reset() {
      (this.mrFile = null),
        (this.micasFile = null),
        (this.techFile = null),
        (this.meterList = []),
        (this.micasList = []),
        (this.techList = []),
        (this.mrCount = null),
        (this.micasCount = null),
        (this.techCount = null),
        (this.loading = false);
    },
    processMeters() {
      this.loading = true;
      processfiles
        .updateXcel(
          this.workbook,
          this.meterList,
          this.micasList,
          this.techList
        )
        .then(() => {
          this.loading = false;
          this.reset();
        });
    },
  },
  computed: {
    isValidFiles() {
      if (
        this.mrFile === null ||
        this.micasFile === null ||
        this.techFile === null
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
