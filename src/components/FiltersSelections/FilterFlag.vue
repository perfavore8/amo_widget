<template>
  <div class="filter">
    <selector-vue
      :options_props="options"
      @select="option_select"
      :selected_option="options[filterValue - 1]"
    />
  </div>
</template>

<script>
import { nextTick } from "vue";
import SelectorVue from "@/components/SelectorVue.vue";
export default {
  components: {
    SelectorVue,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    idx: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      options: [
        { name: "Все", value: 1 },
        { name: "Да", value: 2 },
        { name: "Нет", value: 3 },
      ],
      filterValue: 1,
    };
  },
  computed: {
    option_value() {
      return {
        value: this.filterValue,
      };
    },
  },
  watch: {
    option_value: {
      handler() {
        this.emit_value();
      },
      deep: true,
    },
    item() {
      this.change_value();
    },
  },
  mounted() {
    this.change_value();
  },
  methods: {
    change_value() {
      nextTick(() => {
        this.filterValue = this.item.value;
      });
    },
    emit_value() {
      this.$emit("change_filter_value", this.option_value, this.idx);
    },
    option_select(option) {
      this.filterValue = option.value;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/app.scss";
.filter {
  max-width: 100px;
  min-width: 50px;
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  .v-select {
    width: calc(100% - 26px) !important;
  }
}
</style>
