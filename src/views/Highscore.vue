<template>
<h1> Highscore List</h1>
  <div class = "highscore-list">
    <table>
      <thead>
        <tr>
          <th>Player</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        <div v-for="user in users" :key="user.id">
          <tr>
            <td>{{ user.name }}</td>
            <td>{{ user.highscore }}</td>
          </tr>
        </div>
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
