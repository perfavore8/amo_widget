import { ref, computed } from "vue";
import { useStore } from "vuex";

export function useParams() {
  const store = useStore();
  const params1 = computed(() => {
    return store.getters.params;
  });
  const params = ref([]);
  params1.value.forEach((val) => {
    params.value.push(val);
  });
  params.value.pop();
  params.value.shift();

  return { params };
}
