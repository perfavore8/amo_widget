<template>
  <div class="wrapper">
    <label v-if="paginatedData.length == 0" class="text">
      Ничего не найдено
    </label>
    <table
      class="table"
      :key="updateKey"
      :class="{ blur: show_edit_modal }"
      v-if="paginatedData.length != 0"
    >
      <thead>
        <tr class="bar_row">
          <th
            class="bar_item item"
            v-show="
              collval[idx - 1] === false
                ? false
                : true && idx != params.length - 1
            "
            :style="{
              minWidth:
                idx === 0
                  ? 17 + 'px'
                  : idx === params.length - 1
                  ? 20 + 'px'
                  : width[idx] != 0
                  ? width[idx] + 'px'
                  : (collsCount >= 8 ? 100 : collsCount > 3 ? 90 : 80) /
                      collsCount +
                    '%',
            }"
            v-for="(param, idx) in params"
            :key="param"
          >
            <div class="bar_item_group">
              <div>{{ param }}</div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <transition-group name="rows">
          <tr
            class="row"
            v-for="(row, i) in paginatedData"
            :key="row"
            v-show="!showduplicate[i + idxes[page - 1][0]]"
          >
            <td class="item">
              <div
                class="modal_form"
                v-if="
                  duplicate[i + idxes[page - 1][0]] ||
                  !duplicate[i + idxes[page - 1][0] + 1]
                "
              >
                <input type="number" class="input" v-model="countes[i]" />
              </div>
            </td>
            <td
              :class="{ open_dublitem: duplicate[i + idxes[page - 1][0]] }"
              class="item"
              v-for="(item, idx) in Object.entries(row)"
              v-show="collval[idx] === false ? false : true"
              :key="item"
            >
              <div class="dublitem">
                {{ item[1] }}
                <button
                  v-if="
                    idx == params.indexOf('Название') - 1 &&
                    showduplicate[i + idxes[page - 1][0] + 1] &&
                    !duplicate[i + idxes[page - 1][0]]
                  "
                  @click="showduble(i + idxes[page - 1][0])"
                  class="buttonDuwn btn"
                ></button>
                <button
                  v-if="
                    idx == params.indexOf('Название') - 1 &&
                    !showduplicate[i + idxes[page - 1][0] + 1] &&
                    !duplicate[i + idxes[page - 1][0]] &&
                    duplicate[i + idxes[page - 1][0] + 1]
                  "
                  @click="hideduble(i + idxes[page - 1][0])"
                  class="buttonUp btn"
                ></button>
              </div>
            </td>
          </tr>
        </transition-group>
      </tbody>
    </table>
    <div
      class="bottom"
      :class="{ blur: show_edit_modal }"
      v-if="paginatedData.length != 0"
    >
      <div class="left">
        <button v-if="page > 1" @click="page -= 1" class="btn previous">
          {{ "<" }}
        </button>
        <div class="span">{{ page }}</div>
        <button
          v-if="page * count < data.length - countHideRows"
          @click="page += 1"
          class="btn next"
        >
          {{ ">" }}
        </button>
        <selector-vue
          class="count"
          :options_props="count_values"
          :selected_option="{ name: count, value: Math.random() }"
          @select="change_count"
        ></selector-vue>
      </div>
      <div class="right">
        <button class="btn btn2" @click="accept()">Добавить к сделке</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SelectorVue from "./SelectorVue.vue";
