<template>
    <div class="col-8 mx-2 card py-4">
        <div class="row">
            <h2>Latest Transactions</h2>
        </div>
        <div v-if="hasTransactions" class="row">
            <div v-for="transaction in lastTransactions" :key="transaction.id"
                class="row transaction d-flex justify-content-between ">
                <p>{{ transaction.description }}</p>
                <p class="fw-bold amount"
                    :class="isTransactionAddingMoney(transaction) ? 'positive' : isOwnTransaction(transaction) ? '' : 'negative'">
                    {{
                        formatDecimal(transaction.amount) }} {{ currencySymbol }}</p>
                <hr />
            </div>
        </div>
        <div v-else-if="isLoading" class="row">
            <div class="spinner-border text-primary d-inline" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <div v-else class="row">
            <p>No transactions yet.</p>
        </div>
        <div v-if="!isLoading" class="row see-all-container">
            <router-link class="btn btn-primary" to="/transactionhistory">See all</router-link>
        </div>
    </div>
</template>

<script>
import axios from "../../axios_auth";
import { useUserSessionStore } from "../../stores/usersession.js";

export default {
    name: 'LatestTransactions',
    data() {
        return {
            lastTransactions: [],
            hasTransactions: false,
            isLoading: true
        }
    },
    props: {
        currencySymbol: {
            type: String,
            default: "\u20AC"
        }
    },
    methods: {
        loadLastTransactions() {
            // Get today's date.
            const today = new Date();
            // Format: YYYY-MM-DDTHH:mm:ss.sssZ
            const todayAsString = today.toISOString().split('T')[0];

            axios.get(`/transactions?start_date=${todayAsString}`)
                .then(response => {
                    this.lastTransactions = response.data.slice().reverse().slice(0, 3);
                    this.hasTransactions = this.lastTransactions.length > 0;

                    this.isLoading = false;
                })
                .catch(error => {
                    console.log(error);
                });
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
        formatDecimal(number) {
            if (number % 1 === 0) {
                return number;
            }

            return number.toFixed(2);
        }
    },
    mounted() {
        this.loadLastTransactions();
    },
}
</script>

<style scoped>
.card {
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.card>div {
    margin-left: 1rem;
    margin-right: 1rem;
}

.transaction {
    display: flex;
    width: 100%
}

.transaction>p {
    display: inline;
    width: auto;
}

.amount {
    text-align: right;
}

/* Do not display last <hr /> */
.transaction:last-child>hr {
    display: none;
}

.positive {
    color: green;
}

.negative {
    color: red;
}

.see-all-container {
    /* Display at the bottom of parent. */
    position: absolute;
    bottom: 0;
    margin-bottom: 2rem;
}
</style>