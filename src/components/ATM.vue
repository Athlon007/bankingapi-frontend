<template>
  <section class="d-flex flex-column flex-grow-1">
    <div class="container">
      <div class="row">
        <h2 class="mt-3 mt-lg-5 text-center">INHOLLAND BANK ATM</h2>
      </div>

    </div>
    <div class="row my-4">
      <div class="col-md-6 offset-md-3">
        <div class="card p-4 atm-card">
          <h3 class="text-center mb-4">Withdraw or Deposit</h3>
          <div class="row" v-if="this.error">
            <div class="alert alert-danger">
              {{ this.error }}
            </div>
            <!-- <div class="row" v-if="this.transaction_successfull">
              <div class="alert alert-success">
                {{ this.transaction_message }}
              </div>
            </div> -->
          </div>
          <div class="account-info mb-4">
            <p class="text-center"><strong>Account Balance:</strong> {{ account?.balance.toFixed(2) }} {{ currencySymbol
            }}
            </p>
            <p class="text-center"><strong>IBAN:</strong> {{ account?.IBAN }}</p>
          </div>
          <form @submit.prevent="processTransaction">
            <div class="form-group">
              <label for="amount">Amount</label>
              <input type="number" step="0.01" min="0" class="form-control h5" id="amount" v-model="amount" placeholder="0.00" required>
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-primary btn-lg withdraw-btn"
                @click.prevent="processTransaction('withdraw')">Withdraw</button>
              <button type="submit" class="btn btn-primary btn-lg deposit-btn"
                @click.prevent="processTransaction('deposit')">Deposit</button>
            </div>
          </form>
          <div v-if="transaction_message" class="mt-4">
            <div v-if="transaction_successfull" class="alert alert-success">
              {{ transaction_message }}
            </div>
            <div v-else class="alert alert-danger">
              {{ transaction_message }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from '../axios_auth';
import { useUserSessionStore } from "../stores/usersession.js";

export default {
  name: "Account",
  data() {
    return {
      user: null,
      currency: "",
      amount: "",
      currencySymbol: "\u20AC",
      error: "",
      account: null,
      transaction_message: "",
      transaction_successfull: null
    };
  },
  mounted() {
    if (!useUserSessionStore().isAuthenticated) {
      this.$router.push("/login");
    }

    useUserSessionStore().getUser().then(user => {
      this.user = user;
      if (user.current_account == null) {
        this.$router.push("/accounts");
      }
      else {
        this.account = user.current_account;
      }
    });
  },
  methods: {
    getUserInformation() {
      axios
        .get("/users/" + this.user?.id)
        .then(response => {
          this.user = response.data;
          this.account = response.data.current_account;
        })
        .catch(error => {
          this.error = error.response.data.error_message;
        });
    },
    processTransaction(transactionType) {
      this.error = "";
      this.transaction_message = "";
      const transactionData = {
        IBAN: this.account?.IBAN,
        amount: this.amount,
        currencyType: this.account?.currency_type,
      };

      if (transactionType === "withdraw") {
        axios
          .post("transactions/withdraw", transactionData)
          .then(response => {
            this.getUserInformation();
            this.transaction_message = response.data.description;
            this.transaction_successfull = true;
          })
          .catch(error => {
            this.error = error.response.data.error_message;
            this.transaction_successfull = false;
          })
      } else if (transactionType === "deposit") {
        axios
          .post("/transactions/deposit", transactionData)
          .then(response => {
            this.getUserInformation();
            this.transaction_message = response.data.description;
            this.transaction_successfull = true;
          })
          .catch(error => {
            this.error = error.response.data.error_message;
            this.transaction_successfull = false;
          });
      }
    },
  }
};
</script>
<style>
.atm-card {
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.account-info {
  border-bottom: 1px solid #ddd;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.withdraw-btn {
  background-color: #dc3545;
  border-color: #dc3545;
  margin-top: 3%;
}

.deposit-btn {
  background-color: #28a745;
  border-color: #28a745;
  margin-top: 3%;
  margin-left: 3%;
}

.btn-lg {
  padding: 0.5rem 2rem;
  font-size: 1.25rem;
  line-height: 1.5;
  border-radius: 0.3rem;
}

.btn-lg:focus,
.btn-lg.focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.5);
}
</style>