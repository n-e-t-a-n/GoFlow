<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import ListCard from '@/components/ListCard.vue';
import Modal from '@/components/Modal.vue';

import type { List, Task, BoardData, UserBoard } from '@/types';

export default defineComponent({
  name: 'Board',
  components: {
    ListCard,
    Modal,
  },
  setup() {
    const route = useRoute();
    const tasks = ref<Task[]>([]);
    const lists = ref<List[]>([]);
    const members = ref<UserBoard[]>([]);
    const userIsAdmin = ref(false);
    const isModalOpen = ref(false);
    const isAddMemberModalOpen = ref(false);
    const isCreateModalOpen = ref(false);
    const newMemberEmail = ref('');
    const isAdmin = ref(false);
    const newListTitle = ref('');

    onMounted(() => {
      const boardID = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

      if (boardID) {
        fetchBoardData(boardID);
      }
    });

    const fetchBoardData = async (boardID: string) => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/task/${boardID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data: BoardData = await response.json();

          lists.value = data.lists;
          tasks.value = data.tasks;

          userIsAdmin.value = data.isAdmin;
        } else {
          console.error('Failed to fetch lists');
        }
      } catch (error) {
        console.error('Error fetching board data:', error);
      }
    };

    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem('token');

        const boardID = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/user-board/${boardID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          members.value = data;
        } else {
          console.error('Failed to fetch members');
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    const createNewList = async () => {
      try {
        const token = localStorage.getItem('token');

        const boardID = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/list/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            board_id: boardID,
            name: newListTitle.value,
            priority: 100,
          }),
        });

        if (response.ok) {
          console.log('Successfully added new board.');
          fetchBoardData(boardID);
          closeCreateModal();
        } else {
          console.error('Failed to add new board.');
        }
      } catch (error) {
        console.error('Error adding new board:', error);
      }
    };

    const openModal = async () => {
      await fetchMembers();
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const openAddMemberModal = () => {
      isAddMemberModalOpen.value = true;
    };

    const closeAddMemberModal = () => {
      isAddMemberModalOpen.value = false;
      newMemberEmail.value = '';
      isAdmin.value = false;
    };

    const openCreateModal = () => {
      isCreateModalOpen.value = true;
    };

    const closeCreateModal = () => {
      isCreateModalOpen.value = false;
      newListTitle.value = '';
    };

    const addMember = async () => {
      try {
        const token = localStorage.getItem('token');
        const boardID = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

        const role = isAdmin.value ? 'admin' : 'member';

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/user-board/${boardID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            board_id: boardID,
            email: newMemberEmail.value,
            role: role,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Member added:', data);
          closeAddMemberModal();
          fetchMembers();
        } else {
          console.error('Failed to add member');
        }
      } catch (error) {
        console.error('Error adding member:', error);
      }
    };

    const removeMember = async () => {
      try {
        const token = localStorage.getItem('token');

        const boardID = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/user-board/${boardID}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: newMemberEmail.value,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Member removed:', data);

          closeAddMemberModal();
          fetchMembers();
        } else {
          console.error('Failed to remove member.');
        }
      } catch (error) {
        console.error('Error removing member:', error);
      }
    };

    return {
      tasks,
      lists,
      members,
      isModalOpen,
      isAddMemberModalOpen,
      newMemberEmail,
      isAdmin,
      openModal,
      closeModal,
      openAddMemberModal,
      closeAddMemberModal,
      addMember,
      removeMember,
      userIsAdmin,
      isCreateModalOpen,
      openCreateModal,
      closeCreateModal,
      newListTitle,
      createNewList,
    };
  },
});
</script>

<template>
  <div class="p-6">
    <div class="flex">
      <div class="mt-6 mr-6">
        <button
          @click="openModal"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition duration-200"
        >
          View Board Members
        </button>
      </div>

      <div class="mt-6">
        <button
          v-if="userIsAdmin"
          @click="openAddMemberModal"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-400 focus:outline-none transition duration-200"
        >
          Add/Remove Member
        </button>
      </div>
    </div>

    <div>
      <div class="mt-6 flex overflow-x-auto gap-4 pb-2 justify-start min-w-[250px]">
        <div v-for="list in lists" :key="list.id" class="flex-shrink-0">
          <ListCard :list="list" :tasks="tasks" :role="userIsAdmin" :members="members" />
        </div>
        <div
          v-if="userIsAdmin"
          @click="openCreateModal"
          class="flex items-center justify-center p-4 rounded-lg border-3 min-h-[80vh] max-h-[80vh] min-w-[250px] max-w-[250px] mb-4 flex-shrink-0 w-full"
        >
          <img src="../assets/images/add.png" alt="add" class="w-24" />
        </div>
      </div>

      <Modal :isOpen="isModalOpen" @update:isOpen="closeModal">
        <div class="bg-white rounded-lg w-full max-w-lg mx-auto p-6 space-y-6">
          <h2 class="text-xl font-semibold text-gray-800">Board Members</h2>

          <div v-if="members.length === 0" class="text-gray-500">No members found.</div>

          <div v-else>
            <ul class="space-y-4">
              <li
                v-for="member in members"
                :key="member.user_id"
                class="flex items-center justify-between py-2 px-4 rounded-lg hover:bg-gray-100"
              >
                <div>
                  <strong class="text-gray-900">{{ member.name }}</strong>
                  <p class="text-sm text-gray-600">{{ member.email }}</p>
                </div>
                <span
                  class="inline-block bg-blue-100 text-blue-800 text-xs font-medium py-1 px-3 rounded-full"
                >
                  {{ member.role }}
                </span>
              </li>
            </ul>
          </div>

          <div class="flex justify-end">
            <button
              @click="closeModal"
              class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      <Modal :isOpen="isAddMemberModalOpen" @update:isOpen="closeAddMemberModal">
        <div class="bg-white rounded-lg w-full max-w-md mx-auto p-3 space-y-6">
          <div class="space-y-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="newMemberEmail"
              type="email"
              id="email"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
            />

            <div class="flex items-center space-x-2">
              <input
                v-model="isAdmin"
                type="checkbox"
                id="admin"
                class="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label for="admin" class="text-sm text-gray-700">Add as admin</label>
            </div>
          </div>

          <div class="flex justify-between space-x-4">
            <button
              @click="closeAddMemberModal"
              class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>

            <div class="flex space-x-4">
              <button
                @click="removeMember"
                class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Remove
              </button>

              <button
                @click="addMember"
                class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Invite
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal :isOpen="isCreateModalOpen" @update:isOpen="closeCreateModal">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Create New List</h2>

        <div class="mb-4">
          <input
            v-model="newListTitle"
            type="text"
            class="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Enter list title"
          />
        </div>

        <div class="flex justify-between">
          <button
            @click="closeCreateModal"
            class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Cancel
          </button>
          <button
            @click="createNewList"
            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  </div>
</template>
