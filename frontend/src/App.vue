<script setup>
import {RouterView} from 'vue-router';
import MenuBar from './components/MenuBar.vue';
import LoginForm from './components/LoginForm.vue';
</script>

<template>
  <MenuBar></MenuBar>
  <RouterView />
</template>
