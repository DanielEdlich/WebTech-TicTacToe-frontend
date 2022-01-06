<template>
  <table class="table align-middle w-50 mx-auto">
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
      <td v-if="user.highscore !== 0"> {{ user.name }}</td>
      <td v-if="user.highscore !== 0"> {{ user.highscore}}</td>
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
