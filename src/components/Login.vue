<template>
    <section class="d-flex flex-column flex-grow-1 justify-content-center">
        <div class="container p-2 card">
            <h1 class="mx-auto text-center">Login</h1>
            <div class="alert alert-danger" v-if="this.error">
                {{ this.error }}
            </div>
            <form class="mx-auto w-100 p-2" :class="isLoggingIn ? 'disabled' : ''">
                <div class="form-group mx-auto col-6 col-mx-12">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" class="d-input w-100" v-model="this.username"
                        @keyup.enter="login" />
                </div>
                <div class="form-group mx-auto col-6 col-mx-12">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" class="d-input w-100" v-model="this.password"
                        @keyup.enter="login" />
                </div>
                <div class="form-group mx-auto col-6 col-mx-12">
                    <button type="button" class="btn btn-primary my-2" @click="login">Login</button>
                </div>
            </form>
        </div>
    </section>
</template>

<script>
import { useUserSessionStore } from "../stores/usersession.js";

export default {
    name: "LoginView",
    setup() {
        return { store: useUserSessionStore() };
    },
    data() {
        return {
            username: "",
            password: "",
            error: "",
            isLoggingIn: false
        }
    },
    methods: {
        login() {
            if (this.isLoggingIn) {
                return;
            }

            this.isLoggingIn = true;
            this.store.login(this.username, this.password)
                .then(() => {
                    this.$router.push('/dashboard');
                })
                .catch((error) => {
                    this.error = error;
                })
                .finally(() => {
                    this.isLoggingIn = false;
                });
        }
    },
    mounted() {
        if (this.store.isAuthenticated) {
            this.$router.push('/dashboard');
        }
    }
}
</script>

<style scoped>
.disabled {
    pointer-events: none;
    opacity: 0.4;
}
</style>