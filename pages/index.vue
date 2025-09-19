<script lang="ts" setup>
const { data: tasks, error, status, refresh } = await useFetch('/api/tasks', { lazy: true });

async function deleteTask(id: number) {
    await $fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    await refresh();
}
</script>


<template>
    <div>
        <article v-if='status === "pending"' aria-busy="true" />
        <article v-else-if="error" class="error">
            {{ error.statusMessage }}
        </article>
        <div v-else>
            <article v-for="task in tasks" :key="task.id" style="position: relative; padding-top: 0.5em;">
                <div>
                  {{ task.title }}
                </div>
                <div :class="['status-btn', { complete: task.done }]" class="center">
                  {{ task.done ? 'Complete' : 'Not complete' }}
                </div>
                <div class="button-container">
                    <NuxtLink role="button" :to="{ name: 'tasks-id', params: { id: task.id } }">View</NuxtLink>
                    <button @click="deleteTask(task.id)" style="margin-left: 0.5em; color: red;">Delete</button>
                </div>
            </article>
        </div>
    </div>
</template>

<style scoped>
.status-btn {
  display: inline-block;
  padding: 0.25em 1em;
  border-radius: 999px;
  font-size: 1em;
  font-weight: 500;
  margin: 0.5em auto;
  background: #e0e0e0;
  color: #333;
  border: none;
  transition: background 0.2s, color 0.2s;
}
.status-btn.complete {
  background: #22c55e;
  color: #fff;
}
.center {
  text-align: center;
}
</style>