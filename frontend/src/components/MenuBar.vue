<script setup>
import MenuCustomer from './MenuCustomer.vue';
</script>
<template>
	<div class='menu-bar'>
		<div class="logo">WuWu</div>
		<div class='center-links'>
			<router-link to='/'>
				
				Home</router-link>
			<router-link to='/my'>My Bookings</router-link>
		</div>
		<div class='user'>
			<MenuCustomer ></MenuCustomer>
		</div>
	</div>
</template>

<style scoped>
.menu-bar {
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px;
	backdrop-filter: blur(10px);
	background-color: #fff5;
	width: 80%;
	margin: 10px auto;
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