
import { Province } from 'src/graphql/@types/types.d';
import { listQuery, getItemQuery } from 'src/graphql/query/province.graphql';
import { error } from 'src/helpers/notification';
import { useQuery } from '@vue/apollo-composable';
import useEntityFactory from 'src/composables/useEntityFactory'


const { items, item } = useEntityFactory<Partial<Province>>();

function list() {

    const { loading, onError, onResult } = useQuery(listQuery)


    onResult((result: { data: { provinces: Partial<Province>[] } }) => {
        items.value = result.data.provinces
    })

    onError((e) => {
        error(e);

    });

    return { loading }
}

function getItem(id: string) {
    const { onError, onResult } = useQuery(
        getItemQuery,
        () => ({
            id: `/api/provinces/${id}`,
        })
    );
    onError((e: Error) => {
        error(e);
    });

    onResult((result: { data: { province: Province } }) => {
        item.value = Object.assign({}, result.data.province);
    })
}

export default function service() {

    return { item, items, list, getItem }
}