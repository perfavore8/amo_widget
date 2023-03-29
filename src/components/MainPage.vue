<template>
  <div class="app" :class="{ disable: show_filters }">
    <div class="container">
      <div class="header"></div>
      <div class="content">
        <div class="top">
          <selector-vue
            :options_props="available_data"
            @select="select"
            :selected_option="{
              name: 'Добавление (поиск на складе по названию или артикулу)...',
            }"
          />
          <div class="btns">
            <input
              type="checkbox"
              class="checkbox"
              v-model="show_cards"
              id="grid"
            />
            <label for="grid"></label>
            <button class="btn" @click="show_filters = true">
              <div class="icon"></div>
            </button>
          </div>
        </div>
        <transition name="rows">
          <div class="bottom" v-if="show_cards">
            <div class="links">
              <div
                class="triangle"
                :class="{
                  triangle_last: path.length - 1 == idx,
                }"
                v-for="(cat, idx) in selected_categoryes"
                :key="cat"
                @click="
                  sel_idx = idx;
                  selected_categoryes.splice(idx);
                "
              >
                {{ path[idx] }}
              </div>
            </div>
            <div
              class="path"
              v-for="(item, i) in path"
              :key="item"
              v-show="sel_idx == i && show_categoryes"
            >
              <!-- <h2>{{ item }}:</h2> -->
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
              v-if="
                !show_categoryes || path.length == selected_categoryes.length
              "
            >
              <label v-if="paginatedData.length == 0" class="text">
                Ничего не найдено
              </label>
              <div class="card" v-for="row in paginatedData" :key="row">
                <div class="row">
                  <div class="name">{{ params[1] }} :</div>
                  <div class="value">{{ row[0] }}</div>
                </div>
                <div class="rows">
                  <div
                    class="row"
                    v-for="(item, idx) in row"
                    :key="item"
                    v-show="idx != 0"
                  >
                    <div class="name">{{ params[idx + 1] }} :</div>
                    <div class="value">{{ item }}</div>
                  </div>
                </div>
                <div class="card_footer">
                  <button
                    class="btn btn_del"
                    @click="update_changeValue([row], [1])"
                  >
                    Добавить к сделке
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>
        <div class="bottom">
          <div class="row" v-for="(row, idx) in rows" :key="row">
            <div class="row_title" @click="toShowData(idx)">
              <label>
                {{ short_value(row) }}
              </label>
              <button class="btn" @click="handle_delete(row, idx)">
                <div class="icon"></div>
              </button>
            </div>
            <transition name="rows">
              <div class="rows" v-if="show_data[idx]">
                <div class="row" v-for="(item, index) in fields" :key="item">
                  <div class="name">{{ item.name }}</div>
                  <input
                    class="input"
                    type="number"
                    v-model="countes[idx].count"
                    v-if="index == 0"
                  />
                  <input
                    class="input"
                    v-model="countes[idx].company"
                    v-else-if="index == 1"
                  />
                  <input
                    class="input"
                    v-model="rows[idx][search_idx(item.name)]"
                    v-else-if="item.change"
                  />
                  <div class="value" v-else>
                    {{ search_value(item.name, row) }}
                  </div>
                </div>
                <div class="footer">
                  <button class="btn btn1">возврат</button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
      <div class="footer"></div>
    </div>
    <teleport to="body">
      <transition name="rows">
        <keep-alive>
          <filters-modal
            v-if="show_filters"
            @close="close_filters"
            @update_changeValue="update_changeValue"
          ></filters-modal>
        </keep-alive>
      </transition>
    </teleport>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SelectorVue from "@/components/SelectorVue";
