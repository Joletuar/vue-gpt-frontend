<template>
  <div class="chat-container">
    <div class="chat-messages">
      <div class="grid grid-cols-12 gap-y-2">
        <!-- Bienvenida -->
        <GptMessage
          text="Hola, puedes escribir tu texto en español, y te ayudo con las correcciones"
        />

        <!-- Mensajes -->
        <template v-for="(message, index) in messages" :key="index">
          <GptMessage v-if="message.isGpt" text="Esto es de OpenAI" />
          <MyMessage v-else :text="message.text" />
        </template>

        <!-- Loader -->
        <div v-if="isLoading" class="col-start-1 col-end-12 fade-in">
          <TypingLoader />
        </div>
      </div>
    </div>

    <TextMessageBox
      @sendMessage="handlePost"
      placeholder="Escribe aquí lo que deseas"
      :disableCorrections="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import GptMessage from '../../components/chat-bubbles/GptMessage.vue'
import MyMessage from '../../components/chat-bubbles/MyMessage.vue'
import TextMessageBox from '../../components/chat-input-boxes/TextMessageBox.vue'
import TypingLoader from '../../components/loaders/TypingLoader.vue'

interface Message {
  text: string
  isGpt: boolean
}

const isLoading = ref(false)
const messages = ref<Message[]>([])

const handlePost = async (text: string) => {
  isLoading.value = true
  messages.value.push({ text: text, isGpt: false })

  // TODO: UseCase

  isLoading.value = false

  // TODO: Añadir el mensaje de isGPT en true
}
</script>
