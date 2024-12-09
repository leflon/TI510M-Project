<!-- A simple component providing a dropdown to select a particular station in a set of stations -->
<script setup>
</script>

<template>
    <span class="station-picker">
        <p>Where ? </p>
        <input type="text">
    </span>
</template>

<style>
.station-picker{
    display: flex;
    align-items: center;
    font-size: 24px;
    gap: 4px;
    padding: 8px;
    border-radius: 8px;
    background-color: rgb(60, 125, 183);
}

input[type="text"]{
    width: 100px;
    background-color: rgb(45, 100, 148);
    border: none;
    color: rgb(230, 230, 230);
}
</style>
