<script setup>
import QRCode from 'qrcode';
import {computed, onMounted, ref} from 'vue';
import LoadingIndicator from './LoadingIndicator.vue';
import {SparklesIcon, XMarkIcon} from '@heroicons/vue/24/solid';
const props = defineProps({
	ticket: Object
});
const qrCode = ref(null);
const bigQr = ref(false);

onMounted(() => {
	QRCode.toDataURL(props.ticket.id, {width: 1000, height: 1000})
		.then(url => qrCode.value = url)
		.catch(err => console.error(err));
});
const fullName = computed(() => {
	return `${props.ticket.passenger.first_name} ${props.ticket.passenger.last_name}`;
});
</script>
<template>
	<div class='ticket-viewer'>
		<div class="big-qr-container" v-if='bigQr'>
			<div class='big-qr-close' @click='bigQr = false'>
				<XMarkIcon :style='{ width: 48, height: 48, fill: "white" }'></XMarkIcon>
			</div>
			<img :src='qrCode' alt='QR Code' />
		</div>
		<div class='passenger'>
			<div class='name'>{{ fullName }}</div>
			<div class='class-name' :value='ticket.seat["class"]'>
				<SparklesIcon v-if='ticket.seat["class"] === "First"' :style='{ width: 16, height: 16 }'></SparklesIcon>
				<span>
					{{ ticket.seat['class'] }} class
				</span>
			</div>
		</div>
		<div class='qr-code'>
			<div v-if='qrCode' @click='bigQr = true'>
				<img :src='qrCode' alt='QR Code' />
			</div>
			<LoadingIndicator v-else></LoadingIndicator>
		</div>
		<div class='seat'>
			<div class='car'>Car <span class="bold">{{ ticket.seat.car.toString().padStart(2, '0') }}</span></div>
			<div class='seat-sep'>•</div>
			<div class='seat-number'>Seat <span class='bold'>{{ ticket.seat.seat_number }}</span></div>
		</div>
		<div class="trademark">
			<div class="catchphrase">Powered By</div>
			<div class="logo">WuWu</div>
		</div>
	</div>
</template>

<style scoped>
.ticket-viewer {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	border: 1px solid #ddd;
	background-color: white;
	border-radius: 10px;
	width: 300px;
	height: 400px;
	text-align: center;
	padding: 10px;
}

.big-qr-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.6);
	z-index: 100000;
	display: flex;
	justify-content: center;
	align-items: center;

	& img {
		display: block;
		height: 80%;
		object-fit: contain;
		flex: 1;
	}

	& .big-qr-close {
		position: fixed;
		top: 10px;
		right: 10px;
		cursor: pointer;
	}
}

.passenger {
	& .name {
		font: 600 18pt 'Outfit';
	}

	& .class-name {
		font: oblique 300 12pt 'Outfit';
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 3px;

		&[value='First'] {
			color: rgb(255, 206, 12);
			font-weight: 500;
		}
	}
}

img {
	image-rendering: pixelated;
	width: 250px;
	height: 250px;
	cursor: pointer;
}

.seat {
	display: flex;
	gap: 5px;
	align-items: center;

	& .bold {
		font: 600 13pt 'Outfit';
	}
}

.trademark {
	position: absolute;
	bottom: 0;
	right: 5px;
	display: flex;
	align-items: baseline;
	gap: 3px;

	& .catchphrase {
		font: 300 8pt 'Fira Sans';
		color: black;
	}

	& .logo {
		font: 600 12pt 'Outfit';
	}
}
</style>