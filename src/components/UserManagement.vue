<script setup>

</script>

<template>
    <section class="d-flex flex-column flex-grow-1">
        <div class="container">
            <div class="my-2">
                <h2 class="d-inline">User Management</h2>
                <button type="button" class="btn btn-primary mx-4" @click="this.addUser()">Add User</button>
            </div>
            <div class="row" v-if="this.error">
                <div class="alert alert-danger">
                    {{ this.error }}
                </div>
            </div>
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
                                <input type="checkbox" class="form-check-input" id="has-no-account"
                                    v-model="this.hasNoAccount" @change="this.search()" />
                                <label class="form-check-label d-inline" for="has-no-account">No Account</label>
                            </div>
                        </div>
                    </form>
                    <!-- User Panel -->
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
                <!-- Tabs Panel -->
                <div class="col-6" :class="edited_user == null ? 'disabled' : ''">
                    <!-- Tabs -->
                    <nav>
                        <div class="nav nav-tabs" role="tablist" id="nav-tabs">
                            <button class="nav-link active" id="user-tab" data-bs-toggle="tab" data-bs-target="#details"
                                type="button" role="tab" aria-controls="user" aria-selected="true">Details</button>
                            <button class="nav-link" id="accounts-tab" data-bs-toggle="tab" data-bs-target="#accounts"
                                type="button" role="tab" aria-controls="accounts" aria-selected="false">Account</button>
                            <button class="nav-link" id="limits-tab" data-bs-toggle="tab" data-bs-target="#limits"
                                type="button" role="tab" aria-controls="limits" aria-selected="false"
                                v-if="this.edited_user.current_account != null">Limits</button>
                        </div>
                    </nav>
                    <!-- Content -->
                    <div class="tab-content" id="nav-tabContent">
                        <div class="col-12" :class="edited_user == null ? 'disabled' : ''">
                            <div class="tab-content" id="nav-tabContent">
                                <div class="tab-pane fade show active container" id="details" role="tabpanel">
                                    <div class="form-group">
                                        <label for="username">Username</label>
                                        <input type="text" id="username" name="username" class="d-input w-100"
                                            v-model="this.edited_user.username" @keyup.enter="register" />
                                    </div>
                                    <div class="form-group">
                                        <label for="email">E-Mail</label>
                                        <input type="email" id="email" name="email" class="d-input w-100"
                                            v-model="this.edited_user.email" @keyup.enter="register" />
                                    </div>
                                    <div class="form-group">
                                        <label for="password">Password</label>
                                        <input type="password" id="password" name="password" class="d-input w-100"
                                            v-model="this.edited_user.password" @keyup.enter="register" />
                                    </div>
                                    <div class="form-group">
                                        <label for="password">Confirm Password</label>
                                        <input type="password" id="password" name="password" class="d-input w-100"
                                            v-model="this.password_confirm" @keyup.enter="register" />
                                    </div>
                                    <div class="form-group">
                                        <label for="firstname">First Name</label>
                                        <input type="text" id="firstname" name="firstname" class="d-input w-100"
                                            v-model="this.edited_user.firstname" @keyup.enter="register" />
                                    </div>
                                    <div class="form-group">
                                        <label for="lastname">Last Name</label>
                                        <input type="text" id="lastname" name="lastname" class="d-input w-100"
                                            v-model="this.edited_user.lastname" @keyup.enter="register" />
                                    </div>
                                    <div class="form-group">
                                        <label for="bsn">BSN</label>
                                        <input type="number" id="bsn" name="bsn" class="d-input w-100"
                                            v-model="this.edited_user.bsn" @keyup.enter="register"
                                            @keypress="isValidBsn($event)" />
                                    </div>
                                    <div class="form-group">
                                        <label for="phone_number">Phone Number</label>
                                        <input type="tel" id="phone_number" name="phone_number" class="d-input w-100"
                                            v-model="this.edited_user.phone_number" @keyup.enter="register" />
                                    </div>
                                    <div class="form-group">
                                        <label for="birth_date">Birth Date</label>
                                        <input type="date" id="birth_date" name="birth_date" class="d-input w-100"
                                            v-model="this.edited_user.birth_date" @keyup.enter="register" />
                                    </div>
                                    <div class="form-group" v-if="this.isCurrentUserAdmin">
                                        <label for="role">Role</label>
                                        <select id="role" name="role" class="d-input w-100" v-model="this.edited_user.role"
                                            @keyup.enter="register">
                                            <option value="ADMIN">Admin</option>
                                            <option value="EMPLOYEE">Employee</option>
                                            <option value="USER">User</option>
                                        </select>
                                    </div>
                                    <div class="row py-2">
                                        <div class="col-12">
                                            <button type="button" class="btn btn-primary mx-2" @click="save"
                                                v-if="this.edited_user.active">Save</button>
                                            <button type="button" class="btn btn-success mx-2" @click="save"
                                                v-else>Activate</button>
                                            <button type="button" class="btn btn-light mx-2" @click="cancel">Cancel</button>
                                            <button type="button"
                                                v-if="isCurrentUserAdmin && this.edited_user.role === 'ADMIN' || this.edited_user.role !== 'ADMIN'"
                                                class="btn btn-danger mx-2" @click="this.delete()">{{
                                                    this.edited_user.current_account == null ? "Delete" : "Deactivate"
                                                }}</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="accounts" role="tabpanel">
                                    <div class="card my-2 p-2">
                                        <div class="row">
                                            <h3>Current Account</h3>
                                        </div>
                                        <div class="row" v-if="this.edited_user.current_account == null">
                                            <p>No Account</p>
                                            <div class="col-12">
                                                <button type="button" class="btn btn-primary"
                                                    @click="createAccount('current')">Create
                                                    Account</button>
                                            </div>
                                        </div>
                                        <div class="row" v-else>
                                            <p><strong>Account ID:</strong> {{ this.edited_user.current_account.id }}</p>
                                            <p><strong>IBAN:</strong> {{ this.edited_user.current_account.IBAN }}</p>
                                            <p><strong>Balance:</strong> {{ this.edited_user.current_account.balance }}</p>
                                            <p><strong>Active: </strong> {{ this.edited_user.current_account.isActive ?
                                                "Yes" : "No" }}
                                            <form class="my-2">
                                                <label for="absolute-limit-current"><strong>Absolute Limit:</strong>
                                                </label>
                                                <input type="number" id="absolute-limit-current"
                                                    name="absolute-limit-current" class="d-input w-100"
                                                    v-model="this.edited_user.current_account.absolute_limit" max="0" />
                                            </form>
                                            </p>
                                            <div class="col-12 d-flex">
                                                <button type="button" class="btn btn-primary mx-1"
                                                    @click="updateAccountAbsoluteLimit('current', this.edited_user.current_account.absolute_limit)">Update
                                                    Absolute
                                                    Limit</button>
                                                <button type="button" class="btn btn-danger mx-1"
                                                    @click="setAccountActive(false, 'current')"
                                                    v-if="this.edited_user.current_account.isActive">Deactivate
                                                    Account</button>
                                                <button type="button" class="btn btn-success mx-1"
                                                    @click="setAccountActive(true, 'current')" v-else>Activate
                                                    Account</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card my-2 p-2" v-if="this.edited_user.current_account != null">
                                        <div class="row">
                                            <h3>Saving Account</h3>
                                        </div>
                                        <div class="row" v-if="this.edited_user.saving_account == null">
                                            <p>No Account</p>
                                            <div class="col-12">
                                                <button type="button" class="btn btn-primary"
                                                    @click="createAccount('saving')">Create
                                                    Account</button>
                                            </div>
                                        </div>
                                        <div class="row" v-else>
                                            <p><strong>Account ID:</strong> {{ this.edited_user.saving_account.id }}</p>
                                            <p><strong>IBAN:</strong> {{ this.edited_user.saving_account.IBAN }}</p>
                                            <p><strong>Balance:</strong> {{ this.edited_user.saving_account.balance }}</p>
                                            <p><strong>Active: </strong> {{ this.edited_user.saving_account.isActive ? "Yes"
                                                : "No" }}
                                            </p>
                                            <form class="my-2">
                                                <label for="absolute-limit-current"><strong>Absolute Limit:</strong>
                                                </label>
                                                <input type="number" id="absolute-limit-current"
                                                    name="absolute-limit-current" class="d-input w-100"
                                                    v-model="this.edited_user.saving_account.absolute_limit" max="0" />
                                            </form>
                                            <div class="col-12">
                                                <button type="button" class="btn btn-primary mx-1"
                                                    @click="updateAccountAbsoluteLimit('saving', this.edited_user.saving_account.absolute_limit)">Update
                                                    Absolute
                                                    Limit</button>
                                                <button type="button" class="btn btn-danger"
                                                    @click="setAccountActive(false, 'saving')"
                                                    v-if="this.edited_user.saving_account.isActive">Deactivate
                                                    Account</button>
                                                <button type="button" class="btn btn-success"
                                                    @click="setAccountActive(true, 'saving')" v-else>Activate
                                                    Account</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="limits" role="tabpanel"
                                    v-if="this.edited_user.current_account != null">
                                    <form id="limits-form">
                                        <div class="form-group">
                                            <label for="transaction_limit">Transaction Limit</label>
                                            <input type="number" id="transaction_limit" name="transaction_limit"
                                                class="d-input w-100" v-model="this.edited_user_limits.transaction_limit"
                                                @keyup.enter="register" />
                                        </div>
                                        <div class="form-group">
                                            <label for="daily_transaction_limit">Daily Transaction Limit</label>
                                            <input type="number" id="daily_transaction_limit" name="daily_transaction_limit"
                                                class="d-input w-100"
                                                v-model="this.edited_user_limits.daily_transaction_limit"
                                                @keyup.enter="register" min="0" />
                                        </div>
                                        <div class="form-group">
                                            <label for="remaining_daily_limit">Remaining Daily Limit</label>
                                            <input type="number" id="remaining_daily_limit" name="remaining_daily_limit"
                                                class="d-input w-100"
                                                v-model="this.edited_user_limits.remaining_daily_transaction_limit" max="0"
                                                readonly disabled />
                                        </div>
                                        <div class="d-flex py-2">
                                            <button type="button" class="btn btn-primary mx-2"
                                                @click="saveLimits">Save</button>
                                            <button type="button" class="btn btn-light mx-2"
                                                @click="cancelLimits">Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <dialog id="delete-account-dialog">
            <div class="row">
                <h2>Warning</h2>
            </div>
            <hr />
            <div class="row">
                <p>Are you sure you want to <strong>{{ this.edited_user.current_account == null &&
                    this.edited_user.saving_account == null ? "remove" : "deactivate" }}</strong> this account?</p>
                <strong>
                    <p>{{ this.edited_user.firstname }} {{ this.edited_user.lastname }}</p>
                </strong>
                <p v-if="this.edited_user.current_account != null">This action can only be reverted by contacting customer
                    support.</p>
                <p v-else>This action <strong>CANNOT</strong> be reverted.</p>
            </div>
            <div class="row d-flex justify-content-evenly">
                <button class="btn btn-danger w-25" @click="deleteAccount()">Yes</button>
                <button class="btn btn-primary w-25" @click="closeDialog">No</button>
            </div>
        </dialog>
    </section>
