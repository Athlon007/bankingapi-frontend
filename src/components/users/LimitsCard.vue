<template>
    <div class="card">
        <div class="row">
            <h2>Limits</h2>
        </div>
        <div class="row">
            <div class="row col-6">
                <h3>Transaction Limit:</h3>
                <h4 class="fw-bold">{{ limits.transaction_limit }} {{ currencySymbol }}</h4>
            </div>
            <div class="row col-6">
                <h3>Daily Transaction Limit:</h3>
                <h4 class="fw-bold">{{ limits.daily_transaction_limit }} {{ currencySymbol }}</h4>
            </div>
        </div>
        <div class="row">
            <div class="row col-6">
                <h3>Absolute Limit:</h3>
                <h4 class="fw-bold">{{ limits.absolute_limit }} {{ currencySymbol }}</h4>
            </div>
            <div class="row col-6">
                <h3>Remaining Daily Transaction Limit:</h3>
                <h4 class="fw-bold">{{ limits.remaining_daily_transaction_limit }} {{ currencySymbol }}</h4>
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
                absolute_limit: 0,
                remaining_daily_transaction_limit: 0
            },
            // EUR
            currencySymbol: "\u20AC"
        }
    },
    mounted() {
        const userId = useUserSessionStore().user_id;
        axios.get(`/users/${userId}/limits`)
            .then(response => {
                this.limits = response.data;
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
</style>