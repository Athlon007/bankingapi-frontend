<script setup>
import LimitsCard from "./users/LimitsCard.vue";
</script>

<template>
  <section class="d-flex flex-column flex-grow-1">
    <div class="container">
      <div class="row">
        <h2 class="mt-3 mt-lg-5">Welcome, {{ user?.firstname }}</h2>
      </div>
      <div v-if="user?.current_account == null && user?.saving_account == null">
        <div class="card" v-if="user?.role === 'USER'">
          <p>Sorry, you must wait for an employee to open your account.</p>
        </div>
        <div class="card" v-else="user?.role === 'EMPLOYEE'">
          <p>Go into Account management to create an account.</p>
        </div>
      </div>
      <div v-else>
        <div class="row my-4">
          <div class="card">
            <h3 class="d-inline">Total Balance</h3>
            <h4 class="fw-bold d-inline">{{ user?.total_balance }} {{ currencySymbol }}</h4>
          </div>
        </div>
        <div class="row my-2 gx-4">
          <div class="col px-0">
            <div class="card p-2" v-if="user?.current_account != null">
              <h3>Current Account</h3>
              <p>{{ user?.current_account.IBAN }}</p>
              <h4 class="fw-bold">{{ user?.current_account.balance }} {{ currencySymbol }}</h4>
              <p class="color-warning" v-if="user?.current_account.isActive == false">This account has been deactivated.
                Contact customer
                support.</p>
            </div>
          </div>
          <div class="col" v-if="user?.saving_account != null">
            <div class="card p-2">
              <h3>Saving Account</h3>
              <p>{{ user?.saving_account.IBAN }}</p>
              <h4 class="fw-bold">{{ user?.saving_account.balance }} {{ currencySymbol }}</h4>
              <p class="color-warning" v-if="user?.saving_account.isActive == false">This account has been deactivated.
                Contact customer
                support.</p>
            </div>
          </div>
        </div>
        <hr />
        <div class="row my-4">
          <div class="col">
            <LimitsCard />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useUserSessionStore } from "../stores/usersession.js";
import useEmitter from '../emitter.js';
import axios from "../axios_auth";

export default {
  name: "Home",
  components: {
    LimitsCard
  },
  data() {
    return {
      user: null,
      // EUR
      currencySymbol: "\u20AC"
    };
  },
  methods: {
    loadUser() {
      console.log(useUserSessionStore().user_id);
      axios.get(`/users/${useUserSessionStore().user_id}`)
        .then(response => {
          this.user = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  mounted() {
    if (!useUserSessionStore().isAuthenticated) {
      this.$router.push("/login");
      return;
    }

    this.loadUser();

    useUserSessionStore().getUser().then(user => {
      this.loadUser();
    });

    useEmitter().on("login", user_id => {
      useUserSessionStore().getUser().then(user => {
        this.loadUser();
      });
    });
  },
};
</script>

<style>
.color-warning {
  color: #ff0000;
}
</style>