<!-- eslint-disable prettier/prettier -->
<template>
    <div class="flex flex-col items-center min-h-screen bg-gradient-to-b from-xboxGreen to-softWhite">
      <!-- Botón de regreso -->
      <button
        @click="goBack"
        class="absolute top-4 left-4 bg-white text-xboxGreen p-2 rounded-full shadow-lg hover:bg-green-100"
      >
        <i class="fas fa-arrow-left"></i>
      </button>
  
      <!-- Título -->
      <h1 class="text-2xl font-bold text-center text-white mt-6 mb-4">
        Mi Colección Personal
      </h1>
  
      <!-- Grid de juegos -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-8">
        <div
          v-for="game in collection"
          :key="game.id"
          class="bg-white shadow-md rounded-lg overflow-hidden"
        >
          <img
            :src="game.image"
            :alt="game.name"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h3 class="text-lg font-bold text-gray-800">{{ game.name }}</h3>
            <p class="text-sm text-gray-500 mb-2">
              {{ game.developer || 'Desarrollador desconocido' }}
            </p>
            <button
              @click="confirmRemove(game)"
              class="block w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              Retirar de la Colección
            </button>
          </div>
        </div>
      </div>
  
      <!-- Modal de confirmación -->
      <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm">
          <h2 class="text-lg font-bold mb-4">¿Confirmar eliminación?</h2>
          <p class="text-sm mb-6">¿Deseas retirar "{{ gameToRemove.name }}" de tu colección?</p>
          <div class="flex justify-between">
            <button
              @click="removeFromCollection"
              class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Sí, retirar
            </button>
            <button
              @click="cancelRemove"
              class="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import api from "@/services/api";
  
  export default {
    data() {
      return {
        collection: [], // Juegos en la colección
        showModal: false, // Control del modal
        gameToRemove: null, // Juego a eliminar
        userId: JSON.parse(localStorage.getItem("user"))?.id || null, // ID del usuario
      };
    },
    methods: {
      goBack() {
        this.$router.push("/feed");
      },
      async fetchCollection() {
        try {
          const userResponse = await api.get(`/users/${this.userId}`);
          const collectionData = userResponse.data.personal_collection;
  
          const xboxGames = await Promise.all(
            collectionData.xbox_games.map((id) => api.get(`/xbox-games/${id}`))
          );
  
          const ps5Games = await Promise.all(
            collectionData.ps5_games.map((id) => api.get(`/ps5-games/${id}`))
          );
  
          // Combinar las dos colecciones
          this.collection = [...xboxGames.map((res) => res.data), ...ps5Games.map((res) => res.data)];
        } catch (error) {
          console.error("Error al cargar la colección:", error);
          alert("No se pudo cargar tu colección. Intenta nuevamente.");
        }
      },
      confirmRemove(game) {
        this.gameToRemove = game;
        this.showModal = true;
      },
      cancelRemove() {
        this.showModal = false;
        this.gameToRemove = null;
      },
      async removeFromCollection() {
        try {
            // Obtener la colección actualizada
            const userResponse = await api.get(`/users/${this.userId}`);
            const collectionData = userResponse.data.personal_collection;

            // Quitar el juego correspondiente
            if (collectionData.xbox_games.includes(this.gameToRemove.id)) {
            collectionData.xbox_games = collectionData.xbox_games.filter(
                (id) => id !== this.gameToRemove.id
            );
            } else if (collectionData.ps5_games.includes(this.gameToRemove.id)) {
            collectionData.ps5_games = collectionData.ps5_games.filter(
                (id) => id !== this.gameToRemove.id
            );
            }

            // Convertir la colección actualizada a JSON
            const updatedCollection = collectionData;

            // Enviar el PUT con la colección actualizada
            await api.put(`/users/${this.userId}`, {
            personal_collection: updatedCollection,
            });

            // Actualizar la vista
            this.collection = this.collection.filter(
            (game) => game.id !== this.gameToRemove.id
            );

            alert("El juego ha sido retirado de tu colección.");
        } catch (error) {
            console.error("Error al retirar el juego:", error);
            alert("No se pudo retirar el juego. Intenta nuevamente.");
        } finally {
            this.showModal = false;
            this.gameToRemove = null;
        }
    },

    },
    async created() {
      await this.fetchCollection();
    },
  };
  </script>
  
  <style scoped>
  /* Estilos opcionales */
  </style>
  