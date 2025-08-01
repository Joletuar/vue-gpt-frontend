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
          <GptOrthographyMessage v-if="message.isGpt" :data="message.text" />
          <MyMessage v-else :text="message.text" />
        </template>

        <!-- Loader -->
        <div v-if="isLoading" class="col-start-1 col-end-12 fade-in">
          <TypingLoader />
        </div>
      </div>
    </div>

    <!-- Caja de texto -->
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
import TypingLoader from '../../components/loaders/TypingLoader.vue'
import { checkOrthographyUseCase } from '@/core/use-cases/checkOrthographyUseCase'
import TextMessageBox from '@/presentation/components/chat-input-boxes/TextMessageBox.vue'
import GptOrthographyMessage from '@/presentation/components/chat-bubbles/GptOrthographyMessage.vue'

interface Message {
  text: string
  isGpt: boolean
}

const isLoading = ref(false)
const messages = reactive<Message[]>([])

const handlePost = async (text: string) => {
  isLoading.value = true
  messages.push({ text: text, isGpt: false })

  const orthographyResp = await checkOrthographyUseCase(text)
  isLoading.value = false
  messages.push({ text: JSON.stringify(orthographyResp), isGpt: true })
}
</script>
