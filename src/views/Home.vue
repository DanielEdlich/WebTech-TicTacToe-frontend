<template>
  <div class="home">
    <div class="card login" v-if="!userID">
      <div class="card-body justify-content-center p-2">
        <h2 class="card-title">You need to login to use the side.</h2>
        <button type="button" class="btn btn-primary btn-lg" @click="() => this.$router.push('/login')">Login</button>
      </div>
    </div>

   <div class="card userStats" v-if="userID">
      <div class="card-body">
        <h2 class="card-title">Your Stats.</h2>
        <p class="card-text"> {{ username }}</p>
        <p class="card-text"> Highscore: {{ highscore }}</p>
      </div>
    </div>

    <div class="justify-content-center row row-cols-1 row-cols-md-4 g-4" v-if="userID">
      <div class="card createGame">
        <h2 class="card-title">Create a Game.</h2>
              <button type="button" class="btn btn-primary" @click="createGame()">Create Game</button>

<!--        <div class="btn-group" >-->
<!--          <button type="button" class="btn btn-danger">Create Game</button>-->
<!--          <button type="button" class="btn btn-danger dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">-->
<!--            <span class="visually-hidden">Toggle Dropdown</span>-->
<!--          </button>-->
<!--          <ul class="dropdown-menu">-->
<!--            <li><a class="dropdown-item" href="#"  @click="createGame()"> new Singleplayer</a></li>-->
<!--            <li><a class="dropdown-item" href="#" @click="createGame()">new Multiplayer</a></li>-->
<!--          </ul>-->
<!--        </div>-->
      </div>

    <div class="card joinGame">
        <h2 class="card-title">Join a Game.</h2>
        <button type="button" class="btn btn-primary" @click="loadGame()">Join Game</button>
      </div>

    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import { computed } from 'vue'
import store from '@/store'

export default {
  name: 'Home',
  components: {},
  data () {
    return {
      userID: computed(() => store.state.user.id),
      username: computed(() => store.state.user.name),
      highscore: computed(() => store.state.user.highscore)
    }
  },
  methods: {
    getPlayerById () {
      const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL
      const endpoint = baseUrl + '/api/v1/users'
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      }

      fetch(endpoint, requestOptions)
        .then(response => response.json())
        .then(result => result.forEach(user => {
          this.users.push(user)
        }))
        .catch(error => console.log('error', error))
    },
    async createGame () {
      const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL
      const endpoint = baseUrl + '/api/v1/games'
      const data = {
        player1_id: this.userID,
        player2_id: null,
        isFinished: false,
        grid: '---------'
      }
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
      await fetch(endpoint, requestOptions)
        .then(response => response.json())
        .then(result => {
          // console.log(result.id)
          this.$router.push({
            name: 'Game',
            params: {
              gameID: result.id
            }
          })
        })
        .catch(error => console.log('error', error))
    },
    loadGame () {
      this.$router.push('/game')
    }

  }
}
</script>
