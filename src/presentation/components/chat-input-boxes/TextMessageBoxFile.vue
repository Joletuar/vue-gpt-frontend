<template>
  <form
    @submit.prevent="handleSendMessage"
    class="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
  >
    <div class="mr-3">
      <button
        type="button"
        class="flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
        @click="handleFileClick"
      >
        <i class="fa-solid fa-paperclip text-xl"></i>
      </button>

      <input type="file" ref="inputFileRef" :accept="accept" hidden @change="handleFile" />
    </div>

    <div class="flex-grow">
      <div class="relative w-full">
        <input
          type="text"
          autoFocus
          name="message"
          class="flex w-full border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10"
          :placeholder="placeholder"
          :autoComplete="disableCorrections ? 'on' : 'off'"
          :autoCorrect="disableCorrections ? 'on' : 'off'"
          :spellCheck="disableCorrections ? 'true' : 'false'"
          v-model="message"
        />
      </div>
    </div>

    <div class="ml-4">
      <button class="btn-primary cursor-pointer" :disabled="!selectedFile">
        <span class="mr-2" v-if="!selectedFile">Enviar</span>
        <span class="mr-2" v-else> {{ selectedFile.name.substring(0, 10) + '...' }} </span>
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
}

withDefaults(defineProps<Props>(), {
  disableCorrections: false,
})

const emit = defineEmits<{
  sendMessage: [message: string]
}>()

const message = ref<string>('')
const selectedFile = ref<File | null>(null)
const inputFileRef = ref<HTMLInputElement | null>(null)

const handleSendMessage = () => {
  if (message.value.trim().length === 0) return

  emit('sendMessage', message.value)

  message.value = ''
}

const handleFile = (e: Event) => {
  const target = e.target as HTMLInputElement

  selectedFile.value = target.files?.item(0) ?? null
}

const handleFileClick = () => {
  if (inputFileRef.value) inputFileRef.value.click()
}
</script>
