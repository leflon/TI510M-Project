<script setup>
import {RouterView} from 'vue-router';
import MenuBar from './components/MenuBar.vue';
import {onMounted} from 'vue';
import api from './lib/api';
import {store} from './lib/store';

onMounted(async () => {
  const res = await api.private.get('/me');
  if (!res.error)
    store.customer = res.customer;
});


</script>

<template>
  <MenuBar></MenuBar>
  <RouterView />
</template>
