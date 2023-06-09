<template>
    <div class="card-debit" :class="isPrimary ? 'primary-card' : ''" @click="copyIbanToClipboard()">
        <div class="content">
            <h3 class="title">{{ title }}</h3>
            <h4 class="balance">{{ formatBalance(balance) }} {{ currencySymbol }}</h4>
            <h5 class="iban">{{ this.iban }}</h5>
            <p class="iban-copied-message">{{ ibanCopied ? "IBAN Copied!" : "&nbsp;" }}</p>
            <!-- Sorry for &nbsp;. I didn't have time to fix it -->
        </div>
    </div>
</template>

<script>
export default {
    name: "BalanceCard",
    props: {
        user: {
            type: Object,
            required: true
        },
        currencySymbol: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        balance: {
            required: true
        },
        iban: {
            type: String,
            required: true
        },
        isPrimary: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        return {
            ibanCopied: false
        }
    },
    methods: {
        async copyIbanToClipboard() {
            await navigator.clipboard.writeText(this.iban);
            this.ibanCopied = true;
            setTimeout(() => {
                this.ibanCopied = false;
            }, 3000);
        },
        formatBalance(balance) {
            // if the balance is flat .00, then return it as an integer
            if (balance % 1 === 0) {
                return balance;
            }

            return balance.toFixed(2);
        }
    }
}
</script>

<style scoped>
.card-debit {
    background-color: #f3eefa;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    margin-bottom: 20px;
    width: 20rem;
    height: 12rem;
    display: inline-block;
    margin-right: 20px;
    transition: all 0.3s ease-in-out;
}

.card-debit:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transform: scale(1.05);

}

.content {
    height: 100%
}

.title {
    font-size: 0.8rem;
    margin-bottom: 2px;
    color: #777
}

.balance {
    font-size: 3rem;
    margin-bottom: 20px;
    color: #333;
    font-weight: bold;
}

.iban {
    text-align: right;
    /** Align to the bottom */
    position: relativ;
    bottom: 20px;
    right: 20px;
    margin-bottom: 0;
    margin-top: auto;
    color: #333;
}

.primary-card {
    background-color: #632BB5;
}

.primary-card .title {
    color: #cecece;
}

.primary-card .balance {
    color: #fff;
}

.primary-card .iban {
    color: #fff;
}

.iban-copied-message {
    color: #632BB5;
    text-align: right;
}
</style>