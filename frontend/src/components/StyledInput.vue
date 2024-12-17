<script setup>
import {ref, computed, onMounted, effect} from 'vue';
const props = defineProps({
	label: {
		type: String,
		required: true
	},
	type: {
		type: String,
		default: 'text'
	},
	disabled: {
		type: Boolean,
		default: false
	},
});

const emit = defineEmits(['update:modelValue']);
const isFocused = ref(false);
const model = defineModel();

const className = computed(() => (model.value ? 'input-container filled' : 'input-container') + (props.disabled ? ' disabled' : ''));
</script>

<template>
	<div :class='className'>
		<input :type="type" v-model="model" class="input-field" @focus="isFocused = true" @blur="isFocused = false"
			:disabled='props.disabled' />
		<label class="input-label">{{ label }}</label>
		<div class='bottom-line'></div>
		<div class='bottom-line focused'></div>
	</div>
</template>

<style scoped>
.input-container {
	position: relative;
	display: inline-block;
	margin: 20px 0;

	&.disabled, &.disabled * {
		cursor: not-allowed;
	}
}

.input-label {
	position: absolute;
	top: 50%;
	left: 0;
	font-size: 16px;
	transform: translateY(-50%);
	color: #9e9e9e;
	transition: all 0.2s ease;
	pointer-events: none;
}

.bottom-line {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 2px;
	background: #ddd;
	transition: width .3s ease;
}

.bottom-line.focused {
	background-color: var(--main-blue);
	width: 0;
}

.input-field:focus~.bottom-line.focused {
	width: 100%;
}

.input-field {
	width: 100%;
	padding: 10px 0;
	font-size: 16px;
	border: none;
	background: transparent;
	outline: none;
}

.filled .input-label {
	transform: scale(.8) translate(-15%, -60%);
	top: 0;
	left: 0;
}
</style>