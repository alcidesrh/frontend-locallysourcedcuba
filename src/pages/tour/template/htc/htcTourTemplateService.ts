import { TourTemplate } from 'src/graphql/@types/types.d';
import {
  listHtcTourTemplateQuery,
  getTourTemplateQuery,
} from 'src/graphql/query/tourTemplate.graphql';
import { error } from 'src/helpers/notification';
import { useQuery } from '@vue/apollo-composable';
import useEntityFactory from 'src/composables/useEntityFactory';
import { ref } from 'vue';

const { items, item } = useEntityFactory<Partial<TourTemplate>>();

const tourTemplateFormStep = ref(0);

function list() {
  const { loading, onError, onResult } = useQuery(listHtcTourTemplateQuery);

  onResult((result: { data: { tourTemplates: Partial<TourTemplate>[] } }) => {
    items.value = result.data.tourTemplates;
  });

  onError((e) => {
    error(e);
  });

  return { loading };
}

function getItem(id: string) {
  const { onError, onResult } = useQuery(
    getTourTemplateQuery,
    () => ({
      id: `/api/tour_templates/${id}`,
    }),
    {
      fetchPolicy: 'network-only',
    }
  );
  onError((e: Error) => {
    error(e);
  });

  onResult((result: { data: { tourTemplate: TourTemplate } }) => {
    item.value = Object.assign({}, result.data.tourTemplate);
  });
}

export default function service() {
  return { item, items, list, getItem, tourTemplateFormStep };
}
