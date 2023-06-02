<template>
    <div class="container">
        <form>
            <div class="row">
                <div class="col-6 form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" class="d-input w-100" v-model="this.username"
                        v-on:keyup-enter="register" />
                </div>
                <div class="col-6 form-group">
                    <label for="username">E-Mail</label>
                    <input type="email" id="username" name="username" class="d-input w-100" v-model="this.username"
                        v-on:keyup-enter="register" />
                </div>
            </div>
            <div class="row">
                <div class="col-6 form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" class="d-input w-100" v-model="this.password"
                        v-on:keyup-enter="register" />
                </div>
                <div class="col-6 form-group">
                    <label for="password">Confirm Password</label>
                    <input type="password" id="password" name="password" class="d-input w-100" v-model="this.password"
                        v-on:keyup-enter="register" />
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-6 form-group">
                    <label for="firstname">First Name</label>
                    <input type="text" id="firstname" name="firstname" class="d-input w-100" v-model="this.firstname"
                        v-on:keyup-enter="register" />
                </div>
                <div class="col-6 form-group">
                    <label for="firstname">Last Name</label>
                    <input type="text" id="firstname" name="firstname" class="d-input w-100" v-model="this.firstname"
                        v-on:keyup-enter="register" />
                </div>
            </div>
            <div class="row justify-content-center">

            </div>
        </form>
    </div>
</template>

<script>
import { useUserSessionStore } from "../stores/usersession.js";

export default {
    name: "Register",
    data() {
        return {
            users: []
        };
    },
    mounted() {
        if (useUserSessionStore().isAuthenticated) {
            this.$router.push("/dashboard");
        }
    }

}
</script>

<style scoped></style>