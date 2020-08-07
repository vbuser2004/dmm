<template>
  <v-app>

    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-toolbar-title>Meter Organization</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <FileUpload/>
    </v-main>
    <v-footer
      color="indigo"
      app
    >
    </v-footer>
  </v-app>
</template>

<script>

import FileUpload from '@/components/FileUpload.vue'

export default {
  name: 'App',
  components: {
    FileUpload
  }
};
</script>
