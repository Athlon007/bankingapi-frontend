<script setup>
import { useUserSessionStore } from '../stores/usersession'
import UserManagementListItem from './products/UserManagementListItem.vue';
import axios from '../axios_auth';
import useEmitter from '../emitter';
</script>

<template>
    <div class="container">
        <h2>User Management</h2>
        <div class="row">
            <div class="col-6">
                <form>
                    <div class="d-flex">
                        <input type="text" class="form-control" placeholder="Search" aria-label="Search"
                            v-model="searchQuery" @keyup.enter="this.searchOnSearchbar($e)" />
                        <button type="button" class="btn btn-primary" @click="this.search()">Search</button>
                    </div>
                    <div class="d-inline">
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="has-no-account" v-model="this.hasNoAccount"
                                @change="this.search()" />
                            <label class="form-check-label d-inline" for="has-no-account">No Account</label>
                        </div>
                    </div>
                </form>
                <div class="overflow-auto users-list">
                    <ul class="list-group list-group-horizontal">
                        <li class="list-group-item flex-shrink id-container">ID</li>
                        <li class="list-group-item flex-shrink no-border-right">First Name</li>
                        <li class=" list-group-item flex-shrink no-border-right">Last Name</li>
                        <li class="list-group-item flex-fill text-end">Email</li>
                        <li class="list-group-item flex-shrink id-container">Has Account?
                        </li>
                        <li class="list-group-item flex-shrink id-container">Is Active?</li>
                    </ul>
                    <UserManagementListItem v-for="user in users" :key="user.id" :user="user" />
                </div>
            </div>
            <div class="col-6">
                <div class="row">
                    <div class="col-6 form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" class="d-input w-100"
                            v-model="this.edited_user.username" @keyup.enter="register" />
                    </div>
                    <div class="col-6 form-group">
                        <label for="email">E-Mail</label>
                        <input type="email" id="email" name="email" class="d-input w-100" v-model="this.edited_user.email"
                            @keyup.enter="register" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-6 form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" class="d-input w-100"
                            v-model="this.edited_user.password" @keyup.enter="register" />
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
                            v-model="this.edited_user.firstname" @keyup.enter="register" />
                    </div>
                    <div class="col-6 form-group">
                        <label for="lastname">Last Name</label>
                        <input type="text" id="lastname" name="lastname" class="d-input w-100"
                            v-model="this.edited_user.lastname" @keyup.enter="register" />
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-6 form-group">
                        <label for="bsn">BSN</label>
                        <input type="number" id="bsn" name="bsn" class="d-input w-100" v-model="this.edited_user.bsn"
                            @keyup.enter="register" @keypress="isValidBsn($event)" />
                    </div>
                    <div class="col-6 form-group">
                        <label for="phone_number">Phone Number</label>
                        <input type="tel" id="phone_number" name="phone_number" class="d-input w-100"
                            v-model="this.edited_user.phone_number" @keyup.enter="register" />
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-6 form-group">
                        <label for="birth_date">Birth Date</label>
                        <input type="date" id="birth_date" name="birth_date" class="d-input w-100"
                            v-model="this.edited_user.birth_date" @keyup.enter="register" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "UserManagement",
    components: {
        UserManagementListItem
    },
    data() {
        return {
            users: [],
            error: "",
            searchQuery: "",
            hasNoAccount: false,
            page: 0,
            limit: 20,
            isMorePages: true,
            lastQuery: {},
            edited_user: {}
        }
    },
    methods: {
        async search() {
            this.page = 0;
            this.isMorePages = true;

            let params = {
                page: this.page,
                limit: this.limit
            };
            if (this.searchQuery !== "") {
                params.name = this.searchQuery;
            }

            if (this.hasNoAccount) {
                params.has_no_accounts = true;
            }

            await useUserSessionStore().localLogin();

            this.doQuery(params);
        },
        doQuery(params) {
            this.lastQuery = params;

            axios.get(`/users`, {
                params: params
            })
                .then(response => {
                    this.users = response.data;

                    if (this.users.length < this.limit) {
                        this.isMorePages = false;
                    }

                })
                .catch(error => {
                    console.log(error);
                    this.error = error;
                });
        },
        nextPage() {
            this.page += this.limit;
            this.search(this.lastQuery);
        },
        searchOnSearchbar(event) {
            event.preventDefault();
            this.search();
        }
    },
    mounted() {
        useUserSessionStore().localLogin();
        this.search();

        useEmitter().on("activate-user", (user) => {
            this.edited_user = user;
        });

        useEmitter().on("user-edit-end", () => {
            this.edited_user = {};
        });

        useEmitter().on("user-edit-save", () => {
            this.doQuery(this.lastQuery);
        });
    }
}
</script>

<style scoped>
.users-list {
    height: 75vh;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0px;
}

.id-container {
    width: 4rem;
}

.no-border-right {
    border-right: none;
}
</style>