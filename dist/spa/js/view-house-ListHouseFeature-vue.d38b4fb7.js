(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[28],{"67eb":function(e,t,a){"use strict";a.r(t);var o=a("7a23");const u=Object(o["l"])("label",{class:"text-h6"},"House Features",-1),l={class:"tw-flex tw-justify-items-end tw-items-center tw-w-full tw-mt-5 sm:tw-mt-0 sm:tw-w-auto"};function n(e,t,a,n,s,r){const c=Object(o["K"])("q-space"),i=Object(o["K"])("BaseInput"),d=Object(o["K"])("BaseButton"),b=Object(o["K"])("q-form"),m=Object(o["K"])("q-td"),O=Object(o["K"])("q-icon"),j=Object(o["K"])("q-tr"),p=Object(o["K"])("BaseTable"),f=Object(o["K"])("q-page");return Object(o["C"])(),Object(o["h"])(f,{padding:""},{default:Object(o["T"])((()=>[Object(o["l"])(p,{title:"House Types",columns:e.columns,rows:e.items,loading:e.loading,"rows-per-page-options":[0],"hide-pagination":""},{top:Object(o["T"])((()=>[u,Object(o["l"])(c),Object(o["l"])(b,{onSubmit:e.onSubmit,ref:"formRef"},{default:Object(o["T"])((()=>[Object(o["l"])("div",l,[Object(o["l"])(i,{label:"Name",modelValue:e.item.name,"onUpdate:modelValue":t[1]||(t[1]=t=>e.item.name=t),clearable:"",class:"tw-w-full sm:tw-w-auto tw-mr-2",validate:""},null,8,["modelValue"]),Object(o["l"])("div",null,[Object(o["l"])(d,{loading:e.loading,round:"",color:"primary",icon:"add",type:"submit"},null,8,["loading"])])])])),_:1},8,["onSubmit"])])),body:Object(o["T"])((t=>[Object(o["l"])(j,{props:t},{default:Object(o["T"])((()=>[Object(o["l"])(m,{key:"name",props:t},{default:Object(o["T"])((()=>[Object(o["k"])(Object(o["O"])(t.row.name),1)])),_:2},1032,["props"]),Object(o["l"])(m,{key:"icon",props:t},{default:Object(o["T"])((()=>[Object(o["l"])(O,{class:"q-mr-sm",name:"edit",color:"teal",style:{"font-size":"20px",cursor:"pointer"},onClick:a=>e.edit(t.row)},null,8,["onClick"]),Object(o["l"])(O,{name:"delete",color:"negative",style:{"font-size":"20px",cursor:"pointer"},onClick:a=>e.remove(t.row)},null,8,["onClick"])])),_:2},1032,["props"])])),_:2},1032,["props"])])),_:1},8,["columns","rows","loading"])])),_:1})}var s=a("d4ca"),r=a("1840"),c=a("a92b"),i=a("7b9e");const d=[{name:"name",label:"Name",field:"name",align:"left"},{name:"icon",label:"",field:"",align:"right"}];var b=Object(o["m"])({setup(){let{list:e,items:t,item:a}=Object(s["a"])(),{loading:u}=e();const{mutate:l,onError:n,onDone:b}=Object(r["d"])(c["deleteHouseFeatureMutation"],(()=>({update:(e,{data:{deleteHouseFeature:{houseFeature:{id:a}}}})=>{let o=e.readQuery({query:c["listHouseFeatureQuery"]});o&&(t.value=o.houseFeatures.filter((e=>e.id!=a)),e.writeQuery({query:c["listHouseFeatureQuery"],data:{houseFeatures:t.value}}))}})));n((e=>{Object(i["b"])(e)})),b((()=>{Object(i["c"])({message:"The item have been deleted."})}));const{mutate:m,loading:O,onError:j,onDone:p}=Object(r["d"])(c["createHouseFeatureMutation"],(()=>({update:(e,{data:{createHouseFeature:{houseFeature:t}}})=>{const o=Object.assign(Object.assign({},t),a.value),u=e.readQuery({query:c["listHouseFeatureQuery"]});e.writeQuery({query:c["listHouseFeatureQuery"],data:{houseFeatures:[...(null===u||void 0===u?void 0:u.houseFeatures)||[],o]}})}})));j((e=>{Object(i["b"])(e)})),p((()=>{a.value={},g.value.resetValidation()}));const{mutate:f,onError:w,onDone:v,loading:y}=Object(r["d"])(c["updateHouseFeatureMutation"],(()=>({update:e=>{const a=e.readQuery({query:c["listHouseFeatureQuery"]});a&&(t.value=a.houseFeatures)}})));w((e=>{Object(i["b"])(e)})),v((()=>{a.value={},g.value.resetValidation()}));const g=Object(o["H"])({});return{items:t,item:a,columns:d,loading:Object(o["f"])((()=>u.value||O.value||y)),formRef:g,onSubmit(){if("undefined"==typeof a.value.id)m({input:a.value});else{const e=Object.assign({},a.value);delete e.__typename,f({input:e})}},edit(e){a.value=Object.assign({},e)},remove(e){Object(i["a"])().onOk((()=>{l({input:{id:e.id}})}))}}}}),m=a("9989"),O=a("2c91"),j=a("0378"),p=a("bd08"),f=a("db86"),w=a("0016"),v=a("eebe"),y=a.n(v);b.render=n;t["default"]=b;y()(b,"components",{QPage:m["a"],QSpace:O["a"],QForm:j["a"],QTr:p["a"],QTd:f["a"],QIcon:w["a"]})}}]);