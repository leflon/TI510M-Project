<template>
	<div class='loading-indicator'>
		<div class="dot"></div>
		<div class="dot"></div>
		<div class="dot"></div>
	</div>
</template>
<style scoped>
.loading-indicator {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 8px;
}
.dot {
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background: #ddd;
	opacity: .8;
	animation: loading 1s ease-in-out infinite;
}

.dot:nth-child(2) {
	animation-delay: 150ms;
}
.dot:last-child {
	animation-delay: 300ms;
}

@keyframes loading {
	50% {
		opacity: 1;
		transform: scale(1.3);
	}
}
</style>