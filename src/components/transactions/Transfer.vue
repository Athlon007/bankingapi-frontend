<template>
  <section class="d-flex flex-column flex-grow-1">
    <div class="container">
      <h2 class="pt-3">Transfer money</h2>
    </div>
    <div class="container card my-3 p-3">
      <div v-if="userPerforming?.role === 'EMPLOYEE' || userPerforming?.role === 'ADMIN'" class="border-1 border p-3 mb-4">
        <h5>Perform authorized transaction</h5>
        <select id="userSelection" class="form-control mb-2" @change="targetSelectChange">
          <option value="forMyself">For myself</option>
          <option value="forUser">For a user</option>
        </select>
        <form v-if="forSomeoneElse" @submit.prevent="retrieveUserInformation">
          <label for="userID" class="form-label h5">User ID</label>
          <input id="userID" type="number" min="0" class="form-control mb-3" v-model="userId">
          <button class="btn btn-primary" type="submit">Retrieve accounts</button>
        </form>
      </div>
      <form v-if="user?.current_account != null || user?.saving_account != null" @submit.prevent="processTransfer">
        <div class="mb-3">
          <label for="from_account" class="form-label h5 fw-bolder">Select an account</label>
          <select id="from_account" class="form-select" @change="accountSelectChange">
            <option value="1">Current account ({{user?.current_account.IBAN}})</option>
            <option value="2" v-if="user?.saving_account != null">Saving account ({{user?.saving_account.IBAN}})</option>
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
              <span class="col-10">€ {{ selectedAccount?.balance.toFixed(2) }}</span>
            </div>
            <div class="row">
              <span class="col-2 fw-bolder">Abs. Limit:</span>
              <span class="col-10">€ {{ selectedAccount?.absolute_limit.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label for="amount" class="form-label h5">Amount</label>
          <div class="d-flex justify-content-center">
            <label for="amount" class="align-middle p-2 h5" style="padding-left: 0 !important;">&euro;</label>
            <input type="number" step="0.01" min="0" class="form-control h5" id="amount" placeholder="0.00" required>
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
        <div class="alert alert-success" role="alert" v-if="successfulTransfer">
          {{successMessage}}
        </div>
        <button type="submit" class="btn btn-primary" :disabled="!selectedAccount?.isActive">Transfer</button>
      </form>
      <div v-else class="h5">No accounts found.</div>
      <div class="alert alert-danger mt-3" role="alert" v-if="errorOccurred">
        {{errorMessage}}
      </div>
    </div>
  </section>
</template>

<script>
import { useUserSessionStore } from "@/stores/usersession";
import axios from "@/axios_auth";
import {nextTick} from "vue";

export default {
  name: "Transfer",
  data() {
    return {
      userPerforming: null,
      user: null,
      forSomeoneElse: false,
      userId: 0,
      selectedAccount: null,
      errorOccurred: false,
      errorMessage: "",
      successfulTransfer: false,
      successMessage: ""
    };
  },
  async mounted() {
    if (!useUserSessionStore().isAuthenticated) {
      this.$router.push("/login");
    }

    await axios.get("/users/"+ useUserSessionStore().user_id).then(
      response => {
        this.userPerforming = response.data;
        this.user = response.data;
        this.userId = response.data.id;

        if (this.user?.current_account != null) {
          this.selectedAccount = this.user?.current_account;
        } else if (this.user?.saving_account != null) {
          this.selectedAccount = this.user?.saving_account;
        } else {
          this.selectedAccount = null;
        }
      }
    ).catch(error => {
      this.errorOccurred = true;
      this.errorMessage = error.response.data.error_message;
    });
  },
  methods: {
    setSelfTransfer() {
      this.forSomeoneElse = false;
      this.user = this.userPerforming;
      this.userId = this.user.id;

      if (this.user?.current_account != null) {
        this.selectedAccount = this.user?.current_account;
      } else if (this.user?.saving_account != null) {
        this.selectedAccount = this.user?.saving_account;
      } else {
        this.selectedAccount = null;
      }
    },
    setSomeoneElseTransfer() {
      this.forSomeoneElse = true;
      this.user = null;
      this.userId = 0;
    },
    targetSelectChange(event) {
      this.errorOccurred = false;
      this.successfulTransfer = false;

      if (event.target.value == "forMyself") {
        this.setSelfTransfer();
      } else if (event.target.value == "forUser") {
        this.setSomeoneElseTransfer();
      }
    },
    accountSelectChange(event) {
      if (event.target.value == 1) {
        this.selectedAccount = this.user?.current_account;
      } else if (event.target.value == 2) {
        this.selectedAccount = this.user?.saving_account;
      }
    },
    retrieveUserInformation() {
      this.successfulTransfer = false;
      this.errorOccurred = false;


      this.getUserInformation();
      if (this.selectedAccount != null) {
        document.getElementById("to_iban").value = "";
        document.getElementById("amount").value = "0.00";
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
        // Update account with new values
        this.getUserInformation();

        this.successfulTransfer = true;
        this.successMessage = response.data.description;
      }).catch(error => {
        this.errorOccurred = true;
        this.errorMessage = error.response.data.error_message;
      });
    },
    getUserInformation() {
      this.user = null;
      this.selectedAccount = null;

      axios.get("/users/" + this.userId)
          .then(response => {
            this.user = response.data;
            if (this.user?.current_account != null) {
              this.selectedAccount = this.user?.current_account;
            } else if (this.user?.saving_account != null) {
              this.selectedAccount = this.user?.saving_account;
            } else {
              this.selectedAccount = null;
            }
          })
          .catch(error => {
            this.successfulTransfer = false;
            this.errorOccurred = true;
            this.errorMessage = error.response.data.error_message;
          });
    }
  }
};
</script>

<style>
section {
  padding-bottom: 3em;
}

.frame {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 20px;
}

@media (max-width: 768px) {
  .frame {
    border-radius: 0px;
  }
}
</style>