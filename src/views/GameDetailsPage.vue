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

    <!-- Tarjeta principal -->
    <div class="bg-white shadow-lg rounded-lg p-6 w-3/4 max-w-3xl">
      <!-- Imagen -->
      <img
        :src="localGame.image || defaultAvatar"
        :alt="localGame.name"
        class="w-full h-64 object-cover rounded-lg mb-4"
      />

      <!-- Información del juego -->
      <h1 class="text-2xl font-bold text-gray-800">{{ localGame.name }}</h1>
      <p class="text-sm text-gray-600 mb-2">{{ localGame.developer }}</p>
      <p class="text-gray-700 mb-4">{{ localGame.description }}</p>
      <p class="text-sm text-gray-500 text-right">Lanzado: {{ localGame.release_date }}</p>

      <!-- Calificación general -->
      <div class="my-4" style="margin: auto; width: 50%; padding: 10px;">
        <h2 class="text-lg font-bold text-gray-800 text-center">Calificación General</h2>
        <canvas id="ratingChart"></canvas>
      </div>

      <!-- Estrellas -->
      <div class="flex justify-center space-x-2 my-4">
        <span
          v-for="star in 5"
          :key="star"
          @click="rateGame(star)"
          class="text-3xl cursor-pointer"
          :class="star <= userRating ? 'text-yellow-500' : 'text-gray-300'"
        >
          ★
        </span>
      </div>

      <!-- Comentarios -->
      <h2 class="text-lg font-bold text-gray-800 mb-2">Comentarios</h2>
      <div class="space-y-4">
        <div
          v-for="(comment, index) in comments"
          :key="index"
          class="flex items-start space-x-4"
        >
          <img
            :src="comment.user_image || defaultAvatar"
            alt="User Avatar"
            class="w-10 h-10 rounded-full"
          />
          <div>
            <h3 class="text-sm font-bold text-gray-800">{{ comment.user_nickname }}</h3>
            <p class="text-gray-700">{{ comment.comment }}</p>
          </div>
        </div>
        <!-- Textbox para agregar comentario -->
        <textarea
          v-model="newComment"
          class="w-full border rounded-lg p-2 shadow-sm focus:ring-green-500 focus:border-green-500"
          placeholder="Escribe tu comentario..."
        ></textarea>
        <button
          @click="addComment"
          class="w-full bg-xboxGreen text-white py-2 rounded-lg hover:bg-green-700"
        >
          Comentar ahora
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

export default {
  data() {
    return {
      localGame: JSON.parse(localStorage.getItem("selectedGame")) || {}, // Información almacenada localmente del juego
      gameInfo: {}, // Información adicional de game-info
      comments: [], // Comentarios
      newComment: "", // Nuevo comentario
      userRating: 0, // Calificación del usuario
      defaultAvatar: "https://via.placeholder.com/150", // Avatar genérico
      ratingChart: null, // Instancia de la gráfica
    };
  },
  methods: {
    goBack() {
      this.$router.push("/feed");
    },
    async fetchGameInfo() {
      try {
        const response = await this.$axios.get(`/game-info/${this.localGame.info_id}`);
        this.gameInfo = response.data;

        this.comments = this.gameInfo.user_comments || [];
        this.loadChart(parseFloat(this.gameInfo.general_rating));
      } catch (error) {
        console.error("Error al cargar detalles del juego:", error);
        alert("No se pudieron cargar los detalles adicionales del juego.");
      }
    },
    loadChart(generalRating) {
      const ctx = document.getElementById("ratingChart").getContext("2d");

      // Destruir gráfica anterior si existe
      if (this.ratingChart) {
        this.ratingChart.destroy();
      }

      // Crear gráfica de dona
      this.ratingChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Calificación actual", "Resto"],
          datasets: [
            {
              data: [generalRating, 5 - generalRating],
              backgroundColor: ["#4ade80", "#e5e7eb"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
        },
      });
    },


    async rateGame(star) {
      this.userRating = star;

      // Calcula el nuevo general_rating
      const newGeneralRating =
        (this.gameInfo.general_rating * this.comments.length + star) /
        (this.comments.length + 1);

      // JSON actualizado con el nuevo general_rating
      const updatedGameInfo = {
        general_rating: newGeneralRating,
        user_comments: this.comments, // Mantiene los comentarios existentes
      };

      try {
        // Enviar JSON actualizado con PUT
        await this.$axios.put(`/game-info/${this.localGame.info_id}`, updatedGameInfo);

        // Actualiza localmente la información y el gráfico
        this.gameInfo.general_rating = newGeneralRating;

        // Destruye la gráfica existente antes de cargar una nueva
        if (this.ratingChart) {
          this.ratingChart.destroy();
        }

        this.loadChart(this.gameInfo.general_rating);
        alert("Gracias por tu calificación.");
      } catch (error) {
        console.error("Error al calificar:", error);
        alert("No se pudo registrar tu calificación.");
      }
    },

    async addComment() {
      if (!this.newComment.trim()) return;

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Debes iniciar sesión para comentar.");
        return;
      }

      // Crea el nuevo comentario
      const newCommentData = {
        user_image: user.image || this.defaultAvatar,
        user_nickname: user.nickname || "Guest",
        comment: this.newComment,
      };

      // Actualiza el JSON completo con el nuevo comentario en el array
      const updatedComments = [...this.comments, newCommentData];
      const updatedGameInfo = {
        ...this.gameInfo,
        user_comments: updatedComments,
      };

      try {
        // Envía el JSON actualizado mediante PUT
        await this.$axios.put(`/game-info/${this.localGame.info_id}`, updatedGameInfo);

        // Actualiza localmente la lista de comentarios
        this.comments.push(newCommentData);
        this.newComment = "";
        alert("Comentario agregado con éxito.");
      } catch (error) {
        console.error("Error al agregar comentario:", error);
        alert("No se pudo agregar tu comentario.");
      }
    },

  },
  async created() {
    if (!this.localGame || !this.localGame.info_id) {
      alert("Información del juego no encontrada. Volviendo al feed.");
      this.goBack();
      return;
    }
    await this.fetchGameInfo();
  },
};
</script>

<style scoped>
/* Puedes agregar estilos adicionales aquí */
</style>
