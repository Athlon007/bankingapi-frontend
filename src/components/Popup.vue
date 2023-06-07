<template>
    <div class="root">
        <button class="btn btn-primary" @click="isOPen = true">Show Popup</button>
        <div class="modal" v-if="isOpen">
            <div>
                <h2>Popup</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</p>
                <button @click="isOpen = false">Close</button>
            </div>
        </div>
    </div>
</template>
<script>
import {ref} from 'vue'

const isOpen = ref(false)
</script>
<style scoped>
.root{
    position: relative;
}
.popup {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    background-color: rgba(0, 0, 0, 0.2);

    display: flex;
    align-items: center;
    justify-content: center;
}

.popup > div {
    background-color: white;
    padding: 1rem;
    border-radius: 0.5rem;
}
</style>