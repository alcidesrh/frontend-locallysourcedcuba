import { HouseRoomType } from 'src/graphql/@types/types.d';
import { listHouseRoomTypeQuery } from 'src/graphql/query/house.graphql';
import { error } from 'src/helpers/notification';
import { useQuery } from '@vue/apollo-composable';
import useEntityFactory from 'src/composables/useEntityFactory';

const { item, items } = useEntityFactory<Partial<HouseRoomType>>();

function list() {
  const { loading, onError, onResult } = useQuery(listHouseRoomTypeQuery);

  onResult(
    (result: {
      data: {
        houseRoomTypes: Partial<HouseRoomType>[];
      };
    }) => {
      items.value = result.data.houseRoomTypes;
    }
  );

  onError((e) => {
    error(e);
  });

  return { loading };
}

export default function useHouseRoomType() {
  return { item, items, list };
}
