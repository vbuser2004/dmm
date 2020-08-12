<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-container>
        <h2>Meter Organization</h2>
      </v-container>
    </v-app-bar>

    <v-main>
      <FileDrop />
    </v-main>
    <v-footer color="primary" app> </v-footer>
  </v-app>
</template>

<script>
import FileDrop from '@/components/FileDrop.vue';

export default {
  name: 'App',
  components: {
    FileDrop,
  },
};
</script>
