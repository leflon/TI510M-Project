<script setup>
import {ref} from 'vue';
import DatePicker from "../components/DatePicker.vue";
import StationPicker from "../components/StationPicker.vue";
import BigButton from './BigButton.vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'

const emit = defineEmits(['searchTrips']);

const origin = ref();
const destination = ref();
const date = ref();

const onclick = () => {
    emit('searchTrips', origin.value, destination.value, date.value);
}

</script>

<template>
    <div class="search-trip-bar">
        <StationPicker type='departure' v-model='origin'></StationPicker>    
        <StationPicker type='arrival' v-model='destination'></StationPicker>    
        <DatePicker v-model='date' label='Departure Date'></DatePicker>
        <BigButton @click='onclick'>
            <MagnifyingGlassIcon style="width: 24px; height: 24px;"></MagnifyingGlassIcon>
            <div>Search</div>
        </BigButton>
    </div>
</template>

<style scoped>
.search-trip-bar {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    height: 58px;
    & > :not(button) {
        box-sizing: border-box;
        height: 100%;
    }
}
</style>

