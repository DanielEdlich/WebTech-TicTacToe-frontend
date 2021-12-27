<template>
  <h1>Game</h1>

  <input v-model="requestUId1" type="number" >
  <input v-model="requestUId2" type="number" >
  <p></p>
  <button type="button" @click = "createGame"> create game </button >
  <p></p>
  <input v-model="requestId" type="number" >
  <button type="button" @click = "getGameById(requestId)">search for Game</button>

  <div class="board">
    <div v-for = "m in board.length" :key="m">
      <div v-for="n in board[m-1].length" :key="n" class="cell" @click="processAction(m-1, n-1)">
        <span v-if="board[m-1][n-1] !== '-'"> {{ board[m-1][n-1] }} </span>
        <span v-else> </span>
      </div>
    </div>
  </div>

<!--  <span>{{game}}</span>
  <span>{{board}}</span>-->

</template>

<script>
export default {
  name: 'Game',
  data () {
    return {
      requestId: Number,
      requestUId1: Number,
      requestUId2: Number,

      game: {
        id: Number,
        player_1_id: Number,
        player_2_id: Number,
        isFinished: Boolean,
        grid: String
      },
      board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ]
    }
  },
  methods: {
    getGameById (requestID) {
      const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL
      const endpoint = baseUrl + '/api/v1/games/' + requestID
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      }

      fetch(endpoint, requestOptions)
        .then(response => response.json())
        .then(result => {
          this.game = result
          this.gridToBoard()
        })
        .catch(error => console.log('error', error))
    },

    gridToBoard () {
      for (let c = 0; c < this.game.grid.length; c++) {
        this.board[Math.floor(c / 3)][c % 3] = this.game.grid.charAt(c)
      }
    },

    boardToGrid () {

    },

    createGame () {
      const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL
      const endpoint = baseUrl + '/api/v1/users'
      const data = {
        player1_id: 1,
        player2_id: 2,
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
      fetch(endpoint, requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error))
    },
    processAction (m, n) {
      this.board[m][n] = 'x'
    }
  }
}
</script>

<style scoped>
  .board{
    display: flex;
    flex-wrap: wrap;
  }

  .cell{
    width: 64px;
    height: 64px;
    border: 2px solid rgb(75,75,75);
  }

</style>
