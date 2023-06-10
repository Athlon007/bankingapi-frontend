<template>
    <div class="card-debit" :class="isPrimary ? 'primary-card' : ''" @click="copyIbanToClipboard()">
        <div class="content">
            <h3 class="title">{{ title }}</h3>
            <h4 class="balance">{{ formatBalance(balance) }} {{ translateCurrencyToSymbol() }}</h4>
            <h5 class="iban">{{ iban }}</h5>
            <p class="iban-copied-message">{{ ibanCopied ? "IBAN Copied!" : "&nbsp;" }}</p>
            <!-- Sorry for &nbsp;. I didn't have time to fix it -->
        </div>
    </div>
</template>

<script>
export default {
    name: "BalanceCard",
    props: {
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
        },
        currency: {
            type: String,
            required: false,
            default: "EURO"
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
        },
        translateCurrencyToSymbol() {
            return "\u20AC";
        }
    },
    async mounted() {
        // On mouse hover, start tracking the mouse position
        // and rotate the card accordingly

        const card = this.$el;
        const cardWidth = card.offsetWidth;
        const cardHeight = card.offsetHeight;

        card.addEventListener('mouseover', (e) => {
            requestAnimationFrame(() => {
                const cardX = card.getBoundingClientRect().left;
                const cardY = card.getBoundingClientRect().top;

                // Get mouse X position:
                const mouseX = e.pageX;
                const mouseY = e.pageY;

                // Get the mouse position relative to the card
                const xAxis = -(mouseX - cardX - cardWidth / 2) / 10;
                const yAxis = (mouseY - cardY - cardHeight / 2) / 10;

                card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg) scale(1.05)`;

                // When mosue is moving up, make the card a bit brighter
                // Let's make the force of it depend on the mouse position
                const brightness = (mouseY - cardY) / cardHeight;
                card.style.filter = `brightness(${0.75 + brightness})`;
            });
        });



        // When the mouse leaves the card, reset the rotation
        card.addEventListener('mouseout', (e) => {
            card.style.transform = `rotateY(0deg) rotateX(0deg)`;
            card.style.filter = `brightness(1)`;
        });
    }
}
</script>

<style scoped>
.card-debit {
    background-image: url("data:image/png;base64,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");
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
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
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