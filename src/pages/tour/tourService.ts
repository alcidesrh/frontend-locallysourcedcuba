import { TourTemplate } from './../../graphql/@types/types.d';
// import { error } from 'src/helpers/notification';
// import { useQuery } from '@vue/apollo-composable';
import { ref } from 'vue';
// import gql from 'graphql-tag';

const templates = ref<Partial<TourTemplate>[]>([]);

// function getTemplates() {
//   const {
//     loading,
//     onError: templatesOnError,
//     onResult: teampltesOnResult,
//   } = useQuery(gql`
//     query getTemplates {
//       tourTemplates(tourType: "htc") {
//         id
//         color
//         name
//       }
//     }
//   `);

//   teampltesOnResult((result: { data: { tours: Partial<TourTemplate>[] } }) => {
//     templates.value = result.data.tours;
//   });

//   templatesOnError((e) => {
//     error(e);
//   });

//   return { loading };
// }

export default function service() {
  return { templates };
}
