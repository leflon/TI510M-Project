<script setup>
import {RouterView, useRouter} from 'vue-router';
import MenuBar from './components/MenuBar.vue';
import {onMounted} from 'vue';
import api from './lib/api';
import {store} from './lib/store';
const router = useRouter();
onMounted(async () => {
  const res = await api.private.get('/me');
  if (!res.error)
    store.customer = res.customer;
});

router.beforeEach((to, from) => {
  const {title} = to.meta;
  if (title)
    document.title = title + ' • WuWu';
});

</script>

<template>
  <MenuBar></MenuBar>
  <RouterView />
</template>
