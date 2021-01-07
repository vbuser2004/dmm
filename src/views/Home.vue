<template>
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
</template>
<script>
import FileDrop from '@/components/FileDrop.vue';
import LogProcess from '@/components/ccm/LogProcess.vue'

export default {
  metaInfo: {
    title: "Home"
  },
    components: {
    FileDrop,
    LogProcess
  }
};
</script>
