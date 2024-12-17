<script setup>
import {store} from '../lib/store';
import {onMounted, ref} from 'vue';
import StyledInput from '../components/StyledInput.vue';
import BigButton from '../components/BigButton.vue';
import api from '../lib/api';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import TripDetails from '../components/TripDetails.vue';
const email = ref();
const code = ref();
const findError = ref(null);
const listedBookings = ref([]);
const isLoadingMyBookings = ref(false);

async function findBooking() {
	api.public.get(`/bookings/code/${code.value}?email=${email.value}`)
		.then(res => {
			if (res.error) {
				findError.value = res.error;
			} else {
				location.href = import.meta.env.VITE_APP_URL + '/booking/' + res.id + '?origin=my_view';
			}
		});
}

async function getMyBookings() {
	isLoadingMyBookings.value = true;
	api.private.get('/my-bookings')
		.then(res => {
			isLoadingMyBookings.value = false;
			if (res.error) {
				alert(res.error);
			} else {
				listedBookings.value = res;
				console.log(res);
			}
		});
}
onMounted(getMyBookings);
</script>

<template>
	<h1>See your bookings</h1>
	<div class='my-bookings' v-if='store.customer'>
		<LoadingIndicator v-if='isLoadingMyBookings'></LoadingIndicator>
		<TripDetails v-for='booking in listedBookings' :key='booking.id' :trip='booking.trip'></TripDetails>
	</div>
	<div class='booking-finder island'>
		<h2>Find a booking</h2>
		<div v-if='findError' class='error'>{{ findError }}</div>
		<StyledInput v-model='code' label='Booking Code'></StyledInput>
		<StyledInput v-model='email' label='Email'></StyledInput>
		<BigButton @click='findBooking'>Search</BigButton>
	</div>
</template>
<style scoped>
h1 {
	text-align: center;
}

.booking-finder {
	width: 30%;
	margin: 20px auto;

	& .input-container {
		margin-right: 10px;
	}
}
</style>