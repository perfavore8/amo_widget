<template>
  <div class="app_modal">
    <div class="container">
      <div class="header">
        <label>Filters Modal</label>
        <button class="exit" @click="close()">
          <div class="icon"></div>
        </button>
      </div>
      <div class="content">
        <keep-alive>
          <filters-list
            :show_filters="show_filters"
            :dont_show_filters="dont_show_filters"
            @updateFiltersValue="updateFiltersValue"
            @add_filter="add_filter"
          />
        </keep-alive>
        <div class="accept_btn">
          <button @click="clean_filters()" class="btn1 btn">Очистить</button>
          <button @click="feelFilters()" class="btn2 btn">Применить</button>
        </div>
        <main-grid
          class="main_grid"
          :data="data"
          :collval="collval"
          @update_changeValue="update_changeValue"
          @accept="accept"
          @update_countes="update_countes"
        />
      </div>
      <div class="footer">
        <div class="btns">
          <button class="btn btn1" @click="close()">Назад</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FiltersList from "@/components/FiltersList.vue";
import MainGrid from "@/components/MainGrid.vue";
import { reactive, ref } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import { useFilters } from "@/composition/filters";
export default {
  components: {
    FiltersList,
    MainGrid,
  },
  emits: {
    close: null,
    update_changeValue: null,
  },
  setup(props, { emit }) {
    const { filtersValue, eqval, includes, updateFiltersValue } = useFilters();
    const store = useStore();
    const close = () => {
      emit("close");
    };
    const accept = () => {
      let array = [];
      let array2 = [];
      countes.value.forEach((val, idx) => {
        if (val != undefined && val != "") {
          array.push(data.value[idx]);
          array2.push(countes.value[idx]);
        }
      });
      emit("update_changeValue", array, array2);
      close();
    };

    const arg1 = computed(() => {
      return store.getters.data;
    });
    const arg2 = computed(() => {
      return store.getters.service;
    });
    let dat = [];
    arg2.value.forEach((val) => dat.push(val));
    arg1.value.forEach((val) => dat.push(val));
    const data = ref(dat);
    const update_data = () => {
      data.value = [];
      dat.forEach((val) => {
        data.value.push(reactive(val));
      });
    };
    data.value = data.value.sort((a, b) => a[0].localeCompare(b[0]));

    const collval = [
      true,
      true,
      false,
      true,
      false,
      true,
      true,
      true,
      true,
      true,
      false,
      false,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
    ];

    const feelFilters = () => {
      update_data();
      const arr = [0, 1];
      arr.forEach((idx) => {
        if (
          filtersValue.value[idx].value != "" &&
          filtersValue.value[idx].value != null &&
          filtersValue.value[idx].value != undefined
        ) {
          const dat = [];
          data.value.forEach((val) => dat.push(val));
          data.value = [];
          if (filtersValue.value[idx].option == 1) {
            eqval(dat, filtersValue.value[idx].value, idx).forEach((val) =>
              data.value.push(val)
            );
          }
          if (filtersValue.value[idx].option == 2) {
            includes(dat, filtersValue.value[idx].value, idx).forEach((val) =>
              data.value.push(val)
            );
          }
        }
      });
    };

    const countes = ref([]);
    const update_countes = (val) => (countes.value = val);

    return {
      ...useFilters(),
      updateFiltersValue,
      close,
      accept,
      data,
      collval,
      feelFilters,
      update_countes,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/app.scss";
.app_modal {
  pointer-events: all;
  z-index: 9999999;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
  .container {
    width: 90%;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0.3rem;
    margin: 30px auto;
    outline: 0;
    box-shadow: 0 0 7px 6px rgb(206 212 218 / 50%);
    text-align: left;
    display: flex;
    flex-direction: column;
    .header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 10px 50px;
      @include font(500, 20px);
      border-bottom: 2px solid #dee2e6;
      .exit {
        background: transparent;
        border-radius: 0 5px 5px 0;
        height: 30px;
        width: 30px;
        margin: 0 auto;
        cursor: pointer;
        border: none;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.15s ease-in-out,
          box-shadow 0.15s ease-in-out;
        margin: 0;
        margin-right: -10px;
        .icon {
          width: inherit;
          height: inherit;
          transition: transform 0.15s ease-in-out;
          @include bg_image("@/assets/cross_black.svg", 100% 100%);
        }
        .icon:hover {
          transform: rotate(90deg);
        }
      }
    }
    .content {
      @include font(400, 16px);
      padding: 15px 50px;
      border-bottom: 2px solid #dee2e6;
      display: flex;
      flex-direction: column;
      gap: 10px;
      .filters_list {
        display: flex;
        flex-direction: row;
        gap: 30px;
        padding: 30px;
        border: 1px solid #c9c9c9;
        border-radius: 5px;
      }
      .main_grid {
        overflow-x: auto;
        max-width: 100%;
      }
      .accept_btn {
        text-align: right;
        .btn1 {
          width: 130px;
          background: linear-gradient(
            135deg,
            hsl(208, 7%, 52%),
            hsl(208, 7%, 46%),
            hsl(206, 7%, 40%)
          );
        }
        .btn1:hover {
          background-color: #5f676d;
          box-shadow: 0 0 5px 2px rgb(95 103 109 / 25%);
        }
        .btn2 {
          margin-left: 10px;
          width: 130px;
          background-color: #6c757d;
          background: linear-gradient(
            135deg,
            hsl(208, 7%, 52%),
            hsl(208, 7%, 46%),
            hsl(206, 7%, 40%)
          );
        }
        .btn2:hover {
          box-shadow: 0 0 5px 2px rgb(2 86 212 / 25%);
        }
      }
    }
    .footer {
      display: flex;
      justify-content: end;
      padding: 15px 50px;
      .btns {
        display: flex;
        flex-direction: row;
        gap: 10px;
        .btn1 {
          color: #fff;
          background-color: #6c757d;
          background: linear-gradient(
            135deg,
            hsl(208, 7%, 54%),
            hsl(208, 7%, 46%),
            hsl(206, 7%, 38%)
          );
        }
        .btn1:hover {
          background-color: #5f676d;
          box-shadow: 0 0 5px 2px rgb(95 103 109 / 25%);
        }
      }
    }
  }
}
</style>
