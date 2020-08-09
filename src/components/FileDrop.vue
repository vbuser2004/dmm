<template> 
<v-container>
    <v-container>
        <v-card width="450px" outlined tile>
            <v-container>
                <v-file-input
                    ref="mrlist"
                    v-model="mrFile"
                    @change="getmrFile"
                    show-size
                    label="Blank MR List" 
                    accept=".xlsx"
                    placeholder="Select .xlsx File Provided By Customer">
                </v-file-input>
            </v-container>
            <v-subheader>{{ mrCount }}</v-subheader>
        </v-card>
    </v-container>
    <v-container>
        <v-card width="450px" outlined>
            <v-container>
                <v-file-input 
                    ref="micaslist"
                    v-model="micasFile"
                    @change="getmicasFile"
                    show-size
                    label="MICAS Meter List" 
                    accept=".xlsx, .xls, .csv"
                    placeholder="Select MICAS Device Status File">
                </v-file-input>             
            </v-container>
            <v-subheader>{{ micasCount }}</v-subheader>
        </v-card>
    </v-container>
    <v-container>
        <v-card width="450px" outlined>
            <v-container>
                <v-file-input 
                    ref="techlist"
                    v-model="techFile"
                    @change="gettechFile"
                    show-size
                    label="Technician Manual Meter File" 
                    accept=".xlsx, .xls, .csv"
                    placeholder="Select Tech Manual Meter File">
                </v-file-input>
            </v-container>
            <v-subheader>{{ techCount }}</v-subheader>
         </v-card>
    </v-container>
    <v-container>
        <v-btn class="ma-2" :disabled="isValidFiles" outlined color="indigo">Process Files</v-btn>
    </v-container>

    <v-container>
        <h2>Serial: {{ serial }} </h2>
        <v-text-field
            label="ID"
            v-model="id"
            @keyup.enter.native="getSerial"
          ></v-text-field>
          <v-btn @click="getSerial" color="green">Get Serial</v-btn>
    </v-container>
</v-container>
</template>

<script>
import processfiles from './processfiles';

export default {
  name: "app",
  data() {
      return { 
          mrFile: null,
          micasFile: null,
          techFile: null,
          id: null,
          serial: null,
          meterList: [],
          micasList: [],
          techList: [],
          mrCount: null,
          micasCount: null,
          techCount: null
      }
  },
  methods: {
    async getmrFile() {
        if(this.mrFile != null){
            this.meterList = await processfiles.processXcel(this.mrFile)
            console.log('Meters: ' + JSON.stringify(this.meterList))
            this.mrCount = `${this.meterList.length} total records`
        }
    },
    async getmicasFile() {
        if(this.micasFile != null){
            this.micasList = await processfiles.processXcel(this.micasFile)
            console.log('Micas: ' + JSON.stringify(this.micasList))
            this.micasCount = `${this.micasList.length} total records`
        }
    },
    async gettechFile() {
        if(this.techFile != null){
            this.techList = await processfiles.processXcel(this.techFile)
            console.log('TechList: ' + JSON.stringify(this.techList))
            this.techCount = `${this.techList.length} total records`
}
    },
        async getSerial(){
            let micasRecord = this.micasList.find(o => String(o['Machine ID']) === String(this.id))
            if(micasRecord){
                this.serial = micasRecord['Serial Number']
            } else {
                this.serial = 'Not Found'
            }            
        }
  },
  computed: {
       isValidFiles() {
        if(this.mrFile === null || this.micasFile === null || this.techFile === null) {
            return true
        } else {
            return false
        }
    }
  }
};
</script>