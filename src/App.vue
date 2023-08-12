<script setup>
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <div class="app">
    <Sidebar class="sidebar"/>
    <div class="blog-content">
      <router-view />
    </div>
  </div>
</template>
<style>
.blog-content{
  width: 100%;
}
</style>