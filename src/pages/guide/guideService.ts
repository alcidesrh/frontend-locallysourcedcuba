
import { Guide } from 'src/graphql/@types/types.d';
import { listGuideQuery, getGuideQuery } from 'src/graphql/query/guide.graphql';
import { error } from 'src/helpers/notification';
import { useQuery } from '@vue/apollo-composable';
import useEntityFactory from 'src/composables/useEntityFactory'

const { item, items, sortBy, descending, pagination, variablesListQuery, search } = useEntityFactory<Partial<Guide>>();

function list() {

    const { loading, onError, onResult } = useQuery(listGuideQuery, () => variablesListQuery.value)

    onResult((result: { data: { listGuides: { collection: Partial<Guide>[], paginationInfo: { totalCount: number } } } }) => {
        items.value = result.data.listGuides.collection
        pagination.value.rowsNumber = result.data.listGuides.paginationInfo.totalCount
    })

    onError((e) => {
        error(e);

    });

    return { pagination, loading, search }
}

function getItem(id: string) {
    const { onError, onResult } = useQuery(
        getGuideQuery,
        () => ({
            id: `/api/guides/${id}`,
        })
    );
    onError((e: Error) => {
        error(e);
    });

    onResult((result: { data: { guide: Guide } }) => {
        item.value = Object.assign({}, result.data.guide);
    })
}

export default function useGuide() {

    return { item, items, sortBy, descending, list, getItem, variablesListQuery }
}