<template>
  <div class="chat-container">
    <div class="chat-messages">
      <div class="grid grid-cols-12 gap-y-2">
        <!-- Bienvenida -->
        <GptMessage text="Hola, soy tu asistente de soporte, en que te puedo ayudar?" />

        <!-- Mensajes -->
        <template v-for="(message, index) in messages" :key="index">
          <GptMessage v-if="message.isGpt" :text="message.text" />
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
import { reactive, ref } from 'vue'

import GptMessage from '../../components/chat-bubbles/GptMessage.vue'
import MyMessage from '../../components/chat-bubbles/MyMessage.vue'
import TextMessageBox from '../../components/chat-input-boxes/TextMessageBox.vue'
import TypingLoader from '../../components/loaders/TypingLoader.vue'
import { createThreadUseCase } from '@/core/use-cases/createThreadUseCase'
import { assistantChat } from '@/core/use-cases/assistantChatUseCase'

interface Message {
  text: string
  isGpt: boolean
  id: string
}

const isLoading = ref(false)
const messages = reactive<Message[]>([])
const currentThreadId = ref<null | string>(null)

const handlePost = async (text: string) => {
  isLoading.value = true
  messages.push({ text: text, isGpt: false, id: crypto.randomUUID() })

  if (!currentThreadId.value) {
    // Creamos el thread
    const { threadId } = await createThreadUseCase()

    currentThreadId.value = threadId
  }

  // Añadimos la respuesta

  const currentId = crypto.randomUUID()

  for await (const chunk of assistantChat(text, currentThreadId.value!)) {
    const currentMessage = messages.find(({ id }) => id === currentId)

    if (currentMessage) {
      currentMessage.text += chunk

      continue
    }

    messages.push({ text: chunk, id: currentId, isGpt: true })
  }

  isLoading.value = false
}
</script>
