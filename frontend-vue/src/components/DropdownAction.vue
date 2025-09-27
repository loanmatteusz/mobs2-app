<script setup lang="ts" generic="T">
  import { MoreHorizontal } from "lucide-vue-next";
  import { Button } from "@/components/ui/button";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";

  defineProps<{
    item: T;
    onExpand?: () => void;
  }>();

  const emit = defineEmits<{
    (e: "edit", item: T): void;
    (e: "delete", item: T): void;
  }>();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="h-8 w-8 p-0">
        <span class="sr-only">Abrir menu</span>
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Ações</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="emit('edit', item)">Editar</DropdownMenuItem>
      <DropdownMenuItem @click="emit('delete', item)" class="text-red-600">
        Remover
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
