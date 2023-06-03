import { createRouter, createWebHistory } from 'vue-router'

import Home from '../components/Home.vue';
import Dashboard from '../components/Dashboard.vue';
import Transfer from '../components/Transfer.vue';
import Account from '../components/Account.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import UserManagement from '../components/UserManagement.vue';
import Settings from '../components/Settings.vue';
import AccountDeleted from '../components/AccountDeleted.vue';
//import TransferHistoryList from '../components/TransferHistoryList.vue';

/*import ProductList from '../components/products/ProductList.vue';
import CreateProduct from '../components/products/CreateProduct.vue';
import EditProduct from '../components/products/EditProduct.vue';*/

const routes = [
  { path: '/', component: Home },
  { path: '/dashboard', component: Dashboard },
  { path: '/transfer', component: Transfer },
  { path: '/account', component: Account },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/usermanagement', component: UserManagement },
  { path: '/settings', component: Settings },
  { path: '/accountdeleted', component: AccountDeleted },
  //{ path: '/transferlist', component: TransferHistoryList },
  { path: '/:pathMatch(.*)*', redirect: '/' } // 404
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
