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

const logout = async () => {
	await api.auth.get('/logout');
	store.customer = null;
	showPopUp.value = false;
};
</script>
<template>
	<div class="customer-icon" @click='showPopUp = !showPopUp'>
		<div v-if='store.customer'>{{ initials }}</div>
		<UserIcon v-else :style='{ width: 24, height: 24 }'></UserIcon>
	</div>
	<div v-if='!store.customer' class='form-container'>
		<LoginForm class='menu-form' v-if='showPopUp' @finished='showPopUp = false'></LoginForm>
	</div>
	<div v-else>
		<div class='logout-popup' v-if='showPopUp'>
			<div class='customer-name'>{{ store.customer.name }}</div>
			<BigButton @click='logout'>Logout</BigButton>
		</div>
	</div>
</template>

<style scoped>
.menu-form {
	z-index: 1000;
}

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

.form-container {
	position: absolute;
	right: 0;
	transform: translateY(10px);
	z-index: 100000;
}

.logout-popup {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: 10px;
	position: absolute;
	text-align: center;
	right: 0;
	transform: translateY(10px);
	z-index: 100000;
	padding: 10px;
	background: white;
	border-radius: 10px;
	box-shadow: 0 10px 10px #0004;
}

.customer-name {
	font: 600 14pt 'Outfit';
}
</style>