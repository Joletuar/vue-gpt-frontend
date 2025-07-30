<template>
  <main class="flex flex-row mt-7">
    <!-- Sidebar -->
    <nav
      class="hidden sm:flex flex-col ml-5 w-[370px] min-h-[calc(100vh-3.0rem)] bg-white/10 p-5 rounded-3xl"
    >
      <h1
        class="font-bold text-lg lg:text-3xl bg-gradient-to-br from-white via-white/50 bg-clip-text text-transparent"
      >
        VueGPT<span class="text-indigo-500">.</span>
      </h1>
      <span class="text-xl">Bienvenido</span>

      <div class="border-gray-700 border my-3"></div>

      <!-- Opciones del menú -->
      <SidebarMenuItem v-for="option in menuRoutes" :key="option.to" v-bind="option" class="mt-2" />
    </nav>

    <!-- Main content -->
    <section
      class="mx-3 sm:mx-20 flex flex-col w-full h-[calc(100vh-50px)] bg-white/10 p-5 rounded-3xl"
    >
      <div class="flex flex-row h-full">
        <div class="flex flex-col flex-auto h-full p-1">
          <router-view />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { menuRoutes } from '../router/index'
import SidebarMenuItem from '../components/sidebar/SidebarMenuItem.vue'
</script>
