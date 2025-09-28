<script setup lang="ts">
	import { ref, watch } from "vue";
	import { Button } from "@/components/ui/button";
	import {
		Dialog,
		DialogContent,
		DialogFooter,
		DialogHeader,
		DialogTitle,
	} from "@/components/ui/dialog";
	import { Input } from "@/components/ui/input";
	import type { Vehicle } from "@/types/vehicle";

	const props = defineProps<{
		open: boolean;
		vehicle: Vehicle | null;
	}>();
	const emit = defineEmits<{
		(e: "update:open", value: boolean): void;
		(e: "save", vehicle: Vehicle): void;
	}>();

	const form = ref<Vehicle | null>(null);

	const loading = ref(false);

	watch(
		() => props.open,
		(isOpen) => {
			if (isOpen) {
			if (props.vehicle) {
				form.value = {
					id: props.vehicle.id,
					brand: props.vehicle.brand,
					model: props.vehicle.model,
					plate: props.vehicle.plate,
					year: props.vehicle.year,
				};
			} else {
				form.value = {
					id: "",
					brand: "",
					model: "",
					plate: "",
					year: null,
				};
			}
			}
		},
		{ immediate: true }
	);

	const handleClose = () => emit("update:open", false);

	const handleSave = () => {
		if (!form.value) return;
		if (!form.value.brand.trim()) return;
		if (!form.value.model.trim()) return;
		if (!form.value.plate.trim()) return;
		if (!form.value.year || form.value.year < 1900) return;
		emit("save", form.value as Vehicle);
		handleClose();
	};
</script>

<template>
  <Dialog :open="props.open" @update:open="val => emit('update:open', val)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Vehicle</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <Input v-model="form!.brand" placeholder="Fabricante do Vehicle" />
        <Input v-model="form!.model" placeholder="Modelo do Vehicle" />
		<Input v-model="form!.plate" placeholder="Placa do Vehicle" />
        <Input v-model.number="form!.year" type="number" placeholder="Ano do Vehicle" />
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleClose">Cancelar</Button>
        <Button @click="handleSave">Salvar</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
