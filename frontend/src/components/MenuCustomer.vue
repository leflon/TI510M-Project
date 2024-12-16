<script setup>
import {UserIcon} from '@heroicons/vue/24/solid';
import {computed, onMounted, ref} from 'vue';
import api from '../lib/api';
import LoginForm from './LoginForm.vue';
const customerInfo = ref(null);
const isLoading = ref(true);
const showForm = ref(false);
async function fetchMe() {
	const res = await api.private.get('/me');
	if (!res.error)
		customerInfo.value = res.customer;
	isLoading.value = false;

}
onMounted(fetchMe);
const initials = computed(() => {
	if (customerInfo.value) {
		return customerInfo.value.name.toUpperCase().split(' ').map(name => name[0]).join('');
	}
});
</script>
<template>
	<div class="customer-icon" @click='showForm = !showForm'>
		<div v-if='customerInfo'>{{ initials }}</div>
		<UserIcon v-else :style='{ width: 24, height: 24 }'></UserIcon>
	</div>
	<div v-if='!isLoading && !customerInfo' class='form-container'>
		<LoginForm class='menu-form' v-if='showForm' @logged='fetchMe'></LoginForm>
	</div>
</template>

<style scoped>
.menu-form {
	z-index: 1000;
}

.customer-icon {
	position: relative;
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
</style>