<script setup lang="ts">
  import debounce from "lodash/debounce";
  import { ref, watch } from "vue";
  import Datepicker from "@/components/Datepicker.vue";
  import { Button } from "@/components/ui/button";
  import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import type { Epi } from "@/types/vehicle";

  const props = defineProps<{
    open: boolean;
  }>();
  const emit = defineEmits<{
    (e: "update:open", value: boolean): void;
    (e: "create", epi: Omit<Epi, "id" | "category">): void;
  }>();

  const today = new Date().toISOString().split("T")[0];

  const form = ref<Omit<Epi, "id" | "category">>({
    name: "",
    description: "",
    ca: null,
    categoryId: null,
    expiration: new Date(today),
  });

  watch(
    () => props.open,
    (isOpen) => {
      if (isOpen) {
        form.value = {
          name: "",
          description: "",
          ca: null,
          categoryId: null,
          expiration: new Date(today),
        };
      }
    },
  );

  const handleClose = () => emit("update:open", false);

  const handleCreate = () => {
    if (!form.value.name.trim()) return;
    if (form.value.ca <= 0) return;
    if (!form.value.categoryId.trim()) return;
    if (!form.value.expiration) return;
    emit("create", { ...form.value });
    handleClose();
  };

  const search = ref("");
  const categories = ref([]);
  const loading = ref(false);
  const showDropdown = ref(false);

  const page = ref(1);
  const pageSize = 10;

  const fetchCategories = async (query: string) => {
    if (!query) {
      categories.value = [];
      return;
    }
    loading.value = true;
    try {
      console.log('try do fetchCategories');
    } finally {
      loading.value = false;
    }
  };

  const debouncedSearch = debounce(fetchCategories, 300);

  watch(search, (val) => {
    debouncedSearch(val);
  });

  function selectCategory(category: { id: string; name: string }) {
    form.value.categoryId = category.id;
    search.value = category.name;
    showDropdown.value = false;
  }

  function onBlur() {
    setTimeout(() => {
      showDropdown.value = false;
    }, 150);
  }
</script>

<template>
  <Dialog :open="open" @update:open="val => emit('update:open', val)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Criar Epi</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <Input
          v-model="form.name"
          placeholder="Nome do Epi"
        />
      </div>

      <div class="space-y-4">
        <Input
            v-model="form.description"
            placeholder="Descrição do Epi"
          />
      </div>

      <div class="space-y-4">
        <Input
          v-model="search"
          placeholder="Categoria do Epi"
          @focus="showDropdown = true"
          @blur="onBlur"
        />

        <ul
          v-if="showDropdown && categories.length"
          class="absolute z-10 mt-1 w-full bg-neutral-200 border rounded shadow max-h-60 overflow-auto"
        >
          <li
            v-for="category in categories"
            :key="category.id"
            class="p-2 text-neutral-950 cursor-pointer"
            @mousedown.prevent="selectCategory(category)"
          >
            {{ category.name }}
          </li>
          <li v-if="loading" class="p-2 text-gray-500">Carregando...</li>
          <li v-if="!loading && !categories.length" class="p-2 text-gray-500">
            Nenhuma categoria encontrada
          </li>
        </ul>
      </div>

      <div class="space-y-4">
        <!-- <label>Numero do CA</label> -->
        <Input
          v-model="form.ca"
          placeholder="Numero CA do Epi"
        />
      </div>

      <div class="space-y-4">
        <Datepicker
          v-model="form.expiration"
          :min-date="new Date()"
          placeholder="Data de expiração do Epi"
        />
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleClose">Cancelar</Button>
        <Button @click="handleCreate">Criar</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
