<script lang="ts">
import { Guide, Tour } from 'src/graphql/@types/types';
import { defineComponent, computed, ref, onMounted, watch } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import useGuide from 'src/pages/guide/guideService';
import useGuideSchedule from 'src/pages/guide/guideScheduleService';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import globalLoading from 'src/store/loading';
import SheduleGuideShowTour from './SheduleGuideShowTour.vue';
import gql from 'graphql-tag';

export default defineComponent({
  components: {
    SheduleGuideShowTour,
  },
  setup() {
    dayjs.extend(isSameOrBefore);
    dayjs.extend(isSameOrAfter);
    const tourToAssign = ref<Partial<Tour> | null>(null);
    const guideToAssign = ref<Partial<Guide> | null>(null);

    const menuAssignTour = ref(false);
    const startDatePopup = ref(false);
    const startDatePicker = ref('');
    const subtractDays = ref(0);

    const columnWidth = 60;

    const guidesNotAvailableIndex = ref<number[]>([]);
    let { getGuides, guides } = useGuide();
    if (!guides.value.length) getGuides();

    let { daysToShow, getToursWithGuide, date, getToursWithoutGuide } =
      useGuideSchedule();

    const {
      loading: loadingTour,
      refetch,
      toursWithGuide,
    } = getToursWithGuide();

    const {
      loading: loadingTourWithoutGuide,
      refetch: refetchtoursWithoutGuide,
      toursWithoutGuide,
    } = getToursWithoutGuide();

    const {
      mutate: updateTour,
      onDone,
      loading: loadingUpdateTour,
    } = useMutation(
      gql`
        mutation updateTour($input: updateTourInput!) {
          updateTour(input: $input) {
            tour {
              id
            }
          }
        }
      `
    );

    onDone(() => {
      void refetch();
      void refetchtoursWithoutGuide();
      menuAssignTour.value = false;
    });

    const selectGuideIndex = ref<number>(-1);

    watch(
      [loadingTour, loadingTourWithoutGuide, loadingUpdateTour],
      ([val, val2, val3]) => (globalLoading.value = val || val2 || val3)
    );

    watch(menuAssignTour, (val) => {
      if (!val) tourToAssign.value = null;
      document.querySelectorAll('.tour-space').forEach((el) => el.remove());
    });

    watch(startDatePicker, () => {
      date.value = dayjs(startDatePicker.value);
    });

    function paintTourToAssingn() {
      let el = document.getElementById('tours-container'),
        toursConflict: Partial<Tour>[] = [];
      if (!el) return;

      if (tourToAssign.value?.startDate) {
        const startDate = dayjs(tourToAssign.value?.startDate);
        let endDate = startDate;
        if (
          tourToAssign.value?.service?.code == 'ls' &&
          tourToAssign.value.endDate
        ) {
          endDate = dayjs(tourToAssign.value?.endDate);
        }

        toursConflict = toursWithGuide.value.filter((t) => {
          if (t.startDate) {
            const tStartDate = dayjs(t.startDate);
            let tEndDate = tStartDate;
            if (t.service?.code == 'ls' && t.endDate)
              tEndDate = dayjs(t.endDate);

            return (
              dayjs(t.startDate).isSameOrBefore(endDate, 'day') &&
              tEndDate.isSameOrAfter(dayjs(startDate), 'day')
            );
          }
          return false;
        });
      }

      let left = 0,
        w = (tourToAssign.value?.days as number) * columnWidth;

      if (tourToAssign.value?.startDate) {
        const startDateDay = dayjs(tourToAssign.value.startDate).format(
          'YYYY-MM-DD'
        );
        const calendarDate = date.value.format('YYYY-MM-DD');
        left =
          dayjs(startDateDay).diff(calendarDate, 'day') * columnWidth +
          columnWidth;

        if (tourToAssign.value.endDate) {
          const endDateDay = dayjs(tourToAssign.value.endDate).format(
            'YYYY-MM-DD'
          );
          w =
            (dayjs(endDateDay).diff(dayjs(startDateDay), 'day') + 1) *
            columnWidth;
        }

        if (tourToAssign.value.days && tourToAssign.value.days > 1) {
          w -= columnWidth;
          left += Math.round(columnWidth / 2);
        }
      } else if (tourToAssign.value?.days) {
        // w -= columnWidth;
        left = subtractDays.value * columnWidth + columnWidth;
      }
      document.querySelectorAll('.tour-space').forEach((el) => el.remove());

      for (let index = 0, top = 3; index < guides.value.length; index++) {
        top += 25;

        if (toursConflict.find((t) => t.guide?.id == guides.value[index].id)) {
          guidesNotAvailableIndex.value.push(index);
          continue;
        }

        (
          document.getElementsByClassName('guide')[index] as HTMLElement
        ).style.backgroundColor = tourToAssign.value?.color || 'green';

        const node = document.createElement('div');
        node.style.width = `${w}px`;
        node.style.height = '19px';
        node.style.backgroundColor = tourToAssign.value?.color || 'green';
        node.style.top = `${top}px`;
        node.style.left = `${left}px`;
        node.style.fontSize = tourToAssign.value?.days == 1 ? '8px' : '14px';
        node.style.zIndex = '3';
        node.style.width = `${w}px`;
        node.style.opacity = '.5';
        node.style.whiteSpace = 'nowrap';
        node.classList.add(
          'tw-absolute',
          'tw-flex',
          'tw-justify-center',
          'tw-items-center',
          'tw-font-medium',
          'tw-rounded-3xl',
          'tw-cursor-pointer',
          'tour-space'
        );
        node.innerHTML = tourToAssign.value?.code || '';
        el.appendChild(node);
      }
    }
    watch(tourToAssign, async (val) => {
      const guidesClassElements = document.getElementsByClassName('guide');

      for (let index = 0; index < guidesClassElements.length; index++) {
        (guidesClassElements[index] as HTMLElement).style.backgroundColor = '';
      }

      guidesNotAvailableIndex.value = [];

      if (!val) return;
      let el = document.getElementById('scrollTop');

      if (el?.offsetWidth) {
        const days = Math.round(el.offsetWidth / columnWidth);
        subtractDays.value = 0;

        if (
          tourToAssign.value?.service?.code == 'ls' &&
          tourToAssign.value?.endDate &&
          tourToAssign.value?.startDate
        ) {
          subtractDays.value = Math.round(
            (days -
              dayjs(tourToAssign.value?.endDate).diff(
                tourToAssign.value?.startDate,
                'day'
              )) /
              2
          );
        } else if (tourToAssign.value?.service?.code == 'htc') {
          subtractDays.value = Math.round(days / 2);
        }
        if (tourToAssign.value?.startDate) {
          const startCalendar = dayjs(tourToAssign.value?.startDate).subtract(
            subtractDays.value,
            'day'
          );
          if (!date.value.isSame(startCalendar, 'day')) {
            date.value = startCalendar;
          } else {
            await refetch();
            paintTourToAssingn();
          }
        }
      }
    });

    watch(toursWithGuide, () => {
      if (tourToAssign.value) {
        paintTourToAssingn();
      }
    });
    onMounted(() => {
      const el = document.getElementById('scrollBottom');
      const el2 = document.getElementById('scrollTop');
      if (el && el2) {
        el.addEventListener('scroll', (e) => {
          el2.scrollLeft = (
            e.currentTarget as unknown as Record<string, number>
          ).scrollLeft;
        });
        el2.addEventListener('scroll', (e) => {
          el.scrollLeft = (
            e.currentTarget as unknown as Record<string, number>
          ).scrollLeft;
        });
      }
    });

    return {
      menuAssignTour,
      columnWidth,
      startDatePopup,
      startDatePicker,
      tourToAssign,
      guideToAssign,
      tourToShow: ref<Tour | null>(null),
      showTourRefresh: ref(false),
      guides,
      selectGuideIndex,
      daysToShow,
      date,
      dayjs,
      toursWithGuide,
      toursWithoutGuide,
      refetch,
      refetchtoursWithoutGuide,
      startDate: computed(() => dayjs(date.value).format('DD/MM/YYYY')),
      guidesSelect: computed(() =>
        guides.value.filter(
          (g, i) => !guidesNotAvailableIndex.value.includes(i)
        )
      ),
      days: computed(() => {
        return Array.from({ length: daysToShow.value }, (_, i) =>
          dayjs(date.value).add(i, 'day').format('DD/MM')
        );
      }),
      next: () => {
        daysToShow.value = 10;
        date.value = dayjs(date.value).add(daysToShow.value, 'day');
      },
      selectGuide: (index: number) => {
        if (selectGuideIndex.value == index) selectGuideIndex.value = -1;
        else selectGuideIndex.value = index;
      },
      getStyle: (tour: Tour) => {
        let left = 0,
          top = 25,
          zIndex = 2;
        let w = (tour.days as number) * columnWidth;

        const g = guides.value.find((g) => g.id == tour.guide?.id);
        if (g) {
          top += guides.value.indexOf(g) * 25;
        }
        if (tour.startDate) {
          const startDateDay = dayjs(tour.startDate).format('YYYY-MM-DD');
          const calendarDate = date.value.format('YYYY-MM-DD');
          left =
            dayjs(startDateDay).diff(calendarDate, 'day') * columnWidth +
            columnWidth;

          if (tour.endDate) {
            const endDateDay = dayjs(tour.endDate).format('YYYY-MM-DD');
            w =
              (dayjs(endDateDay).diff(dayjs(startDateDay), 'day') + 1) *
              columnWidth;
          }

          if (tour.days && tour.days > 1) {
            w -= columnWidth;
            left += Math.round(columnWidth / 2);
            zIndex = 1;
          }
        }
        return {
          height: '25px',
          width: `${w}px`,
          backgroundColor: tour.color,
          top: `${top}px`,
          left: `${left}px`,
          fontSize: tour.days == 1 ? '8px' : '14px',
          zIndex: zIndex,
        };
      },
      currentInterval: computed(() => {
        return `From ${dayjs(date.value).format('MMMM DD')} to ${dayjs(
          date.value
        )
          .add(daysToShow.value, 'day')
          .format('MMMM DD')}`;
      }),
      assingGuide() {
        void updateTour({
          input: { id: tourToAssign.value?.id, guide: guideToAssign.value?.id },
        });
      },
    };
  },
});
</script>

