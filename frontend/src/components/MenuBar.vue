<script setup>
import {ref, computed, onMounted} from 'vue';
import LoginForm from './LoginForm.vue';
import {store} from '../lib/store';
import api from '../lib/api';
import MenuCustomer from './MenuCustomer.vue';
import BigButton from './BigButton.vue';

const menuBar = ref(null);
const menuBarRight = ref(null);
const menuBarBottom = ref(null);
const showPopUp = ref(false);
onMounted(() => {
	menuBarRight.value = menuBar.value.getBoundingClientRect().x;
	menuBarBottom.value = menuBar.value.getBoundingClientRect().y + menuBar.value.getBoundingClientRect().height;
});
const popUpStyle = computed(() => {
	console.log(menuBarRight.value);
	return {
		top: menuBarBottom.value + 10 + 'px',
		right: menuBarRight.value + 'px'
	};
});
async function logout() {
	await api.auth.get('/logout');
	store.customer = null;
	showPopUp.value = false;
}
</script>
<template>
	<div class='menu-bar' ref='menuBar'>
		<div class="logo">WuWu</div>
		<div class='center-links'>
			<router-link to='/'>

				Home</router-link>
			<router-link to='/my'>My Bookings</router-link>
		</div>
		<div class='user'>
			<MenuCustomer @click='showPopUp = !showPopUp'></MenuCustomer>
		</div>
	</div>
	<LoginForm class='menu-form' :style='popUpStyle' v-if='showPopUp && !store.customer' @finished='showPopUp = false'>
	</LoginForm>
	<div class='logout-popup island' :style='popUpStyle' v-if='showPopUp && store.customer'>
		<h2>{{ store.customer.name }}</h2>
		<BigButton @click='logout'>Log out</BigButton>
	</div>
</template>

<style scoped>
.menu-form {
	position: absolute;
}

.logout-popup {
	position: absolute;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 10px;
}

.menu-bar {
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px;
	backdrop-filter: blur(10px);
	background-color: #fff5;
	width: 80%;
	margin: 0 auto;
	margin-bottom: 20px;
	border-radius: 10em;
	box-shadow: 0 10px 10px rgba(6, 6, 6, 0.156);
}

.logo {
	font: 800 25pt 'Outfit';
}

.center-links {
	display: flex;
	gap: 10px;
}

a {
	text-decoration: none;
	color: black;
}
</style>