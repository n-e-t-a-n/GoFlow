<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import type { PropType } from 'vue';

import type { Task, UserBoard, List } from '@/types';

import { Modal } from '@/components/common';

export default defineComponent({
  name: 'TaskCard',
  components: {
    Modal,
  },
  props: {
    task: {
      type: Object as PropType<Task>,
      required: true,
    },
    listName: String,
    members: {
      type: Array as PropType<UserBoard[]>,
      required: true,
    },
    list: {
      type: Object as PropType<List>,
      required: true,
    },
    role: Boolean,
  },
  setup(props) {
    const isModalVisible = ref(false);
    const isEditModalVisible = ref(false);
    const taskDetails = ref<Task | null>(null);

    const listArr = ref<List[]>([]);
    const listNames = ref<string[]>([]);

    const viewTask = () => {
      taskDetails.value = props.task;
      isModalVisible.value = true;
    };

    const closeModal = () => {
      isModalVisible.value = false;
      taskDetails.value = null;
    };

    const openEditModal = () => {
      isModalVisible.value = false;
      isEditModalVisible.value = true;
    };

    const closeEditModal = () => {
      isEditModalVisible.value = false;
    };

    const editTask = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('No token found');
          return;
        }

        const selectedList = listArr.value.find((list) => list.name === props.task.list_name);

        if (!selectedList) {
          console.error('Selected list not found');
          return;
        }

        const updatedTaskData = {
          title: props.task.title,
          description: props.task.description,
          status: props.task.status,
          priority: props.task.priority,
          due_date: props.task.due_date,
          task_list_id: selectedList.id,
        };

        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/v1/task/${props.task.id}/edit`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedTaskData),
          },
        );

        if (response.ok) {
          const data = await response.json();
          console.log('Successfully edited task:', data);
          closeEditModal();
          window.location.reload();
        } else {
          const errorData = await response.json();
          console.error('Failed to edit task:', errorData);
        }
      } catch (error) {
        console.error('Error occurred while editing task:', error);
      }
    };

    const getNamesFromListArr = () => {
      if (listArr.value) {
        return listArr.value.map((item: { name: string }) => item.name);
      } else {
        console.log('listArr is undefined or empty');
        return [];
      }
    };

    const updateListNames = () => {
      listNames.value = listArr.value.map((list) => list.name);
    };

    onMounted(async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token is missing');
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/v1/task/${props.task.board_id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          console.log('Successfully retrieved tasks:', data);
          listArr.value = data.lists;
          updateListNames();
        } else {
          const errorData = await response.json();
          console.error('Failed to retrieve tasks:', errorData);
        }
      } catch (error) {
        console.error('Error occurred while fetching tasks:', error);
      }
    });

    return {
      viewTask,
      closeModal,
      isModalVisible,
      taskDetails,
      formatString,
      isEditModalVisible,
      openEditModal,
      closeEditModal,
      editTask,
      listNames,
    };
  },
});

function formatString(str: string) {
  let formattedStr = str.replace(/_/g, ' ');

  formattedStr = ' ' + formattedStr;
  formattedStr = formattedStr.replace(/\b\w/g, (char) => char.toUpperCase());

  return formattedStr;
}
</script>

<template>
  <div
    @click="viewTask"
    class="bg-white border-1 p-4 rounded-md transition-shadow duration-300 w-[85%] max-w-[300px] min-h-30 overflow-hidden cursor-pointer"
  >
    <h3 class="text-md font-semibold text-gray-800 truncate">{{ task.title }}</h3>
    <div class="mt-2">
      <p class="text-sm text-gray-500">
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
          >{{ task?.priority ? formatString(task.priority) : ' No priority set' }}</span
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
          >{{ task.status ? formatString(task.status) : 'No status set' }}</span
        >
      </p>
      <p class="text-sm text-gray-500">
        <strong>Due Date:</strong>
        {{
          task.due_date
            ? new Date(task.due_date).toLocaleDateString('en-US', {
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

  <Modal :isOpen="isModalVisible" @update:isOpen="isModalVisible = $event">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ taskDetails?.title }}</h2>

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
            taskDetails?.priority ? formatString(taskDetails.priority) : ' No priority set'
          }}</span
        >
      </p>
      <p class="mb-4">
        <strong>Status:</strong>
        <span
          :class="[
            'font-semibold',
            {
              'text-blue-500': taskDetails?.status === 'pending',
              'text-yellow-500': taskDetails?.status === 'in_progress',
              'text-green-500 font-bold': taskDetails?.status === 'completed',
              'text-gray-500': taskDetails?.status === 'on_hold',
            },
          ]"
          >{{ taskDetails?.status ? formatString(taskDetails.status) : 'No status set' }}</span
        >
      </p>
      <p class="mb-4">
        <strong>Due Date:</strong>
        {{
          taskDetails?.due_date
            ? new Date(taskDetails.due_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : 'N/A'
        }}
      </p>
      <p class="mb-4">
        <strong>Description:</strong>
        {{ taskDetails?.description || 'No description available.' }}
      </p>
      <!-- <p>
        <strong>Assignee:</strong>
        {{ $props.members.find((user) => user.user_id === $props.task.assigned_user_id)?.name || 'None' }}
      </p> -->
    </div>

    <div class="flex">
      <button
        @click="closeModal"
        class="mt-4 bg-gray-500 text-white p-2 rounded-lg w-full hover:bg-gray-600 transition"
      >
        Close
      </button>
      <button
        @click="openEditModal"
        class="mt-4 ml-8 bg-lightblue text-white p-2 rounded-lg w-full hover:bg-darkblue transition"
      >
        Edit
      </button>
    </div>
  </Modal>

  <Modal :isOpen="isEditModalVisible" @update:isOpen="isEditModalVisible = $event">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Edit task</h2>

    <div class="task-form">
      <div>
        <label for="title" class="block text-sm font-semibold">Task Title</label>
        <input
          v-model="task.title"
          type="text"
          id="title"
          class="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Enter task title"
        />
      </div>

      <div class="mt-4">
        <label for="description" class="block text-sm font-semibold">Description</label>
        <textarea
          v-model="task.description"
          id="description"
          class="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Enter task description"
        ></textarea>
      </div>

      <div class="mt-4">
        <label for="status" class="block text-sm font-semibold">Status</label>
        <select
          v-model="task.status"
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
          v-model="task.due_date"
          type="date"
          id="due_date"
          class="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div v-if="role" class="mt-4">
        <label for="priority" class="block text-sm font-semibold">Priority</label>
        <select
          v-model="task.priority"
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
        v-model="task.list_name"
        id="list"
        class="w-full p-2 border border-gray-300 rounded-lg"
      >
        <option value="" disabled>Select a list</option>
        <option v-for="name in listNames" :key="name" :value="name">
          {{ name }}
        </option>
      </select>
    </div>

    <div class="flex justify-between mt-6">
      <button
        @click="closeEditModal"
        class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
      >
        Cancel
      </button>
      <button
        @click="editTask"
        class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
      >
        Save
      </button>
    </div>
  </Modal>
</template>
