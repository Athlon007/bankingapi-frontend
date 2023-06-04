<template>
  <section>
    <div class="container">
      <h2 class="mt-3 mt-lg-5">Transaction History</h2>
    </div>
    <div class="container">
      <h5>Filter by</h5>
      <div>
        <select>
          <option @click="activateFilterByTransactionID">Transaction ID</option>
          <option @click="activateFilterByIBANs">IBANs</option>
          <option @click="activateFilterByUserIDs">User IDs</option>
        </select>
      </div>
      <div>
        <select>
          <option @click="transactionType = null">All</option>
          <option @click="transactionType = 'TRANSACTION'">Transaction</option>
          <option @click="transactionType = 'DEPOSIT'">Deposit</option>
          <option @click="transactionType = 'WITHDRAWAL'">Withdrawal</option>
        </select>
      </div>
      <form @submit.prevent="getFilteredTransactions">
        <div>
          <div v-if="filterByTransactionID">
            <label for="transactionID">Transaction ID</label>
            <input id="transactionID" type="number" min="0"
                   v-model="transactionID">
          </div>
          <div v-if="filterByIBANs">
            <label for="senderIBAN">Sender IBAN</label>
            <input id="senderIBAN" type="text" pattern="^[A-Za-z]{2}[0-9]{2}[A-Za-z]{4}[0-9]{10}$"
                   v-model="ibanSender">
            <label for="receiverIBAN">Receiver IBAN</label>
            <input id="receiverIBAN" type="text" pattern="^[A-Za-z]{2}[0-9]{2}[A-Za-z]{4}[0-9]{10}$"
                   v-model="ibanReceiver">
          </div>
          <div v-if="filterByUserIDs">
            <label for="senderID">Sender ID</label>
            <input id="senderID" type="number" min="0" v-model="userSenderID">
            <label for="receiverID">Receiver ID</label>
            <input id="receiverID" type="number" min="0" v-model="userReceiverID">
          </div>
        </div>
        <div class="row">
          <label for="minAmount">Minimum Amount</label>
          <input id="minAmount" type="number" step="0.01" min="0" placeholder="0.00" v-model="minAmount">
        </div>
        <div class="row">
          <label for="minAmount">Maximum Amount</label>
          <input id="minAmount" type="number" step="0.01" min="0" placeholder="0.00" v-model="maxAmount">
        </div>
        <div class="row">
          <label for="startDate">Start Date</label>
          <input id="startDate" type="datetime-local" v-model="startDate">
        </div>
        <div class="row">
          <label for="endDate">End Date</label>
          <input id="endDate" type="datetime-local" v-model="endDate">
        </div>
        <button class="btn btn-primary" type="submit">Filter</button>
      </form>
      <div class="alert alert-danger mt-3" role="alert" v-if="errorOccurred">
        {{errorMessage}}
      </div>
    </div>
    <div class="container">
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
            <td>{{ transaction.timestamp }}</td>
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
    }
  }
};
</script>

<style></style>