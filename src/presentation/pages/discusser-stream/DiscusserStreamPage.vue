<template>
  <div class="chat-container">
    <div class="chat-messages" ref="chatMessagesRef">
      <div class="grid grid-cols-12 gap-y-2">
        <!-- Bienvenida -->
        <GptMessage
          text="Hola, puedes escribir algún tema o pregunta que te gustaría que evalúe sus pros y constras."
        />

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
      placeholder="Escribe aquí lo que deseas"
      @sendMessage="handlePost"
      @abortStream="handleAbort"
      :disableButton="disableButton"
      :disableCorrections="true"
      :isStream="true"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue'

import GptMessage from '../../components/chat-bubbles/GptMessage.vue'
import MyMessage from '../../components/chat-bubbles/MyMessage.vue'
import TextMessageBox from '../../components/chat-input-boxes/TextMessageBox.vue'
import TypingLoader from '../../components/loaders/TypingLoader.vue'
import { discusserStreamUseCase } from '@/core/use-cases/discusserStreamUseCase'

interface Message {
  id: string
  text: string
  isGpt: boolean
}

const isLoading = ref(false)
const messages = reactive<Message[]>([])
const disableButton = ref(false)
const chatMessagesRef = ref<HTMLElement | null>(null)
let abortController: AbortController | null = null

const handlePost = async (text: string) => {
  isLoading.value = true
  disableButton.value = true
  messages.push({ id: crypto.randomUUID(), text: text, isGpt: false })

  abortController = new AbortController()
  const abortSignal = abortController.signal

  try {
    const stream = discusserStreamUseCase(text, abortSignal)

    const currentId = crypto.randomUUID()

    for await (const chunk of stream) {
      const currentMessage = messages.find((m) => m.id === currentId)

      if (currentMessage) {
        currentMessage.text += chunk

        continue
      }

      messages.push({ id: currentId, text: chunk, isGpt: true })
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Stream abortado por el usuario')

      return
    }

    console.error('Error en el stream:', error)
  } finally {
    disableButton.value = false
    abortController = null
    isLoading.value = false
  }
}

const handleAbort = () => {
  if (abortController) {
    abortController.abort()
    abortController = null
    isLoading.value = false
    disableButton.value = false
  }
}

watch(
  messages,
  async () => {
    await nextTick()

    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTo({
        top: chatMessagesRef.value.scrollHeight,
        behavior: 'smooth',
      })
    }
  },
  /**
   * Usar la opción 'deep: true' es necesario cuando se observa un objeto reactivo o un array, ya que permite detectar y reaccionar a cambios en sus propiedades internas o elementos anidados.
   */
  { deep: true },
)
</script>
