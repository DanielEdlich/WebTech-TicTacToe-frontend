<template>
<h1>Login / create account</h1>
  <input v-model="username" type="text">
  <button type="button" @click = "save()">Create</button>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      username: ''
    }
  },
  methods: {
    save () {
      const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL
      const endpoint = baseUrl + '/api/v1/users'
      const data = {
        name: this.username,
        highscore: 0
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
      alert(this.username + ' created')
      this.username = ''
    }
  }
}
</script>

<style scoped>

</style>
