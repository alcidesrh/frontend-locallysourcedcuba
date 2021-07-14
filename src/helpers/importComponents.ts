export default (path: string) => {
    return import(/* webpackChunkName: "view-[request]" */
        `pages/${path}.vue`
    )
}