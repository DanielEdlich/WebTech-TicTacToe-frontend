<template>
  <h1>Login</h1>
  <form class="<<!--position-absolute start-50 justify-content-center--> w-50 mx-auto">
    <div class="mb-3">
      <label for="InputUsername" class="form-label">Username</label>
      <input v-model="username" type="text" class="form-control" id="InputUsername">
    </div>
    <div class="mb-3">
      <label for="InputPassword" class="form-label">Password</label>
      <input v-model="password" type="password" class="form-control" id="InputPassword">
    </div>
    <p>
    </p>
    <button type="button" class="btn btn-primary" @click = "save()">Register</button>
  </form>
</template>

<script>

import router from '@/router'

const { useRouter } = require('vue-router')

export default {
  name: 'Register',
  router: useRouter(),
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async save () {
      if (this.username !== '' && this.password !== '') {
        const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL
        const endpoint = baseUrl + '/api/v1/signup'
        const data = {
          name: this.username,
          password: this.password
        }
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credential: 'include',
          body: JSON.stringify(data)
        }
        await fetch(endpoint, requestOptions)
          .then(response => response.json())
          .then(result => console.log(result))
          .catch(error => console.log('error', error))
        alert(this.username + ' created')

        await router.push('/login')
      } else {
        console.log('username and password can not be empty')
      }
    }
  }
}
</script>

<style scoped>

</style>
