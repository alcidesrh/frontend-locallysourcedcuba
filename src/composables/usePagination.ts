import { ref } from 'vue'
import { itemsPerPage as itemsPerPageConfig } from 'src/config/app'

export default function usePagination() {

    const page = ref(1);

    const itemsPerPage = ref<number>(itemsPerPageConfig);

    const sortBy = ref<[Record<string, string>] | null>()

    const descending = ref<boolean>(true)

    const total = ref(0)

    const pagination = ref({
        sortBy: sortBy.value ? 'name' : '',
        descending: descending.value,
        page: page.value,
        rowsPerPage: itemsPerPage.value,
        rowsNumber: total.value,
    })

    return { page, itemsPerPage, sortBy, descending, total, pagination }

}