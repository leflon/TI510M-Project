<script setup>
import {ref, watch} from 'vue';
import BigButton from './BigButton.vue';
import StyledInput from './StyledInput.vue';
import {UserIcon} from '@heroicons/vue/24/solid';
import {XMarkIcon} from '@heroicons/vue/24/outline';
const props = defineProps({
	index: Number,
	info: {
		type: Object,
		optional: true
	},
	canDelete: Boolean,
	trip: Object
});
const emit = defineEmits(['update', 'delete']);
function seatsFormatted(n) {
	if (n > 20)
		return `${n} available`;
	else
		return `Only ${n} left`;
}

function selectClass(c) {
	props.info.preferred_class = c;
}

function deletePassenger() {
	emit('delete', props.index);
}

</script>

<template>
	<div class='passenger-form'>
		<div v-if='canDelete' class='close-button' @click='deletePassenger'>
			<XMarkIcon :style='{ width: 24, height: 24 }'></XMarkIcon>
		</div>
		<div class="form-label">
			<UserIcon :style='{ width: 24, height: 24 }'></UserIcon>
			<span>Passenger {{ props.index + 1 }}</span>
		</div>
		<div class='personal-info'>
			<StyledInput label='First name' v-model='props.info.first_name'></StyledInput>
			<StyledInput label='Last name' v-model='props.info.last_name'></StyledInput>
			<StyledInput label='Age' type='number' v-model='props.info.age'></StyledInput>
		</div>
		<h3>Select a class</h3>
		<div class='class-selector'>
			<div v-for='[k, v] of Object.entries(trip.available_seats)' class='class-container' @click='selectClass(k)'
				:selected='props.info.preferred_class === k'>
				<div class="left">
					<div class='class-title'>{{ k }}</div>
					<div class="class-availability">{{ seatsFormatted(v) }}</div>
				</div>
				<div class='class-price'>
					<span>From</span>
					<span>¥{{ trip.class_prices[k] }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.close-button {
	display: flex;
	width: 34px;
	height: 34px;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	position: absolute;
	top: 10px;
	right: 10px;
	cursor: pointer;
	transition: background .3s ease;

	&:hover {
		background: #ddd8;
	}
}

.passenger-form {
	position: relative;
	border: 1px solid #ddd;
	padding: 20px;
	border-radius: 10px;
	background-color: white;
}

.passenger-form .form-label {
	font: 600 14pt 'Outfit';
	display: flex;
	align-items: center;
}

.passenger-form .personal-info {
	display: flex;
	gap: 10px;
}

.class-selector {
	display: flex;
	gap: 10px;
}

.class-container {
	border: 1px solid #ddd;
	border-radius: 10px;
	display: inline-flex;
	flex-direction: row;
	align-items: center;
	padding: 5px 10px;
	gap: 20px;
	cursor: pointer;
	transition: background .1s ease, border-color .1s ease;

	&[selected=true] {
		border-color: var(--secondary);
		background: var(--secondary-10);
	}
}

.class-container .class-price span:first-child {
	font: 10pt 'Fira Sans';
	margin-right: 3px;
	color: #777;
}

.class-container .class-title {
	font: 600 16pt 'Outfit';
}

.class-container .class-availability {
	font: 300 10pt 'Fira Sans';
}

.class-select-btn {
	height: auto;
}
</style>