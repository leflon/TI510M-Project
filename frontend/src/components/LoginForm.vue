<script setup>

import {ref, computed} from 'vue';
import StyledInput from './StyledInput.vue';
import BigButton from './BigButton.vue';
import api from '../lib/api';
const mode = ref('login');
const error = ref('');
const loginValues = ref({
	email: '',
	password: ''
});
const registerValues = ref({
	firstName: '',
	lastName: '',
	email: '',
	password: '',
	confirmPassword: ''
});
function login() {
	console.log(loginValues.value);
	api.auth.get('/login', loginValues.value)
		.then((res) => {
			if (res.error) {
				error.value = res.error;
			} else {
				error.value = '';
				alert(JSON.stringify(res));
			}
		});
}
function register() {
	console.log(registerValues.value);
}
function test() {
	api.private.get('/test').then(console.log);
}
</script>
<template>
	<div class="login-form">
		<div class="mode-selector">
			<div class="mode" :class="{ selected: mode === 'login' }" @click="mode = 'login'">Login</div>
			<div class="mode" :class="{ selected: mode === 'register' }" @click="mode = 'register'">Register</div>
		</div>
		<div v-if='error' class='error'>{{ error }}</div>
		<div v-if='mode === "login"' class='form login-inputs'>
			<StyledInput label='E-mail' type='text' v-model='loginValues.email'></StyledInput>
			<StyledInput label='Password' type='password' v-model='loginValues.password'></StyledInput>
			<BigButton @click='login'>Log In</BigButton>
		</div>
		<div v-else class='form register-inputs'>
			<div>
				<StyledInput label='First Name' type='text' v-model='registerValues.firstName'></StyledInput>
				<StyledInput label='Last Name' type='text' v-model='registerValues.lastName'></StyledInput>
			</div>
			<StyledInput label='E-mail' type='text' v-model='registerValues.email'></StyledInput>
			<StyledInput label='Password' type='password' v-model='registerValues.password'></StyledInput>
			<StyledInput label='Confirm Password' type='password' v-model='registerValues.confirmPassword'>
			</StyledInput>
			<BigButton @click='register'>Register</BigButton>

		</div>
		<button @click='test'>test</button>
	</div>
</template>

<style scoped>
.error {
	color: red;
	margin: 5px 0;
}

.login-form {
	display: flex;
	flex-direction: column;
	align-items: center;
	background: white;
	border-radius: 10px;
	border: 1px solid #ddd;
	box-shadow: 0 10px 10px rgba(6, 6, 6, 0.156);
	padding: 20px;
	width: 350px;
}

.mode-selector {
	display: flex;
	gap: 20px;

	&>div {
		padding: 5px 8px;
		cursor: pointer;
		border-bottom: 3px solid white;
		font-weight: 600;
	}

	& .selected {
		color: var(--secondary);
		border-bottom: 3px solid var(--secondary);
	}
}

.form {
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 100%;
}

.form button {
	width: auto;
	align-self: end;
	padding: 10px 20px;
}
</style>