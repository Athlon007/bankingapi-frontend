<template>
  <section class="d-flex flex-column flex-grow-1">
    <div class="container">
      <h2 class="pt-3">Transaction History</h2>
    </div>
    <div class="container border border-1 p-3 card">
      <div class="pb-3 row">
        <span class="fw-bolder col-lg-2">Transaction type: </span>
        <select class="col" style="max-width: 10em;">
          <option @click="transactionType = null">All</option>
          <option @click="transactionType = 'TRANSACTION'">Transaction</option>
          <option @click="transactionType = 'DEPOSIT'">Deposit</option>
          <option @click="transactionType = 'WITHDRAWAL'">Withdrawal</option>
        </select>
      </div>
      <div class="pb-3 row">
        <span class="fw-bolder col-lg-2">Filter by: </span>
        <select class="col" style="max-width: 10em;">
          <option @click="activateFilterByTransactionID">Transaction ID</option>
          <option @click="activateFilterByIBANs">IBANs</option>
          <option @click="activateFilterByUserIDs">User IDs</option>
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
            <input id="startDate" type="datetime-local" v-model="startDate" class="m-2">
          </div>
          <div class="col">
            <label for="endDate" class="fw-bolder">End Date</label>
            <input id="endDate" type="datetime-local" v-model="endDate" class="m-2">
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
            <th scope="col">Receiver IBAN</th>
            <th scope="col">Sender IBAN</th>
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
            <td>{{ transaction.receiver_iban }}</td>
            <td>{{ transaction.sender_iban }}</td>
            <td>{{ transaction.amount }}</td>
            <td>{{ formatDate(transaction.timestamp) }}</td>
            <td>{{ transaction.description }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script>
import { useUserSessionStore } from "../../stores/usersession.js";
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
      limit: 10,
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
  mounted() {
    if (!useUserSessionStore().isAuthenticated) {
      this.$router.push("/login");
    }

    useUserSessionStore().getUser().then(user => {
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
          page: 0,
          limit: 10,
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
          page: 0,
          limit: 10,
          minAmount: this.minAmount,
          maxAmount: this.maxAmount,
          startDate: this.startDate,
          endDate: this.endDate,
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
</style>