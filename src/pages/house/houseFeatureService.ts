import { HouseFeature } from 'src/graphql/@types/types.d';
import { listHouseFeatureQuery } from 'src/graphql/query/house.graphql';
import { error } from 'src/helpers/notification';
import { useQuery } from '@vue/apollo-composable';
import useEntityFactory from 'src/composables/useEntityFactory';

const { item, items } = useEntityFactory<Partial<HouseFeature>>();

function list() {
  const { loading, onError, onResult } = useQuery(listHouseFeatureQuery);

  onResult(
    (result: {
      data: {
        houseFeatures: Partial<HouseFeature>[];
      };
    }) => {
      items.value = result.data.houseFeatures;
    }
  );

  onError((e) => {
    error(e);
  });

  return { loading };
}

export default function useHouseFeature() {
  return { item, items, list };
}
