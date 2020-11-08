<template>
<v-app>
  <v-container>
    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-toolbar-title>Meter Organization</v-toolbar-title>

    </v-app-bar>
</v-container>
<v-main>
    <v-container>
      <v-layout row>
        <v-flex md4 pa-2 fill-height>
          <v-card elevation="2" outlined fill-height>
            <v-card-text>
              <FileDrop/>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex md4 pa-2 fill-height>
          <v-card elevation="2" outlined fill-height>
            <v-card-text>

              <LogProcess/>
            </v-card-text>
          </v-card>

    <v-footer color="primary" app> </v-footer>
        </v-flex>
       </v-layout>
    </v-container>
</v-main>
    <v-footer
      color="indigo"
      app
    >
    </v-footer>
  </v-app>
</template>

<script>
import FileDrop from '@/components/FileDrop.vue';
import LogProcess from '@/components/ccm/LogProcess.vue'

export default {
  name: 'App',
  components: {
    FileDrop,
    LogProcess
  }
};
</script>
