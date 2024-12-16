<script setup>
import {onMounted, ref, computed} from 'vue';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import api from '../lib/api';
import TripDetails from '../components/TripDetails.vue';
import PassengerForm from '../components/PassengerForm.vue';
import {UserIcon} from '@heroicons/vue/24/solid';
import {ArrowRightIcon, PlusCircleIcon} from '@heroicons/vue/24/outline';
import BigButton from '../components/BigButton.vue';
import StyledInput from '../components/StyledInput.vue';
const props = defineProps({id: String});

const isLoading = ref(true);
const isBookingLoading = ref(false);
const trip = ref(null);
const passengers = ref([{}]);
const email = ref();
onMounted(async () => {
	trip.value = await api.public.get(`/trips/${props.id}`);
	isLoading.value = false;
});
function addPassenger() {
	passengers.value.push({});
}
function deletePassenger(i) {
	console.log(passengers.value.map(p => p.first_name));
	passengers.value = passengers.value.filter((_, index) => index !== i);
	console.log(passengers.value.map(p => p.first_name));
}
function updatePassenger(i, data) {
	console.log(data);
	passengers.value[i] = data.value;
}

async function book() {
	if (!email.value || !canBook) return;
	console.log(email.value, passengers.value);
	isBookingLoading.value = true;
	const res = await api.public.post(`/book/${props.id}`, {passengers: passengers.value, email: email.value});
	isBookingLoading.value = false;
	if (res.error) {
		alert(res.error);
	} else {
		location.href = import.meta.env.VITE_APP_URL + '/booking/' + res.id + '?origin=booking_process';
	}
}

const canBook = computed(() => {
	return passengers.value.every(p => p.first_name && p.last_name && p.age && p.preferred_class);
});

</script>
<template>
	<div v-if='!isLoading && trip' class='booking-process'>
		<div class='left'>
			<h2>Book this trip to {{ trip.arrival_station.city }}</h2>
			<TripDetails :trip :showLink='false'></TripDetails>
			<div class='passenger-forms'>
				<PassengerForm :trip v-for='[k, v] in Object.entries(passengers)' :canDelete='parseInt(k) !== 0'
					:index='parseInt(k)' @delete='deletePassenger' @update='updatePassenger' :info='v'></PassengerForm>
				<div class='add-passenger' @click='addPassenger'>
					<PlusCircleIcon :style='{ width: 96, height: 96, stroke: "#ddd" }'></PlusCircleIcon>
					<div>Add a passenger</div>
				</div>
			</div>
		</div>
		<div class='right'>
			<div class="summary" v-if='passengers'>
				<div class='summary-title'>Summary</div>
				<div v-for="(passenger, index) in passengers" :key="index" class="passenger-summary">
					<div :style='{ display: "contents" }'>
						<div class='passenger-summary-left'>
							<div class='passenger-summary-name'>
								<UserIcon :style='{ width: 16, height: 16 }'></UserIcon>
								<span>{{ passenger.first_name && passenger.last_name ? passenger.first_name + ' ' +
									passenger.last_name : 'Passenger ' + (index + 1) }}</span>
							</div>
							<div class='passenger-summary-sep' v-if='passenger.preferred_class'>•</div>
							<div class='passenger-summary-class'>{{ passenger.preferred_class }}</div>
						</div>
						<div class='passenger-summary-right' v-if='passenger.preferred_class'>
							¥{{ trip.class_prices[passenger.preferred_class] }}
						</div>
					</div>
				</div>
				<div v-if='passengers.length' class='passenger-summary'>
					<div class='passenger-summary-left'>
						<span :style='{ fontStyle: "oblique" }'>Service fee</span>
						<span>&nbsp;{{ passengers.length > 1 ? `(×${passengers.length})` : '' }}</span>
					</div>
					<div class='passenger-summary-right'>¥{{ passengers.length * 15 }}</div>
				</div>
				<div class="total-price">
					<span>Total</span>
					<span>
						¥{{ passengers.reduce((acc, p) => acc += trip.class_prices[p.preferred_class] || 0,
							passengers.length * 15)
						}}
					</span>
				</div>
			</div>
			<StyledInput v-model='email' type='text' label='Email'></StyledInput>
			<BigButton class='book-button' v-if='canBook' @click='book'>
				<div v-if='!isBookingLoading'>
					<span>Book</span>
					<ArrowRightIcon style='width: 16px; height: 16px'></ArrowRightIcon>
				</div>
				<LoadingIndicator :size='10' v-else></LoadingIndicator>
			</BigButton>
		</div>
	</div>
	<LoadingIndicator v-else></LoadingIndicator>
</template>
<style scoped>
.booking-process {
	display: flex;
	width: 100%;
	height: 100%;
	flex-direction: row;
	gap: 10px;
}

.left {
	padding: 20px;
	width: 60%;
	height: 100%;
}

.right {
	padding: 20px;
	width: 40%;
	height: 100%;
}

.passenger-forms {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.add-passenger {
	border: 1px solid #ddd;
	margin: 5px auto;
	display: inline-flex;
	flex-direction: column;
	place-items: center;
	padding: 10px 20px;
	border-radius: 10px;
	cursor: pointer;
	transition: background .3s ease;

	&:hover {
		background: #eee7;
	}
}

.summary {
	border: 1px solid #ddd;
	border-radius: 10px;
}

.summary .summary-title {
	font: 600 12pt 'Outfit';
	padding: 5px 10px;
	border-bottom: 1px solid #ddd;
}

.passenger-summary-name {
	display: flex;
	align-items: center;
}

.passenger-summary-sep {
	margin: 0 5px;
}

.passenger-summary {
	display: flex;
	padding: 5px 10px;
	border-bottom: 1px solid #ddd;
	justify-content: space-between;
}

.passenger-summary-left {
	display: flex;
	align-items: center;
}

.total-price {
	display: flex;
	justify-content: space-between;
	padding: 5px 10px;
	font: 600 12pt 'Outfit';
}

.right {
	display: flex;
	flex-direction: column;
}

.book-button {
	margin: 10px 0;
	align-self: flex-end;
}
</style>