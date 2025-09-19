<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
const route = useRoute();
const { data: task, error, status, refresh } = await useFetch(`/api/tasks/${route.params.id}`, { lazy: true });
const router = useRouter();

const form = ref({
    title: '',
    done: false
});

watchEffect(() => {
    if (task.value) {
        form.value.title = task.value.title;
        form.value.done = task.value.done;
    }
});

const saving = ref(false);
const saveError = ref<string|null>(null);

async function submit() {
    saving.value = true;
    saveError.value = null;
    try {
        await $fetch(`/api/tasks/${route.params.id}`, {
            method: 'PATCH',
            body: form.value
        });
        await refresh();
        router.push('/');
    } catch (e: any) {
        saveError.value = e?.data?.statusMessage || 'Failed to update task';
    } finally {
        saving.value = false;
    }
}
</script>


<template>
    <div>
        <article v-if='status === "pending"' aria-busy="true" />
        <article v-else-if="error" class="error">
            {{ error.statusMessage }}
        </article>
        <form v-else-if="task" @submit.prevent="submit">
            <div>
                <label for="title">Title</label>
                <input id="title" v-model="form.title" :disabled="saving" required maxlength="500" />
            </div>
            <div>
                <label>
                    <input type="checkbox" v-model="form.done" :disabled="saving" />
                    Complete
                </label>
            </div>
            <button type="submit" :disabled="saving">Save</button>
            <span v-if="saving">Saving...</span>
            <span v-if="saveError" class="error">{{ saveError }}</span>
        </form>
    </div>
</template>