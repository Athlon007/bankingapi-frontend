<template>
  <section class="d-flex flex-column flex-grow-1">
    <div class="container">
      <h2 class="pt-3">Transaction History</h2>
    </div>
    <div class="container border border-1 p-3 card">
      <div class="pb-3 row">
        <span class="fw-bolder col-lg-2">Transaction type: </span>
        <select class="col" style="max-width: 10em;" @change="changeTransactionType">
          <option value="ALL">All</option>
          <option value="TRANSACTION">Transaction</option>
          <option value="DEPOSIT">Deposit</option>
          <option value="WITHDRAWAL">Withdrawal</option>
        </select>
      </div>
      <div class="pb-3 row">
        <span class="fw-bolder col-lg-2">Filter by: </span>
        <select class="col" style="max-width: 10em;" @change="changeFilterType">
          <option value="TransactionID">Transaction ID</option>
          <option value="IBAN">IBANs</option>
          <option value="UserID">User IDs</option>
        </select>
      </div>
      <form @submit.prevent="getFilteredTransactions">
        <div class="pb-3">
          <div v-if="filterByTransactionID" class="row">
            <div class="col">
              <label for="transactionID" class="fw-bolder">Transaction ID</label>
              <input id="transactionID" type="number" min="0" class="m-2 mx-0 w-100"
                     v-model="transactionID">
            </div>
            <div class="col"></div>
          </div>
          <div v-if="filterByIBANs" class="row">
            <div class="col">
              <label for="senderIBAN" class="fw-bolder">Sender IBAN</label>
              <input id="senderIBAN" type="text" pattern="^[A-Za-z]{2}[0-9]{2}[A-Za-z]{4}[0-9]{10}$" class="m-2 mx-0 w-100"
                     v-model="ibanSender">
            </div>
            <div class="col">
              <label for="receiverIBAN" class="fw-bolder">Receiver IBAN</label>
              <input id="receiverIBAN" type="text" pattern="^[A-Za-z]{2}[0-9]{2}[A-Za-z]{4}[0-9]{10}$" class="m-2 mx-0 w-100"
                     v-model="ibanReceiver">
            </div>
          </div>
          <div v-if="filterByUserIDs" class="row">
            <div class="col">
              <label for="senderID" class="fw-bolder">Sender ID</label>
              <input id="senderID" type="number" min="0" v-model="userSenderID" class="m-2 mx-0 w-100">
            </div>
            <div class="col">
              <label for="receiverID" class="fw-bolder">Receiver ID</label>
              <input id="receiverID" type="number" min="0" v-model="userReceiverID" class="m-2 mx-0 w-100">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label for="minAmount" class="fw-bolder">Minimum Amount</label>
            <input id="minAmount" type="number" step="0.01" min="0" placeholder="0.00" v-model="minAmount" class="m-2 mx-0 w-100">
          </div>
          <div class="col">
            <label for="minAmount" class="fw-bolder">Maximum Amount</label>
            <input id="minAmount" type="number" step="0.01" min="0" placeholder="0.00" v-model="maxAmount" class="m-2 mx-0 w-100">
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label for="startDate" class="fw-bolder">Start Date</label>
            <input id="startDate" type="date" v-model="startDate" class="m-2">
          </div>
          <div class="col">
            <label for="endDate" class="fw-bolder">End Date</label>
            <input id="endDate" type="date" v-model="endDate" class="m-2">
          </div>
        </div>
        <button class="btn btn-primary" type="submit">Filter</button>
      </form>
      <div class="alert alert-danger mt-3" role="alert" v-if="errorOccurred">
        {{errorMessage}}
      </div>
    </div>
    <div class="container card mt-4">
      <div class="table-responsive">
        <table class="table table-hover">
          <thead class="thead-light">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Type</th>
            <th scope="col">Performer</th>
            <th scope="col">Sender IBAN</th>
            <th scope="col">Receiver IBAN</th>
            <th scope="col">Amount</th>
            <th scope="col">Timestamp</th>
            <th scope="col">Description</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="transaction in transactions">
            <th scope="row">{{ transaction.id }}</th>
            <td>{{ transaction.transactionType }}</td>
            <td>{{ transaction.username }}</td>
            <td>{{ transaction.sender_iban }}</td>
            <td>{{ transaction.receiver_iban }}</td>
            <td class="fw-bold" :class="isTransactionAddingMoney(transaction) ? 'positive' : isOwnTransaction(transaction) ? '' : 'negative'">
              {{ transaction.amount.toFixed(2) }} {{currencySymbol}}</td>
            <td>{{ formatDate(transaction.timestamp) }}</td>
            <td>{{ transaction.description }}</td>
          </tr>
          </tbody>
        </table>
        <!-- Pagination -->
        <p v-if="transactions.length === 0">No results found.</p>
        <div v-if="transactions.length > 0 || page > 0">
          <p>Page: {{page}}</p>
          <button class="btn btn-primary mb-3" v-if="page > 0" @click="pageBack"> &#60; </button>
          <button class="btn btn-primary mx-2 mb-3" v-if="transactions.length === limit" @click="pageForward"> &#62; </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useUserSessionStore } from "@/stores/usersession";
