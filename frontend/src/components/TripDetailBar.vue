<script setup></script>

<template>
    <div class="trip-detail-bar">
        <p>Trip ID</p>

        <p>From: </p>

        <p>To: </p>

        <p>Dep. Hour:</p>

        <p>Arr. Hour:</p>

        <p>Price: </p>
    </div>
</template>

<style>
.trip-detail-bar{
    display: flex;
    justify-content: space-between;
    background-color: rgb(26, 51, 33);
    border-radius: 4px;
}
.trip-detail-bar *{
    padding: 4px;
    margin: 4px;
}
</style>
