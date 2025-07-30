<template>
  <form
    @submit.prevent="handleSendMessage"
    class="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
  >
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
      <button class="btn-primary">
        <span class="mr-2">Enviar</span>
        <i class="fa-regular fa-paper-plane"></i>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  placeholder?: string
  disableCorrections?: boolean
}

withDefaults(defineProps<Props>(), {
  disableCorrections: false,
})

const emits = defineEmits<{
  sendMessage: [message: string]
}>()

const message = ref<string>('')

const handleSendMessage = () => {
  if (message.value.trim().length === 0) return

  emits('sendMessage', message.value)

  message.value = ''
}
</script>
