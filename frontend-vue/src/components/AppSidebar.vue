<script setup lang="ts">
  import {
    Car,
    ChevronUp,
    LayoutDashboard,
    Map,
    Settings,
    User2,
  } from "lucide-vue-next";
  import { RouterLink, useRouter } from "vue-router";
  import Logo from "@/assets/vue.svg";
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
  } from "@/components/ui/sidebar";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "./ui/dropdown-menu";

  const router = useRouter();

  function signOut() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  const items = [
    // {
    //   title: "Dashboard",
    //   url: "/dashboard",
    //   icon: LayoutDashboard,
    // },
    {
      title: "Map",
      url: "/maps",
      icon: Map,
    },
    {
      title: "Vehicles",
      url: "/vehicles",
      icon: Car,
    },
    {
      title: "Settings",
      url: "/",
      icon: Settings,
    },
  ];
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader class="p-2">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <RouterLink to="/">
              <img :src="Logo" alt="logo" width="20" height="20" />
              <span>Loan Matteus</span>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarGroup>
      <SidebarSeparator />
    </SidebarGroup>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
              <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton asChild>
                    <RouterLink :to="item.url">
                      <component :is="item.icon" />
                      <span>{{item.title}}</span>
                    </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton class="flex items-center gap-2 w-full">
                <User2 />
                <span>Loan Matteus</span>
                <ChevronUp class="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Account</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem class="cursor-pointer" @click="signOut">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>
