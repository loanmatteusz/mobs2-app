import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import type { Vehicle } from "@/types/vehicle";
import DropdownAction from "../DropdownAction.vue";
import { Checkbox } from "../ui/checkbox";

export type ColumnsOptions = {
	onEdit: (vehicle: Vehicle) => void;
	onDelete: (id: string) => void;
}

export const createColumns = ({ onEdit, onDelete }: ColumnsOptions): ColumnDef<Vehicle>[] => [
	{
		id: "select",
		header: ({ table }) =>
			h(Checkbox, {
				modelValue:
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate"),
				"onUpdate:modelValue": (value) =>
					table.toggleAllPageRowsSelected(!!value),
				ariaLabel: "Select all",
				class: "h-4 w-4",
			}),
		cell: ({ row }) =>
			h(Checkbox, {
				modelValue: row.getIsSelected(),
				"onUpdate:modelValue": (value) => row.toggleSelected(!!value),
				ariaLabel: "Select row",
				class: "h-4 w-4",
			}),
		enableSorting: false,
		enableHiding: false,
	},

	{
		accessorKey: "brand",
		header: () => h("div", { class: "text-right" }, "Fabricante"),
		cell: ({ row }) => h("div", { class: "text-right" }, row.getValue("brand")),
	},

	{
		accessorKey: "model",
		header: () => h("div", { class: "text-right" }, "Modelo"),
		cell: ({ row }) => h("div", { class: "text-right" }, row.getValue("model")),
	},

	{
		accessorKey: "plate",
		header: () => h("div", { class: "text-right" }, "Placa"),
		cell: ({ row }) => h("div", { class: "text-right" }, row.getValue("plate")),
	},

	{
		accessorKey: "year",
		header: () => h("div", { class: "text-right" }, "Ano"),
		cell: ({ row }) => h("div", { class: "text-right" }, row.getValue("year")),
	},

	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const vehicle = row.original;

			return h(
				"div",
				{ class: "flex justify-end" },
				h(DropdownAction as any, {
					vehicle,
					onEdit: () => onEdit(vehicle),
					onDelete: () => onDelete(vehicle.id),
				})
			);
		},
	},
];
