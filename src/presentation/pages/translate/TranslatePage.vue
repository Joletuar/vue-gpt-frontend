<template>
  <div class="chat-container">
    <div class="chat-messages">
      <div class="grid grid-cols-12 gap-y-2">
        <!-- Bienvenida -->
        <GptMessage
          :text="`Hola, puedes escribir tu texto en español, y lo traduciré al idioma que tú elijas.
                  Puedes seleccionar el idioma en el menú desplegable que está arriba a la derecha.
                  Actualmente, el idioma seleccionado es Inglés.`"
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

    <TextMessageBoxSelect
      @sendMessage="handlePost"
      placeholder="Escribe aquí lo que deseas"
      :disableCorrections="true"
      :options="languages"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import GptMessage from '../../components/chat-bubbles/GptMessage.vue'
import MyMessage from '../../components/chat-bubbles/MyMessage.vue'
import TypingLoader from '../../components/loaders/TypingLoader.vue'
import { translationUseCase } from '@/core/use-cases/translationUseCase'
import TextMessageBoxSelect from '@/presentation/components/chat-input-boxes/TextMessageBoxSelect.vue'

interface Message {
  text: string
  isGpt: boolean
}

const isLoading = ref(false)
const messages = ref<Message[]>([])

const languages = [
  { id: 'inglés', text: 'Inglés' },
  { id: 'alemán', text: 'Alemán' },
  { id: 'árabe', text: 'Árabe' },
  { id: 'bengalí', text: 'Bengalí' },
  { id: 'francés', text: 'Francés' },
  { id: 'hindi', text: 'Hindi' },
  { id: 'japonés', text: 'Japonés' },
  { id: 'mandarín', text: 'Mandarín' },
  { id: 'portugués', text: 'Portugués' },
  { id: 'ruso', text: 'Ruso' },
]

const handlePost = async (text: string, selectedLanguage: string) => {
  isLoading.value = true
  messages.value.push({ text: text, isGpt: false })

  const resp = await translationUseCase(text, selectedLanguage)
  messages.value.push({ text: resp.text, isGpt: true })
  isLoading.value = false
}
</script>
