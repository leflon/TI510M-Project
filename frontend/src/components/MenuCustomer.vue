<script setup>
import {UserIcon} from '@heroicons/vue/24/solid';
import {computed, onMounted, ref} from 'vue';
import api from '../lib/api';
import {store} from '../lib/store';
import LoginForm from './LoginForm.vue';
import BigButton from './BigButton.vue';
const showPopUp = ref(false);
const initials = computed(() => {
	if (store.customer) {
		return store.customer.name.toUpperCase().split(' ').map(name => name[0]).join('');
	}
});

const emit = defineEmits(['click']);
</script>
<template>
	<div class="customer-icon" @click='emit("click")'>
		<div v-if='store.customer'>{{ initials }}</div>
		<UserIcon v-else :style='{ width: 24, height: 24 }'></UserIcon>
	</div>
</template>

<style scoped>
.customer-icon {
	position: relative;
	z-index: 100000;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background-color: #ddd;
	border: 3px solid var(--bg-blue);
	font: 800 16pt 'Outfit';
	overflow: hidden;
	cursor: pointer;
}

.customer-name {
	font: 600 14pt 'Outfit';
}
</style>