import axios from "@/axios_auth";
import moment from "moment";

export default {
  name: "TransferHistoryList",
  data() {
    return {
      user : null,
      transactions: [],
      errorOccurred: false,
      errorMessage : "",
      filterByTransactionID: true,
      filterByIBANs: false,
      filterByUserIDs: false,
      transactionType: null,
      page: 0,
      limit: 5,
      minAmount: 0,
      maxAmount: 1000,
      startDate: null,
      endDate: null,
      transactionID: null,
      ibanSender: null,
      ibanReceiver: null,
      userSenderID: null,
      userReceiverID: null,
    };
  },
  props: {
    currencySymbol: {
      type: String,
      default: "\u20AC"
    }
  },
  async mounted() {
    if (!useUserSessionStore().isAuthenticated) {
      this.$router.push("/login");
    }

    await useUserSessionStore().getUser().then(user => {
      this.user = user;
    });

    this.getTransactions();
  },
  methods: {
    activateFilterByTransactionID() {
      this.filterByTransactionID = true;
      this.filterByIBANs = false;
      this.filterByUserIDs = false;

      this.resetFilterByValues();
    },
    activateFilterByIBANs() {
      this.filterByTransactionID = false;
      this.filterByIBANs = true;
      this.filterByUserIDs = false;

      this.resetFilterByValues();
    },
    activateFilterByUserIDs() {
      this.filterByTransactionID = false;
      this.filterByIBANs = false;
      this.filterByUserIDs = true;

      this.resetFilterByValues();
    },
    resetFilterByValues() {
      this.transactionID = null;
      this.ibanSender = null;
      this.ibanReceiver = null;
      this.userSenderID = null;
      this.userReceiverID = null;
    },
    getTransactions() {
      this.errorOccurred = false;

      axios.get('/transactions', {
        params: {
          page: this.page,
          limit: this.limit,
          minAmount: this.minAmount,
          maxAmount: this.maxAmount,
          startDate: this.startDate,
          endDate: this.endDate,
          transactionType: this.transactionType,
        }
      })
      .then(response => {
        // Handle successful response
        this.transactions = response.data;
        // Process the transactions
      })
      .catch(error => {
        this.errorOccurred = true;
        this.errorMessage = error.response.data.error_message;
      });
    },
    getFilteredTransactions() {
      this.errorOccurred = false;

      axios.get('/transactions', {
        params: {
          page: this.page,
          limit: this.limit,
          minAmount: this.minAmount,
          maxAmount: this.maxAmount,
          startDate: this.startDate ? moment(this.startDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss') : null,
          endDate: this.endDate ? moment(this.endDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss') : null,
          transactionID: this.transactionID,
          ibanSender: this.ibanSender,
          ibanReceiver: this.ibanReceiver,
          userSenderID: this.userSenderID,
          userReceiverID: this.userReceiverID,
          transactionType: this.transactionType,
        }
      })
      .then(response => {
        this.transactions = response.data;
      })
      .catch(error => {
        this.errorOccurred = true;
        this.errorMessage = error.response.data.error_message;
      });
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY hh:mm:ss');
    },
    pageBack() {
      this.page -= 1;
      this.getFilteredTransactions();
    },
    pageForward() {
      this.page += 1;
      this.getFilteredTransactions()
    },
    changeTransactionType(event) {
      if (event.target.value === "ALL") {
        this.transactionType = null;
      } else {
        this.transactionType = event.target.value;
      }
    },
    changeFilterType(event) {
      if (event.target.value == "TransactionID") {
        this.activateFilterByTransactionID();
      } else if (event.target.value == "IBAN") {
        this.activateFilterByIBANs();
      } else if (event.target.value == "UserID") {
        this.activateFilterByUserIDs();
      }
    },
    isTransactionAddingMoney(transaction) {
      const thisUsersIban = useUserSessionStore().user.current_account.IBAN;
      if (transaction.transactionType === 'TRANSACTION') {
        return transaction.receiver_iban == thisUsersIban;
      } else if (transaction.transactionType === 'DEPOSIT') {
        return true;
      } else {
        return false;
      }
    },
    isOwnTransaction(transaction) {
      const thisUsersIban = useUserSessionStore().user.current_account.IBAN;

      if (useUserSessionStore().user.saving_account == null) {
        return false;
      }

      const thisUsersSavingAccountIban = useUserSessionStore().user.saving_account.IBAN;
      return transaction.sender_iban == thisUsersIban && transaction.receiver_iban == thisUsersSavingAccountIban || transaction.sender_iban == thisUsersSavingAccountIban && transaction.receiver_iban == thisUsersIban;
    },
  }
};
</script>

<style>
tbody>tr {
  background-color: #ffffff;
}
section {
  background-color: #F9F8FB;
}

.positive {
  color: green;
}

.negative {
  color: red;
}
</style>