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
	isLoading.value = true;
	console.log(date);
	api.public.get('/trips/search', {origin: origin.id, destination: destination.id, date: date})
		.then((result) => {
			if (result.error)
				return;
			trips.value = result.filter(trip => new Date(trip.departure_time) > new Date());
			isLoading.value = false;
			displayResults.value = true;
		});
}

</script>

<template>
	<div class="catchphrase">Book a trip to <span class="paradise">paradise</span></div>

	<div class="search-container">
		<SearchTripBar @searchTrips='fetchTrips'></SearchTripBar>
	</div>
	<div class='trip-list'>
		<LoadingIndicator v-if='isLoading'></LoadingIndicator>
		<TripDetails v-else v-for='trip of trips' :trip></TripDetails>
	</div>
</template>



<style scoped>
.trip-list {
	width: 80%;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 10px auto;
}

.catchphrase {
	color: white;
	font: 800 30pt 'Outfit';
	text-align: center;
	margin: 40px 0;
}

.paradise {
	background: linear-gradient(45deg, rgba(255, 251, 175, 1) 0%, rgba(255, 151, 0, 1) 100%);
	-webkit-background-clip: text;
	background-clip: text;
	-webkit-text-fill-color: transparent;
}

.search-container {
	position: sticky;
	top: 20px;
	z-index: 10;
	padding: 20px 60px;
	background: white;
	width: max-content;
	border-radius: 10em;
	border: 1px solid #ddd;
	box-shadow: 0 10px 10px #0001;
	margin: 0 auto;
}
</style>
