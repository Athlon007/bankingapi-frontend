<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav"
        aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="nav" class="collapse navbar-collapse">
        <router-link to="/" class="navbar-brand">InHolland Bank</router-link>
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li class="nav-item">
            <router-link to="/dashboard" class="nav-link" active-class="active"
              v-if="this.user != null">Dashboard</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/transfer" class="nav-link" active-class="active"
              v-if="this.user != null">Transfer</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/account" class="nav-link" active-class="active"
              v-if="this.user != null">Account</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/transferlist" class="nav-link" active-class="active" v-if="this.user != null">Transfer
              List</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/usermanagement" class="nav-link" active-class="active"
              v-if="this.user != null && isEmployeeOrAdmin">User
              Management</router-link>
          </li>
        </ul>
        <ul class="navbar-nav">
          <div class="d-inline" v-if="this.user != null">
            <li class="nav-item d-inline">
              <router-link to="/settings" class="nav-link d-inline" active-class="active">My Account ({{
                this.user.firstname
              }} {{ this.user.lastname }})</router-link>
            </li>
            <li class="nav-item d-inline">
              <a class="nav-link d-inline" @click="logout">Logout</a>
            </li>
          </div>
          <div class="d-inline" v-else>
            <li class="nav-item d-inline">
              <router-link to="/register" class="nav-link d-inline" active-class="active">Register</router-link>
            </li>
            <li class="nav-item d-inline">
              <router-link to="/login" class="nav-link d-inline" active-class="active">Login</router-link>
            </li>
          </div>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useUserSessionStore } from "../stores/usersession.js";
import useEmitter from '../emitter.js';

export default {
  name: "Navigation",
  data() {
    return {
      isEmployeeOrAdmin: false,
      user: null
    };
  },
  methods: {
    logout() {
      useUserSessionStore().logout();
      this.$router.push("/login");
    },
    loadUser() {
      useUserSessionStore().getUser().then(user => {
        this.user = user;
        this.isEmployeeOrAdmin = user.role === "EMPLOYEE" || user.role === "ADMIN";
      });
    }
  },
  mounted() {
    useUserSessionStore().localLogin();
    this.isLoggedIn = useUserSessionStore().isAuthenticated;
    this.loadUser();

    useEmitter().on("login", user_id => {
      this.loadUser();
    });
  }
};
</script>

<style>
.nav-link:hover {
  cursor: pointer;
}
</style>