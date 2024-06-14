import { Variation } from "@prisma/client";

export type IActionVariation = Omit<Variation, "id" | "productId">;
