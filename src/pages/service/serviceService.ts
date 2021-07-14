
import { Service } from 'src/graphql/@types/types.d';
import { listServiceQuery, getServiceQuery } from 'src/graphql/query/service.graphql';
import { error } from 'src/helpers/notification';
import { useQuery } from '@vue/apollo-composable';
import useEntityFactory from 'src/composables/useEntityFactory'


const { items, item } = useEntityFactory<Partial<Service>>();

function list() {

    const { loading, onError, onResult } = useQuery(listServiceQuery)


    onResult((result: { data: { services: Partial<Service>[] } }) => {
        items.value = result.data.services
    })

    onError((e) => {
        error(e);

    });

    return { loading }
}

function getItem(id: string) {
    const { onError, onResult } = useQuery(
        getServiceQuery,
        () => ({
            id: `/api/services/${id}`,
        })
    );
    onError((e: Error) => {
        error(e);
    });

    onResult((result: { data: { service: Partial<Service> } }) => {
        item.value = Object.assign({}, result.data.service);
    })
}

export default function service() {

    return { item, items, list, getItem }
}