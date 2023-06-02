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
  <div class="container">
    <footer class="py-3 my-4">
      <ul class="nav justify-content-center border-bottom pb-3 mb-3">
        <li class="nav-item"><a href="#" class="nav-link px-2 text-body-secondary">Home</a></li>
        <li class="nav-item"><a href="#" class="nav-link px-2 text-body-secondary">Features</a></li>
        <li class="nav-item"><a href="#" class="nav-link px-2 text-body-secondary">Pricing</a></li>
        <li class="nav-item"><a href="#" class="nav-link px-2 text-body-secondary">FAQs</a></li>
        <li class="nav-item"><a href="#" class="nav-link px-2 text-body-secondary">About</a></li>
      </ul>
      <p class="text-center text-body-secondary">© 2023 IT2A Group I actually forgot</p>
      <p class="text-center text-body-secondary">This website is not actually InHolland's website, instead it is an
        university project.</p>
      <p class="text-center text-body-secondary">If something doesn't work, <a
          href="https://www.youtube.com/watch?v=nqxVMLVe62U" target="_blank">Blame It on the Boogie.</a></p>
    </footer>
  </div>
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
