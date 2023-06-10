<template>
    <div class="container d-flex justify-content-center align-items-center">
        <div>
            <h1 class="text-center">Account {{ this.wasDeactivated ? "Deactivated" : "Deleted" }}</h1>
            <p class="text-center">Your account has been {{ this.wasDeactivated ? "deactivated" : "deleted" }}.</p>
            <p class="text-center">You'll be redirected automatically within 5 seconds...</p>
            <div class="col-12 d-flex justify-content-center">
                <button class="btn btn-primary" @click="this.goHome()">Click To Go Home</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "AccountDeletedMessage",
    data() {
        return {
            wasDeactivated: false
        };
    },
    methods: {
        goHome() {
            this.$router.push('/');
        }
    },
    mounted() {
        setTimeout(() => {
            this.$router.push('/');
        }, 5000);

        // With redirection, if user was deactivated, there must be a param wasDeactivated=true.

        this.wasDeactivated = this.$route.query.wasDeactivated;
    }

}
</script>

<style scoped>
.container {
    height: 75vh;
}
</style>