import db from "~/lib/db";
import { InsertTasksSchema, tasks } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
    try {
        const result = await readValidatedBody(event, InsertTasksSchema.safeParse);

        if (!result.success) {
            return sendError(event, createError({
                statusCode: 422,
                statusMessage: "Invalid task",
            }));
        }

        const [created] = await db.insert(tasks).values(result.data).returning();
        return created;
    } catch (error) {
        console.error("POST /api/tasks error:", error);
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
        }));
    }
});