<template>
    <ul class="list-group list-group-horizontal" @click="activate()" :class="this.isEdited ? 'edited' : ''">
        <li class="list-group-item flex-shrink id-container">{{ user.id }}</li>
        <li class="list-group-item flex-fill w-25 no-border-right">{{ user.firstname }} {{ user.lastname }}</li>
        <li class="list-group-item flex-fill w-25 mail">{{ user.email }}</li>
        <li class="list-group-item flex-shrink id-container">{{ user.current_account == null ? "No" : "Yes" }}</li>
        <li class="list-group-item flex-shrink id-container">{{ user.active ? "Yes" : "No" }}</li>
    </ul>
</template>

<script>
import useEmitter from "../../emitter";

export default {
    name: "UserManagementListItem",
    data() {
        return {
            isEdited: false,
        };
    },
    props: {
        key: Number,
        user: Object
    },
    methods: {
        async activate() {
            useEmitter().emit('user-edit-end');
            this.isEdited = true;
            useEmitter().emit("activate-user", this.user);
        }
    },
    mounted() {
        useEmitter().on("user-edit-end", () => {
            this.isEdited = false;
        });
    }
}
</script>

<style scoped>
.id-container {
    width: 4rem;
}

.no-border-right {
    border-right: none;
}

ul:hover {
    cursor: pointer;
}

ul:hover>li {
    background-color: #e9ecef;
}

.edited>li {
    background-color: #2c378233 !important;
}

.list-group-item {
    text-overflow: ellipsis;
    overflow: hidden;
    border-radius: 0;
}

.list-group {
    border-radius: 0;
}
</style>