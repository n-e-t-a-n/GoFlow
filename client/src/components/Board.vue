<script lang="ts" setup>
import { onMounted, provide, ref } from 'vue';

import { useRoute } from 'vue-router';

import { ListCard, Modal } from '@/components/common';

import {
  getMembers,
  getTasks,
  createMember,
  createList,
  removeMember,
  type ApiRequest,
} from '@/helpers/database';

import type { List, Task, UserBoard } from '@/types';

import { useToastStore } from '@/stores';

const route = useRoute();

const { showToast } = useToastStore();

const tasks = ref<Task[]>([]);
const lists = ref<List[]>([]);
const members = ref<UserBoard[]>([]);

const isAdmin = ref(false);
const userIsAdmin = ref(false);

const email = ref('');

const isViewMemberModalOpen = ref(false);
const isCreateListModalOpen = ref(false);
const isCreateMemberModalOpen = ref(false);

const boardID = ref(Array.isArray(route.params.id) ? route.params.id[0] : route.params.id);
const newList = ref<List>({ id: '', board_id: boardID.value, name: '', priority: 0 });

async function handleCreateList() {
  const { message, type }: ApiRequest = await createList(lists, newList.value);

  handleCreateListModal();

  showToast(message, type);
}

function handleCreateListModal() {
  if (!isCreateListModalOpen.value) {
    newList.value = { id: '', board_id: boardID.value, name: '', priority: 0 };
  }

  isCreateListModalOpen.value = !isCreateListModalOpen.value;
}

function handleViewMemberModal() {
  isViewMemberModalOpen.value = !isViewMemberModalOpen.value;
}

async function handleCreateMember() {
  const { message, type }: ApiRequest = await createMember(
    members,
    email.value,
    boardID.value,
    isAdmin.value,
  );

  handleCreateMemberModal();

  showToast(message, type);
}

function handleCreateMemberModal() {
  if (!isCreateMemberModalOpen.value) {
    email.value = '';
    isAdmin.value = false;
  }

  isCreateMemberModalOpen.value = !isCreateMemberModalOpen.value;
}

async function handleRemoveMember() {
  const { message, type }: ApiRequest = await removeMember(members, email.value, boardID.value);

  handleCreateMemberModal();

  showToast(message, type);
}

onMounted(() => {
  getTasks(tasks, lists, userIsAdmin, boardID.value);
  getMembers(members, boardID.value);

  newList.value.board_id = boardID.value;
});

provide('tasks', tasks);
provide('lists', lists);
provide('boardID', boardID);
provide('members', members);
provide('role', userIsAdmin);
</script>

<template>
  <div class="p-6">
    <div class="flex">
      <div class="mt-6 mr-6">
        <button
          @click="handleViewMemberModal"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition duration-200"
        >
          View Board Members
        </button>
      </div>

      <div class="mt-6">
        <button
          v-if="userIsAdmin"
          @click="handleCreateMemberModal"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-400 focus:outline-none transition duration-200"
        >
          Add/Remove Member
        </button>
      </div>
    </div>

    <div>
      <div class="mt-6 flex overflow-x-auto gap-4 pb-2 justify-start min-w-[250px]">
        <div v-for="list in lists" :key="list.id" class="flex-shrink-0">
          <ListCard :list="list" />
        </div>
        <div
          v-if="userIsAdmin"
          @click="handleCreateListModal"
          class="flex items-center justify-center p-4 rounded-lg border-3 min-h-[80vh] max-h-[80vh] min-w-[250px] max-w-[250px] mb-4 flex-shrink-0 w-full"
        >
          <img src="../assets/images/add.png" alt="add" class="w-24" />
        </div>
      </div>

      <Modal :isOpen="isViewMemberModalOpen" :handleModal="handleViewMemberModal">
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
              @click="handleViewMemberModal"
              class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      <Modal :isOpen="isCreateMemberModalOpen" :handleModal="handleCreateMemberModal">
        <div class="bg-white rounded-lg w-full max-w-md mx-auto p-3 space-y-6">
          <div class="space-y-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="email"
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
              @click="handleCreateMemberModal"
              class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>

            <div class="flex space-x-4">
              <button
                @click="handleRemoveMember"
                class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Remove
              </button>

              <button
                @click="handleCreateMember"
                class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Invite
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal :isOpen="isCreateListModalOpen" :handleModal="handleCreateListModal">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Create New List</h2>

        <div class="mb-4">
          <input
            v-model="newList.name"
            type="text"
            class="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Enter list title"
          />
        </div>

        <div class="flex justify-between">
          <button
            @click="handleCreateListModal"
            class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Cancel
          </button>
          <button
            @click="handleCreateList"
            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  </div>
</template>
