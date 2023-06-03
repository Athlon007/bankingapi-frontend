<template>
    <div class="container">
        <h1>Register</h1>
        <div class="alert alert-danger" v-if="this.error">
            {{ this.error }}
        </div>
        <form>
            <div class="row">
                <div class="col-6 form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" class="d-input w-100"
                        v-model="this.userRequest.username" @keyup.enter="register" />
                </div>
                <div class="col-6 form-group">
                    <label for="email">E-Mail</label>
                    <input type="email" id="email" name="email" class="d-input w-100" v-model="this.userRequest.email"
                        @keyup.enter="register" />
                </div>
            </div>
            <div class="row">
                <div class="col-6 form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" class="d-input w-100"
                        v-model="this.userRequest.password" @keyup.enter="register" />
                </div>
                <div class="col-6 form-group">
                    <label for="password">Confirm Password</label>
                    <input type="password" id="password" name="password" class="d-input w-100"
                        v-model="this.password_confirm" @keyup.enter="register" />
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-6 form-group">
                    <label for="firstname">First Name</label>
                    <input type="text" id="firstname" name="firstname" class="d-input w-100"
                        v-model="this.userRequest.firstname" @keyup.enter="register" />
                </div>
                <div class="col-6 form-group">
                    <label for="lastname">Last Name</label>
                    <input type="text" id="lastname" name="lastname" class="d-input w-100"
                        v-model="this.userRequest.lastname" @keyup.enter="register" />
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-6 form-group">
                    <label for="bsn">BSN</label>
                    <input type="number" id="bsn" name="bsn" class="d-input w-100" v-model="this.userRequest.bsn"
                        @keyup.enter="register" @keypress="isValidBsn($event)" />
                </div>
                <div class="col-6 form-group">
                    <label for="phone_number">Phone Number</label>
                    <input type="tel" id="phone_number" name="phone_number" class="d-input w-100"
                        v-model="this.userRequest.phone_number" @keyup.enter="register" />
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-6 form-group">
                    <label for="birth_date">Birth Date</label>
                    <input type="date" id="birth_date" name="birth_date" class="d-input w-100"
                        v-model="this.userRequest.birth_date" @keyup.enter="register" />
                </div>
            </div>
            <button type="button" class="btn btn-primary" v-on:click="register">Register</button>
        </form>
    </div>
</template>

<script>
import { useUserSessionStore } from "../stores/usersession.js";
import axios from "../axios_auth";

export default {
    name: "Register",
    data() {
        return {
            userRequest: {
                username: "",
                password: "",
                email: "",
                first_name: "",
                last_name: "",
                bsn: "",
                phone_number: "",
                birth_date: ""
            },
            error: "",
            password_confirm: ""
        };
    },
    methods: {
        isValidBsn(event) {
            const charCode = (event.which) ? event.which : event.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                event.preventDefault();
            }

            // if Longer than 9 characters, prevent input
            if (event.target.value.length >= 9) {
                event.preventDefault();
            }
        },
        register() {
            if (this.userRequest.password !== this.password_confirm) {
                this.error = "Passwords do not match.";
                return;
            }

            // Take userRequest to JSON and print in console.
            const body = JSON.stringify(this.userRequest);

            // Send POST request to API
            axios
                .post("/users", body)
                .then((response) => {
                    // If response is OK, redirect to login page.
                    if (response.status === 201) {
                        this.$router.push("/login");
                    }
                })
                .catch((error) => {
                    // If response is not OK, print error in console.
                    console.log(error);
                    this.error = error.response.data.error_message;
                });
        }
    },
    mounted() {
        if (useUserSessionStore().isAuthenticated) {
            this.$router.push("/dashboard");
        }
    }

}
</script>

<style scoped></style>