<template>
  <h1>Game</h1>

  <div v-if="!game.id">
  <input v-model="requestId" type="number" >
  <button type="button" @click = "getGameById(requestId)">search for Game</button>
  </div>

  <div v-if="$route.params.gameID || this.game.id">
    <p> Game ID: {{game.id}}</p>
  </div>

  <div class="board" v-if="game.id">
    <div v-for = "m in board.length" :key="m">
      <div v-for="n in board[m-1].length" :key="n" class="cell" @click="processAction(m-1, n-1)">
        <span v-if="board[m-1][n-1] !== '-'"> {{ board[m-1][n-1] }} </span>
        <span v-else> </span>
      </div>
    </div>
  </div>

  <div v-if="game.isFinished">
    <button type="button" class="btn btn-primary" @click="createGame()"> Play again </button>
  </div>

<!--  <span>{{game}}</span>-->
<!--  <span>{{board}}</span>-->

</template>

<script>
import store from '@/store'
import { computed } from 'vue'

export default {
  name: 'Game',
  props: {
    gameID: NaN
  },
  data () {
    return {
      user: computed(() => store.state.user),
      requestId: NaN,
      /* requestUId1: Number,
      requestUId2: Number, */

      game: {
        id: NaN,
        player_1_id: NaN,
        player_2_id: NaN,
        isFinished: NaN,
        grid: ''
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
        player1_id: this.user.id,
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
      fetch(endpoint, requestOptions)
        .then(response => response.text())
        .then(result => {
          this.game.id = result
          this.game.player_1_id = data.player1_id
          this.game.player_2_id = data.player2_id
          this.game.isFinished = data.isFinished
          this.game.grid = data.grid

          this.gridToBoard()
        })
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
        if (!this.hasWinner() && !this.isFull()) {
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
      } while ((this.board[x][y] === 'X') || (this.board[x][y] === 'O'))

      this.board[x][y] = 'O'
    },

    hasWinner () {
      // horizontally
      for (let x = 0; x < this.board.length; x++) {
        if (this.board[x][0] === this.board[x][1] && this.board[x][1] === this.board[x][2] && this.board[x][0] !== '-') {
          this.game.isFinished = true
          this.rewardPoitns(this.game.player_1_id, 20)
          return true
        }
      }

      // vertically
      for (let y = 0; y < this.board.length; y++) {
        if (this.board[0][y] === this.board[1][y] && this.board[1][y] === this.board[2][y] && this.board[0][y] !== '-') {
          this.game.isFinished = true
          this.rewardPoitns(this.game.player_1_id, 20)
          return true
        }
      }

      // diagonally
      if ((this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2] && this.board[0][0] !== '-') ||
        (this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0] && this.board[0][2] !== '-')) {
        this.game.isFinished = true
        this.rewardPoitns(this.game.player_1_id, 20)
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
        this.rewardPoitns(this.game.player_1_id, 5)
        if (this.game.player_2_id !== undefined) {
          this.rewardPoitns(this.game.player_2_id, 5)
        }

        // this.updateGame()
        return true
      }
    },
    rewardPoitns (playerID, amount) {
      // console.log('playerID: ' + playerID)
      // console.log('amount: ' + amount)
      const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL
      const endpoint = baseUrl + '/api/v1/users/' + playerID
      let data = {}
      if (playerID === this.user.id) {
        data = this.user
        data.highscore += amount
      } else {
        const player = this.getPlayer(playerID)
        data = {
          id: playerID,
          name: player.name,
          highscore: player.highscore + amount
        }
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
    getPlayer (playerID) {
      const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL
      const endpoint = baseUrl + '/api/v1/users/' + playerID
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      }

      return fetch(endpoint, requestOptions)
        .then(response => response.json())
        .then(result => {
          return result
        })
        .catch(error => console.log('error', error))
    }
  },
  created () {
    console.log(this.$route.params.gameID)
    if (this.$route.params.gameID) {
      this.getGameById(this.$route.params.gameID)
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

  .heading {
    text-align: center;
    width: 100%;
  }

  /* Inspired by https://stackoverflow.com/a/23703655 */
  .board {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

</style>
