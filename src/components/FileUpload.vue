<template>
  <v-container>
    <v-container>
     <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>
    </v-container>
    <v-container>
      <v-btn class="ma-2" @click="getfiletext" outlined color="indigo">Get File List</v-btn>
    </v-container>
  </v-container>
</template>

<script>
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import processfiles from './processfiles';

export default {
  name: "app",
  components: {
    vueDropzone: vue2Dropzone,
  },
  data: function () {
    return {
      dropzoneOptions: {
        url: null,
        thumbnailWidth: 150,
        dictDefaultMessage: "ADD FILES",
        maxFilesize: 15,
        autoProcessQueue: false,
        duplicateCheck: true,
        maxFiles: 3,
        addRemoveLinks: true,
      },
    };
  },
  methods: {
    async getfiletext() {
        let myfiles = this.$refs.myVueDropzone.getQueuedFiles();
        const meterSearchList = await processfiles.processXcel(myfiles[0])
        console.log('Meters: ' + JSON.stringify(meterSearchList))
        this.$refs.myVueDropzone.processQueue();
        this.$refs.myVueDropzone.removeAllFiles();
    }
  },
};
</script>
