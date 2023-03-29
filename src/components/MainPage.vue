<template>
  <div class="container">
    <div class="header">header</div>
    <div class="content">content</div>
    <div class="footer">footer</div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  watch: {},
  methods: {},
};
</script>

<style scoped>
/* .app {
} */
.container {
  overflow-y: auto;
  width: 100%;
  height: 100%;
  padding: 20px;
}
.header {
  margin-bottom: 30px;
}
.content::-webkit-scrollbar {
  width: 0;
}
.footer {
  display: flex;
  justify-content: end;
}
</style>
