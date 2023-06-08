<script setup>
import LimitsCard from "./dashboard/LimitsCard.vue";
import BalanceCard from "./dashboard/BalanceCard.vue";
import LatestTransactions from "./dashboard/LatestTransactions.vue";
import NoAccounts from "./dashboard/NoAccounts.vue";
</script>

<template>
  <section class="d-flex flex-column flex-grow-1">
    <div class="container">
      <div class="row">
        <h2 class="mt-3 mt-lg-5">Welcome, <strong class="accent">{{ user?.firstname }}</strong></h2>
      </div>
      <div class="row d-flex align-items-center">
        <div class="col d-inline" v-if="user?.current_account != null">
          <BalanceCard :user="this.user" :currencySymbol="this.currencySymbol" title="My Balance"
            :balance="user?.total_balance" iban="Total" :isPrimary=true />
          <BalanceCard :user="this.user" :currencySymbol="this.currencySymbol" title="Current Account"
            :balance="user?.current_account?.balance" :iban="user?.current_account?.IBAN" />
          <BalanceCard v-if="this.user?.saving_account != null" :user="this.user" :currencySymbol="this.currencySymbol"
            title="Saving Account" :balance="user?.saving_account?.balance" :iban="user?.saving_account?.IBAN" />
          <div v-else class="d-inline add-account" @click="showDialog()">
            <i class="bi bi-plus-circle-fill"></i>
          </div>
        </div>
        <div class="col d-inline" v-else>
          <NoAccounts />
        </div>
      </div>
      <div v-if="this.user?.current_account != null">
        <div class="row d-flex my-4 mx-1 justify-content-evenly">
          <LatestTransactions />
          <LimitsCard />
        </div>
      </div>
    </div>
    <dialog id="add-account-dialog">
      <div class="row">
        <h2>Need Saving Account?</h2>
      </div>
      <hr />
      <div class="row">
        <p>Contact our customer support to create your saving account!</p>
      </div>
      <div class="row d-flex justify-content-evenly">
        <button class="btn btn-primary w-25" @click="closeDialog()">Ok</button>
      </div>
    </dialog>
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
      axios.get(`/users/${useUserSessionStore().user_id}`)
        .then(response => {
          this.user = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    showDialog() {
      document.getElementById("add-account-dialog").showModal();
    },
    closeDialog() {
      document.getElementById("add-account-dialog").close();
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

<style scoped>
.color-warning {
  color: #ff0000;
}

.accent {
  color: #2c3782;
}

.add-account {
  color: #e6d8fa;
  font-size: 8rem;
  margin-left: 1rem;
  border-radius: 50%;
  transition: all 0.3s ease-in-out;
}

.add-account:hover {
  cursor: pointer;
  color: #2c3782;
}
</style>