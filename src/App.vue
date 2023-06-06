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
  <div class="w-100">
    <footer class="p-4">
      <p class="text-center text-body-secondary">© 2023 IT2A Group 2</p>
      <p class="text-center text-body-secondary">This website is not actually InHolland's website, instead it is an
        university project.</p>
      <p class="text-center text-body-secondary">If something doesn't work, <a
          href="https://www.youtube.com/watch?v=nqxVMLVe62U" target="_blank">Blame It on the Boogie.</a></p>
    </footer>
  </div>
</template>

<style>
body {
  min-height: 100vh;
  #background-color: #EAEBF3;
}

footer {
  color: white;
  background-color: #2C3782;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

dialog {
  border-width: 0px;
  border-radius: calc(5px * 3.14);
  box-shadow: 0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 1.6rem;
  max-width: 400px
}
</style>
