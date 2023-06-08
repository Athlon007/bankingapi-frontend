<template>
  <section class="d-flex flex-column flex-grow-1 justify-content-center">
    <div id="error-alert" class="alert alert-danger alert-fixed" v-if="this.error" @click="this.dismiss()">
      {{ this.error }}
    </div>
    <div id="success-alert" class="alert alert-success alert-fixed" v-if="this.success" @click="this.dismiss()">
      {{ this.success }}
    </div>
    <div class="container card p-3">
      <h1>Settings</h1>
      <div class="col-12">
        <button class="btn btn-primary" @click="toggleEdit()" :class="editStart ? 'disabled' : ''">Edit Account</button>
      </div>
      <div class="row" :class="editStart ? '' : 'disabled'">
        <form>
          <div class="row">
            <div class="col-6 form-group">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" class="d-input w-100" v-model="this.userRequest.username"
                @keyup.enter="updateAccount" />
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
              <input type="password" id="password" name="password" class="d-input w-100" v-model="this.password_confirm"
                @keyup.enter="updateAccount" />
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
              <input type="text" id="lastname" name="lastname" class="d-input w-100" v-model="this.userRequest.lastname"
                @keyup.enter="updateAccount" />
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
          <button type="button" class="btn btn-primary" @click="updateAccount">Update</button>
        </form>
      </div>
      <div class="row py-2">
        <div class="mty-4">
          <h3>Danger Zone</h3>
          <button class="btn btn-danger" @click="toggleDialog(true)"> {{ userHasAccount ? "Deactivate Account" :
            "Remove Account" }} </button>
        </div>
      </div>
    </div>
    <dialog id="delete-account-dialog">
      <div class="row">
        <h2>Warning</h2>
      </div>
      <hr />
      <div class="row">
        <p>Are you sure you want to <strong>{{ userHasAccount ? "deactivate" : "remove" }}</strong> your account?</p>
        <p v-if="userHasAccount">This action can only be reverted by contacting customer support.</p>
      </div>
      <div class="row d-flex justify-content-evenly">
        <button class="btn btn-danger w-25" @click="deleteAccount()">Yes</button>
        <button id="btn-no" class="btn btn-primary w-25" @click="toggleDialog(false)">No</button>
      </div>
    </dialog>
  </section>
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
      password_confirm: "",
      userHasAccount: false,
      success: "",
      editStart: false
    }
  },
  methods: {
    updateAccount() {
      this.error = "";
      this.success = "";

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
          this.success = "Account updated successfully!";
          useUserSessionStore().user = response.data;
          this.editStart = false;
          useEmitter().emit("login");
        })
        .catch(error => {
          this.error = error.response.data.error_message;
        });
    },
    toggleDialog(enabled) {
      const dialog = document.getElementById("delete-account-dialog");
      if (enabled) {
        dialog.showModal();

        // Focus on btn-no.
        document.getElementById("btn-no").focus();
      } else {
        dialog.close();
      }
    },
    deleteAccount() {
      this.toggleDialog(false);
      axios.delete("/users/" + useUserSessionStore().getUserId)
        .then(response => {
          this.error = "";
          this.$router.push({ path: "/accountdeleted", query: { wasDeactivated: this.userHasAccount } });
          useUserSessionStore().logout();
          useEmitter().emit("logout");
        })
        .catch(error => {
          this.error = error.response.data.error_message;
        });
    },
    dismiss() {
      this.error = "";
      this.success = "";
    },
    toggleEdit() {
      this.editStart = true;
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
        this.userHasAccount = response.data.current_account != null;
      })
      .catch(error => {
        this.error = error.response.data.error_message;
      });
  }
}
</script>

<style scoped>
dialog {
  border-width: 0px;
  border-radius: calc(5px * 3.14);
  box-shadow: 0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 1.6rem;
  max-width: 400px
}

.disabled {
  opacity: 0.6;
}

.mty-4 {
  margin-top: 1.6rem;
}
</style>