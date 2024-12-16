<script setup>
import {onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import api from '../lib/api';
import TripDetails from '../components/TripDetails.vue';
import TicketViewer from '../components/TicketViewer.vue';
import {CheckCircleIcon} from '@heroicons/vue/24/outline';

const props = defineProps({id: String});
const isLoading = ref(true);
const booking = ref(null);

const route = useRoute();
const origin = route.query.origin;

onMounted(async () => {
	const res = await api.public.get(`/bookings/${props.id}`);
	booking.value = res;
	isLoading.value = false;
});
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
				</div>
			</div>
			<h1>Your trip to {{ booking.trip.arrival_station.city }}</h1>
			<h2>Booking {{ booking.code }}</h2>
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
}

.ticket-list {
	display: flex;
	gap: 30px;
}
</style>