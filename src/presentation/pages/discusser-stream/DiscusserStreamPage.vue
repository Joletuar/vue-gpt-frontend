<template>
  <div class="chat-container">
    <div class="chat-messages">
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
      @sendMessage="handlePost"
      @abortStream="handleAbort"
      placeholder="Escribe aquí lo que deseas"
      :disableCorrections="true"
      :disableButton="disableButton"
      :isStream="true"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

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
let abortController: AbortController | null = null

const handlePost = async (text: string) => {
  isLoading.value = true
  disableButton.value = true
  messages.push({ id: crypto.randomUUID(), text: text, isGpt: false })

  abortController = new AbortController()
  const abortSignal = abortController.signal

  try {
    const reader = await discusserStreamUseCase(text, abortSignal)
    isLoading.value = false

    if (!reader) return

    const decoder = new TextDecoder()
    const currentId = crypto.randomUUID()
    messages.push({ id: currentId, text: '', isGpt: true })

    while (true) {
      if (!reader) break

      const { done, value } = await reader.read()

      if (done) break

      const decoded = decoder.decode(value)

      const currentMessage = messages.find((m) => m.id === currentId)

      if (currentMessage) currentMessage.text += decoded
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Stream abortado por el usuario')

      return
    }

    isLoading.value = false

    console.error('Error en el stream:', error)
  } finally {
    disableButton.value = false
    abortController = null
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
</script>
