<template>
  <form
    @submit.prevent="handleSendMessage"
    class="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
  >
    <div class="flex-grow">
      <div class="flex">
        <input
          type="text"
          autoFocus
          name="message"
          class="w-full border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10"
          :placeholder="placeholder"
          :autoComplete="disableCorrections ? 'on' : 'off'"
          :autoCorrect="disableCorrections ? 'on' : 'off'"
          :spellCheck="disableCorrections ? 'true' : 'false'"
          v-model="message"
        />

        <select
          name="select"
          class="w-2/5 ml-5 border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10"
          v-model="selectedOption"
        >
          <option value="">Seleccione</option>
          <option v-for="option in options" :key="option.id" :value="option.id">
            {{ option.text }}
          </option>
        </select>
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
  options: Option[]
}

interface Option {
  id: string
  text: string
}

const emit = defineEmits<{
  sendMessage: [message: string, selectedOption: string]
}>()

withDefaults(defineProps<Props>(), {
  disableCorrections: false,
})

const message = ref<string>('')
const selectedOption = ref<string>('')

const handleSendMessage = () => {
  if (message.value.trim().length === 0) return

  emit('sendMessage', message.value, selectedOption.value)

  message.value = ''
}
</script>
