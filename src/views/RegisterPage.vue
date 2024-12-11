<!-- eslint-disable prettier/prettier -->
<template>
    <div class="flex min-h-screen bg-gradient-to-r from-green-900 to-green-700">
      <!-- Sección izquierda -->
      <div class="w-1/2 flex flex-col justify-center items-center text-white px-12">
        <img src="../assets/Xbox_one_logo.svg" alt="Xbox Logo" class="w-24 h-24 mb-4" />
        <h1 class="text-4xl font-bold">Bienvenido a</h1>
        <p class="text-xl mt-2">Xbox Games Collection</p>
      </div>
  
      <!-- Sección derecha -->
      <div class="w-1/2 bg-white flex flex-col justify-center items-center rounded-l-3xl shadow-lg p-8">
        <h2 class="text-3xl font-bold text-gray-700 mb-6">Regístrate</h2>
        <form @submit.prevent="register" class="w-full max-w-md space-y-4">
          <!-- Nombre -->
          <div>
            <label for="full_name" class="block text-gray-700 font-medium mb-1">Nombre completo</label>
            <input
              v-model="full_name"
              type="text"
              id="full_name"
              class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Ingresa tu nombre completo"
              required
              minlength="4"
            />
          </div>
  
          <!-- Nickname -->
          <div>
            <label for="nickname" class="block text-gray-700 font-medium mb-1">Nickname</label>
            <input
              v-model="nickname"
              type="text"
              id="nickname"
              class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Ingresa tu nickname"
              required
              minlength="4"
            />
          </div>
  
          <!-- Email -->
          <div>
            <label for="email" class="block text-gray-700 font-medium mb-1">Correo electrónico</label>
            <input
              v-model="email"
              type="email"
              id="email"
              class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Ingresa tu correo"
              required
            />
          </div>
  
          <!-- Contraseña -->
          <div>
            <label for="password" class="block text-gray-700 font-medium mb-1">Contraseña</label>
            <input
              v-model="password"
              type="password"
              id="password"
              class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Ingresa tu contraseña"
              required
              minlength="8"
            />
          </div>
  
          <!-- Confirmar Contraseña -->
          <div>
            <label for="confirm_password" class="block text-gray-700 font-medium mb-1">Confirmar contraseña</label>
            <input
              v-model="confirm_password"
              type="password"
              id="confirm_password"
              class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Confirma tu contraseña"
              required
            />
          </div>
  
          <!-- Botón de registro -->
          <button
            type="submit"
            class="w-full py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700"
          >
            Registrarse
          </button>
  
          <!-- Enlace a inicio de sesión -->
          <p class="text-sm text-gray-500 text-center">
            ¿Ya tienes una cuenta? <router-link to="/" class="text-green-600 font-medium">Inicia sesión aquí</router-link>
          </p>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import api from "@/services/api";
  
  export default {
    data() {
      return {
        full_name: "",
        nickname: "",
        email: "",
        password: "",
        confirm_password: "",
      };
    },
    methods: {
      async register() {
        if (this.password !== this.confirm_password) {
          alert("Las contraseñas no coinciden.");
          return;
        }
  
        const newUser = {
          full_name: this.full_name,
          nickname: this.nickname,
          email: this.email,
          password: this.password,
          personal_collection: { xbox_games: [], ps5_games: [] }, // Colección vacía
        };
  
        try {
          await api.post("/users", newUser);
          alert("Usuario registrado exitosamente. Ahora puedes iniciar sesión.");
          this.$router.push("/"); // Redirigir al login
        } catch (error) {
          console.error("Error al registrar usuario:", error);
          alert("Hubo un error al registrar el usuario. Por favor, intenta nuevamente.");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .shadow-lg {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  </style>
  