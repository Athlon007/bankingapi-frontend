<template>
    <div v-if="this.isUser" class="row">

        <div class="row">
            <div class="col-4">
                <h3>Sorry! You must wait a bit!</h3>
                <p>You must wait for one of our employees to approve you and create your account.</p>
                <p>In the meantime, you can enjoy this game!</p>
                <p><strong>Good luck!</strong></p>
                <p><i>PS: Use Arrows to Move, Press A to shoot!</i></p>
            </div>
            <div class="col-8 game-col">
                <iframe src="https://kfigura.nl/game.html" title="game" class="game"></iframe>
            </div>
        </div>
    </div>
    <div v-else>
        <h3>You do not have any accounts just yet...</h3>
        <p>Go into Management section to open your acount.</p>
        <router-link class="btn btn-primary" to="/usermanagement">Management</router-link>
    </div>
</template>

<script>
import { useUserSessionStore } from '../../stores/usersession';

export default {
    name: "NoAccounts",
    data() {
        return {
            isUser: true
        }
    },
    async mounted() {
        await useUserSessionStore().getUser();
        const role = useUserSessionStore().user.role;

        if (role !== "USER") {
            this.isUser = false;
        }
    }
}
</script>

<style scoped>
.game {
    width: 100%;
    height: 50rem;
    zoom: 0.5;
    transform: scale(0.8) translateY(-10rem);
    padding-top: 0;
}

.game-col {
    padding-top: 0;
    margin-top: 0;
}
</style>
