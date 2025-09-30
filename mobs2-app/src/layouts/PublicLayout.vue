<script setup lang="ts">
    defineProps<{ className?: string }>();
</script>

<template>
  <div class="min-h-screen flex justify-center items-center" :class="className">
    <router-view />
  </div>
</template>
