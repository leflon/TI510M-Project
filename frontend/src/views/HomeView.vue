<script setup>
import {ref} from 'vue';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import SearchTripBar from "../components/SearchTripBar.vue";
import api from '../lib/api';
import TripDetails from '../components/TripDetails.vue';

const isLoading = ref(false);
const displayResults = ref(false);
const trips = ref([]);


async function fetchTrips(origin, destination, date) {
	console.log(origin, destination, date);
	isLoading.value = true;
	api.public.get('/trips/search', {origin: origin.id, destination: destination.id})
		.then((result) => {
			trips.value = result;
			isLoading.value = false;
			displayResults.value = true;
			console.log(result);
		});
}

</script>

<template>
	<h1>Welcome to WuWu</h1>
	<SearchTripBar @searchTrips='fetchTrips'></SearchTripBar>
		<LoadingIndicator v-if='isLoading'></LoadingIndicator>
	<div class='trip-list'>
		<TripDetails v-for='trip of trips' :trip></TripDetails>
	</div>
</template>



<style>
.trip-list {
	width: 80%;
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
