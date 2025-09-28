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
  }>();
  const emit = defineEmits<{
    (e: "update:open", value: boolean): void;
    (e: "create", epi: Omit<Vehicle, "id">): void;
  }>();

  const form = ref<Omit<Vehicle, "id">>({
    brand: "",
    model: "",
    plate: "",
    year: null,
  });

  watch(
    () => props.open,
    (isOpen) => {
      if (isOpen) {
        form.value = {
          brand: "",
          model: "",
          plate: "",
          year: null,
        };
      }
    },
  );

  const handleClose = () => emit("update:open", false);

  const handleCreate = () => {
    if (!form.value.brand.trim()) return;
    if (!form.value.model.trim()) return;
    if (!form.value.plate.trim()) return;
    if (form.value.year < 1900) return;
    emit("create", { ...form.value });
    handleClose();
  };

</script>

<template>
  <Dialog :open="open" @update:open="val => emit('update:open', val)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Criar Vehicle</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <Input
          v-model="form.brand"
          placeholder="Nome do Fabricante"
        />
      </div>

      <div class="space-y-4">
        <Input
            v-model="form.model"
            placeholder="Modelo do Vehicle"
          />
      </div>

      <div class="space-y-4">
        <Input
            v-model="form.plate"
            placeholder="Placa do Vehicle"
          />
      </div>

      <div class="space-y-4">
        <Input
            v-model="form.year"
            placeholder="Ano do Vehicle"
          />
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleClose">Cancelar</Button>
        <Button @click="handleCreate">Criar</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