import FiltersModal from "@/components/FiltersModal.vue";
export default {
  components: {
    SelectorVue,
    FiltersModal,
  },
  data() {
    return {
      path: ["Поступление", "№ партии", "НДС включен в цену"],
      selected_categoryes: [],
      sel_idx: 0,
      show_categoryes: true,
      categoryes: {},
      short_data: [],
      cat_for_short_dat: ["Название", "Артикул", "№ партии"],
      rows: [],
      available_data: [],
      show_cards: false,
      show_filters: false,
      countes: [],
      show_data: [],
      fields: [
        { name: "Количество", change: true },
        { name: "Поставщик", change: true },
        { name: "Группа", change: false },
        { name: "Артикул", change: false },
        { name: "На складе", change: false },
        { name: "В резерве", change: false },
        { name: "Цена", change: true },
        { name: "Себестоимость", change: false },
        { name: "№ партии", change: false },
        { name: "Описание", change: true },
        { name: "Единицы измерений", change: false },
        { name: "Поступление", change: false },
        { name: "Сумма ₽", change: false },
        { name: "Итого к оплате ₽", change: false },
        { name: "Прибыль ₽", change: false },
      ],
    };
  },
  computed: {
    ...mapGetters(["data", "params"]),
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
        return result;
      } else {
        return this.data;
      }
    },
  },
  mounted() {
    this.get_data_categoryes();
    this.feel_available_data();
  },
  watch: {
    show_cards() {
      if (!this.show_cards) {
        this.selected_categoryes = [];
        this.sel_idx = 0;
      }
    },
  },
  methods: {
    handle_delete(row, idx) {
      const obj = {
        name: this.short_value(row),
        data: row,
        value: Math.random(),
      };
      this.available_data.push(obj);
      this.rows.splice(idx, 1);
      this.countes.splice(idx, 1);
    },
    update_changeValue(arr, countes) {
      arr.forEach((val, idx) => {
        if (!this.rows.includes(val)) {
          let array = [];
          val.forEach((item) => array.push(item));
          this.rows.push(array);
          let count = null;
          countes[idx] == undefined ? (count = 0) : (count = countes[idx]);
          const obj = {
            count: count,
            company: "",
          };
          this.countes.push(obj);
        }
      });
    },
    close_filters() {
      this.show_filters = false;
    },
    select(value) {
      this.available_data.forEach((val, idx) => {
        if (val.data == value.data) this.available_data.splice(idx, 1);
      });
      this.rows.push(value.data);
      const obj = {
        count: 1,
        company: "",
      };
      this.countes.push(obj);
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
    feel_available_data() {
      this.data.forEach((val, idx) => {
        const obj = {
          name: this.short_value(val),
          data: val,
          value: idx,
        };
        this.available_data.push(obj);
      });
    },
    short_value(data) {
      const search_idx = (val) => {
        return this.params.indexOf(val) - 1;
      };
      let str = "";
      this.cat_for_short_dat.forEach((value, idx) => {
        idx == 0
          ? (str = str + data[search_idx(value)] + " (")
          : (str = str + value + ": " + data[search_idx(value)] + " ");
      });
      str = str + ")";
      return str;
    },
    search_value(str, row) {
      const idx = this.search_idx(str);
      if (idx != -2) {
        return row[idx];
      }
    },
    search_idx(str) {
      const idx = this.params.indexOf(str) - 1;
      return idx;
    },
    toShowData(idx) {
      const val = this.show_data[idx];
      this.show_data = [];
      this.show_data[idx] = !val;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/app.scss";
.app {
  .container {
    overflow-y: auto;
    width: 100%;
    height: 100%;
    padding: 20px;
    .header {
      margin-bottom: 30px;
    }
    .content::-webkit-scrollbar {
      width: 0;
    }
    .content {
      height: calc(100% - 40px);
      overflow-y: auto;
      .top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .v-select {
          width: calc(80% - 26px);
          margin: 2px;
        }
        .v-select:deep(.title) {
          p {
            overflow-x: hidden;
            white-space: nowrap;
            max-height: 34px;
          }
          .arrow {
            margin-left: 10px;
          }
        }
        .btns {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 15px;
          .checkbox + label::before {
            width: 32px;
            height: 32px;
            margin-left: 17px;
            border: none;
            transition: all 0.15s ease-ount;
            @include bg_image("@/assets/arrow.svg", 100%);
          }
          .checkbox:checked + label::before {
            border-color: transparent;
            background-color: transparent;
            @include bg_image("@/assets/arrow.svg", 100%);
            transform: rotateX(180deg);
            background-position: center 8px;
          }
          .checkbox:not(:checked) + label:hover::before {
            background-size: 110%;
          }
          .checkbox:checked + label:hover::before {
            background-size: 110%;
            background-position: center 6px;
          }
          .checkbox:not(:disabled):active + label::before {
            background-color: transparent;
          }
          .btn {
            width: 32px;
            height: 32px;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            // background: #018361;
            background: linear-gradient(135deg, #00cc8f, #40bf99, #018360db);
            border-radius: 8px;
            padding: 0;
            .icon {
              height: 20px;
              width: 20px;
              @include bg_image("@/assets/plus.svg", 100%);
            }
          }
          .btn:hover,
          .btn:focus-visible {
            background-color: #40bf99;
            box-shadow: 0 0 5px 2px rgb(64 191 153 / 25%);
          }
          .btn:active {
            background-color: #00cc8f;
            box-shadow: 0 0 5px 2px rgb(0 204 143 / 25%);
            height: 31px;
            width: 31px;
            .icon {
              height: 19px;
              width: 19px;
            }
          }
        }
      }
      .bottom {
        margin-top: 30px;
        .links {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          margin-bottom: 10px;
          $step: 12px;

          .triangle {
            cursor: pointer;
            padding: 5px 10px 5px 15px;
            height: 20px;
            margin: 5px 0;
            @include font(400, 15px);
            -webkit-clip-path: polygon(
              0 0,
              calc(100% - $step) 0,
              100% 50%,
              calc(100% - $step) 100%,
              0% 100%,
              $step 50%
            );
            clip-path: polygon(
              0 0,
              calc(100% - $step) 0,
              100% 50%,
              calc(100% - $step) 100%,
              0% 100%,
              $step 50%
            );
            display: flex;
            justify-content: start;
            align-items: center;
            color: #000;
          }
          .triangle:hover {
            padding: 5px 12px 5px 17px;
            margin-left: -2px;
            margin-right: -2px;
            background: #e6e6e6 !important;
          }
          .triangle:first-child:hover {
            margin-left: 0;
          }
          .triangle_last {
            color: #fff;
            background: rgba(27, 53, 70, 0.945) !important;
          }
          .triangle_last:hover {
            background: rgba(27, 53, 70, 0.851) !important;
          }
          .triangle:active {
            background: #d6d6d6 !important;
          }

          .triangle:nth-child(3n + 1) {
            background: linear-gradient(
              45deg,
              hsl(0, 0%, 90%),
              hsl(0, 0%, 84%)
            );
          }
          .triangle:nth-child(3n + 2) {
            background: linear-gradient(
              45deg,
              hsl(0, 0%, 84%),
              hsl(0, 0%, 83%),
              hsl(0, 0%, 84%)
            );
          }
          .triangle:nth-child(3n + 3) {
            background: linear-gradient(
              45deg,
              hsl(0, 0%, 84%),
              hsl(0, 0%, 90%)
            );
          }
          .triangle:first-child {
            padding-left: 5px;
            -webkit-clip-path: polygon(
              0 0,
              calc(100% - $step) 0,
              100% 50%,
              calc(100% - $step) 100%,
              0% 100%
            );
            clip-path: polygon(
              0 0,
              calc(100% - $step) 0,
              100% 50%,
              calc(100% - $step) 100%,
              0% 100%
            );
          }
        }
        > .row {
          width: calc(100% - 30px);
          margin-bottom: 5px;
          @include font(400, 15px);
          .row_title {
            padding: 15px;
            width: 100%;
            background-color: #9bb7e74a;
            padding-bottom: 20px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .btn {
              background: transparent;
              height: 17px;
              width: 17px;
              margin: 0 auto;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0;
              padding: 0;
              .icon {
                width: inherit;
                height: inherit;
                transition: background-size 0.15s ease-in-out;
                @include bg_image("@/assets/cross_black.svg", 90%);
              }
            }
            .btn:hover {
              .icon {
                background-size: 100%;
              }
            }
          }
          .rows {
            display: flex;
            flex-direction: column;
            gap: 5px;
            width: calc(100% - 2px);
            padding: 15px;
            border: 1px solid #f1f1f1;
            .row {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: flex-end;
              height: 34px;
              .name {
                width: 40%;
              }
              .value {
                width: 60%;
              }
              .input {
                width: 60%;
                height: 90%;
                border: 1px solid #dbdedf;
                border-radius: 3px;
                padding: 8px 9px 7px;
                box-sizing: border-box;
                color: #313942;
                background: #fff;
                @include font(400, 15px);
                outline: 0;
                appearance: 0;
              }
              input::-webkit-outer-spin-button,
              input::-webkit-inner-spin-button {
                /* display: none; <- Crashes Chrome on hover */
                -webkit-appearance: none;
                margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
              }
            }
          }
          .footer {
            display: flex;
            justify-content: end;
            .btn1 {
              padding: 0 12px;
              height: 32px;
              color: #fff;
              background-color: #6c757d;
              background: linear-gradient(
                135deg,
                hsl(208, 7%, 66%),
                hsl(208, 7%, 58%),
                hsl(206, 7%, 50%)
              );
            }
            .btn1:hover {
              background-color: #5f676d;
              box-shadow: 0 0 5px 2px rgb(95 103 109 / 25%);
            }
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
            min-width: 178px;
            width: calc(50% - 58px);
            border: 1px solid #c9c9c9;
            border-radius: 5px;
            padding: 20px;
            .rows::-webkit-scrollbar {
              display: none;
            }
            .rows {
              max-height: 220px;
              overflow: auto;
            }
            .row {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              border-bottom: 1px dotted #c9c9c9;
              padding-top: 5px;
              .name {
                max-width: 50%;
              }
              .value {
                text-align: end;
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
          justify-content: flex-end;
          align-items: flex-end;
          margin-top: 10px;
          .btn_del {
            color: #fff;
            background-color: #a2a9ae;
          }
          .btn_del:hover {
            background-color: #929aa0;
            box-shadow: 0 0 5px 2px rgb(146 154 160 / 25%);
          }
        }
      }
    }
  }
}
.disable {
  pointer-events: none;
}
.rows-enter-active,
.rows-leave-active {
  transition: all 0.15s ease-out;
}
.rows-enter-from,
.rows-leave-to {
  opacity: 0;
  transform: translateY(-40px);
}
</style>
