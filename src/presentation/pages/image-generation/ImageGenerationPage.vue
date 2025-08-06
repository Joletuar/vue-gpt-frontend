<template>
  <div class="chat-container">
    <div class="chat-messages">
      <div class="grid grid-cols-12 gap-y-2">
        <!-- Bienvenida -->
        <GptMessage
          text="Hola, puedes escribir la descripción de la imagen que quieres que genere."
        />

        <div class="flex flex-col col-start-1 col-end-12">
          <!-- Mensajes -->
          <template v-for="(message, index) in messages" :key="index">
            <GptMessage v-if="message.isGpt" :text="message.text" />
            <MyMessage v-else :text="message.text" />
          </template>

          <div class="ml-10 overflow-visible rounded-b-md max-w-xl">
            <img :src="imageUrl!" alt="Imagen generada" v-if="imageUrl" class="object-cover" />
          </div>
        </div>

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
      :disableButton="isLoading"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

import GptMessage from '../../components/chat-bubbles/GptMessage.vue'
import MyMessage from '../../components/chat-bubbles/MyMessage.vue'
import TextMessageBox from '../../components/chat-input-boxes/TextMessageBox.vue'
import TypingLoader from '../../components/loaders/TypingLoader.vue'
import { generateImageUseCase } from '@/core/use-cases/generateImageUseCase'
import { getImage } from '@/core/use-cases/getImageUseCase'

interface Message {
  text: string
  isGpt: boolean
}

const isLoading = ref(false)
const messages = reactive<Message[]>([])
const imageUrl = ref<string | null>('')

const handlePost = async (text: string) => {
  isLoading.value = true
  messages.push({ text: text, isGpt: false })

  const { imageId } = await generateImageUseCase(text)
  messages.push({
    isGpt: true,
    text: `Se ha generado tu imagen correctamente con el siguiente ID: ${imageId}`,
  })

  const imageChunks: Uint8Array[] = []
  const chunks = getImage(imageId)
  for await (const chunk of chunks) {
    imageChunks.push(chunk)
  }

  const imageBlob = new Blob(imageChunks, { type: 'imge/png' })
  imageUrl.value = URL.createObjectURL(imageBlob)

  isLoading.value = false
}
</script>
