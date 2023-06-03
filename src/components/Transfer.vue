<template>
  <section>
    <div class="container">
      <h2 class="mt-3 mt-lg-5">Transfer money</h2>
    </div>
    <div class="container">
      <form v-if="user?.current_account != null" @submit.prevent="processTransfer">
        <div class="mb-3">
          <label for="from_account" class="form-label h5">Select your account</label>
          <select id="from_account" class="form-select" onchange="accountSelectChange(value)">
            <option value="1">Current account</option>
            <option value="2" v-if="user?.saving_account != null">Saving account</option>
          </select>
          <div class="d-flex flex-column pt-3">
            <div class="row">
              <span class="col-2 fw-bolder">IBAN:</span>
              <span class="col-10">{{ selectedAccount?.IBAN }}</span>
            </div>
            <div class="row">
              <span class="col-2 fw-bolder">Status:</span>
              <span class="col-10 fw-bold text-uppercase"
                    :class="selectedAccount?.isActive ? 'activeAccountText' : 'inactiveAccountText'">
              {{ selectedAccount?.isActive ? "Active" : "Inactive" }}</span>
            </div>
            <div class="row">
              <span class="col-2 fw-bolder">Balance:</span>
              <span class="col-10">€ {{ selectedAccount?.balance }}</span>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label for="amount" class="form-label h5">Amount</label>
          <div class="d-flex justify-content-center">
            <label for="amount" class="align-middle p-2 h5" style="padding-left: 0 !important;">&euro;</label>
            <input type="number" step="0.01" class="form-control h5" id="amount" placeholder="0.00" required>
          </div>
        </div>
        <div class="mb-3">
          <label for="to_iban" class="form-label h5">Beneficiary IBAN</label>
          <span> (NLxxINHO0xxxxxxxxx)</span>
          <input type="text" class="form-control" id="to_iban" placeholder="NLxxINHO0xxxxxxxxx"
                 pattern="^[A-Za-z]{2}[0-9]{2}[A-Za-z]{4}[0-9]{10}$" required>
        </div>
        <div class="alert alert-warning" role="alert" v-if="!selectedAccount?.isActive">
          The current account is inactive and cannot be used for transfers.
        </div>
        <div class="alert alert-danger" role="alert" v-if="errorOccurred">
          {{errorMessage}}
        </div>
        <div class="alert alert-success" role="alert" v-if="successfulTransfer">
          {{successMessage}}
        </div>
        <button type="submit" class="btn btn-primary" :disabled="!selectedAccount?.isActive">Transfer</button>
      </form>
      <div v-else class="h5">No accounts found.</div>
    </div>
  </section>
</template>

<script>
import { useUserSessionStore } from "@/stores/usersession";
import axios from "@/axios_auth";
import useEmitter from "@/emitter";

export default {
  name: "Transfer",
  data() {
    return {
      user: null,
      selectedAccount: null,
      errorOccurred: false,
      errorMessage: "",
      successfulTransfer: false,
      successMessage: ""
    };
  },
  mounted() {
    if (!useUserSessionStore().isAuthenticated) {
      this.$router.push("/login");
    }

    useUserSessionStore().getUser().then(user => {
      this.user = user;
      this.selectedAccount = this.user?.current_account;
    });

    useEmitter().on("login", user_id => {
      useUserSessionStore().getUser().then(user => {
        this.user = user;
        this.selectedAccount = this.user?.current_account;
      });
    });
  },
  methods: {
    accountSelectChange(value) {
      if (value === 1) {
        this.selectedAccount = this.user?.current_account;
      } else if (value === 2) {
        this.selectedAccount = this.user?.saving_account;
      }
    },
    processTransfer() {
      this.errorOccurred = false;
      this.successfulTransfer = false;

      axios.post("/transactions", {
        sender_iban: this.selectedAccount?.IBAN,
        receiver_iban: document.getElementById("to_iban").value,
        amount: document.getElementById("amount").value
      }).then(response => {
        this.successfulTransfer = true;
        this.successMessage = response.data.description;

        // Update account with new values
        this.updateAccount();
      }).catch(error => {
        this.errorOccurred = true;
        this.errorMessage = error.response.data.error_message;
      });
    },
    updateAccount() {
      return useUserSessionStore().getUser().then(user => {
        this.user = user;

        if (this.selectedAccount.id === this.user?.current_account.id) {
          this.selectedAccount = this.user?.current_account;
        } else if (this.selectedAccount.id === this.user?.saving_account.id) {
          this.selectedAccount = this.user?.saving_account;
        }
      });

    }
  }
};
</script>

<style></style>