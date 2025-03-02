<script lang="ts" setup>
import { ref, inject, computed, type Ref } from 'vue';

import { TaskCard, Modal } from '@/components/common';

import { createTask, updateList } from '@/helpers/database';

import type { List, Task } from '@/types';

const props = defineProps<{
  list: List;
}>();

const tasks = inject('tasks') as Ref<Task[]>;
const lists = inject('lists') as Ref<List[]>;
const role = inject('role') as Ref<boolean>;

const filteredTasks = computed(() =>
  tasks.value
    .filter((task) => task.task_list_id === props.list.id)
    .map((task) => ({ ...task, list_name: props.list.name })),
);

const isUpdateListModalOpen = ref(false);
const isCreateTaskModalOpen = ref(false);

const newListName = ref(props.list.name);

const newTask = ref<Task>({
  id: '',
  board_id: props.list?.board_id || '',
  task_list_id: props.list?.id || '',
  title: '',
  description: null,
  status: 'pending',
  assigned_user_id: '',
  due_date: null,
  priority: 'medium',
});

function handleUpdateList() {
  updateList(lists, newListName, isUpdateListModalOpen, props.list.id);
}

function handleUpdateListModal() {
  if (isUpdateListModalOpen.value) {
    newListName.value = props.list.name;
  }

  isUpdateListModalOpen.value = !isUpdateListModalOpen.value;
}

function handleCreateTask() {
  createTask(newTask, tasks, handleCreateTaskModal);
}

function handleCreateTaskModal() {
  isCreateTaskModalOpen.value = !isCreateTaskModalOpen.value;
}
</script>

<template>
  <div
    class="p-4 rounded-lg border-2 border-gray-400 min-w-[250px] max-w-[30vw] mb-4 flex-shrink-0 w-full"
  >
    <h3
      @click="handleUpdateListModal"
      class="text-center text-xl font-semibold text-gray-800 mb-4 width-100 truncate max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
    >
      {{ lists.find((list) => list.id === $props.list.id)?.name || '' }}
    </h3>

    <div class="overflow-y-auto flex flex-col items-center justify-start gap-4 max-h-[75vh]">
      <TaskCard v-for="task in filteredTasks" :key="task.id" :task="task" />

      <div
        @click="handleCreateTaskModal"
        class="flex items-center justify-center bg-white p-4 rounded-md border-3 transition-shadow duration-300 w-[85%] max-w-[300px] min-h-30 overflow-hidden cursor-pointer"
      >
        <img src="@/assets/images/add.png" alt="add" class="w-8 h-8" />
        <div class="mt-2"></div>
      </div>
    </div>
  </div>

  <Modal :isOpen="isUpdateListModalOpen" :handleModal="handleUpdateListModal">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Edit List Title</h2>

    <div class="mb-4">
      <input
        v-model="newListName"
        type="text"
        class="w-full p-2 border border-gray-300 rounded-lg"
        placeholder="Enter new list title"
      />
    </div>

    <div class="flex justify-between">
      <button
        @click="handleUpdateListModal"
        class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Cancel
      </button>
      <button
        @click="handleUpdateList"
        class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
      >
        Save
      </button>
    </div>
  </Modal>

  <Modal :isOpen="isCreateTaskModalOpen" :handleModal="handleCreateTaskModal">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Create new task</h2>

    <div class="task-form">
      <div>
        <label for="title" class="block text-sm font-semibold">Task Title</label>
        <input
          v-model="newTask.title"
          type="text"
          id="title"
          class="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Enter task title"
        />
      </div>

      <div class="mt-4">
        <label for="description" class="block text-sm font-semibold">Description</label>
        <textarea
          v-model="newTask.description"
          id="description"
          class="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Enter task description"
        ></textarea>
      </div>

      <div class="mt-4">
        <label for="status" class="block text-sm font-semibold">Status</label>
        <select
          v-model="newTask.status"
          id="status"
          class="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="on_hold">On Hold</option>
        </select>
      </div>

      <!-- <div v-if="role" class="mt-4">
        <label for="assigned_user" class="block text-sm font-semibold">Assigned User</label>
        <input
          v-model="newTask.assigned_user_id"
          type="text"
          id="assigned_user"
          class="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Enter assigned user"
        />
      </div> -->

      <div v-if="role" class="mt-4">
        <label for="due_date" class="block text-sm font-semibold">Due Date</label>
        <input
          v-model="newTask.due_date"
          type="date"
          id="due_date"
          class="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div v-if="role" class="mt-4">
        <label for="priority" class="block text-sm font-semibold">Priority</label>
        <select
          v-model="newTask.priority"
          id="priority"
          class="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="top">Top</option>
        </select>
      </div>
    </div>

    <div class="flex justify-between mt-6">
      <button
        @click="handleCreateTaskModal"
        class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
      >
        Cancel
      </button>
      <button
        @click="handleCreateTask"
        class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
      >
        Save
      </button>
    </div>
  </Modal>
</template>
