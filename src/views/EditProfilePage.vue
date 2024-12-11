<!-- eslint-disable prettier/prettier -->
<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-xboxGreen to-softWhite">
      <!-- Botón de regreso -->
      <button
        @click="goBack"
        class="absolute top-4 left-4 bg-white text-xboxGreen p-2 rounded-full shadow-lg hover:bg-green-100"
      >
        <i class="fas fa-arrow-left"></i>
      </button>
  
      <!-- Tarjeta de edición -->
      <div class="bg-white shadow-lg rounded-lg p-6 w-3/4 max-w-3xl">
        <h1 class="text-2xl font-bold text-center text-gray-800 mb-4">Editar Perfil</h1>
  
        <form @submit.prevent="saveProfile" class="space-y-4">
          <!-- Imagen de perfil -->
          <div class="flex flex-col items-center">
            <div class="w-32 h-32 rounded-full bg-gray-300 overflow-hidden shadow-md mb-4">
              <img :src="previewImage || user.profile_image || defaultImage" alt="Profile" class="w-full h-full object-cover" />
            </div>
            <input type="file" @change="uploadImage" class="hidden" ref="imageInput" />
            <button
              @click.prevent="$refs.imageInput.click()"
              type="button"
              class="bg-xboxGreen text-white py-2 px-4 rounded-lg shadow hover:bg-green-700"
            >
              Subir Imagen
            </button>
          </div>
  
          <!-- Campos del formulario -->
          <div>
            <label for="full_name" class="block text-gray-700 font-medium mb-1">Nombre Completo</label>
            <input
              v-model="user.full_name"
              type="text"
              id="full_name"
              class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
  
          <div>
            <label for="nickname" class="block text-gray-700 font-medium mb-1">Nickname</label>
            <input
              v-model="user.nickname"
              type="text"
              id="nickname"
              class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
  
          <div>
            <label for="email" class="block text-gray-700 font-medium mb-1">Email</label>
            <input
              v-model="user.email"
              type="email"
              id="email"
              class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
  
          <div>
            <label for="description" class="block text-gray-700 font-medium mb-1">Descripción</label>
            <textarea
              v-model="user.description"
              id="description"
              class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              rows="3"
            ></textarea>
          </div>
  
          <!-- Botones -->
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="goBack"
              class="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="!isFormValid"
              class="py-2 px-4 bg-xboxGreen text-white rounded-lg shadow hover:bg-green-700 disabled:opacity-50"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import api from "@/services/api";
  
  export default {
    data() {
      return {
        user: {}, // Información del usuario
        defaultImage: "https://via.placeholder.com/150", // Imagen genérica
        previewImage: null, // Previsualización de la imagen cargada
      };
    },
    computed: {
      isFormValid() {
        return this.user.full_name && this.user.nickname && this.user.email;
      },
    },
    methods: {
      goBack() {
        const userId = this.$route.params.id;
        this.$router.push(`/profile/${userId}`);
      },
      async fetchUserData() {
        try {
          const response = await api.get(`/users/${this.$route.params.id}`);
          this.user = response.data;
        } catch (error) {
          console.error("Error al cargar datos del usuario:", error);
          alert("No se pudieron cargar los datos del usuario.");
        }
      },
      async uploadImage(event) {
        const file = event.target.files[0];
        if (!file) return;
  
        const formData = new FormData();
        formData.append("image", file);
  
        try {
          const response = await api.post("/upload-image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          this.user.profile_image = response.data.path; // Actualizar el path de la imagen
          this.previewImage = URL.createObjectURL(file); // Previsualización
        } catch (error) {
          console.error("Error al subir la imagen:", error);
          alert("No se pudo subir la imagen. Por favor, intenta nuevamente.");
        }
      },
      async saveProfile() {
        try {
          await api.put(`/users/${this.$route.params.id}`, this.user);
          alert("Perfil actualizado correctamente.");
        
        } catch (error) {
          console.error("Error al guardar perfil:", error);
          alert("No se pudieron guardar los cambios. Por favor, intenta nuevamente.");
        }
      },
    },
    async created() {
      await this.fetchUserData();
    },
  };
  </script>
  
  <style scoped>
  </style>
  