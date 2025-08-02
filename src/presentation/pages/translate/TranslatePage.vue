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

        <!-- Selector de idioma -->
        <div class="relative w-full max-w-xs mx-auto my-4">
          <label for="language-select" class="text-sm font-semibold mb-1 flex items-center gap-2">
            Idioma
          </label>

          <div class="relative">
            <select
              id="language-select"
              class="block w-full pl-4 pr-10 py-2 text-base border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 rounded-lg shadow-sm transition duration-200 bg-white/10 appearance-none hover:border-indigo-400"
              v-model="selectedLanguage"
            >
              <option
                class="text-gray-700 hover:bg-indigo-50"
                v-for="language in languages"
                :key="language.id"
                :value="language.id"
              >
                {{ language.text }}
              </option>
            </select>

            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                class="w-5 h-5 text-indigo-400"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

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
import { ref } from 'vue'

import GptMessage from '../../components/chat-bubbles/GptMessage.vue'
import MyMessage from '../../components/chat-bubbles/MyMessage.vue'
import TextMessageBox from '../../components/chat-input-boxes/TextMessageBox.vue'
import TypingLoader from '../../components/loaders/TypingLoader.vue'
import { translationUseCase } from '@/core/use-cases/translationUseCase'

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
] as const

const selectedLanguage = ref<(typeof languages)[number]['id']>(languages[0].id)

const handlePost = async (text: string) => {
  isLoading.value = true
  messages.value.push({ text: text, isGpt: false })

  const resp = await translationUseCase(text, selectedLanguage.value)
  messages.value.push({ text: resp.text, isGpt: true })
  isLoading.value = false
}
</script>
