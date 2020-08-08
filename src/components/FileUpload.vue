<template>
  <v-container>
    <v-container>
      <vue-dropzone
        ref="myVueDropzone"
        id="dropzone"
        :options="dropzoneOptions"
      ></vue-dropzone>
    </v-container>
    <v-container>
      <v-btn class="ma-2" outlined color="indigo">Outlined Button</v-btn>
    </v-container>
  </v-container>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';

export default {
  name: 'app',
  components: {
    vueDropzone: vue2Dropzone,
  },
  data: function() {
    return {
      dropzoneOptions: {
        url: 'http://httpbin.org/post',
        thumbnailWidth: 150,
        dictDefaultMessage: 'ADD FILES',
        autoProcessQueue: false,
        maxFilesize: 20,
        addRemoveLinks: true,
        headers: { 'My-Awesome-Header': 'header value' },
      },
    };
  },
};
</script>
