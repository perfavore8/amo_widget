<template>
  <edit-item v-if="show_edit_modal" :edit_data="edit_data" />
  <div class="wrapper" :class="{ blur: show_edit_modal }">
    <div class="header">
      <transition-group name="mdl">
        <div class="filters" v-if="show_filter">
          <div
            class="item"
            v-show="show_filter && (collval[idx] === false ? false : true)"
            v-for="(filter, idx) in filtersValue"
            :key="idx"
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
      <!-- <div class="btns">
        <button class="button" @click="show_categoryes = !show_categoryes">
          <span v-if="show_categoryes">Все</span>
          <span v-if="!show_categoryes">По категориям</span>
        </button>
      </div> -->
    </div>
    <div
      class="path"
      v-for="(item, i) in path"
      :key="item"
      v-show="sel_idx == i && show_categoryes"
    >
      <h2>{{ item }}:</h2>
      <div class="links">
        <div v-for="idx in i" :key="idx">
          <a
            href="#"
            @click="
              sel_idx = idx - 1;
              selected_categoryes.splice(idx - 1);
            "
            >{{ path[idx - 1] }}
          </a>
          <span> /</span>
        </div>
      </div>
      <div class="grid">
        <div
          class="card"
          v-for="select in categoryes[item]"
          :key="select"
          @click="
            selected_categoryes.push(select);
            sel_idx += 1;
          "
        >
          <div class="row">
            <div class="name"></div>
            <div class="value">{{ select }}</div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="grid"
      v-if="!show_categoryes || path.length == selected_categoryes.length"
    >
      <label v-if="paginatedData.length == 0" class="text">
        Ничего не найдено
      </label>
      <div class="card" v-for="(row, i) in paginatedData" :key="row">
        <div
          class="row"
          v-for="(item, idx) in row"
          :key="item"
          v-show="collval[idx]"
        >
          <div class="name">{{ params[idx + 1] }} :</div>
          <div class="value">{{ item }}</div>
        </div>
        <div class="card_footer">
          <input
            type="checkbox"
            class="checkbox"
            :id="i + 'a'"
            v-model="changeValue[i]"
          />
          <label :for="i + 'a'"></label>
          <div
            class="edit_icon"
            @click="open_edit_modal(row, data.indexOf(row))"
          ></div>
        </div>
      </div>
    </div>
    <div
      class="bottom"
      :class="{ blur: show_edit_modal }"
      v-if="
        (!show_categoryes || path.length == selected_categoryes.length) &&
        paginatedData.length != 0
      "
    >
      <button v-if="page > 1" @click="page -= 1">
        {{ "<" }}
      </button>
      <span style="margin: 5px">{{ page }}</span>
      <button v-if="page * count < data.length" @click="page += 1">
        {{ ">" }}
      </button>
      <select name="count" id="count" class="count" v-model="count">
        <option>5</option>
        <option>10</option>
        <option>20</option>
      </select>
    </div>
  </div>
</template>

