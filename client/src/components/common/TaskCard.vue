<script lang="ts" setup>
import { ref, inject, computed, type Ref, type ComputedRef } from 'vue';

import { Modal } from '@/components/common';

import { updateTask } from '@/helpers/database';

import type { Task, List } from '@/types';

const props = defineProps<{
  task: Task;
}>();

const isViewTaskModalOpen = ref(false);
const isEditTaskModalOpen = ref(false);

const role = inject('role') as Ref<boolean>;
const tasks = inject('tasks') as Ref<Task[]>;
const lists = inject('lists') as Ref<List[]>;

const listNames = computed(() => lists.value.map((list) => ({ id: list.id, name: list.name })));

const taskDetails = computed(() =>
  tasks.value.find((task) => task.id === props.task.id),
) as ComputedRef<Task>;

const updatedTaskDetails = ref<Task>({ ...taskDetails.value, list_name: props.task.list_name });

function handleViewTaskModal() {
  isViewTaskModalOpen.value = !isViewTaskModalOpen.value;
}

async function handleEditTask() {
  const selectedList = lists.value.find((list) => list.name === updatedTaskDetails.value.list_name);

  if (!selectedList) return;

  updatedTaskDetails.value.task_list_id = selectedList.id;

  await updateTask(tasks, props.task.id, updatedTaskDetails);

  handleEditTaskModal();
}

function handleEditTaskModal() {
  if (isEditTaskModalOpen.value) {
    updatedTaskDetails.value = { ...props.task };
  }

  isEditTaskModalOpen.value = !isEditTaskModalOpen.value;
}

function formatString(str: string) {
  let formattedStr = str.replace(/_/g, ' ');

  formattedStr = ' ' + formattedStr;
  formattedStr = formattedStr.replace(/\b\w/g, (char) => char.toUpperCase());

  return formattedStr;
}
</script>

<template>
  <div
    @click="handleViewTaskModal"
    class="bg-white border-1 p-4 rounded-md transition-shadow duration-300 w-[85%] max-w-[300px] min-h-30 overflow-hidden cursor-pointer"
  >
    <h3 class="text-md font-semibold text-gray-800 truncate">{{ taskDetails.title }}</h3>
    <div class="mt-2">
      <p class="text-sm text-gray-500">
        <strong>Priority:</strong>
        <span
          :class="[
            'font-semibold',
            {
              'text-red-500': taskDetails.priority === 'high',
              'text-yellow-500': taskDetails.priority === 'medium',
              'text-green-500': taskDetails.priority === 'low',
              'text-black font-bold': taskDetails.priority === 'top',
            },
          ]"
          >{{
            taskDetails.priority ? formatString(taskDetails.priority) : ' No priority set'
          }}</span
        >
      </p>
      <p class="text-sm text-gray-500">
        <strong>Status:</strong>
        <span
          :class="[
            'font-semibold',
            {
              'text-blue-500': task.status === 'pending',
              'text-yellow-500': task.status === 'in_progress',
              'text-green-500 font-bold': task.status === 'completed',
              'text-gray-500': task.status === 'on_hold',
            },
          ]"
          >{{ taskDetails.status ? formatString(taskDetails.status) : 'No status set' }}</span
        >
      </p>
      <p class="text-sm text-gray-500">
        <strong>Due Date:</strong>
        {{
          taskDetails.due_date
            ? new Date(taskDetails.due_date).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : 'N/A'
        }}
      </p>
    </div>
  </div>

  <Modal :isOpen="isViewTaskModalOpen" :handleModal="handleViewTaskModal">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ taskDetails.title }}</h2>

    <div class="mb-4">
      <p class="mb-4">
        <strong>Priority:</strong>
        <span
          :class="[
            'font-semibold',
            {
              'text-red-500': task.priority === 'high',
              'text-yellow-500': task.priority === 'medium',
              'text-green-500': task.priority === 'low',
              'text-black font-bold': task.priority === 'top',
            },
          ]"
          >{{
            taskDetails.priority ? formatString(taskDetails.priority) : ' No priority set'
          }}</span
        >
      </p>
      <p class="mb-4">
        <strong>Status:</strong>
        <span
          :class="[
            'font-semibold',
            {
              'text-blue-500': taskDetails.status === 'pending',
              'text-yellow-500': taskDetails.status === 'in_progress',
              'text-green-500 font-bold': taskDetails.status === 'completed',
              'text-gray-500': taskDetails.status === 'on_hold',
            },
          ]"
          >{{ taskDetails.status ? formatString(taskDetails.status) : 'No status set' }}</span
        >
      </p>
      <p class="mb-4">
        <strong>Due Date:</strong>
        {{
          taskDetails.due_date
            ? new Date(taskDetails.due_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'N/A'
        }}
      </p>
      <p class="mb-4">
        <strong>Description:</strong>
        {{ taskDetails.description || 'No description available.' }}
      </p>
      <!-- <p>
        <strong>Assignee:</strong>
        {{ $props.members.find((user) => user.user_id === $props.task.assigned_user_id)?.name || 'None' }}
      </p> -->
    </div>

    <div class="flex">
      <button
        @click="handleViewTaskModal"
        class="mt-4 bg-gray-500 text-white p-2 rounded-lg w-full hover:bg-gray-600 transition"
      >
        Close
      </button>
      <button
        @click="handleEditTaskModal"
        class="mt-4 ml-8 bg-lightblue text-white p-2 rounded-lg w-full hover:bg-darkblue transition"
      >
        Edit
      </button>
    </div>
  </Modal>

  <Modal :isOpen="isEditTaskModalOpen" :handleModal="handleEditTaskModal">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Edit task</h2>

    <div class="task-form">
      <div>
        <label for="title" class="block text-sm font-semibold">Task Title</label>
        <input
          v-model="updatedTaskDetails.title"
          type="text"
          id="title"
          class="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Enter task title"
        />
      </div>

      <div class="mt-4">
        <label for="description" class="block text-sm font-semibold">Description</label>
        <textarea
          v-model="updatedTaskDetails.description"
          id="description"
          class="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Enter task description"
        ></textarea>
      </div>

      <div class="mt-4">
        <label for="status" class="block text-sm font-semibold">Status</label>
        <select
          v-model="updatedTaskDetails.status"
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
          v-model="updatedTaskDetails.due_date"
          type="datetime-local"
          id="due_date"
          class="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div v-if="role" class="mt-4">
        <label for="priority" class="block text-sm font-semibold">Priority</label>
        <select
          v-model="updatedTaskDetails.priority"
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

    <div class="mt-4">
      <label for="list" class="block text-sm font-semibold">List</label>
      <select
        v-model="updatedTaskDetails.list_name"
        id="list"
        class="w-full p-2 border border-gray-300 rounded-lg"
      >
        <option v-for="name in listNames" :key="name.id" :value="name.name">
          {{ name.name }}
        </option>
      </select>
    </div>

    <div class="flex justify-between mt-6">
      <button
        @click="handleEditTaskModal"
        class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
      >
        Cancel
      </button>
      <button
        @click="handleEditTask"
        class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
      >
        Save
      </button>
    </div>
  </Modal>
</template>
