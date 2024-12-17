<script setup>
import {store} from '../lib/store';
import {onMounted, ref, watch} from 'vue';
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
				findError.value = res.error;
			} else {
				listedBookings.value = res;
				console.log(res);
			}
		});
}
watch(store.customer, getMyBookings, {deep: true});
onMounted(getMyBookings);
</script>

<template>
	<h1>See your bookings</h1>
	<div class='my-bookings' v-if='store.customer'>
		<LoadingIndicator v-if='isLoadingMyBookings'></LoadingIndicator>
		<TripDetails v-for='booking in listedBookings' :key='booking.id' :trip='booking.trip' :showLink='false'
			:showLinkToBooking='true' :bookingId='booking.id'>
		</TripDetails>
	</div>
	<div v-if='store.customer'>
		<div class='sep'></div>
		<div class='add-cta'>
			A booking is missing? Find it using your booking code.
		</div>
	</div>
	<div v-else>
		<div class="register-cta">
			Register to WuWu to browse your bookings with ease!
		</div>
		<div class="or">OR</div>
	</div>
	<div class='booking-finder island'>
		<h2>Find a booking</h2>
		<div v-if='findError' class='error'>{{ findError }}</div>
		<div class="finder-inputs">
			<StyledInput v-model='code' label='Booking Code'></StyledInput>
			<StyledInput v-model='email' label='Email'></StyledInput>
		</div>
		<BigButton @click='findBooking'>Search</BigButton>
	</div>
</template>
<style scoped>
h1 {
	text-align: center;
}

.sep {
	width: 100px;
	height: 1px;
	background: #fff4;
	margin: 10px auto;
}

.my-bookings {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.booking-finder {
	width: 30%;
	margin: 20px auto;

	& .input-container {
		margin-right: 10px;
	}
}

.finder-inputs {
	display: flex;
	gap: 10px;
}

.add-cta {
	color: white;
	text-align: center;
	margin-top: 20px;
	font: 500 14pt 'Fira Sans';
}

.register-cta {
	color: white;
	text-align: center;
	margin-top: 20px;
	font: 500 14pt 'Fira Sans';
}

.or {
	position: relative;
	color: white;
	font: 800 14pt 'Outfit';
	width: max-content;
	margin: 10px auto;

	&:before,
	&:after {
		content: '';
		position: absolute;
		width: 50px;
		height: 1px;
		background-color: #fff;
		top: 50%;
	}

	&:before {
		right: calc(100% + 10px);
	}

	&:after {
		left: calc(100% + 10px);
	}
}
</style>