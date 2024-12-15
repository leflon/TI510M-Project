<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
	buttonClass: {
		type: String,
		default: ''
	}
});

const emit = defineEmits(['click']);

function handleClick(event) {
	emit('click', event);
}
</script>
<template>
	<button @click="handleClick" :class="buttonClass">
		<slot></slot>
	</button>
</template>

<style scoped>
button {
	display: flex;
	align-items: center;
	gap: 2px;
	appearance: none;
	padding: 10px;
	cursor: pointer;
	border: none;
	background: var(--main-blue);
	border-radius: 5px;
	color: #fff;
	font: 600 16pt 'Outfit';
}
</style>
