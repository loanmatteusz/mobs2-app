<script setup lang="ts">
  import { LogOut, Moon, Settings, SquareMenu, Sun, User } from "lucide-vue-next";
  import { ref } from "vue";
  import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
  import { Button } from "./ui/button";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "./ui/dropdown-menu";
  import { SidebarTrigger } from "./ui/sidebar";

  const theme = ref("system");

  function setTheme(t: string) {
    theme.value = t;
    if (t === "dark") document.documentElement.classList.add("dark");
    else if (t === "light") document.documentElement.classList.remove("dark");
    else document.documentElement.classList.remove("dark");
  }
</script>

<template>
  <nav class="flex p-2 items-center justify-between sticky top-0 bg-background z-10">
    <SidebarTrigger class="cursor-pointer" />

    <div class="flex items-center gap-4">
      <router-link to="/">Dashboard</router-link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" class="relative">
            <Sun
              class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />
            <Moon
              class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
            <span class="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="setTheme('light')">Light</DropdownMenuItem>
          <DropdownMenuItem @click="setTheme('dark')">Dark</DropdownMenuItem>
          <DropdownMenuItem @click="setTheme('system')">System</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage src="https://avatars.githubusercontent.com/u/39535956" />
            <AvatarFallback>LM</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent :sideOffset="10">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User class="h-[1.2rem] w-[1.2rem] mr-2" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings class="h-[1.2rem] w-[1.2rem] mr-2" /> Settings
          </DropdownMenuItem>
          <DropdownMenuItem class="text-destructive">
            <LogOut class="h-[1.2rem] w-[1.2rem] mr-2" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <SquareMenu />
            <span class="sr-only">Open Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Home</DropdownMenuLabel>
          <DropdownMenuLabel>User</DropdownMenuLabel>
          <DropdownMenuLabel>Payment</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </nav>
</template>
