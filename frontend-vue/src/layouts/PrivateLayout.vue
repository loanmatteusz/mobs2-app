<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import Navbar from "@/components/Navbar.vue";
import { SidebarProvider } from "@/components/ui/sidebar";
</script>

<template>
  <SidebarProvider class="flex min-h-screen">
    <AppSidebar />
    <main class="flex-1 w-full mb-4 flex flex-col">
      <Navbar />
      <div class="px-4 flex-1">
        <router-view />
      </div>
    </main>
  </SidebarProvider>
</template>
