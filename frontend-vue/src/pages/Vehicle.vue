<script setup lang="ts">
	import type {
		ColumnDef,
		ColumnFiltersState,
		ExpandedState,
		SortingState,
		VisibilityState,
	} from "@tanstack/vue-table";
	import {
		getCoreRowModel,
		getExpandedRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		useVueTable,
	} from "@tanstack/vue-table";
	import { ChevronDown } from "lucide-vue-next";
	import { computed, ref, watch } from "vue";
	import { useToast } from "vue-toastification";
	import { createColumns } from "@/components/vehicles/columns";
	import DataTable from "@/components/vehicles/data-table.vue";
	//import EditVehicleModal from "@/components/modals/vehicles/EditVehicleModal.vue";
	//import NewVehicleModal from "@/components/modals/vehicles/NewVehicleModal.vue";
	import { Button } from "@/components/ui/button";
	import {
		DropdownMenu,
		DropdownMenuCheckboxItem,
		DropdownMenuContent,
		DropdownMenuTrigger,
	} from "@/components/ui/dropdown-menu";
	import { Input } from "@/components/ui/input";
	import { vehicleService } from "@/services/vehicle.service";
	import type { Vehicle } from "@/types/vehicle";

	const toast = useToast();

	const data = ref<Vehicle[]>([]);

	const isCreateOpen = ref(false);
	const isEditOpen = ref(false);
	const vehicleToEdit = ref<Vehicle | null>(null);

	const totalCount = ref(0);
	const pageIndex = ref(0);
	const pageSize = ref(10);
	const filterBrand = ref("");
	const filterModel = ref("");
	const filterPlate = ref("");
	const filterYear = ref(null);

	async function fetchVehicles() {
		try {
			const response = await vehicleService.getAll({
				page: pageIndex.value + 1,
				limit: pageSize.value,
				brand: filterBrand.value,
				model: filterModel.value,
				plate: filterPlate.value,
				year: filterYear.value,
			});

			data.value = response.data;
			totalCount.value = response.total;
		} catch (error) {
			console.error("Erro ao buscar vehicles:", error);
		}
	}

	async function handleCreateVehicle(vehicle: Vehicle) {
		try {
			await vehicleService.create(vehicle);
			await fetchVehicles();
			toast.success("Vehicle created successfully");
		} catch (error) {
			console.error({ error });
			toast.error(`Vehicle creation failed`);
		}
	}

	async function handleEditVehicle(vehicle: Vehicle) {
		try {
			await vehicleService.update(vehicle.id, vehicle);
			await fetchVehicles();
			toast.success("Vehicle updated successfully");
		} catch (error) {
			console.log({ error });
			toast.error(`Vehicle update failed`);
		}
	}

	function handleCreateModal() {
		isCreateOpen.value = true;
	}

	function handleEditModal(vehicle: Vehicle) {
		vehicleToEdit.value = vehicle;
		isEditOpen.value = true;
	}

	async function removeVehicle(id: string) {
		try {
			await vehicleService.delete(id);
			await fetchVehicles();
			toast.success(`Vehicle deleted successfully`);
		} catch (error) {
			console.error("Erro ao deletar vehicle:", error);
			toast.error(`Vehicle deleted failed`);
		}
	}

	watch([filterBrand, filterModel, filterPlate, filterYear, pageIndex, pageSize], fetchVehicles, { immediate: true });

	function prevPage() {
		if (pageIndex.value > 0) {
			pageIndex.value--;
		}
	}

	function nextPage() {
		const maxPage = Math.ceil(totalCount.value / pageSize.value) - 1;
		if (pageIndex.value < maxPage) {
			pageIndex.value++;
		}
	}

	const startItem = computed(() => pageIndex.value * pageSize.value + 1);
	const endItem = computed(() =>
		Math.min((pageIndex.value + 1) * pageSize.value, totalCount.value),
	);

	const sorting = ref<SortingState>([]);
	const columnFilters = ref<ColumnFiltersState>([]);
	const columnVisibility = ref<VisibilityState>({});
	const rowSelection = ref({});
	const expanded = ref<ExpandedState>({});

	const columns = createColumns({
		onEdit: handleEditModal,
		onDelete: removeVehicle,
	});

	const table = useVueTable({
		data,
		columns: columns as ColumnDef<Vehicle>[],
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		pageCount: Math.ceil(totalCount.value / pageSize.value),
		state: {
			get sorting() {
				return sorting.value;
			},
			get columnFilters() {
				return columnFilters.value;
			},
			get columnVisibility() {
				return columnVisibility.value;
			},
			get rowSelection() {
				return rowSelection.value;
			},
			get expanded() {
				return expanded.value;
			},
		},
	});
</script>

<template>
  <div class="w-full">
    <h1 class="flex font-bold text-2xl">Vehicles</h1>
    <div class="flex flex-col md:flex-row items-start md:items-center py-4 gap-2">
		<Input
			class="max-w-md w-full md:w-auto"
			placeholder="Filter Vehicles by Brand"
			v-model="filterBrand"
		/>
		<Input
			class="max-w-md w-full md:w-auto"
			placeholder="Filter by Model"
			v-model="filterModel"
		/>
		<Input
			class="max-w-md w-full md:w-auto"
			placeholder="Filter by Plate"
			v-model="filterPlate"
		/>
		<Input
			class="max-w-md w-full md:w-auto"
			placeholder="Filter by Year"
			v-model="filterYear"
		/>
	
		<Button
			variant="outline"
			@click="handleCreateModal"
		>
			New Vehicle
		</Button>

      	<div class="flex-1"></div>

		<DropdownMenu>
			<DropdownMenuTrigger as-child>
			<Button variant="outline">
				Columns <ChevronDown class="ml-2 h-4 w-4" />
			</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
			<DropdownMenuCheckboxItem
				v-for="column in table.getAllColumns().filter(c => c.getCanHide())"
				:key="column.id"
				class="capitalize"
				:model-value="column.getIsVisible()"
				@update:model-value="(value) => column.toggleVisibility(!!value)"
			>
				{{ column.id }}
			</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
    </div>

    <DataTable :columns="columns" :data="data" />

    <div class="flex items-center justify-end gap-2 py-4">
      <div class="text-sm text-muted-foreground">
        {{ startItem }} - {{ endItem }} of {{ totalCount }}
      </div>
        <Button
          variant="outline"
          size="sm"
          :disabled="pageIndex === 0"
          @click="prevPage"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="pageIndex >= Math.ceil(totalCount / pageSize) - 1"
          @click="nextPage"
        >
          Next
        </Button>
    </div>
  </div>

  <!-- <NewVehicleModal
    v-model:open="isCreateOpen"
    @create="handleCreateVehicle"
  />

  <EditVehicleModal
    v-model:open="isEditOpen"
    :vehicle="vehicleToEdit"
    @save="handleEditVehicle"
  /> -->
</template>
