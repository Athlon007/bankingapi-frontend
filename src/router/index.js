import { createRouter, createWebHistory } from 'vue-router'

import Home from '../components/Home.vue';
import Dashboard from '../components/Dashboard.vue';
import Transfer from '../components/transactions/Transfer.vue';
import ATM from '../components/ATM.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import UserManagement from '../components/UserManagement.vue';
import Settings from '../components/Settings.vue';
import AccountDeleted from '../components/AccountDeleted.vue';
import TransactionHistory from '../components/transactions/TransactionHistory.vue';
//import TransferHistoryList from '../components/TransactionHistory.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/dashboard', component: Dashboard },
  { path: '/transfer', component: Transfer },
  { path: '/atm', component: ATM },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/usermanagement', component: UserManagement },
  { path: '/settings', component: Settings },
  { path: '/accountdeleted', component: AccountDeleted },
  { path: '/transactionhistory', component: TransactionHistory },
  { path: '/:pathMatch(.*)*', redirect: '/' } // 404
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
