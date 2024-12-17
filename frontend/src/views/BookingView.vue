<script setup>
import {onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import {store} from '../lib/store';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import BigButton from '../components/BigButton.vue';
import api from '../lib/api';
import TripDetails from '../components/TripDetails.vue';
import TicketViewer from '../components/TicketViewer.vue';
import {CheckCircleIcon} from '@heroicons/vue/24/outline';

const props = defineProps({id: String});
const isLoading = ref(true);
const booking = ref(null);

const route = useRoute();
const origin = route.query.origin;
const saveError = ref(null);

onMounted(async () => {
	const res = await api.public.get(`/bookings/${props.id}`);
	booking.value = res;
	isLoading.value = false;
});

async function saveBooking() {
	const res = await api.private.post(`/save-booking/${booking.value.id}`);
	if (res?.success) {
		booking.value.customer_id = store.customer.id;
	} else {
		saveError.value = res?.error;
	}
}

</script>

<template>
	<div v-if='!isLoading'>
		<div class='booking-view'>
			<div class='booking-success' v-if='origin === "booking_process"'>
				<div class='left'>
					<CheckCircleIcon :style='{ width: 48, height: 48 }'></CheckCircleIcon>
				</div>
				<div class="right">
					<h1>Booking successful!</h1>
					<p>Your booking has been successfully processed. You can now view your tickets below.</p>
					<p v-if='!store.customer'>
						Register an account to view your bookings and tickets anytime.
					</p>
				</div>
			</div>
			<h1>Your trip to {{ booking.trip.arrival_station.city }}</h1>
			<h2>Booking {{ booking.code }}</h2>
			<div class='add-trip' v-if='!booking.customer_id && store.customer'>
				<div v-if='saveError' class='error'>{{ saveError }}</div>
				<BigButton @click='saveBooking'>Save this trip to your account</BigButton>
			</div>
			<TripDetails :trip='booking.trip' :showLink='false' />
			<div class="ticket-list">
				<TicketViewer :ticket='ticket' v-for='ticket of booking.tickets' :key='ticket.id' />
			</div>
		</div>
	</div>
	<LoadingIndicator v-else></LoadingIndicator>
</template>
<style scoped>
.booking-view {
	width: 80%;
	margin: 0 auto;
	display: flex;
	align-items: center;
	flex-direction: column;
}

.booking-success {
	display: flex;
	gap: 20px;
	align-items: center;
	padding: 20px;
	background: rgb(142, 255, 142);
	border-left: 10px solid rgb(43, 195, 43);
	width: 80%;
	margin: 10px auto;

	& h1 {
		color: black;
	}
}

.ticket-list {
	display: flex;
	gap: 30px;
}
</style>