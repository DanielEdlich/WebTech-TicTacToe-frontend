<template>
  <h1 v-if="!game.id">Game</h1>
  <h1 v-if="game.player_2_id && game.id">Multiplayer Game</h1>
  <h1 v-if="!game.player_2_id && game.id">Singleplayer Game</h1>

  <div v-if="!game.id" class="head justify-content-center row row-cols-md-2">
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

    <div class="alert alert-primary" role="alert" v-if="game.player_2_id && waiting">
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

<!--  <button type="button" @click="rewardPoints(user.id, 10)">  reward Points</button>-->
<!--  <button type="button" @click="rewardPoints(game.player_2_id, 10)">  reward Points</button>-->
<!--  <input v-model="game.grid" type="text">-->
<!--  <button type="button" @click="hasWinner()"> winner </button>-->
<!--  <p> {{board}}</p>-->
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
      waiting: false,
      oldGrid: '',
      pointsRewarded: false,

      // data
      user: {
        id: computed(() => store.state.user.id),
        name: computed(() => store.state.user.name),
        highscore: computed(() => store.state.user.highscore)
      },
      opponent: {
        id: NaN,
        name: '',
        highscore: NaN
      },

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
      // eslint-disable-next-line no-unused-vars
      // const a = this.hasWinner()
      // this.isFull()
      if (this.board[m][n] === '-' && !this.game.isFinished && this.user.id && !this.waiting) {
        if (this.user.id === this.game.player_1_id) {
          this.board[m][n] = 'X'
        } else {
          this.board[m][n] = 'O'
        }

        if (!this.hasWinner() && !this.isFull()) {
          if (!this.game.player_2_id) {
            this.opponentMove()
          } else {
            this.waitForOpponent()
          }
        }
        if (!this.board.isFinished) {
          this.hasWinner()
          this.isFull()
        }
        this.game.grid = this.boardToGrid()
        this.updateGame()
      } else if (this.waiting && !this.game.isFinished) {
        this.error = 'It`s not yor turn jet!'
      } else if (!this.user.id) {
        this.error = ' You need to bo logged in to play'
      } else {
        this.error = 'Game is already finished'
      }
    },

    async loadGame (requestId) {
      if (requestId) {
        this.getGameById(requestId)
        setTimeout(() => {
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
            // console.log(counter)
            // console.log(counter % 2)
            if (counter % 2 === 0 && this.game.player_2_id === this.user.id && !this.game.isFinished) {
              this.waitForOpponent()
            } else if (counter % 2 === 1 && this.game.player_1_id === this.user.id && !this.game.isFinished) {
              this.waitForOpponent()
            }
          }
          if (!this.timeout) {
            this.reloadData()
          }
        }, 500)
      } else {
        this.error = 'No ID provided'
      }
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
      clearTimeout(this.timeout)

      let x
      let y
      do {
        x = Math.floor(Math.random() * 3)
        y = Math.floor(Math.random() * 3)
      } while ((this.board[x][y] === 'X') || (this.board[x][y] === 'O'))

      this.board[x][y] = 'O'
    },

    hasWinner () {
      // this.gridToBoard()
      // console.log(this.board)
      let winner = NaN
      let status = false

      // const getWinner = function (c) {
      //   console.log((c === 'X') ? this.game.player_1_id : this.game.player_2_id)
      //   return (c === 'X') ? this.game.player_1_id : this.game.player_2_id
      // }

      // horizontally
      if (!status) {
        // console.log('hor')
        for (let x = 0; x < this.board.length; x++) {
          // horizontally
          // console.log(this.board[x][0] === 'X' && this.board[x][1] === 'X' && this.board[x][2] === 'X')
          if (this.board[x][0] === 'X' && this.board[x][1] === 'X' && this.board[x][2] === 'X') {
            // console.log('ver X' + x)
            // this.game.isFinished = true
            winner = this.game.player_1_id
            status = true
          } else if (this.board[x][0] === 'O' && this.board[x][1] === 'O' && this.board[x][2] === 'O') {
            // console.log('ver O' + x)
            // this.game.isFinished = true
            winner = this.game.player_2_id
            status = true
          }
        }
      }
      // vertically
      if (!status) {
        // console.log('ver')
        for (let x = 0; x < this.board.length; x++) {
          // console.log(this.board[0][x] === 'X' && this.board[1][x] === 'X' && this.board[2][x] === 'X')
          if (this.board[0][x] === 'X' && this.board[1][x] === 'X' && this.board[2][x] === 'X') {
            // this.game.isFinished = true
            // console.log('ver O' + x)
            winner = this.game.player_1_id
            status = true
          } else if (this.board[0][x] === 'O' && this.board[1][x] === 'O' && this.board[2][x] === 'O') {
            // console.log('ver X' + x)
            // this.game.isFinished = true
            winner = this.game.player_2_id
            status = true
          }
        }
      }

      // diagonally
      if (!status) {
        // console.log('diag')
        // console.log(this.board[0][0] === 'X' && this.board[1][1] === 'X' && this.board[2][2] === 'X')
        // console.log(this.board[0][2] === 'X' && this.board[1][1] === 'X' && this.board[2][0] === 'X')
        if ((this.board[0][0] === 'X' && this.board[1][1] === 'X' && this.board[2][2] === 'X') ||
          (this.board[0][2] === 'X' && this.board[1][1] === 'X' && this.board[2][0] === 'X')) {
          // console.log('diag X')
          // this.game.isFinished = true
          winner = this.game.player_1_id
          status = true
        } else if ((this.board[0][0] === 'O' && this.board[1][1] === 'O' && this.board[2][2] === 'O') ||
          (this.board[0][2] === 'O' && this.board[1][1] === 'O' && this.board[2][0] === 'O')) {
          // console.log('diag X')
          // this.game.isFinished = true
          winner = this.game.player_2_id
          status = true
        }
      }

      // console.log(status)

      if (status) {
        if (!this.pointsRewarded) {
          console.log('winner: ' + winner)
          this.rewardPoints(winner, 20)
        }
        this.game.isFinished = true
        return true
        // this.rewardPoints(winner, 20)
      } else {
        return false
      }
    },

    isFull () {
      let count = 0
      for (let x = 0; x < this.board.length; x++) {
        for (let y = 0; y < this.board.length; y++) {
          if (this.board[x][y] === '-') {
            count++
          }
        }
      }
      if (count === 0) {
        this.game.isFinished = true
        if (this.rewardPoints) {
          this.rewardPoints(this.game.player_1_id, 5)
          if (this.game.player_2_id) {
            this.rewardPoints(this.game.player_2_id, 5)
          }
        }
        // this.updateGame()
        return true
      } else {
        return false
      }
    },

    waitForOpponent () {
      this.waiting = true
      this.oldGrid = this.game.grid
      // console.log('oldGrid: ' + this.oldGrid)

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

      // eslint-disable-next-line no-unused-vars
      let innerTimeout
      this.timeout = setTimeout(() => {
        console.log('reloadData')
        this.loadGame(this.game.id)
        if (this.game.grid !== this.oldGrid || this.game.isFinished) {
          this.waiting = false
          clearTimeout(this.timeout)
          clearTimeout(innerTimeout)
        } else {
          innerTimeout = setTimeout(() => {
            if (this.game.grid !== this.oldGrid) {
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
      // reset data
      this.pointsRewarded = false
      this.waiting = false
      this.opponent = {
        id: NaN,
        name: '',
        highscore: NaN
      }

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
          if (!result.isFinished && !this.game.player_2_id) {
            this.reloadData()
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
      if (!playerID) {
        return
      }
      console.log(playerID, amount)
      const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL
      const endpoint = baseUrl + '/api/v1/users/' + playerID

      if (playerID !== this.user.id) {
        this.getPlayer(playerID)
      }
      setTimeout(() => {
        let score
        if (playerID === this.user.id) {
          score = this.user.highscore
        } else {
          score = this.opponent.highscore
        }

        const data = {
          highscore: score + amount
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
        // .then(result => console.log(result))
          .catch(error => console.log('error', error))
      }, 500)
    },

    getPlayer (playerID) {
      const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL
      const endpoint = baseUrl + '/api/v1/users/' + playerID
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      }

      fetch(endpoint, requestOptions)
        .then(response => response.json())
        .then(result => {
          this.opponent.id = result.id
          this.opponent.name = result.name
          this.opponent.highscore = result.highscore
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
