<script setup>
const props = defineProps({
    label: String
})
const date = defineModel();
</script>

<template>
    <div class='date-picker'>
        <div class='date-picker-label'>{{  label }}</div>
        <input type='date' v-model='date' />
    </div>
</template>

<style scoped>
.date-picker {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}
.date-picker-label {
    font: 300 9pt 'Fira Sans';
    color: #7e7e7e;
}
</style>
