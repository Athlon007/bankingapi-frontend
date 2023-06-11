<template>
    <div class="card col-3 py-4">
        <div class="row">
            <h2>Limits</h2>
        </div>
        <div v-if="isLoading" class="row">
            <div class="spinner-border text-primary d-inline" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <div v-else class="row">
            <div class="row my-2 col-12">
                <h3>Transaction Limit</h3>
                <h4 class="fw-bold">{{ limits?.transaction_limit }} {{ currencySymbol }}</h4>
            </div>
            <div class="row my-2 col-12">
                <h3>Daily Limit</h3>
                <h4 class="fw-bold">{{ limits?.daily_transaction_limit }} {{ currencySymbol }}</h4>
            </div>
            <div class="row col-12">
                <h3>Remaining Daily Limit</h3>
                <h4 class="fw-bold" :class="limits?.remaining_daily_transaction_limit == 0 ? 'out-of-limits' : ''">{{
                    formatDecimal(limits?.remaining_daily_transaction_limit) }} {{ currencySymbol }}</h4>
            </div>
        </div>
    </div>
</template>

<script>
import { useUserSessionStore } from "../../stores/usersession.js";
import axios from '../../axios_auth';

export default {
    name: "LimitsCard",
    data() {
        return {
            limits: {
                transaction_limit: 0,
                daily_transaction_limit: 0,
                remaining_daily_transaction_limit: 0
            },
            // EUR
            currencySymbol: "\u20AC",
            isLoading: true
        }
    },
    methods: {
        formatDecimal(number) {
            if (number % 1 === 0) {
                return number;
            }

            return number.toFixed(2);
        }
    },
    mounted() {
        const userId = useUserSessionStore().user_id;
        axios.get(`/users/${userId}/limits`)
            .then(response => {
                this.limits = response.data;
                this.isLoading = false;
            })
            .catch(error => {
                console.log(error);
            });
    }
}
</script>

<style scoped>
.card>div {
    margin-left: 1rem;
    margin-right: 1rem;
}

.card {
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

h3 {
    font-size: 0.8rem;
    margin-bottom: 2px;
    color: #777
}

.out-of-limits {
    color: red;
}
</style>