export default {
  name: "MainGrid",
  components: { SelectorVue },
  props: {
    data: {
      type: Array,
      required: true,
    },
    collval: {
      type: Array,
      required: true,
    },
  },
  emits: {
    accept: null,
    update_countes: null,
  },
  data() {
    return {
      count: 5,
      count_values: [
        { name: "3", value: 1 },
        { name: "5", value: 2 },
        { name: "10", value: 3 },
        { name: "20", value: 4 },
      ],
      page: 1,
      filtersValue: [],
      updateKey: 0,
      duplicate: [],
      showduplicate: [],
      startIdx: 0,
      idxes: [[0, 6]],
      countes: [],
    };
  },
  watch: {
    count() {
      this.startIdx = 0;
      this.feelIdxes();
      this.page = 1;
    },
    paginatedData: {
      handler: function () {
        this.updateKey += 1;
        this.countes = [];
      },
      deep: true,
    },
    countes: {
      handler: function () {
        this.$emit("update_countes", this.countes);
      },
      deep: true,
    },
    data: {
      handler: function () {
        // if (this.edit_idx != null) this.page = 1;
        this.calcDuplicate();
      },
      deep: true,
    },
    countHideRows: function () {
      this.feelIdxes();
    },
  },
  computed: {
    paginatedData() {
      if (this.idxes[this.page - 1] != undefined) {
        const dat = this.data.slice(
          this.idxes[this.page - 1][0],
          this.idxes[this.page - 1][1]
        );
        return dat;
      } else {
        return [];
      }
    },
    collsCount() {
      let count = 0;
      this.collval.forEach((val) => (val ? (count += 1) : null));
      return count;
    },
    countPage() {
      return this.count * (this.page - 1);
    },
    countHideRows() {
      let a = 0;
      this.duplicate.forEach((val) => (val ? (a += 1) : null));
      return a;
    },
    endidx() {
      return this.endId(this.startIdx);
    },
    width() {
      let arr = [];
      this.params.forEach((value) => {
        let a = 0;
        this.fields.forEach((val) => {
          if (value === val.field) {
            if (val.type.value == 9) a = 70;
            if (val.type.value == 7 || val.type.value == 8) a = 130;
          }
        });
        arr.push(a);
      });
      return arr;
    },
    ...mapGetters(["fields"]),
    ...mapGetters(["data1"]),
    ...mapGetters(["params"]),
  },
  mounted() {
    this.calcDuplicate();
    this.feelIdxes();
    // this.open_edit_modal(this.data[0], 0);
  },
  deactivated() {
    this.countes = [];
  },
  methods: {
    change_count(option) {
      this.count = option.name;
    },
    accept() {
      this.$emit("accept");
    },
    calcDuplicate() {
      let name = "";
      let artic = "";
      this.duplicate = [];
      this.showduplicate = [];
      const name_idx = this.params.indexOf("Название") - 1;
      const artic_idx = this.params.indexOf("Артикул") - 1;
      this.data.forEach((val) => {
        if (val[name_idx] == name && val[artic_idx] == artic) {
          this.duplicate.push(true);
        } else {
          this.duplicate.push(false);
        }
        name = val[name_idx];
        artic = val[artic_idx];
      });
      this.duplicate.forEach((val) => this.showduplicate.push(val));
    },
    showduble(idx) {
      while (this.duplicate[idx + 1]) {
        this.showduplicate[idx + 1] = false;
        idx += 1;
      }
    },
    hideduble(idx) {
      while (this.duplicate[idx + 1]) {
        this.showduplicate[idx + 1] = true;
        idx += 1;
      }
    },
    endId(idx) {
      let a = 0;
      while (a != this.count) {
        if (!this.duplicate[idx]) a += 1;
        idx += 1;
      }
      while (this.duplicate[idx]) idx += 1;
      return idx;
    },
    feelIdxes() {
      this.idxes = [];
      while (this.startIdx < this.data.length) {
        this.idxes.push([this.startIdx, this.endId(this.startIdx)]);
        this.startIdx = this.endId(this.startIdx);
      }
      this.startIdx = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/app.scss";
.item {
  padding: 10px;
  padding-left: 15px;
  border: 1px solid #c9c9c9;
  @include font(400, 14px, 17px);
  color: #3f3f3f;
  text-align: start;
  min-width: 50px;
  .input {
    width: calc(100% - 12px);
    height: calc(100% - 12px);
    outline: none;
    border: none;
    border: 1px solid #c4c4c4;
    border-radius: 4px;
    padding: 5px;
    background: transparent;
    appearance: none;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .modal_form {
    width: 40px;
    height: 28px;
    margin-left: 10px;
    background: #f0f0f0;
    position: relative;
    border-radius: 4px;
  }
}
.row {
}
.table {
  border-collapse: collapse;
  margin: 0 auto;
  width: 100%;
}
.bar_row {
  height: 66px;
}
.bar_item {
  background: #e5e5e5;
  @include font(500, 16px, 19px);
  color: #000000;
  vertical-align: middle;
  cursor: pointer;
}
.bar_item_group {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}
.count {
  margin-left: 5px;
  height: 26px;
  width: 100px;
}
.item:first-child {
  padding-left: 5px;
}
.bar_item:first-child {
  width: 17px !important;
}
.bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 20px;
  .left {
    display: flex;
    flex-direction: row;
    align-items: center;
    .btn {
      height: 32px;
      width: 30px;
      color: #3f3f3f;
      background-color: #f0f0f0;
      border-radius: 50%;
      padding: 0;
      transition: 0.2s ease-in-out;
      box-shadow: 0 0 0;
    }
    .btn:hover {
      background-color: hsl(0, 0%, 85%);
    }
    .btn:active {
      box-shadow: 0 0 1px rgba(0, 0, 0, 0.25) inset,
        0 2px 3px rgba(0, 0, 0, 0.25) inset, 0 1px 1px rgba(255, 255, 255, 0.05);
    }
    .next {
      padding-left: 2px;
      padding-bottom: 2px;
    }
    .previous {
      padding-right: 2px;
      padding-bottom: 2px;
    }
    .span {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 30px;
      width: 60px;
      margin: 5px;
      border-radius: 25%/50%;
      background-color: #f0f0f0;
      @include font(400, 16px, 19px);
      color: #3f3f3f;
    }
    .count {
      margin-top: -7px;
    }
  }
  .right {
    // margin-right: 20px;
    .btn2 {
      color: #fff;
      // background-color: #0d6efd;
      background: linear-gradient(
        135deg,
        hsl(216, 98%, 57%),
        hsl(216, 98%, 52%),
        hsl(216, 98%, 42%)
      );
      transition: background 0.15s ease-out;
    }
    .btn2:hover {
      box-shadow: 0 0 5px 2px rgb(2 86 212 / 25%);
    }
  }
}
.dublitem {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .btn {
    margin-top: -1px;
    width: 25px;
    height: 25px;
    background-color: transparent;
  }
  .buttonDuwn {
    @include bg_image("@/assets/arrow.svg", 100% 60%);
  }
  .buttonUp {
    @include bg_image("@/assets/arrow.svg", 100% 60%);
    transform: rotate(180deg);
  }
}
.open_dublitem {
  background-color: rgba(187, 224, 242, 0.267);
  // padding-left: 30px;
  .dublitem {
  }
}
.blur {
  filter: blur(5px);
}
.text {
  margin: 0 auto;
  @include font(500, 18px);
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
