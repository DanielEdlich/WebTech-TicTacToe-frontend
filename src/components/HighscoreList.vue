<template>
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
      <td> {{ user.name }}</td>
      <td> {{ user.highscore}}</td>
    </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  name: 'HighscoreList',
  props: {
    users: []
  }
}
</script>
<style scoped>
table {
  margin-left: auto;
  margin-right: auto;
}

</style>
