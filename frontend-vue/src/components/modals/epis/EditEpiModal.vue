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
		epi: Epi | null;
	}>();
	const emit = defineEmits<{
		(e: "update:open", value: boolean): void;
		(e: "save", epi: Epi): void;
	}>();

	const form = ref<Omit<Epi, "category"> | null>(null);

	const today = new Date().toISOString().split("T")[0];

	const search = ref("");
	const categories = ref<{ id: string; name: string }[]>([]);
	const loading = ref(false);
	const showDropdown = ref(false);
	const page = ref(1);
	const pageSize = 10;

	const fetchCategories = async (query: string) => {
		if (!query) {
			console.log('!query do fetchCategories');
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
	watch(search, (val) => debouncedSearch(val));

	function selectCategory(category: { id: string; name: string }) {
		if (!form.value) return;
		form.value.categoryId = category.id;
		search.value = category.name;
		showDropdown.value = false;
	}

	function onBlur() {
		setTimeout(() => {
			showDropdown.value = false;
		}, 150);
	}

	watch(
		() => props.open,
		(isOpen) => {
			if (isOpen) {
			if (props.epi) {
				form.value = {
					id: props.epi.id,
					name: props.epi.name,
					description: props.epi.description,
					ca: props.epi.ca,
					categoryId: props.epi.categoryId,
					expiration: props.epi.expiration,
				};
				search.value = props.epi.category?.name ?? "";
			} else {
				form.value = {
					id: "",
					name: "",
					description: "",
					ca: null,
					categoryId: null,
					expiration: new Date(today),
				};
				search.value = "";
			}
			}
		},
		{ immediate: true }
	);

	const handleClose = () => emit("update:open", false);

	const handleSave = () => {
		if (!form.value) return;
		if (!form.value.name.trim()) return;
		if (!form.value.ca || form.value.ca <= 0) return;
		if (!form.value.categoryId) return;
		if (!form.value.expiration) return;
		emit("save", form.value as Epi);
		handleClose();
	};
</script>

<template>
  <Dialog :open="props.open" @update:open="val => emit('update:open', val)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Epi</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <Input v-model="form!.name" placeholder="Nome do Epi" />
        <Input v-model="form!.description" placeholder="Descrição do Epi" />
        <Input v-model.number="form!.ca" type="number" placeholder="Numero CA" />

        <Input
          :key="form?.categoryId" 
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

        <Datepicker
          v-model="form!.expiration"
          :min-date="new Date()"
          placeholder="Data de expiração do Epi"
        />
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleClose">Cancelar</Button>
        <Button @click="handleSave">Salvar</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
