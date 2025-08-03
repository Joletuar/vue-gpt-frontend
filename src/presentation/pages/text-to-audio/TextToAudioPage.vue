<template>
  <div class="chat-container">
    <div class="chat-messages">
      <div class="grid grid-cols-12 gap-y-2">
        <!-- Bienvenida -->
        <GptMessage
          text="Hola, puedes escribir tu texto en español, y generaré un audio a partir de dicho texto."
        />

        <!-- Mensajes -->
        <template v-for="(message, index) in messages" :key="index">
          <div v-if="message.isGpt" class="col-start-1 col-end-12">
            <GptMessage text="Aqui tienes el audio generado:" />

            <audio :src="message.text" controls />
          </div>

          <MyMessage v-else :text="message.text as string" />
        </template>

        <!-- Loader -->
        <div v-if="isLoading" class="col-start-1 col-end-12 fade-in">
          <TypingLoader />
        </div>
      </div>
    </div>

    <TextMessageBoxSelect
      @sendMessage="handlePost"
      placeholder="Escribe aquí lo que deseas"
      :disableCorrections="true"
      :disableButton="isLoading"
      :options="voices"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

import GptMessage from '../../components/chat-bubbles/GptMessage.vue'
import MyMessage from '../../components/chat-bubbles/MyMessage.vue'
import TypingLoader from '../../components/loaders/TypingLoader.vue'
import TextMessageBoxSelect from '@/presentation/components/chat-input-boxes/TextMessageBoxSelect.vue'
import { texToAudioUseCase } from '@/core/use-cases/textoAudioUseCase'

interface Message {
  text: string
  isGpt: boolean
}

const isLoading = ref(false)
const messages = reactive<Message[]>([])

const voices = [
  { id: 'nova', text: 'Nova' },
  { id: 'alloy', text: 'Alloy' },
  { id: 'echo', text: 'Echo' },
  { id: 'fable', text: 'Fable' },
  { id: 'onyx', text: 'Onyx' },
  { id: 'shimmer', text: 'Shimmer' },
]

const handlePost = async (text: string, voice: string) => {
  isLoading.value = true
  messages.push({ text: text, isGpt: false })

  const audioBlob = await texToAudioUseCase(text, voice)

  if (!audioBlob) {
    messages.push({
      isGpt: true,
      text: 'Ha ocurrido un error al generar el audio, intenta de nuevo.',
    })

    isLoading.value = false

    return
  }

  const audioUrl = URL.createObjectURL(audioBlob)
  messages.push({ isGpt: true, text: audioUrl })
  isLoading.value = false
}
</script>
