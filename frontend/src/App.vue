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
  <footer>
    <p>Made by Paul Leflon & Mattéo Launay</p>
    <p>See source code on <a href='https://github.com/paulleflon/TI510M-Project' target='_blank'>GitHub</a></p>
  </footer>
</template>
<style scoped>
footer {
  width: 100%;
  flex: 1;
  color: white;
  text-align: center;
  font: 9pt 'Fira Sans';
  opacity: .6;
  display: flex;
  flex-direction: column;
  justify-content: end;
  & p {
    margin: 3px 0;
  }
  & a {
    color: white;

    &:hover {
      text-decoration: none;
    }
  }
}
</style>
