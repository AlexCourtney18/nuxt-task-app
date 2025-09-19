import { eq } from "drizzle-orm";
import { z } from "zod";
import db from "~/lib/db";
import { tasks, PatchTasksSchema } from "~/lib/db/schema";

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

    const body = await readBody(event);
    const patch = PatchTasksSchema.safeParse(body);
    if (!patch.success) {
        return sendError(event, createError({
            statusCode: 400,
            statusMessage: "Invalid body",
        }));
    }

    const updated = await db.update(tasks)
        .set(patch.data)
        .where(eq(tasks.id, result.data.id));

    return updated;
});
