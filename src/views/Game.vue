<template>
  <h1>Game</h1>

  <div v-if="!game.id" class="head justify-content-center row row-cols-md-2
">
    <div>
      <label for="inputID"> game ID </label>
      <div class="input-group justify-content-center">
        <input v-model="requestId" type="number" id="inputID" >
      </div>
    </div>
    <div>
      <button type="button" class="btn btn-primary" @click = "loadGame(requestId)">Search for Game</button>
    </div>

  </div>

  <div v-if="$route.params.gameID || this.game.id">
    <p> Game ID: {{game.id}}</p>
  </div>

  <transition name="fade" @after-enter="startTimer" :duration="{ enter: 100, leave: 100 }">
    <div v-if="error" class="alert alert-danger" role="alert">
      {{error}}
    </div>
  </transition>

  <div class="main">

    <div class="alert alert-primary" role="alert" v-if="game.player_2_id && !waiting">
      <p> Waiting for opponent </p>
    </div>

    <div class="board" v-if="game.id">
      <div v-for = "m in board.length" :key="m">
        <div v-for="n in board[m-1].length" :key="n" class="cell" @click="processAction(m-1, n-1)">
          <span v-if="board[m-1][n-1] !== '-'"
                :class="{ 'blue' : board[m-1][n-1] === 'X', 'red': board[m-1][n-1] === 'O' }">
            {{ board[m-1][n-1] }} </span>
          <span v-else>
          </span>
        </div>
      </div>
    </div>

    <div v-if="game.isFinished">
      <div class="alert alert-primary" role="alert">
        <p> Game is finished </p>
      </div>
      <button type="button" class="btn btn-primary" @click="createGame()" v-if="!game.player_2_id"> Play again </button>
    </div>
  </div>

  <span>{{game}}</span>
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
  data: function () {
    return {
      // method vars
      requestId: NaN,

      error: '',
      timeout: undefined,
      waiting: undefined,

      // data
      user: computed(() => store.state.user),

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

  created () {
    console.log('ID: ' + this.$route.params.gameID)
    if (this.$route.params.gameID) {
      this.loadGame(this.$route.params.gameID)
      // this.reloadData()
    }
  },
  beforeUnmount () {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  },

  methods: {

    // actions
    processAction (m, n) {
      console.log(!this.waiting)
      if (this.board[m][n] === '-' && !this.game.isFinished && !this.hasWinner() && this.user.id && !this.waiting) {
        if (this.user.id === this.game.player_1_id) {
          this.board[m][n] = 'X'
        } else {
          this.board[m][n] = 'O'
        }
        this.game.grid = this.boardToGrid()
        // this.board[m][n] = 'X'
        if (!this.hasWinner() && !this.isFull()) {
          if (!this.game.player_2_id) {
            this.opponentMove()
          } else {
            this.waitForOpponet()
          }
        } else {
        }
        this.updateGame()
      } else {
        this.error = 'Game is already finished'
      }
    },

    async loadGame (requestId) {
      this.getGameById(requestId)
      setTimeout(() => {
        // console.log('gid: ' + this.game.id)
        // console.log('p1: ' + this.game.player_1_id)
        // console.log('p2: ' + this.game.player_2_id)
        // console.log('uid: ' + this.user.id)
        // console.log('p1: ' + !this.game.player_1_id !== this.user.id)
        // console.log('p2: ' + !this.game.player_2_id)

        if (!this.game.player_2_id && this.game.player_1_id !== this.user.id && !this.error) {
          this.game.player_2_id = this.user.id
          this.updateGame()
        }
        if (this.game.player_2_id) {
          let counter = 0
          for (let a = 0; a < this.game.grid.length; a++) {
            if (this.game.grid.charAt(a) !== '-') {
              counter++
            }
          }
          console.log(counter)
          console.log(counter % 2)
          if (counter % 2 === 0 && this.game.player_2_id === this.user.id) {
            this.waitForOpponet()
          } else if (counter % 2 === 1 && this.game.player_1_id === this.user.id) {
            this.waitForOpponet()
          }
        }
        if (!this.timeout) {
          this.reloadData()
        }
      }, 500)
    },

    // helper methods
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
          this.rewardPoints(this.game.player_1_id, 20)
          return true
        }
      }

      // vertically
      for (let y = 0; y < this.board.length; y++) {
        if (this.board[0][y] === this.board[1][y] && this.board[1][y] === this.board[2][y] && this.board[0][y] !== '-') {
          this.game.isFinished = true
          this.rewardPoints(this.game.player_1_id, 20)
          return true
        }
      }

      // diagonally
      if ((this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2] && this.board[0][0] !== '-') ||
        (this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0] && this.board[0][2] !== '-')) {
        this.game.isFinished = true
        this.rewardPoints(this.game.player_1_id, 20)
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
        this.rewardPoints(this.game.player_1_id, 5)
        if (this.game.player_2_id !== undefined) {
          this.rewardPoints(this.game.player_2_id, 5)
        }

        // this.updateGame()
        return true
      }
    },

    waitForOpponet () {
      this.waiting = true

      this.reloadData()
    },

    // timers
    startTimer () {
      setTimeout(() => {
        this.error = ''
      }, 3000)
    },

    reloadData () {
      const delay = 10000

      const oldGrid = this.game.grid
      console.log('oldGrid: ' + oldGrid)

      // eslint-disable-next-line no-unused-vars
      let innerTimeout
      this.timeout = setTimeout(() => {
        console.log('reloadData')
        this.loadGame(this.game.id)
        console.log(this.game.grid !== oldGrid)
        if (this.game.grid !== oldGrid) {
          this.waiting = false
          clearTimeout(this.timeout)
          clearTimeout(innerTimeout)
        } else {
          innerTimeout = setTimeout(() => {
            if (this.game.grid !== oldGrid) {
              this.waiting = false
              clearTimeout(this.timeout)
              clearTimeout(innerTimeout)
            }
          }, delay)
        }
      }, delay)
    },

    // API requests
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
        .then(response => response.json())
        .then(result => {
          this.game.id = result.id
          this.game.player_1_id = data.player1_id
          this.game.player_2_id = data.player2_id
          this.game.isFinished = data.isFinished
          this.game.grid = data.grid

          this.gridToBoard()
          this.reloadData()
        })
        .catch(error => console.log('error', error))
    },

    async getGameById (requestID) {
      const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL
      const endpoint = baseUrl + '/api/v1/games/' + requestID
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      }

      await fetch(endpoint, requestOptions)
        .then(async response => await response.json())
        .then(async result => {
          //  TODO
          if (!result.isFinished) {
            this.game = result
            await this.gridToBoard()
            if (!this.game.player_2_id) {
              this.reloadData()
            }
          } else {
            this.error = 'Game is already finished'
          }
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
        // .then(result => console.log('update: ' + result))
        .catch(error => console.log('error', error))
    },

    rewardPoints (playerID, amount) {
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

      // console.log(data.id)
      // console.log(data.name)
      // console.log(data.highscore)

      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
      fetch(endpoint, requestOptions)
        .then(response => response.json())
        // .then(result => console.log(result))
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

  .head {
    position: absolute;
    top: 15%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  .main {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  .blue {
    color: darkblue;
  }
  .red {
    color: darkred;
  }
  .blue,.red {
    position: relative;
    top: -6px;
    font-weight: bold;
    font-size: 48px;
  }

  /*!* Inspired by https://stackoverflow.com/a/23703655 *!*/
  /*.board {*/
  /*  position: absolute;*/
  /*  top: 50%;*/
  /*  left: 50%;*/
  /*  transform: translateX(-50%) translateY(-50%);*/
  /*}*/

  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: #fff;
    background-color: #2c3e50;
    -webkit-font-smoothing: antialiased;
  }

</style>
