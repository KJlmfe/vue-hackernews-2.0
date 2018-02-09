<template>
  <li class="news-item">
    Token id: <router-link class="link" :to="'/item/' + item.id">{{ item.id }}</router-link>
    <br>
    BirthTime: {{ (new Date(Number(item.birthTime)*1000)).toLocaleString() }}
    <!-- Owner address: <router-link class="link" :to="'/user/' + item.owner">{{ item.owner }}</router-link> -->
    <!-- <pre>{{ JSON.stringify(item, null, 2) }}</pre> -->
  </li>
</template>

<script>
export default {
  name: "news-item",
  props: ["item"]
};
</script>

<style scoped>
.news-item {
  padding:10px;
  border: 1px solid #666;
  margin: 10px;
}
.link {
  padding: 10px;
}
</style>
