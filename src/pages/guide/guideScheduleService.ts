import { Tour } from 'src/graphql/@types/types.d';
import { useQuery } from '@vue/apollo-composable';
import { ref, computed } from 'vue';
import { LocalStorage } from 'quasar';
import {
  listTourWithGuideSheduleQuery,
  listTourWithoutGuideSheduleQuery,
} from 'src/graphql/query/tour.graphql';
import dayjs from 'dayjs';
import { cloneDeep } from '@apollo/client/utilities';

const date = ref(dayjs());
const daysToShow = ref<number>(
  LocalStorage.getItem('guide-scheduler-daysToShow') || 90
);

const search = computed(() => {
  return {
    needle: '',
    from: date.value.format('MM/DD/YYYY'),
    to: dayjs(date.value).add(daysToShow.value, 'day').format('MM/DD/YYYY'),
    notification: [] as number[],
    notificationComplete: null,
    template: null,
  };
});

const toursWithGuide = ref<Partial<Tour>[]>([]);
const toursWithoutGuide = ref<Partial<Tour>[]>([]);

function getToursWithGuide() {
  const { loading, onResult, refetch } = useQuery(
    listTourWithGuideSheduleQuery,
    () => search.value
  );

  onResult(
    (result: {
      data: { listScheduleToursWithGuideTours: Partial<Tour>[] };
    }) => {
      toursWithGuide.value = cloneDeep(
        result.data.listScheduleToursWithGuideTours
      );
    }
  );

  return { loading, refetch, toursWithGuide };
}

function getToursWithoutGuide() {
  const { loading, onResult, refetch } = useQuery(
    listTourWithoutGuideSheduleQuery
  );

  onResult(
    (result: {
      data: { listScheduleToursWithoutGuideTours: Partial<Tour>[] };
    }) => {
      toursWithoutGuide.value = cloneDeep(
        result.data.listScheduleToursWithoutGuideTours
      );
    }
  );

  return { loading, refetch, toursWithoutGuide };
}

export default function useGuide() {
  return {
    date,
    daysToShow,
    search,
    getToursWithGuide,
    getToursWithoutGuide,
  };
}
