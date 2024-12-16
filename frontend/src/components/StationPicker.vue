<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue';
import api from '../lib/api';
const props = defineProps({
    type: String
});

const selectedStation = defineModel();
const inputVal = ref('');
const proposedStations = ref([]);
const focused = ref(false);
const fetchStations = async () => {
    const stations = await api.public.get('/stations/search', {name: inputVal.value}) || [];
    proposedStations.value = stations.slice(0, 10);
    focused.value = true;
}

const selectStation = (station) => {
    selectedStation.value = station; 
    inputVal.value = station.name;
    focused.value = false;
}
</script>

<template>
    <div class='station-picker'>
        <div class='station-picker-label'>{{ props.type === 'departure' ? 'From': 'To'}}</div>
        <input 
            type='text' 
            v-model='inputVal' 
            @input='fetchStations' 
            :placeholder='props.type === "departure" ? "Departure Station" : "Arrival Station"' 
            @focusin='focused = true'
        />
        <div class='proposed-stations' v-if='focused && proposedStations.length'>
            <div v-for='station of proposedStations' class='proposed-station-item'>
                <div
                    @click.capture='selectStation(station)' 
                    v-html='station.name.replace(new RegExp(`(${inputVal})`, "gi"), "<b>$1</b>")'
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.station-picker {
    border: 1px solid grey;
    background: white;
    border-radius: 5px;
    padding: 10px;
    border: 1px solid #ddd;
    display: inline-block;
    position: relative;
}

.station-picker-label {
    color: #7e7e7e;
    font-weight: 300;
    font-size: 8pt;
}

input {
    appearance: none;
    border: none;
    outline: none;
    font-weight: 600;
}
.proposed-stations {
    z-index: 9999;
    position: absolute;
    background: white;
    border: 1px solid #eee;
    box-shadow: 0px 5px 10px #0002;
    top: 105%;
    left: 0;
    width: max-content;
    padding: 5px 10px;
    border-radius: 10px;
    max-height: 400px;
    overflow: auto;
}
.proposed-station-item {
    margin: 5px 0;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #b3bac0;
    }
}
.no-station {
    font: 600 13pt 'Fira Sans';
    color: #444;
    text-align: center;
    padding: 10px;
}
</style>
