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
      <FileDrop/>
    </v-main>
    <v-footer
      color="indigo"
      app
    >
    </v-footer>
  </v-app>
</template>

<script>
import FileDrop from '@/components/FileDrop.vue'

export default {
  name: 'App',
  components: {
    FileDrop
  }
};
</script>
