<template>
  <div class="item-view"
       v-if="item">
    <template v-if="item">
      <pre>{{ JSON.stringify(item, null, 2) }}
        </pre>
    </template>
  </div>
</template>

<script>
export default {
  name: "item-view",

  data: () => ({}),

  computed: {
    item() {
      return this.$store.state.items[this.$route.params.id];
    }
  },

  // We only fetch the item itself before entering the view, because
  // it might take a long time to load threads with hundreds of comments
  // due to how the HN Firebase API works.
  asyncData({ store, route: { params: { id } } }) {
    return store.dispatch("FETCH_ITEMS", { ids: [id] });
  },

  title() {
    return this.item.id;
  },

  // Fetch comments when mounted on the client
  beforeMount() {
    // this.fetchComments();
  },

  // refetch comments if item changed
  watch: {},

  methods: {}
};
</script>