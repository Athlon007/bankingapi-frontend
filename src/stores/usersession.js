import { defineStore } from 'pinia'
import axios from '../axios_auth.js';
import useEmitter from '../emitter.js'

export const useUserSessionStore = defineStore('usersession', {
    state: () => ({
        access_token: '',
        refresh_token: '',
        user_id: 0,
        expires_at: 0,
        user: null
    }),
    getters: {
        isAuthenticated: (state) => state.access_token !== '',
        getUserId: (state) => state.user_id,
        isExpired: (state) => Date.now() > state.expires_at,
    },
    actions: {
        async localLogin() {
            if (!localStorage['access_token'] || !localStorage['refresh_token'] || !localStorage['expires_at'].length || !localStorage['id'].length) {
                return;
            }

            this.refresh_token = localStorage['refresh_token'];
            this.user_id = localStorage['id'];
            this.expires_at = localStorage['expires_at'];

            if (Date.now() > this.expires_at) {
                console.log('Token expired at. Trying to refresh.');
                await this.refresh();
            }


            this.access_token = localStorage['access_token'];

            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.access_token;
        },
        login(username, password) {
            return new Promise((resolve, reject) => {
                axios
                    .post("/auth/login", {
                        username: username,
                        password: password,
                    })
                    .then((response) => {
                        this.user = null;
                        this.user_id = 0;

                        this.access_token = response.data.access_token;
                        this.refresh_token = response.data.refresh_token;
                        this.user_id = response.data.id;
                        this.expires_at = response.data.expires_at;

                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.access_token;
                        localStorage['access_token'] = this.access_token;
                        localStorage['refresh_token'] = this.refresh_token;
                        localStorage['id'] = response.data.id;
                        localStorage['expires_at'] = response.data.expires_at;

                        this.getUser();

                        // Set timer to refresh token.
                        setTimeout(() => {
                            this.refresh();
                        }, this.expires_at - Date.now() - 1000);

                        useEmitter().emit('login', this.user_id);
                        resolve();
                    })
                    .catch((error) => {
                        console.log(error);
                        console.log(error.response.data.error_message);
                        reject(error.response.data.error_message);
                    });
            });
        },
        invalidateUser() {
            this.user = null;
        },
        logout() {
            this.access_token = '';
            this.refresh_token = '';
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('expires_at');
            axios.defaults.headers.common['Authorization'] = '';
        },
        refresh() {
            // check if refresh token is even there.
            if (!this.refresh_token) {
                this.logout();
                return Promise.reject("No refresh token.");
            }

            return new Promise((resolve, reject) => {
                axios
                    .post("/auth/refresh", {
                        refresh_token: this.refresh_token
                    })
                    .then((response) => {
                        this.access_token = response.data.access_token;
                        this.refresh_token = response.data.refresh_token;
                        this.expires_at = response.data.expires_at;

                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.access_token;
                        localStorage['access_token'] = this.access_token;
                        localStorage['refresh_token'] = this.refresh_token;
                        localStorage['expires_at'] = this.expires_at;

                        console.log('Refreshed token.');

                        useEmitter().emit('login', this.user_id);

                        resolve();
                    }
                    )
                    .catch((error) => {
                        this.logout();
                        reject("Could not refresh token.");
                    }
                    );
            });
        },
        async getUser() {
            if (Date.now() > this.expires_at) {
                console.log('Token expired at. Trying to refresh.');
                await this.refresh()
            }

            return new Promise((resolve, reject) => {
                if (this.user != null) {
                    resolve(this.user);
                }

                if (this.user_id == 0) {
                    reject("No user id.");
                }

                axios
                    .get("/users/" + this.user_id)
                    .then((response) => {
                        this.user = response.data;
                        resolve(response.data);
                    })
                    .catch((error) => {
                        reject(error.response.data.errorMessage);
                    });
            });
        }
    }
})
