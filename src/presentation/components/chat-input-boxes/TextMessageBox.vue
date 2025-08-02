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
      <template v-if="isStream">
        <button type="button" class="btn-stop" v-if="disableButton" @click="handleAbort">
          <span class="mr-2">Parar</span>
          <i class="fa-solid fa-stop"></i>
        </button>

        <button type="submit" class="btn-primary" v-else>
          <span class="mr-2">Enviar</span>
          <i class="fa-regular fa-paper-plane"></i>
        </button>
      </template>

      <button type="submit" class="btn-primary" v-else :disabled="disableButton">
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
  disableButton?: boolean
  isStream?: boolean
}

withDefaults(defineProps<Props>(), {
  disableCorrections: false,
  disableButton: false,
  isStream: false,
})

const emits = defineEmits<{
  sendMessage: [message: string]
  abortStream: []
}>()

const message = ref<string>('')

const handleSendMessage = () => {
  if (message.value.trim().length === 0) return

  emits('sendMessage', message.value)

  message.value = ''
}

const handleAbort = () => {
  emits('abortStream')
}
</script>
