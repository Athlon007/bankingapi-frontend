<template>
    <div class="container">
        <h1>Settings</h1>
        <div class="alert alert-danger" v-if="this.error">
            {{ this.error }}
        </div>
        <div class="row">
            <form>
                <div class="row">
                    <div class="col-6 form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" class="d-input w-100"
                            v-model="this.userRequest.username" @keyup.enter="updateAccount" />
                    </div>
                    <div class="col-6 form-group">
                        <label for="email">E-Mail</label>
                        <input type="email" id="email" name="email" class="d-input w-100" v-model="this.userRequest.email"
                            @keyup.enter="updateAccount" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-6 form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" class="d-input w-100"
                            v-model="this.userRequest.password" @keyup.enter="updateAccount" />
                    </div>
                    <div class="col-6 form-group">
                        <label for="password">Confirm Password</label>
                        <input type="password" id="password" name="password" class="d-input w-100"
                            v-model="this.password_confirm" @keyup.enter="updateAccount" />
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-6 form-group">
                        <label for="firstname">First Name</label>
                        <input type="text" id="firstname" name="firstname" class="d-input w-100"
                            v-model="this.userRequest.firstname" @keyup.enter="updateAccount" />
                    </div>
                    <div class="col-6 form-group">
                        <label for="lastname">Last Name</label>
                        <input type="text" id="lastname" name="lastname" class="d-input w-100"
                            v-model="this.userRequest.lastname" @keyup.enter="updateAccount" />
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-6 form-group">
                        <label for="bsn">BSN</label>
                        <input type="number" id="bsn" name="bsn" class="d-input w-100" v-model="this.userRequest.bsn"
                            @keyup.enter="updateAccount" @keypress="isValidBsn($event)" />
                    </div>
                    <div class="col-6 form-group">
                        <label for="phone_number">Phone Number</label>
                        <input type="tel" id="phone_number" name="phone_number" class="d-input w-100"
                            v-model="this.userRequest.phone_number" @keyup.enter="updateAccount" />
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-6 form-group">
                        <label for="birth_date">Birth Date</label>
                        <input type="date" id="birth_date" name="birth_date" class="d-input w-100"
                            v-model="this.userRequest.birth_date" @keyup.enter="updateAccount" />
                    </div>
                </div>
                <button type="button" class="btn btn-primary" v-on:click="updateAccount">Update</button>
            </form>
        </div>
    </div>
</template>

<script>
import { useUserSessionStore } from '../stores/usersession';
import axios from '../axios_auth'
import useEmitter from '../emitter.js'

export default {
    name: "Settings",
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
        }
    },
    methods: {
        updateAccount() {
            // Remove 'role' if it exists.
            if (this.userRequest.role) {
                delete this.userRequest.role;
            }

            const json = JSON.stringify(this.userRequest);

            axios.put("/users/" + useUserSessionStore().getUserId, json, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    this.error = "";
                    this.$router.push("/dashboard");
                    useEmitter().emit("login");
                })
                .catch(error => {
                    this.error = error.response.data.error_message;
                });
        }
    },
    async mounted() {
        await useUserSessionStore().localLogin();
        if (!useUserSessionStore().isAuthenticated) {
            this.$router.push("/login");
        }

        // Get latest info about user.
        axios.get("/users/" + useUserSessionStore().getUserId)
            .then(response => {
                this.userRequest = response.data;
            })
            .catch(error => {
                this.error = error.response.data.error_message;
            });
    }
}
</script>

<style scoped></style>