</template>

<script>
import UserManagementListItem from './users/UserManagementListItem.vue';
import { useUserSessionStore } from '../stores/usersession'
import axios from '../axios_auth';
import useEmitter from '../emitter';

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
            edited_user: {},
            isCurrentUserAdmin: false,
            password_confirm: "",
            edited_user_limits: {},
            limits_copy: {},
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
                    this.error = error.response.data.error_message;
                });
        },
        nextPage() {
            this.page += this.limit;
            this.search(this.lastQuery);
        },
        searchOnSearchbar(event) {
            event.preventDefault();
            this.search();
        },
        createAccount(account_type) {

            const request = {
                accountType: account_type.toUpperCase(),
                userId: this.edited_user.id,
                currencyType: "EURO"
            }

            axios.post(`/accounts`, request)
                .then(response => {
                    if (account_type === "current") {
                        this.edited_user.current_account = response.data;
                        this.users.find(user => user.id === this.edited_user.id).current_account = response.data;

                        // Request limits for current user.
                        axios.get(`/users/${this.edited_user.id}/limits`)
                            .then(response => {
                                this.edited_user_limits = response.data;
                                this.limits_copy = JSON.parse(JSON.stringify(this.edited_user_limits));
                            })
                            .catch(error => {
                                this.error = error.response.data.error_message;
                            });
                    }
                    else {
                        this.edited_user.saving_account = response.data;
                        this.users.find(user => user.id === this.edited_user.id).saving_account = response.data;
                    }
                })
                .catch(error => {
                    this.error = error.response.data.error_message;
                });
        },
        setAccountActive(isActive, account_type) {
            let account_id = null;
            if (account_type === "current")
                account_id = this.edited_user.current_account.id;
            else
                account_id = this.edited_user.saving_account.id;

            let user_id = this.edited_user.id;

            axios.put(`/accounts/${user_id}/${account_id}`, {
                isActive: isActive
            },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (account_type === "current") {
                        this.edited_user.current_account = response.data;
                        this.users.find(user => user.id === this.edited_user.id).current_account = response.data;
                    }
                    else {
                        this.edited_user.saving_account = response.data;
                        this.users.find(user => user.id === this.edited_user.id).saving_account = response.data;
                    }
                })
                .catch(error => {
                    this.error = error.response.data.error_message;
                });
        },
        save() {
            this.error = "";

            const request = {
                username: this.edited_user.username,
                email: this.edited_user.email,
                firstname: this.edited_user.firstname,
                lastname: this.edited_user.lastname,
                bsn: this.edited_user.bsn,
                phone_number: this.edited_user.phone_number,
                birth_date: this.edited_user.birth_date
            }

            // If this user is admin, add role too.
            if (this.isCurrentUserAdmin) {
                request.role = this.edited_user.role;
            }

            axios.put(`/users/${this.edited_user.id}`, request)
                .then(response => {
                    useEmitter().emit("user-edit-save");

                    // Replace the user in the list with the updated one.
                    const index = this.users.findIndex(user => user.id === this.edited_user.id);
                    this.users[index] = response.data;
                })
                .catch(error => {
                    this.error = error.response.data.error_message;
                });

        },
        cancel() {
            useEmitter().emit("user-edit-end");
        },
        delete() {
            document.getElementById("delete-account-dialog").showModal();
        },
        deleteAccount() {
            axios.delete(`/users/${this.edited_user.id}`)
                .then(response => {

                    // Check if user deletes himself.
                    if (this.edited_user.id === useUserSessionStore().user.id) {
                        useUserSessionStore().logout();
                        useEmitter().emit('logout');
                        this.$router.push("/login");
                        return;
                    }
                    // Remove the user from the list.
                    const index = this.users.findIndex(user => user.id === this.edited_user.id);
                    this.users.splice(index, 1);

                    this.closeDialog();
                    useEmitter().emit("user-edit-save");
                })
                .catch(error => {
                    this.error = error.response.data.error_message;
                });
        },
        closeDialog() {
            document.getElementById("delete-account-dialog").close();
        },
        saveLimits() {
            this.error = "";

            axios.put(`/users/${this.edited_user.id}/limits`, this.edited_user_limits)
                .then(response => {
                    this.edited_user_limits = response.data;
                    this.limits_copy = JSON.parse(JSON.stringify(this.edited_user_limits));
                })
                .catch(error => {
                    this.error = error.response.data.error_message;
                });
        },
        cancelLimits() {
            // restore the limits
            this.edited_user_limits = JSON.parse(JSON.stringify(this.limits_copy));
        },
        addUser() {
            this.$router.push("/register");
        },
        updateAccountAbsoluteLimit(account_type, value) {
            // PUT /accounts/user_id/account_id/limit

            this.error = "";

            const user_id = this.edited_user.id;
            const account_id = account_type == 'current' ? this.edited_user.current_account.id : this.edited_user.saving_account.id;

            axios.put('/accounts/' + user_id + '/' + account_id + '/limit', {
                absoluteLimit: value
            })
                .then(response => {
                    if (account_type == 'current') {
                        this.edited_user.current_account = response.data;
                        this.users.find(user => user.id === this.edited_user.id).current_account = response.data;
                    }
                    else {
                        this.edited_user.saving_account = response.data;
                        this.users.find(user => user.id === this.edited_user.id).saving_account = response.data;
                    }
                })
                .catch(error => {
                    this.error = error.response.data.error_message;
                });
        }
    },
    async mounted() {
        // we don't want regular users to access this page
        await useUserSessionStore().localLogin();
        if (useUserSessionStore().user == null || useUserSessionStore().user.role !== "ADMIN" && useUserSessionStore().user.role !== "EMPLOYEE") {
            this.$router.push("/");
        }

        await this.search();
        this.isCurrentUserAdmin = useUserSessionStore().user.role === "ADMIN";

        useEmitter().on("activate-user", (user) => {
            this.edited_user = JSON.parse(JSON.stringify(user));

            if (this.edited_user.current_account != null) {
                // Load user limits from /users/{id}/limits
                axios.get(`/users/${this.edited_user.id}/limits`)
                    .then(response => {
                        this.edited_user_limits = response.data;
                        this.limits_copy = JSON.parse(JSON.stringify(response.data));
                    })
                    .catch(error => {
                        this.error = error.response.data.error_message;
                    });
            } else {
                this.edited_user_limits = {};
            }
        });

        useEmitter().on("user-edit-end", () => {
            this.edited_user = {};
        });

        useEmitter().on("user-edit-save", () => {
            this.doQuery(this.lastQuery);
            useEmitter().emit("user-edit-end");
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

.disabled {
    pointer-events: none;
    cursor: default;
}

.container {
    margin-bottom: 2rem;
}
</style>