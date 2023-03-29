<template>
  <div class="multi_selector">
    <div
      class="item"
      :class="{ selected: selected_options[idx] }"
      v-for="(option, idx) in options_props"
      :key="option.value"
      @click="select(idx)"
    >
      {{ option.name }}
    </div>
  </div>
</template>

<script>
import { reactive } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
export default {
  name: "MultiSelector",
  props: {
    options_props: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    selected_options: {
      type: Array,
      required: true,
      default() {
        return [true];
      },
    },
  },
  emits: {
    select: null,
  },
  setup(props, { emit }) {
    let options_value = reactive([]);
    onMounted(() =>
      props.selected_options.forEach((item) => options_value.push(item))
    );
    const select = (idx) => {
      if (idx == 0) options_value = reactive([]);
      if (options_value[0] == true) options_value[0] = false;
      options_value[idx] = !options_value[idx];
      if (!options_value.includes(true)) options_value[0] = true;
      emit("select", options_value);
    };
    return {
      options_value,
      select,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/app.scss";
.multi_selector {
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 1px solid #ced4da;
  border-radius: 5px;
  .item {
    cursor: pointer;
    height: 20px;
    width: 250px;
    padding: 6px 12px;
    transition: background-color 0.2s ease-out;
    @include font(400, 16px, 20px);
  }
  .item:first-child {
    border-radius: 4px 4px 0 0;
  }
  .item:last-child {
    border-radius: 0 0 4px 4px;
  }
  .item:hover {
    background-color: rgb(13 110 253 / 20%);
  }
}
.selected {
  background-color: #b3d7ff;
}
.selected:hover {
  background-color: #b3d7ff !important;
}
</style>
