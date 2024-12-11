<!-- eslint-disable prettier/prettier -->
<template>
  <div class="flex h-screen">
    <!-- Menú lateral -->
    <div class="w-64 bg-white shadow-lg flex flex-col items-center py-6">
      <!-- Imagen redondeada del usuario -->
      <div class="w-20 h-20 rounded-full bg-gray-300 mb-4 overflow-hidden shadow-md">
        <img
          :src="userImage || defaultImage"
          alt="User Avatar"
          class="w-full h-full object-cover"
        />
      </div>
      <h2 class="text-xl font-bold text-green-600 mb-6">
        Welcome, {{ nickname }}
      </h2>
      <ul class="w-full">
        <li class="text-green-600 font-medium hover:bg-green-100 rounded-lg py-3 px-6 cursor-pointer transition duration-300">
          <router-link :to="`/profile/${user.id}`" class="flex items-center">
            <i class="fas fa-user mr-3"></i> Mi perfil
          </router-link>
        </li>
        <li class="text-green-600 font-medium hover:bg-green-100 rounded-lg py-3 px-6 cursor-pointer transition duration-300">
          <router-link to="/collection" class="flex items-center">
            <i class="fas fa-gamepad mr-3"></i> Mi colección
          </router-link>
        </li>
        <li class="text-green-600 font-medium hover:bg-green-100 rounded-lg py-3 px-6 cursor-pointer transition duration-300">
          <button @click="logout" class="flex items-center w-full">
            <i class="fas fa-sign-out-alt mr-3"></i> Cerrar sesión
          </button>
        </li>
      </ul>
    </div>
      <!-- Contenido principal -->
      <main class="flex-1 p-4 bg-gradient-to-b from-xboxGreen to-softWhite">
        <h1 class="text-2xl font-bold text-center mb-4">Feed de Juegos</h1>

        <!-- Filtros de categoría -->
        <div class="flex flex-wrap justify-center space-x-4 mb-4">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="filterByCategory(category.id)"
            class="px-4 py-2 bg-xboxGreen text-white rounded-full hover:bg-green-700"
          >
            {{ category.name }}
          </button>
        </div>

        <!-- Grid de juegos -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="game in filteredGames"
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
              <p class="text-sm text-gray-500 mb-2">{{ game.category.name }}</p>
              <button
                @click="addToCollection(game.id)"
                class="block w-full bg-xboxGreen text-white py-2 rounded-lg hover:bg-green-700"
              >
                Agregar a colección
              </button>
              <button
                @click="goToDetails(game.id)"
                class="block w-full bg-gray-200 text-gray-800 py-2 mt-2 rounded-lg hover:bg-gray-300"
              >
                Ver detalles
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
</template>

<script>
import api from "@/services/api";

export default {
  name: "FeedPage",
  data() {
    return {
      userImage: localStorage.getItem("userImage"),
      defaultImage: "https://via.placeholder.com/150",
      user: JSON.parse(localStorage.getItem('user')) || {}, // Cargamos los datos del usuario desde localStorage
      nickname: JSON.parse(localStorage.getItem("user"))?.nickname || "Guest",
      games: [], // Juegos de Xbox
      categories: [], // Categorías
      filteredGames: [], // Juegos filtrados
    };
  },
  methods: {
    async fetchData() {
      try {
        const [gamesResponse, categoriesResponse] = await Promise.all([
          api.get("/xbox-games"),
          api.get("/categories"),
        ]);
        this.games = gamesResponse.data;
        this.categories = categoriesResponse.data;
        this.filteredGames = this.games;
      } catch (error) {
        console.error("Error al cargar datos:", error);
        alert('No se pudieron cargar los datos. Por favor, intenta nuevamente.');
      }
    },
    filterByCategory(categoryId) {
      this.filteredGames = this.games.filter(
        (game) => game.category.id === categoryId
      );
    },
    async addToCollection(gameId) {
      try {
        // Obtener la colección actual del usuario
        const userResponse = await api.get(`/users/${this.user.id}`);
        let collectionData = userResponse.data.personal_collection; // No parsear, ya es un objeto

        // Si la colección está vacía, inicializarla
        if (!collectionData) {
          collectionData = { xbox_games: [], ps5_games: [] };
        }

        // Verificar si xbox_games ya incluye el juego
        if (!collectionData.xbox_games.includes(gameId)) {
          collectionData.xbox_games.push(gameId); // Agregar el juego a xbox_games
        }
        if (typeof collectionData === "string") {
          collectionData = JSON.parse(collectionData);
        }

        // Hacer el PUT al endpoint con el objeto directamente
        await api.put(`/users/${this.user.id}`, {
          personal_collection: collectionData, // Enviar como objeto, no como string
        });

        alert("Juego agregado a tu colección.");
      } catch (error) {
        console.error("Error al agregar juego a la colección:", error);
        alert("No se pudo agregar el juego a tu colección.");
      }
    },



    goToDetails(gameId) {
    const selectedGame = this.games.find((game) => game.id === gameId);
    if (selectedGame) {
      localStorage.setItem("selectedGame", JSON.stringify(selectedGame));
      this.$router.push(`/game/${gameId}`);
    } else {
      alert("No se encontró la información del juego.");
    }
  },
    goToPage(path) {
      this.$router.push(path);
    },
    logout() {
      localStorage.clear();
      localStorage.removeItem("token");
      this.$router.push("/");
    },
  },
  async created() {
  const token = localStorage.getItem('token');
  if (!token) {
    this.$router.push('/'); // Si no hay token, redirigir al login
    return;
  }
  try {
    await this.fetchData();
  } catch (error) {
    console.error('Error al cargar datos del feed:', error);
    alert('Ocurrió un problema al cargar los datos del feed.');
  }
},
};
</script>

<style scoped>
.shadow-lg {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.transition {
  transition: all 0.3s ease-in-out;
}
</style>

