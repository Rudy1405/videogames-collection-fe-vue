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
      <h2 class="text-3xl font-bold text-gray-700 mb-6">Inicia sesión</h2>
      <form @submit.prevent="login" class="w-full max-w-md space-y-4">
        <!-- Input de Email -->
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

        <!-- Input de Password -->
        <div class="relative">
          <label for="password" class="block text-gray-700 font-medium mb-1">Contraseña</label>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            placeholder="Ingresa tu contraseña"
            required
          />
          <span
            @click="togglePassword"
            class="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 hover:text-green-600"
          >
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
        </div>

        <!-- Botón de inicio de sesión -->
        <button
          type="submit"
          class="w-full py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700"
        >
          Iniciar sesión
        </button>

        <!-- Enlace a Registro -->
        <p class="text-sm text-gray-500 text-center">
          ¿No tienes una cuenta? <router-link to="/register" class="text-green-600 font-medium">Regístrate aquí</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async login() {
      try {
        const response = await this.$axios.post("/login", {
          email: this.email,
          password: this.password,
        });
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        this.$router.push("/feed");
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Credenciales incorrectas");
      }
    }
  },
};
</script>

<style scoped>
/* Agrega cualquier estilo específico aquí si lo necesitas */
</style>
