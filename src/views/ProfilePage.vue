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
  
      <!-- Botón de editar -->
      <button
        @click="goToEditProfile"
        class="absolute top-4 right-4 bg-white text-xboxGreen p-2 rounded-full shadow-lg hover:bg-green-100"
      >
        <i class="fas fa-edit"></i>
      </button>
  
      <!-- Tarjeta principal -->
      <div class="bg-white shadow-lg rounded-lg p-6 w-3/4 max-w-md text-center">
        <!-- Imagen de perfil -->
        <div class="w-32 h-32 mx-auto rounded-full bg-gray-300 overflow-hidden mb-4">
          <img
            :src="user.profile_image || defaultAvatar"
            alt="User Avatar"
            class="w-full h-full object-cover"
          />
        </div>
  
        <!-- Información del usuario -->
        <h1 class="text-2xl font-bold text-gray-800">{{ user.full_name }}</h1>
        <p class="text-sm text-gray-500 mb-4">@{{ user.nickname }}</p>
        <p class="text-gray-700">{{ user.description || "Sin descripción disponible." }}</p>
  
        <!-- Gráfica mockeada -->
        <div class="mt-6">
          <h2 class="text-lg font-bold text-gray-800 mb-2">Tu colección en popularidad</h2>
          <canvas id="popularityChart" class="w-full h-32"></canvas>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import { Chart, LinearScale, LineController, LineElement, PointElement, CategoryScale } from 'chart.js';

Chart.register(LinearScale, LineController, LineElement, PointElement, CategoryScale);
  
  export default {
    data() {
      return {
        user: {}, // Datos del usuario
        defaultAvatar: "https://via.placeholder.com/150", // Avatar genérico
      };
    },
    methods: {
      async fetchUserData() {
        try {
          const response = await this.$axios.get(`/users/${this.$route.params.id}`);
          this.user = response.data;
  
          // Cargar gráfica después de obtener datos
          this.loadChart();
        } catch (error) {
          console.error("Error al cargar datos del usuario:", error);
          alert("No se pudo cargar la información del usuario.");
        }
      },
      loadChart() {
        const ctx = document.getElementById("popularityChart").getContext("2d");
  
        new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
            datasets: [
              {
                label: "Popularidad",
                data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
                borderColor: "#4ade80",
                backgroundColor: "rgba(74, 222, 128, 0.3)",
                fill: true,
                tension: 0.4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      },
      goBack() {
        this.$router.push("/feed");
      },
      goToEditProfile() {
        this.$router.push(`/edit-profile/${this.user.id}`);
      },
    },
    async created() {
      await this.fetchUserData();
    },
  };
  </script>
  
  <style scoped>
  .shadow-lg {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  button {
    transition: all 0.3s ease-in-out;
  }
  </style>
  