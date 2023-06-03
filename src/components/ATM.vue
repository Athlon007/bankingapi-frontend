<template>
  <section>
    <div class="container">
      <div class="row">
        <h2 class="mt-3 mt-lg-5 text-center">INHOLLAND BANK ATM</h2>
      </div>
      <div class="row my-4">
        <div class="col-md-6 offset-md-3">
          <div class="card p-4 atm-card">
            <h3 class="text-center mb-4">Withdraw or Deposit</h3>
            <div class="account-info mb-4">
              <p class="text-center"><strong>Account Balance:</strong> {{ user?.current_account.balance }} {{ user?.current_account.currency_type }}</p>
              <p class="text-center"><strong>IBAN:</strong> {{ user?.current_account.IBAN }}</p>
            </div>
            <form @submit.prevent="processTransaction">
              <div class="form-group">
                <label for="amount">Amount</label>
                <input type="number" id="amount" class="form-control" v-model="amount" required>
              </div>
              <div class="text-center">
                <button type="submit" class="btn btn-primary btn-lg withdraw-btn">Withdraw</button>
                <button type="submit" class="btn btn-primary btn-lg deposit-btn">Deposit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useUserSessionStore } from "../stores/usersession.js";

export default {
    name: "Account",
    data() {
        return {
            user: null,
            amount: 0,
            currency: "EURO",
            iban: "",
        };
    },
    mounted() {
        if (!useUserSessionStore().isAuthenticated) {
            this.$router.push("/login");
        }

        useUserSessionStore().getUser().then(user => {
            this.user = user;
        });
    },

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

.btn-lg:focus, .btn-lg.focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.5);
}
</style>