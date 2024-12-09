<script setup>
import TripDetailBar from "../components/TripDetailBar.vue" 
</script>

<template>
    <div class="search-result-wrapper">
        
        <TripDetailBar></TripDetailBar>
        <TripDetailBar></TripDetailBar>
        <TripDetailBar></TripDetailBar>
    </div>
</template>

<style>
.search-result-wrapper{
    display: flex;
    flex-direction: column;
    background-color: green;
    width: 100%;
}
</style>