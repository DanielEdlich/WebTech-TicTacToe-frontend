<template>
<h1> Highscore List</h1>

    <HighscoreList :users="users"/>

</template>

<script>
import HighscoreList from '@/components/HighscoreList'
export default {
  name: 'Highscore',
  components: { HighscoreList },
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
