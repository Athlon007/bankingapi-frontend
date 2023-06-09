<script setup>
import LimitsCard from "./dashboard/LimitsCard.vue";
import BalanceCard from "./dashboard/BalanceCard.vue";
import LatestTransactions from "./dashboard/LatestTransactions.vue";
import NoAccounts from "./dashboard/NoAccounts.vue";
</script>

<template>
  <section class="d-flex flex-column flex-grow-1">
    <div class="container">
      <div class="row" v-if="isLoading">
        <div class="col my-4 d-inline">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h2 class="d-inline mx-2">Loading...</h2>
        </div>
      </div>
      <div v-else>
        <div class="row">
          <h2 class="mt-3 mt-lg-5">Welcome, <strong class="accent">{{ user?.firstname }}</strong></h2>
        </div>
        <div class="row d-flex align-items-center">
          <div class="col d-inline" v-if="user?.current_account != null">
            <BalanceCard title="My Balance" :balance="user?.total_balance" iban="Total" :isPrimary=true currency="EURO" />
            <BalanceCard title="Current Account" :balance="user?.current_account?.balance"
              :iban="user?.current_account?.IBAN" :currency="user?.current_account?.currency_type" />
            <BalanceCard v-if="user?.saving_account != null" title="Saving Account"
              :balance="user?.saving_account?.balance" :iban="user?.saving_account?.IBAN"
              :currency="user?.saving_account?.currency_type" />
            <div v-else class="d-inline add-account" @click="showDialog()">
              <i class="bi bi-plus-circle-fill"></i>
            </div>
          </div>
          <div class="col d-inline" v-else>
            <NoAccounts />
          </div>
        </div>
        <div v-if="user != null && user?.current_account != null">
          <div class="row d-flex my-4 mx-1 justify-content-evenly">
            <LatestTransactions />
            <LimitsCard />
          </div>
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
    LimitsCard,
    BalanceCard,
    LatestTransactions,
    NoAccounts
  },
  data() {
    return {
      user: null,
      isLoading: true
    };
  },
  methods: {
    loadUser() {
      axios.get(`/users/${useUserSessionStore().user_id}`)
        .then(response => {
          this.user = response.data;
          this.isLoading = false;
        })
        .catch(error => {
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