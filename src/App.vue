<script>
import { useUserSessionStore } from './stores/usersession'
import Navigation from './components/Navigation.vue'

export default {
  name: "App",
  components: {
    Navigation
  },
  mounted() {
    useUserSessionStore().localLogin();
  },
};
</script>

<template>
  <navigation />
  <RouterView />
</template>

<style>
dialog {
  border-width: 0px;
  border-radius: calc(5px * 3.14);
  box-shadow: 0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 1.6rem;
  max-width: 400px
}
</style>
