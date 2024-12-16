<script setup>
import {store} from '../lib/store';
import {ref} from 'vue';
import StyledInput from '../components/StyledInput.vue';
import BigButton from '../components/BigButton.vue';
import api from '../lib/api';
const email = ref();
const code = ref();
const findError = ref(null);

async function fetchBooking() {
	api.public.get(`/bookings/code/${code.value}?email=${email.value}`)
		.then(res => {
			if (res.error) {
				findError.value = res.error;
			} else {
				location.href = import.meta.env.VITE_APP_URL + '/booking/' + res.id + '?origin=my_view';
			}
		});
}

</script>

<template>
	<h1>See your bookings</h1>
	<div class='booking-finder'>
		<h2>Find a booking</h2>
		<div v-if='findError' class='error'>{{ findError }}</div>
		<StyledInput v-model='code' label='Booking Code'></StyledInput>
		<StyledInput v-model='email' label='Email'></StyledInput>
		<BigButton @click='fetchBooking'>Search</BigButton>
	</div>
</template>
<style scoped>
.booking-finder {
	padding: 20px;
	width: 30%;
	margin: 20px auto;
	background: white;
	border: 1px solid #ddd;
	border-radius: 10px;
	& .input-container {
		margin-right: 10px;
	}
}
</style>