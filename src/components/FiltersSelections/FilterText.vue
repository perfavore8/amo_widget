<template>
  <div class="filter">
    <button @click="option == 2 ? (option = 1) : (option += 1)">
      <div
        class="icon"
        :class="{
          equal: option == 1,
          tilde: option == 2,
        }"
      ></div>
    </button>
    <input v-model="filterValue" type="text" />
  </div>
</template>

<script>
import { nextTick } from "vue";
export default {
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
      option: 1,
      filterValue: null,
    };
  },
  computed: {
    option_value() {
      return {
        option: this.option,
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
        this.option = this.item.option;
        this.filterValue = this.item.value;
      });
    },
    emit_value() {
      this.$emit("change_filter_value", this.option_value, this.idx);
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
  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 37px;
    height: 27px;
    background: #757575;
    border-radius: 4px;
    border: none;
    z-index: 2;
    cursor: pointer;

    .icon {
      width: 35px;
      height: 35px;
    }
  }
  > input {
    width: 100%;
    height: 23px;
    background: #ffffff;
    border: 0.5px solid #c4c4c4;
    border-radius: 4px;
    margin-left: -5px;
    padding-left: 7px;
    @include font(400, 14px, 17px);
    outline: none;
  }
}
.equal {
  @include bg_image("@/assets/equal.svg", 30% 30%);
}
.tilde {
  @include bg_image("@/assets/tilde.svg", 40% 40%);
}
</style>
