<template>
    <section class="d-flex flex-column flex-grow-1 justify-content-center">
        <div class="container card p-3">
            <h1>Register</h1>
            <div class="alert alert-danger" v-if="this.error">
                {{ this.error }}
            </div>
            <div>
                <form :class="this.isRegistering ? 'disabled' : ''">
                    <div class="row">
                        <div class="col-6 form-group">
                            <label for="username">Username</label>
                            <input type="text" id="username" name="username" class="d-input w-100"
                                v-model="this.userRequest.username" @keyup.enter="register" />
                        </div>
                        <div class="col-6 form-group">
                            <label for="email">E-Mail</label>
                            <input type="email" id="email" name="email" class="d-input w-100"
                                v-model="this.userRequest.email" @keyup.enter="register" />
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
                        <div class="col-6 form-group" v-if="this.is_current_user_admin">
                            <label for="role">Role</label>
                            <select id="role" name="role" class="d-input w-100" v-model="this.userRequest.role"
                                @keyup.enter="register">
                                <option value="USER" selected>User</option>
                                <option value="EMPLOYEE">Employee</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary" v-on:click="register">Register</button>
                </form>
            </div>
        </div>
    </section>
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
                birth_date: "",
                role: "USER"
            },
            error: "",
            password_confirm: "",
            is_current_user_admin: false,
            isRegistering: false
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
            if (this.isRegistering) {
                return;
            }

            this.isRegistering = true;

            if (this.userRequest.password !== this.password_confirm) {
                this.error = "Passwords do not match.";
                this.isRegistering = false;
                return;
            }

            if (!this.is_current_user_admin) {
                delete this.userRequest.role; // Remove role from userRequest if current user is not admin.
            }

            // Take userRequest to JSON and print in console.
            const body = JSON.stringify(this.userRequest);

            // Send POST request to API
            axios
                .post("/users", body)
                .then((response) => {
                    // If response is OK, redirect to login page.
                    if (response.status === 201) {
                        if (useUserSessionStore().isAuthenticated) {
                            this.$router.push("/usermanagement", { params: { user_id: response.data.id } });
                        } else {
                            this.$router.push("/login?registration=true");
                        }
                    }
                })
                .catch((error) => {
                    // If response is not OK, print error in console.
                    console.log(error);
                    this.error = error.response.data.error_message;
                })
                .finally(() => {
                    this.isRegistering = false;
                })
        }
    },
    mounted() {
        if (useUserSessionStore().isAuthenticated && useUserSessionStore().user.role === "USER") {
            this.$router.push("/dashboard");
        }

        if (useUserSessionStore().isAuthenticated && useUserSessionStore().user.role === "ADMIN") {
            this.is_current_user_admin = true;
        }
    }

}
</script>
