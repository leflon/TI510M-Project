<script setup>
import {watch} from 'vue';
const props = defineProps({
    label: String
});
const date = defineModel();
watch(date, (newVal) => {
    if (new Date(newVal).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0))
        date.value = new Date().toISOString().split('T')[0];
});
</script>

<template>
    <div class='date-picker'>
        <div class='date-picker-label'>{{ label }}</div>
        <input type='date' v-model='date' />
    </div>
</template>

<style scoped>
.date-picker {
    padding: 10px;
    border: 1px solid #ddd;
    background-color: white;
    border-radius: 5px;
}

.date-picker-label {
    font: 300 9pt 'Fira Sans';
    color: #7e7e7e;
}
</style>
