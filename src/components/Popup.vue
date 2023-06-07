<template>
    <div class="popup">
        <div class="popup-inner">
            <slot />
            <button class="popup-close">
                Close popup
            </button>
        </div>
    </div>
</template>
<script>
</script>
<style scoped>
.popup{
    position:fixed;
    top:0;
    left:0;
    right: 0;
    bottom:0;
    z-index: 0;
    background-color: rgba(0,0,0,0.2);

    display: flex;
    align-items: center;
    justify-content: center;
}
    .popup-inner{
        position: relative;
        padding: 32px;
        width: 100%;
        max-width: 500px;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
    }

</style>