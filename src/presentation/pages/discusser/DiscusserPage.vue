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
import { discusserUseCase } from '@/core/use-cases/discusserUseCase'

interface Message {
  text: string
  isGpt: boolean
}

const isLoading = ref(false)
const messages = reactive<Message[]>([])

const handlePost = async (text: string) => {
  isLoading.value = true
  messages.push({ text: text, isGpt: false })

  const res = await discusserUseCase(text)
  messages.push({ isGpt: true, text: res.message })
  isLoading.value = false
}
</script>
