<template>
  <RouterLink
    :to="to"
    active-class="flex justify-center items-center bg-gray-800 rounded-md p-2 transition-colors"
    class="flex justify-center items-center hover:bg-gray-800 rounded-md p-2 transition-colors"
  >
    <i class="text-2xl mr-4 text-indigo-400" :class="icon"></i>
    <div class="flex flex-col flex-grow">
      <span class="text-white text-lg font-semibold">{{ title }}</span>
      <span class="text-gray-400 text-sm">{{ description }}</span>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface Props {
  to: string
  icon: string
  title: string
  description: string
}

defineProps<Props>()
</script>
