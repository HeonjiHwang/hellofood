<template>
  <div class="body">
    <HeaderPanel/>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import HeaderPanel from '@/components/HeaderPanel.vue';

export default {
  name: 'App',
  components: {
    HeaderPanel
  }
}
</script>