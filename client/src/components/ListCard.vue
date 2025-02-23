<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import TaskCard from '@/components/TaskCard.vue';

import type { PropType } from 'vue';
import type { List, Task } from '@/types';

import Modal from '@/components/Modal.vue';

export default defineComponent({
  name: 'ListCard',
  components: {
    TaskCard,
    Modal,
  },
  props: {
    list: {
      type: Object as PropType<List>,
      required: true,
    },
    tasks: {
      type: Array as PropType<Task[]>,
      required: true,
    },
  },
  setup(props) {
    const filteredTasks = ref(props.tasks.filter((task) => task.task_list_id === props.list.id));

    watch(
      () => props.tasks,
      (newTasks) => {
        filteredTasks.value = newTasks.filter((task) => task.task_list_id === props.list.id);
      },
      { immediate: true },
    );

    const isEditModalVisible = ref(false);
    const newListTitle = ref<string>(props.list.name);

    const isCreateTaskModalVisible = ref(false);
    const newTask = ref<Task>({
      id: '0',
      board_id: '',
      task_list_id: '',
      title: '',
      description: null,
      status: 'pending',
      assigned_user_id: null,
      due_date: null,
      priority: 'medium',
    });

    const openEditModal = () => {
      newListTitle.value = props.list.name;
      isEditModalVisible.value = true;
    };

    const closeEditModal = () => {
      isEditModalVisible.value = false;
    };

    const updateListTitle = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/list/${props.list.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newListTitle.value,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('List title successfully edited:', data);

          closeEditModal();
          props.list.name = newListTitle.value;
        } else {
          console.error('Failed to edit list title');
        }
      } catch (error) {
        console.error('Error changing list title:', error);
      }
    };

    const openCreateTaskModal = () => {
      isCreateTaskModalVisible.value = true;
    };

    const closeCreateTaskModal = () => {
      isCreateTaskModalVisible.value = false;
    };

    const createNewTask = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/task`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            board_id: props.list.board_id,
            task_list_id: props.list.id,
            title: newTask.value.title,
            description: newTask.value.description,
            assigned_user_id: newTask.value.assigned_user_id,
            due_date: newTask.value.due_date,
            priority: newTask.value.priority,
            status: newTask.value.status,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Successfully created new task:', data);

          closeCreateTaskModal();
          filteredTasks.value.push(data);
        } else {
          console.error('Failed to create new task');
        }
      } catch (error) {
        console.error('Error creating new task:', error);
      }
    };

    return {
      filteredTasks,
      isEditModalVisible,
      newListTitle,
      openEditModal,
      closeEditModal,
      updateListTitle,
      newTask,
      isCreateTaskModalVisible,
      openCreateTaskModal,
      closeCreateTaskModal,
      createNewTask,
    };
  },
});
</script>

<template>
  <div
    class="bg-gray-100 p-4 rounded-lg shadow-md min-w-[250px] max-w-[250px] mb-4 flex-shrink-0 w-full min-h-[80vh] max-h-[80vh]"
  >
    <h3
      @click="openEditModal"
      class="text-xl font-semibold text-gray-800 mb-4 width-100 truncate max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
    >
      {{ list.name }}
    </h3>

    <div class="overflow-y-auto flex flex-col items-center justify-start gap-4 max-h-[75vh]">
      <TaskCard v-for="task in filteredTasks" :key="task.id" :task="task" />

      <div
        @click="openCreateTaskModal"
        class="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 w-[85%] max-w-[300px] min-h-30 overflow-hidden cursor-pointer"
      >
        <h3 class="text-xl font-semibold text-gray-800 truncate"></h3>
        <div class="mt-2"></div>
      </div>
    </div>
  </div>

  <Modal :isOpen="isEditModalVisible" @update:isOpen="isEditModalVisible = $event">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Edit List Title</h2>

    <div class="mb-4">
      <input
        v-model="newListTitle"
        type="text"
        class="w-full p-2 border border-gray-300 rounded-lg"
        placeholder="Enter new list title"
      />
    </div>

    <div class="flex justify-between">
      <button
        @click="updateListTitle"
        class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
      >
        Save
      </button>
      <button
        @click="closeEditModal"
        class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Cancel
      </button>
    </div>
  </Modal>

  <Modal :isOpen="isCreateTaskModalVisible" @update:isOpen="isCreateTaskModalVisible = $event">
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

      <div class="mt-4">
        <label for="assigned_user" class="block text-sm font-semibold">Assigned User</label>
        <input
          v-model="newTask.assigned_user_id"
          type="text"
          id="assigned_user"
          class="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Enter assigned user"
        />
      </div>

      <div class="mt-4">
        <label for="due_date" class="block text-sm font-semibold">Due Date</label>
        <input
          v-model="newTask.due_date"
          type="date"
          id="due_date"
          class="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div class="mt-4">
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

    <div class="flex justify-between">
      <button
        @click="createNewTask"
        class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
      >
        Save
      </button>
      <button
        @click="closeCreateTaskModal"
        class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Cancel
      </button>
    </div>
  </Modal>
</template>
