<template>
  <transition-group name="mdl">
    <div class="filters">
      <div class="item">
        <selector-vue
          :options_props="dont_show_filters"
          :selected_option="{ name: 'Добавить фильтр' }"
          @select="add_filter"
        />
      </div>
      <div
        class="item"
        v-for="(filter, idx) in filtersValue"
        :key="idx"
        v-show="show_filters[idx]"
      >
        <div class="title">
          {{ params[idx + 1] }}
        </div>
        <filter-number
          v-if="filter.type == 1 || filter.type == 2"
          :item="filter"
          :idx="idx"
          @change_filter_value="change_filter_value"
        />
        <filter-text
          v-if="filter.type == 3 || filter.type == 4"
          :item="filter"
          :idx="idx"
          @change_filter_value="change_filter_value"
        />
        <filter-list
          v-if="filter.type == 5 || filter.type == 6"
          :item="filter"
          :idx="idx"
          :selector_options="filter.selector_options"
          @change_filter_value="change_filter_value"
        />
        <filter-date
          v-if="filter.type == 7 || filter.type == 8"
          :item="filter"
          :idx="idx"
          @change_filter_value="change_filter_value"
        />
        <filter-flag
          v-if="filter.type == 9"
          :item="filter"
          :idx="idx"
          @change_filter_value="change_filter_value"
        />
      </div>
    </div>
  </transition-group>
</template>

<script>
import { mapGetters } from "vuex";
import SelectorVue from "@/components/SelectorVue.vue";
import FilterNumber from "@/components/FiltersSelections/FilterNumber.vue";
import FilterText from "@/components/FiltersSelections/FilterText.vue";
import FilterList from "@/components/FiltersSelections/FilterList.vue";
import FilterDate from "@/components/FiltersSelections/FilterDate.vue";
import FilterFlag from "@/components/FiltersSelections/FilterFlag.vue";
export default {
  components: {
    SelectorVue,
    FilterNumber,
    FilterText,
    FilterList,
    FilterDate,
    FilterFlag,
  },
  props: {
    show_filters: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
  },
  emits: {
    updateFiltersValue: null,
    add_filter: null,
  },
  data() {
    return {
      filtersValue: [],
      dont_show_filters: [],
    };
  },
  computed: {
    ...mapGetters(["fields", "params"]),
  },
  mounted() {
    this.feelFilters();
    this.feelParams();
  },
  watch: {
    filtersValue: {
      handler: function () {
        this.$emit("updateFiltersValue", this.filtersValue);
      },
      deep: true,
    },
    show_filters: {
      handler: function () {
        this.feelParams();
      },
      deep: true,
    },
  },
  methods: {
    feelParams() {
      let arr = [];
      this.params.forEach((val, idx) => {
        if (
          this.show_filters[idx - 1] !== true &&
          idx != 0 &&
          idx != this.params.length - 1
        ) {
          const obj = {
            name: val,
            value: idx,
          };
          arr.push(obj);
        }
      });
      this.dont_show_filters = arr;
    },
    add_filter(option) {
      this.dont_show_filters.splice(
        this.dont_show_filters.indexOf(option.name),
        1
      );
      this.$emit("add_filter", option);
    },
    change_filter_value(new_obj, idx) {
      Object.assign(this.filtersValue[idx], new_obj);
    },
    feelFilters() {
      this.params.forEach((val, idx) => {
        if (idx != 0 && idx != this.params.length - 1) {
          let type = null;
          let selector_options = [];
          this.fields.forEach((value) =>
            value.field == val
              ? ((type = value.type.value),
                (selector_options = value.selector_options))
              : null
          );
          let value = null;
          if (type == 5 || type == 6) {
            value = [true];
          }
          if (type == 9) {
            value = 1;
          }
          const obj = {
            type: type,
            option: 1,
            selector_options: selector_options,
            value: value,
          };
          this.filtersValue.push(obj);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/app.scss";
.filters {
  display: flex;
  flex-direction: row;
  // justify-content: space-around;
  flex-wrap: wrap;
  gap: 5px;
  // background-color: rgba(0, 0, 0, 0.05);
  .item {
    .v-select {
      margin-top: 10px;
      margin-right: 30px;
      width: 300px;
      min-width: 300px;
    }
    // max-width: 23%;
    // width: min-content;
    display: flex;
    flex-direction: row;
    align-items: center;
    // justify-content: space-between;
    // flex-grow: 1;
    // border: 1px solid #c9c9c9;
    // border-radius: 5px;
    padding: 10px 5px;
    background-color: #fff;
    gap: 5px;
    .title {
      @include font(500, 16px, 19px);
    }
  }
  .item:deep(.filter) {
    min-width: 80px;
    width: min-content;
    // max-width: none;
  }
}
</style>
