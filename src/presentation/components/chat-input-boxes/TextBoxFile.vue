<template>
  <form
    @submit.prevent="handleSendMessage"
    class="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
  >
    <div class="mr-3 flex-grow flex">
      <button
        type="button"
        class="flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
        @click="handleFileClick"
      >
        <i class="fa-solid fa-paperclip text-xl"></i>
      </button>

      <input type="file" ref="inputFileRef" :accept="accept" hidden @change="handleFile" />
      <span
        class="text-gray-700 ml-2 border-2 border-gray-300 px-3 py-1 rounded-md"
        v-if="selectedFile"
      >
        {{ selectedFile.name.substring(0, 150) + '...' }}
      </span>
    </div>

    <div class="ml-4">
      <button class="btn-primary cursor-pointer" :disabled="!selectedFile || disableButton">
        <span class="mr-2">Enviar</span>
        <i class="fa-regular fa-paper-plane"></i>
      </button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface Props {
  placeholder?: string
  disableCorrections?: boolean
  accept?: string // image/*
  disableButton: boolean
}

withDefaults(defineProps<Props>(), {
  disableCorrections: false,
  disableButton: false,
})

const emit = defineEmits<{
  sendFile: [file: File]
}>()

const selectedFile = ref<File | null>(null)
const inputFileRef = ref<HTMLInputElement | null>(null)

const handleSendMessage = () => {
  if (!selectedFile.value) return

  emit('sendFile', selectedFile.value)

  selectedFile.value = null
}

const handleFile = (e: Event) => {
  const target = e.target as HTMLInputElement

  selectedFile.value = target.files?.item(0) ?? null
}

const handleFileClick = () => {
  if (inputFileRef.value) inputFileRef.value.click()
}
</script>
