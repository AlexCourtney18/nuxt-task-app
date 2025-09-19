import { eq } from "drizzle-orm";
import { z } from "zod";
import db from "~/lib/db";
import { tasks } from "~/lib/db/schema";

const IdParamsSchema = z.object({
    id: z.coerce.number()
});

export default defineEventHandler(async (event) => {
    const result = await getValidatedRouterParams(event, IdParamsSchema.safeParse);
    if (!result.success) {
        return sendError(event, createError({
            statusCode: 422,
            statusMessage: "Invalid id",
        }));
    }

    await db.delete(tasks).where(eq(tasks.id, result.data.id));
    return { success: true };
});