<script>
import EditItem from "@/components/EditItem.vue";
import { mapGetters } from "vuex";
import FilterNumber from "@/components/FiltersSelections/FilterNumber.vue";
import FilterText from "@/components/FiltersSelections/FilterText.vue";
import FilterList from "@/components/FiltersSelections/FilterList.vue";
import FilterDate from "@/components/FiltersSelections/FilterDate.vue";
import FilterFlag from "@/components/FiltersSelections/FilterFlag.vue";
export default {
  name: "Card_grid",
  components: {
    EditItem,
    FilterNumber,
    FilterText,
    FilterList,
    FilterDate,
    FilterFlag,
  },
  props: {
    params: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    collval: {
      type: Array,
      required: true,
    },
    drop_page: {
      type: Boolean,
      required: false,
    },
  },
  emits: { update_changeValue: null },
  data() {
    return {
      count: 20,
      page: 1,
      filtersValue: [],
      edit_data: [],
      changeValue: [],
      path: ["Поступление", "№ партии", "НДС включен в цену"],
      selected_categoryes: [],
      sel_idx: 0,
      show_categoryes: true,
      categoryes: {},
    };
  },
  computed: {
    countPage() {
      return this.count * (this.page - 1);
    },
    paginatedData() {
      if (this.show_categoryes) {
        let dat = [];
        dat = dat.concat(this.data);
        let result = [];
        dat.forEach((val) => {
          let a = true;
          this.path.forEach((title, i) => {
            const title_idx = this.params.indexOf(title) - 1;
            a = val[title_idx] == this.selected_categoryes[i] && a;
          });
          if (a) result.push(val);
        });
        return result.slice(this.countPage, this.count * this.page);
      } else {
        return this.data.slice(this.countPage, this.count * this.page);
      }
    },
    show_buttons() {
      let value = false;
      this.changeValue.forEach((val) => {
        if (val != undefined) {
          value = val || value;
        }
      });
      return value;
    },
    ...mapGetters(["show_edit_modal"]),
    ...mapGetters(["show_filter"]),
    ...mapGetters(["fields"]),
  },
  mounted() {
    this.get_data_categoryes();
    this.feelFilters();
  },
  watch: {
    page() {
      if (this.page < 1) this.page = 1;
    },
    count() {
      this.page = 1;
    },
    paginatedData: {
      handler: function () {
        this.changeValue = [];
      },
      deep: true,
    },
    data: {
      handler: function () {
        this.get_data_categoryes();
        this.filtersValue = [];
        this.feelFilters();
      },
      deep: true,
    },
    changeValue: {
      handler: function () {
        this.$emit("update_changeValue", this.changeValue);
      },
      deep: true,
    },
    show_buttons() {
      this.$store.commit("open_close_buttons", this.show_buttons);
    },
    drop_page() {
      if (this.drop_page) {
        this.page = 1;
        this.selected_categoryes = [];
        this.sel_idx = 0;
        this.show_categoryes = true;
        this.feelFilters();
      }
    },
    show_categoryes() {
      if (!this.show_categoryes) {
        this.selected_categoryes = [];
        this.sel_idx = 0;
      }
    },
  },
  methods: {
    open_edit_modal(row, idx) {
      this.edit_data = [];
      this.edit_data = this.edit_data.concat(row);
      this.$store.commit("open_edit_modal", idx);
    },
    change_filter_value(new_obj, idx) {
      Object.assign(this.filtersValue[idx], new_obj);
    },
    get_data_categoryes() {
      this.categoryes = {};
      function unique(arr) {
        let res = [];

        for (let str of arr) {
          if (!res.includes(str)) {
            res.push(str);
          }
        }
        return res;
      }
      const result = {};
      let titles = [];
      titles = titles.concat(this.params);
      titles.pop();
      titles.shift();
      titles.forEach((title, idx) => {
        result[title] = [];
        let arr = [];
        this.data.forEach((val) => {
          arr.push(val[idx]);
        });
        result[title] = unique(arr);
      });
      Object.assign(this.categoryes, result);
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
.header {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
  .btns {
    display: flex;
    justify-content: flex-end;
    .button {
      cursor: pointer;
      color: #ffffff;
      border-radius: 4px;
      border: none;
      transition: background-color 0.15s ease-in-out,
        box-shadow 0.15s ease-in-out;
      @include font(400, 14px);
      width: 124px;
      height: 35px;
      background: #ea9197;
    }
    .button:hover {
      background: rgb(226, 101, 109);
      box-shadow: 0 0 5px 2px rgb(226 101 109 / 25%);
    }
  }
  .filters {
    display: flex;
    flex-direction: row;
    // justify-content: space-around;
    flex-wrap: wrap;
    gap: 5px;
    padding: 30px;
    border: 1px solid #c9c9c9;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.05);
    .item {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-grow: 1;
      border: 1px solid #c9c9c9;
      border-radius: 5px;
      padding: 10px;
      background-color: #fff;
      gap: 10px;
      .title {
        @include font(500, 16px, 19px);
      }
    }
  }
}
.links {
  display: flex;
  flex-direction: row;
  a {
    @include font(400, 16px);
  }
  a:hover {
    text-decoration: none;
    opacity: 0.8;
  }
}
.grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 30px;
  @include font(400, 14px);
  .text {
    margin: 0 auto;
    @include font(500, 18px);
  }
  .card {
    width: 300px;
    border: 1px solid #c9c9c9;
    border-radius: 5px;
    padding: 20px;
    .row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      border-bottom: 1px dotted #c9c9c9;
      padding-top: 5px;
      .name {
      }
      .value {
      }
      .value:first-child {
        display: none;
      }
    }
    .row:first-child {
      justify-content: center;
      @include font(500, 18px);
      padding: 20px 0;
      .name {
        display: none;
      }
    }
  }
}
.card_footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 10px;
  .edit_icon {
    width: 25px;
    height: 25px;
    cursor: pointer;
    @include bg_image("@/assets/edit.svg");
  }
}
.count {
  margin-top: 20px;
  margin-left: 5px;
  margin-bottom: 150px;
  height: 26px;
  width: 100px;
}
.bottom {
  button {
    @include font(400, 16px, 19px);
    color: #3f3f3f;
  }
  span {
    @include font(400, 16px, 19px);
    color: #3f3f3f;
  }
  input {
    @include font(400, 16px, 19px);
    color: #3f3f3f;
  }
}
.blur {
  filter: blur(5px);
}
.checkbox {
  position: absolute;
  z-index: -1;
  opacity: 0;
}
.checkbox + label {
  display: inline-flex;
  align-items: center;
  user-select: none;
}
.checkbox + label::before {
  content: "";
  display: inline-block;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  flex-grow: 0;
  border: 1px solid #adb5bd;
  border-radius: 0.25em;
  margin-right: 0.5em;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 50% 50%;
  cursor: pointer;
  transition: border-color 0.15s ease-in-out, background-color 0.15s ease-in-out;
}
.checkbox:checked + label::before {
  border-color: #757575;
  background-color: #757575;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
}
.checkbox:not(:disabled):not(:checked) + label:hover::before {
  border-color: #75757591;
}
.checkbox:not(:disabled):active + label::before {
  background-color: #75757591;
  border-color: #75757591;
}
.mdl-enter-active,
.mdl-leave-active {
  transition: opacity 0.15s ease-in-out;
}
.mdl-enter-from,
.mdl-leave-to {
  opacity: 0;
}
.rows-enter-active,
.rows-leave-active {
  transition: opacity 0.15s ease-in-out;
}
.rows-enter-from,
.rows-leave-to {
  opacity: 0;
}
</style>
