import { HouseType } from 'src/graphql/@types/types.d';
import { listHouseTypeQuery } from 'src/graphql/query/house.graphql';
import { error } from 'src/helpers/notification';
import { useQuery } from '@vue/apollo-composable';
import useEntityFactory from 'src/composables/useEntityFactory';

const { item, items } = useEntityFactory<Partial<HouseType>>();

function list() {
  const { loading, onError, onResult } = useQuery(listHouseTypeQuery);

  onResult(
    (result: {
      data: {
        houseTypes: Partial<HouseType>[];
      };
    }) => {
      items.value = result.data.houseTypes;
    }
  );

  onError((e) => {
    error(e);
  });

  return { loading };
}

export default function useHouseType() {
  return { item, items, list };
}
