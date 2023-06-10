<script>
import { useUserSessionStore } from './stores/usersession'
import Navigation from './components/Navigation.vue'

export default {
  name: "App",
  components: {
    Navigation
  },
  async mounted() {
    await useUserSessionStore().localLogin();
  },
};
</script>

<template>
  <navigation />
  <RouterView />
  <div class="w-100">
    <footer class="p-4">
      <p class="text-center text-body-secondary">© 2023 IT2A Group 2</p>
      <p class="text-center text-body-secondary">This is not InHolland's official website. This is an university project.
      </p>
      <p class="text-center text-body-secondary">If something doesn't work, <a
          href="https://www.youtube.com/watch?v=nqxVMLVe62U" target="_blank">Blame It on the Boogie.</a></p>
    </footer>
  </div>
</template>

<style>
body {
  min-height: 100vh;
  background-color: #EAEBF3;
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

.alert-fixed {
  position: fixed;
  top: 10px;
  left: 10px;
  width: 25rem;
  z-index: 100;
  animation: left-to-right 0.1s ease-out;
}

@-webkit-keyframes left-to-right {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(0%);
  }
}

.disabled {
  pointer-events: none;
  opacity: 0.4;
}

.btn {
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.25);
}

.btn:hover {
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.35);
}

.btn-primary {
  background-color: #632bb5;
  border-color: #632bb5;
}

.btn-primary:hover {
  background-color: #4e1f8c;
  border-color: #4e1f8c;
}

.btn-primary:active {
  background-color: #4e1f8c;
  border-color: #4e1f8c;
}

.btn-primary:focus {
  box-shadow: 0 0 0 0.2rem rgba(99, 43, 181, 0.5);
  background-color: #4e1f8c;
}
</style>
