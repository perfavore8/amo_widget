<template>
  <div class="filter" v-if="item.type == 7">
    <input type="date" v-model="date_start" />
    <input type="date" v-model="date_end" />
  </div>
  <div class="filter" v-if="item.type == 8">
    <input type="datetime-local" v-model="date_start" />
    <input type="datetime-local" v-model="date_end" />
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
      date_start: "",
      date_end: "",
    };
  },
  computed: {
    date() {
      return {
        value: this.date_start + "~" + this.date_end,
      };
    },
  },
  watch: {
    date: {
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
  emits: { change_filter_value: null },
  methods: {
    change_value() {
      nextTick(() => {
        if (this.item.value != null) {
          const a = this.item.value.split("~");
          this.date_start = a[0];
          this.date_end = a[1];
        }
      });
    },
    emit_value() {
      this.$emit("change_filter_value", this.date, this.idx);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/app.scss";
.filter {
  max-width: 130px;
  min-width: 50px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0 auto;
  input {
    position: relative;
    width: 100%;
    height: 27px;
    background: white;
    border: 0.5px solid #c4c4c4;
    border-radius: 4px;
    color: #3f3f3f;
    outline: none;
    @include font(400, 14px, 17px);
  }
  input::-webkit-datetime-edit-fields-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  input::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    appearance: none;
  }
}
</style>
