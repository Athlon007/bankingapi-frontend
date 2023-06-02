<template>
    <div class="container">
        <form>
            <div class="row">
                <div class="col-6 form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" class="d-input w-100"
                        v-model="this.userRequest.username" v-on:keyup-enter="register" />
                </div>
                <div class="col-6 form-group">
                    <label for="username">E-Mail</label>
                    <input type="email" id="username" name="username" class="d-input w-100"
                        v-model="this.userRequest.username" v-on:keyup-enter="register" />
                </div>
            </div>
            <div class="row">
                <div class="col-6 form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" class="d-input w-100"
                        v-model="this.userRequest.password" v-on:keyup-enter="register" />
                </div>
                <div class="col-6 form-group">
                    <label for="password">Confirm Password</label>
                    <input type="password" id="password" name="password" class="d-input w-100"
                        v-model="this.userRequest.password" v-on:keyup-enter="register" />
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-6 form-group">
                    <label for="firstname">First Name</label>
                    <input type="text" id="firstname" name="firstname" class="d-input w-100"
                        v-model="this.userRequest.firstname" v-on:keyup-enter="register" />
                </div>
                <div class="col-6 form-group">
                    <label for="lastname">Last Name</label>
                    <input type="text" id="lastname" name="lastname" class="d-input w-100"
                        v-model="this.userRequest.lastname" v-on:keyup-enter="register" />
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-6 form-group">
                    <label for="bsn">BSN</label>
                    <input type="number" id="bsn" name="bsn" class="d-input w-100" v-model="this.userRequest.bsn"
                        v-on:keyup-enter="register" @keypress="isValidBsn($event)" />
                </div>
                <div class="col-6 form-group">
                    <label for="phone_number">Phone Number</label>
                    <input type="tel" id="phone_number" name="phone_number" class="d-input w-100"
                        v-model="this.userRequest.phone_number" v-on:keyup-enter="register" />
                </div>
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
            userRequest: {
                username: "",
                password: "",
                email: "",
                firstName: "",
                lastName: "",
                bsn: "",
                phone_number: "",
                birth_date: ""
            }
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