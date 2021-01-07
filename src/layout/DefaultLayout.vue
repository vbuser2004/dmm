<template>
  <v-app>
    <NavBar />
    <v-container>
      <router-view></router-view>
    </v-container>
    <Footer />
  </v-app>
</template>

<script>
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

export default {
  name: "meterorganization",
  components: {
    NavBar,
    Footer
  }
};
</script>
