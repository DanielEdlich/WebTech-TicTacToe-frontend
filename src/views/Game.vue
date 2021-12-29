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

    createGame () {
      const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL
      const endpoint = baseUrl + '/api/v1/games'
      const data = {
        player1_id: this.requestUId1,
        player2_id: this.requestUId2,
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

    updateGame () {
      const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL
      const endpoint = baseUrl + '/api/v1/games/' + this.game.id
      const data = {
        player1_id: this.game.player_1_id,
        player2_id: this.game.player_2_id,
        isFinished: this.game.isFinished,
        grid: this.boardToGrid()
      }
      const requestOptions = {
        method: 'PUT',
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

    gridToBoard () {
      for (let c = 0; c < this.game.grid.length; c++) {
        this.board[Math.floor(c / 3)][c % 3] = this.game.grid.charAt(c)
      }
    },

    boardToGrid () {
      let str = ''
      for (let m = 0; m < this.board.length; m++) {
        for (let n = 0; n < this.board[m].length; n++) {
          str += this.board[m][n]
        }
      }

      return str
    },

    processAction (m, n) {
      /* if (player === this.game.player_1_id) {
        this.board[m][n] = 'x'
      } else {
        this.board[m][n] = 'o' */
      if (this.board[m][n] === '-' && !this.game.isFinished) {
        this.board[m][n] = 'X'
        // console.log(this.hasWinner())
        // console.log(this.isFull())
        if (!this.hasWinner() || !this.isFull()) {
          this.opponentMove()
        }
        this.updateGame()
      }
    },
    opponentMove () {
      let x
      let y
      do {
        x = Math.floor(Math.random() * 3)
        y = Math.floor(Math.random() * 3)
        // console.log(x + ' ' + y)
      } while ((this.board[x][y] === 'X') || (this.board[x][y] === 'O'))

      this.board[x][y] = 'O'
    },

    hasWinner () {
      // horizontally
      for (let x = 0; x < this.board.length; x++) {
        if (this.board[x][0] === this.board[x][1] && this.board[x][1] === this.board[x][2] && this.board[x][0] !== '-') {
          this.game.isFinished = true
          return true
        }
      }

      // vertically
      for (let y = 0; y < this.board.length; y++) {
        if (this.board[0][y] === this.board[1][y] && this.board[1][y] === this.board[2][y] && this.board[0][y] !== '-') {
          this.game.isFinished = true
          return true
        }
      }

      // diagonally
      if ((this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2] && this.board[0][0] !== '-') ||
        (this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0] && this.board[0][2] !== '-')) {
        this.game.isFinished = true
        return true
      }

      return false
    },

    isFull () {
      for (let x = 0; x < this.board.length; x++) {
        for (let y = 0; y < this.board[x].length; y++) {
          if (this.board[x][y] === '-') {
            return false
          }
        }
        this.game.isFinished = true
        return true
      }
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
    border-width: 1px;
    border-style: solid;
    border-color:  black;
  }

</style>
