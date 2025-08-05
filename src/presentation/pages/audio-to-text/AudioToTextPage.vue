<template>
  <div class="chat-container">
    <div class="chat-messages">
      <div class="grid grid-cols-12 gap-y-2">
        <!-- Bienvenida -->
        <GptMessage text="Hola, puedes enviar tu audio para que pueda realizar la transcripcion" />

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

    <TextBoxFile
      @sendFile="handlePost"
      placeholder="Escribe aquí lo que deseas"
      :disableCorrections="true"
      :disableButton="isLoading"
      accept="audio/*"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

import GptMessage from '../../components/chat-bubbles/GptMessage.vue'
import MyMessage from '../../components/chat-bubbles/MyMessage.vue'
import TypingLoader from '../../components/loaders/TypingLoader.vue'
import { audioToTextUseCase } from '@/core/use-cases/audioToTextUseCase'
import TextBoxFile from '@/presentation/components/chat-input-boxes/TextBoxFile.vue'

interface Message {
  text: string
  isGpt: boolean
}

const isLoading = ref(false)
const messages = reactive<Message[]>([])

const handlePost = async (audio: File) => {
  isLoading.value = true
  messages.push({ text: 'Transcribe este audio', isGpt: false })

  const result = await audioToTextUseCase(audio)
  messages.push({ text: result.text, isGpt: true })

  isLoading.value = false
}
</script>
