import { z } from "zod";

export const vehicleFormSchema = z.object({
    brand: z.string().min(1, "Brand é obrigatório"),
    model: z.string().min(1, "Model é obrigatório"),
    plate: z.string().min(1, "Plate é obrigatório"),
    year: z.number().min(1900, "Year é obrigatório"),
    timestamp: z.date({
        required_error: "Data de expiração é obrigatória",
        invalid_type_error: "Data inválida",
    }),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;
