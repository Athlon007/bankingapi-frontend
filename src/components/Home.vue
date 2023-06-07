<template>
  <section class="d-flex flex-column flex-grow-1 p-0 overflow-hidden">
    <div class="row pt-3">
      <img src="/logo.png" alt="logo" class="logo" />
      <h2 class="tagline">Taking 2300 {{ this.currencySymbol }} from you every year!</h2>
    </div>
    <div class="row">
      <div class="container navs">
        <RouterLink to="/register" class="btn btn-success">Register</RouterLink>
        <RouterLink to="/login" class="btn btn-light">Login</RouterLink>
      </div>
    </div>
    <div class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="/harolds/1-harold.webp" class="d-block w-100" alt="Harold my beloved">
        </div>
        <div class="carousel-item">
          <img src="/harolds/harold-0.webp" class="d-block w-100" alt="Harold my beloved">
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useUserSessionStore } from "../stores/usersession.js";

export default {
  name: "Home",
  data() {
    return {
      // EUR
      currencySymbol: "\u20AC"
    };
  },
  mounted() {
    if (useUserSessionStore().isAuthenticated) {
      this.$router.push("/dashboard");
    }
  },
};
</script>

<style scoped>
.logo {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  display: block;
}

.tagline {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #ca0288;
  margin-top: 1rem;
  font-style: italic;
}

.navs {
  text-align: center;
  margin-top: 2rem;
  padding: 1em;
}

.navs>* {
  margin: 0.5em;
}

.navs>a {
  font-size: 2em;
}

.carousel-inner,
.carousel-inner>.carousel-item>img {
  max-height: 800px;
}

.carousel-item>img {
  object-fit: cover;
}
</style>