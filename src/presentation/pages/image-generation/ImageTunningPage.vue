<template>
  <div class="chat-container">
    <div class="chat-messages">
      <div class="grid grid-cols-12 gap-y-2">
        <!-- Bienvenida -->
        <GptMessage
          text="Hola, puedes subir tu imagen y seleccionar los lugares donde quieres editarla."
        />

        <!-- Mensajes -->
        <template v-for="(message, index) in messages" :key="index">
          <GptMessage v-if="message.isGpt" :text="message.text" />
          <ImageMessage
            v-else-if="message.image"
            :url="message.text"
            :editable="message.editable !== false"
            @editedImage="handleEditedImage"
          />
          <MyMessage v-else :text="message.text" />
        </template>

        <!-- Loader -->
        <div v-if="isLoading" class="col-start-1 col-end-12 fade-in">
          <TypingLoader />
        </div>
      </div>
    </div>

    <TextMessageBoxFile
      @sendMessage="handlePost"
      placeholder="Escribe aquí lo que deseas"
      :disableCorrections="true"
      :disableButton="isLoading || !maskImageSrc || !orginalImageSrc"
      accept="image/*"
      @loadFile="handleLoadFile"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

import GptMessage from '../../components/chat-bubbles/GptMessage.vue'
import MyMessage from '../../components/chat-bubbles/MyMessage.vue'
import TypingLoader from '../../components/loaders/TypingLoader.vue'
import TextMessageBoxFile from '@/presentation/components/chat-input-boxes/TextMessageBoxFile.vue'
import ImageMessage from '@/presentation/components/chat-input-boxes/ImageMessage.vue'
import { editImageUseCase } from '@/core/use-cases/editImageUseCase'

interface Message {
  text: string
  isGpt: boolean
  image: boolean
  editable?: boolean
}

const isLoading = ref(false)
const messages = reactive<Message[]>([])
const orginalImageSrc = ref<string | null>(null)
const maskImageSrc = ref<string | null>(null)

const handlePost = async (text: string) => {
  isLoading.value = true
  messages.push({ text: text, isGpt: false, image: false })

  await editImageUseCase(orginalImageSrc.value!, maskImageSrc.value!, text)

  isLoading.value = false
}

const handleLoadFile = (file: File) => {
  const reader = new FileReader()

  reader.onload = (event) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      // Convertir a PNG
      const pngDataUrl = canvas.toDataURL('image/png')
      orginalImageSrc.value = pngDataUrl
      messages.push({ text: orginalImageSrc.value, isGpt: false, image: true, editable: true })
    }
    img.src = event.target?.result as string
  }

  reader.readAsDataURL(file)
}

const handleEditedImage = (base64Image: string) => {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].image && !messages[i].isGpt) {
      messages[i].editable = false
      break
    }
  }

  maskImageSrc.value = base64Image
  messages.push({ text: base64Image, isGpt: false, image: true, editable: false })

  messages.push({
    text: 'He recibido tu imagen editada. ¿Qué te gustaría hacer con ella?',
    isGpt: true,
    image: false,
  })
}
</script>
