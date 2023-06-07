<template>
  <nav class="navbar navbar-expand-md navbar-dark nav-background">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav"
        aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="nav" class="collapse navbar-collapse">
        <router-link to="/" class="navbar-brand fw-bolder">InHolland Bank</router-link>
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li class="nav-item">
            <router-link to="/dashboard" class="nav-link" active-class="active" v-if="this.user != null"><i
                class="bi bi-house-door-fill"></i>Dashboard</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/transfer" class="nav-link" active-class="active" v-if="this.user != null"><i
                class="bi bi-send-fill"></i>Transfer</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/atm" class="nav-link" active-class="active" v-if="this.user != null"><i
                class="bi bi-credit-card-fill"></i>ATM</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/transactionhistory" class="nav-link" active-class="active" v-if="this.user != null"><i
                class="bi bi-clock-fill"></i>Transaction History
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/usermanagement" class="nav-link" active-class="active"
              v-if="this.user != null && isEmployeeOrAdmin"><i class="bi bi-kanban-fill"></i>User
              Management</router-link>
          </li>
        </ul>
        <ul class="navbar-nav">
          <div class="d-inline" v-if="this.user != null">
            <li class="nav-item d-inline">
              <router-link to="/settings" class="nav-link d-inline" active-class="active"><i
                  class="bi bi-person-fill"></i>My Account ({{
                    this.user.firstname
                  }} {{ this.user.lastname }})</router-link>
            </li>
            <li class="nav-item d-inline">
              <a class="nav-link d-inline" @click="logoutClick"><i class="bi bi-door-closed-fill"></i>Logout</a>
            </li>
          </div>
          <div class="d-inline" v-else>
            <li class="nav-item d-inline">
              <router-link to="/register" class="nav-link d-inline" active-class="active"><i
                  class="bi bi-person-fill-add"></i>Register</router-link>
            </li>
            <li class="nav-item d-inline">
              <router-link to="/login" class="nav-link d-inline" active-class="active"><i
                  class="bi bi-door-open-fill"></i>Login</router-link>
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
      this.user = null;
      this.isEmployeeOrAdmin = false;
    },
    logoutClick() {
      useUserSessionStore().logout();
      this.logout();
      this.$router.push("/");
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
    useEmitter().on("logout", () => {
      this.logout();
    });
  }
};
</script>

<style>
.nav-background {
  background-color: #2C3782;
}

.nav-link:hover {
  cursor: pointer;
}

.bi {
  margin-right: 0.3rem;
}
</style>