<template>
  <q-page padding v-show="guides.length">
    <div class="tw-flex tw-items-center tw-justify-end">
      <div class="tw-text-lg tw-text-right tw-mr-3">
        <q-btn color="primary" label="Assign Tour" v-if="toursWithoutGuide.length">
          <q-badge color="orange" floating>{{toursWithoutGuide.length}}</q-badge>
        </q-btn>
        <q-menu anchor="bottom left" self="bottom right" v-model="menuAssignTour">
          <div class="tw-p-5" style="max-width: 300px; min-height: 220px; max-height: 500px;">
            <BaseSelect :options="toursWithoutGuide" label="Tours" v-model="tourToAssign">
              <template v-slot:selected-item="scope">
                <div class="row tw-w-full">
                  <div
                    class="col"
                    :style="{maxWidth: '30px', height: '30px', backgroundColor: scope.opt.color}"
                  ></div>

                  <div class="col tw-flex tw-justify-between tw-items-center">
                    <label class="tw-ml-3" v-html="scope.opt.name"></label>
                    <label class="tw-text-sm tw-text-gray-400">{{ scope.opt.type }}</label>
                  </div>
                </div>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" class="tw-flex tw-items-center">
                  <q-section avatar>
                    <div :style="{width: '30px', height: '30px', backgroundColor: scope.opt.color}"></div>
                  </q-section>
                  <q-item-section class="tw-ml-3">
                    <q-item-label v-html="scope.opt.name" />
                    <q-item-label caption>{{ scope.opt.type }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </BaseSelect>
            <BaseSelect
              :disable="tourToAssign"
              class="tw-mt-3"
              v-model="guideToAssign"
              :options="guidesSelect"
              label="Guide"
              option-label="name"
              option-value="id"
              use-input
            ></BaseSelect>

            <div class="tw-flex tw-justify-end tw-mt-2">
              <BaseButton
                label="Assign"
                type="submit"
                color="primary"
                class="q-ml-sm"
                :loading="loading"
                @click="assingGuide"
              />
            </div>
          </div>
        </q-menu>
      </div>
      <q-space />
      <div class="tw-mr-3">
        <BaseInput readonly v-model="startDate" label="Date">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                v-model="startDatePopup"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date minimal v-model="startDatePicker" :options="optionsFn"></q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </BaseInput>
      </div>
      <div class="tw-text-lg">
        <q-icon
          class="q-mr-sm"
          name="chevron_left"
          style="font-size: 30px; cursor: pointer;"
          @click="date = dayjs(date).subtract(daysToShow, 'day')"
        />
        {{currentInterval}}
        <q-icon
          class="q-mr-sm"
          name="chevron_right"
          style="font-size: 30px; cursor: pointer;"
          @click="date = dayjs(date).add(daysToShow, 'day')"
        />
      </div>
    </div>

    <div class="tw-flex">
      <div id="scrollBottom" class="tw-overflow-x-scroll tw-w-full" style="margin-left: 150px;">
        <div :style="{ minWidth: `${daysToShow * columnWidth}px`, height: '20px' }"></div>
      </div>
    </div>

    <div class="tw-flex">
      <div style="line-height: 0px; width: 150px;">
        <div
          class="cell-guide first-row tw-w-full tw-flex tw-justify-center tw-items-center tw-truncate tw-bg-gray-100"
        >Guides</div>
        <div
          @click="selectGuide(i)"
          v-for="g, i in guides"
          :key="g.id"
          class="cell-guide tw-w-full tw-flex tw-justify-center tw-items-center tw-truncate tw-font-medium tw-cursor-pointer guide"
          v-text="g.name"
          :class="{ 'selected-guide': i == selectGuideIndex, 'tw-bg-gray-200': i % 2 == 0 }"
        ></div>
        <div
          class="cell-guide first-row tw-w-full tw-flex tw-justify-center tw-items-center tw-truncate tw-border-t-2 tw-bg-gray-100"
        >Guides</div>
      </div>

      <div id="scrollTop" class="tw-overflow-x-scroll tw-relative">
        <div
          class="tw-flex tw-overflow-y-auto tw-overflow-x-hidden"
          :style="{ minWidth: `${daysToShow * columnWidth}px` }"
        >
          <div id="tours-container" style="line-height: 0px; position: relative;">
            <div
              v-for="tour, i in toursWithGuide"
              :key="i"
              @click.stop="showTourRefresh = !showTourRefresh; tourToShow = tour"
              class="tw-absolute tw-flex tw-justify-center tw-items-center tw-font-medium tw-rounded-3xl tw-cursor-pointer"
              :style="{ ...getStyle(tour) }"
            >
              <div>{{ tour.code }} | {{ tour.endDate }}</div>
            </div>

            <div
              v-for="e, i in days"
              :key="i"
              class="cell first-row tw-inline-block tw-bg-gray-100"
            >
              <div class="tw-flex tw-justify-center tw-items-center tw-h-full" v-text="e"></div>
            </div>

            <div
              v-for="g, i in guides.length"
              :key="g"
              :class="{ 'tw-bg-gray-200': i % 2 == 0, 'selected-guide': i == selectGuideIndex }"
            >
              <div v-for="e in daysToShow" :key="e" class="cell tw-inline-block"></div>
            </div>

            <div v-for="e, i in days" :key="i" class="first-row cell tw-inline-block">
              <div class="tw-flex tw-justify-center tw-items-center tw-h-full" v-text="e"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SheduleGuideShowTour
      v-if="tourToShow"
      :id="tourToShow.id"
      :type="tourToShow.service.code"
      :key="showTourRefresh"
      @refetch="refetch()"
      @refetchtoursWithoutGuide="refetchtoursWithoutGuide()"
      @close="tourToShow = false"
    />
  </q-page>
</template>
<style scoped>
.first-row {
  border-top: 0px;
  font-weight: bold;
  color: grey;
}

.cell {
  border-top: 1px solid grey;
  border-right: 1px solid grey;
}

.cell-guide {
  border: 1px solid grey;
  border-bottom: 0px;
}

.cell,
.cell-guide {
  width: 60px;
  height: 25px;
}

.cell-guide {
  width: 100%;
}

.selected-guide {
  background: repeating-linear-gradient(
    to right,
    #f6ba52,
    #f6ba52 10px,
    #ffd180 10px,
    #ffd180 20px
  );
}
</style>
