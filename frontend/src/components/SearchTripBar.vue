<script setup>
import DatePicker from "../components/DatePicker.vue";
import StationPicker from "../components/StationPicker.vue";
</script>

<template>
    <div class="search-trip-bar">
        <StationPicker></StationPicker>    
        <StationPicker></StationPicker>    
        <DatePicker></DatePicker>
        <DatePicker></DatePicker>
    </div>
</template>

<style>
.search-trip-bar{
    display: flex;
    justify-content: center;
    background-color: #363636;
    border-radius: 8px;
    gap: 10px;
    width: 100%;
}

</style>