<template>
<h1> Highscore List</h1>
  <div class = "highscore-list">
    <table class="table align-middle">
      <thead>
        <tr>
          <th scope="col">Player</th>
          <th scope="col">Points</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="users.length === 0">
          <td colspan="2">No highscores yet</td>
        </tr>
        <tr v-for="user in users" :key="user.id">
          <td > {{ user.name }} </td>
          <td > {{ user.highscore}} </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Highscore',
  data () {
    return {
      users: []
    }
  },
  methods: {
    getPlayers () {
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
    }

  },
  mounted () {
    this.getPlayers()
  }

}
</script>

<style scoped>
  table{
    margin-left: auto;
    margin-right: auto;
  }

</style>
