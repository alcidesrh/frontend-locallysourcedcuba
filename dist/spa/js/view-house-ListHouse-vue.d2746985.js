(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[27],{2116:function(e,t,a){"use strict";a.r(t);var l=a("7a23");const o=Object(l["l"])("label",{class:"text-h6"},"Houses",-1),s={class:"flex justify-end tw-w-full tw-mt-5 sm:tw-mt-0 sm:tw-w-auto"};function n(e,t,a,n,c,r){const i=Object(l["K"])("BaseButton"),b=Object(l["K"])("q-space"),u=Object(l["K"])("q-icon"),d=Object(l["K"])("BaseInput"),O=Object(l["K"])("q-tooltip"),m=Object(l["K"])("q-td"),j=Object(l["K"])("q-chip"),p=Object(l["K"])("q-table"),g=Object(l["K"])("q-page");return Object(l["C"])(),Object(l["h"])(g,{padding:""},{default:Object(l["T"])((()=>[Object(l["l"])(p,{title:"Houses",rows:e.items,columns:e.columns,color:"primary","row-key":"name",loading:e.loading,pagination:e.pagination,"onUpdate:pagination":t[3]||(t[3]=t=>e.pagination=t),onRequest:e.onRequest},{top:Object(l["T"])((()=>[o,Object(l["l"])(i,{class:"q-ml-md tw-absolute sm:tw-relative tw-top-0 tw-right-0 tw-mt-2 tw-mr-2 sm:tw-mt-0 sm:tw-mr-0",round:"",color:"primary",icon:"add",onClick:t[1]||(t[1]=t=>e.router.push({name:"CreateHouse"}))}),Object(l["l"])(b),Object(l["l"])("div",s,[Object(l["l"])(d,{label:"Search",modelValue:e.search,"onUpdate:modelValue":t[2]||(t[2]=t=>e.search=t),clearable:"",class:"tw-w-full sm:tw-w-auto"},{append:Object(l["T"])((()=>[Object(l["l"])(u,{name:"search"})])),_:1},8,["modelValue"])])])),"body-cell-address":Object(l["T"])((t=>[Object(l["l"])(m,{key:"address",props:t},{default:Object(l["T"])((()=>[Object(l["l"])("div",null,[Object(l["l"])(O,{anchor:"top middle",self:"top middle"},{default:Object(l["T"])((()=>[Object(l["k"])(Object(l["O"])(t.row.address),1)])),_:2},1024),Object(l["l"])("label",null,Object(l["O"])(t.row.address&&e.truncate(t.row.address,{length:20})),1)])])),_:2},1032,["props"])])),"body-cell-features":Object(l["T"])((e=>[Object(l["l"])(m,{key:"features",props:e},{default:Object(l["T"])((()=>[(Object(l["C"])(!0),Object(l["h"])(l["a"],null,Object(l["I"])(e.row.features,(e=>(Object(l["C"])(),Object(l["h"])(j,{class:"tw-ml-0",key:e.id},{default:Object(l["T"])((()=>[Object(l["k"])(Object(l["O"])(e.name),1)])),_:2},1024)))),128))])),_:2},1032,["props"])])),"body-cell-rooms":Object(l["T"])((e=>[Object(l["l"])(m,{key:"rooms",props:e},{default:Object(l["T"])((()=>[(Object(l["C"])(!0),Object(l["h"])(l["a"],null,Object(l["I"])(e.row.rooms,(e=>(Object(l["C"])(),Object(l["h"])(j,{class:"tw-ml-0",key:e.id},{default:Object(l["T"])((()=>[Object(l["k"])(Object(l["O"])(e.roomType.name),1)])),_:2},1024)))),128))])),_:2},1032,["props"])])),"body-cell-seasons":Object(l["T"])((t=>[Object(l["l"])(m,{key:"seasons",props:t},{default:Object(l["T"])((()=>[(Object(l["C"])(!0),Object(l["h"])(l["a"],null,Object(l["I"])(t.row.houseSeasons,(t=>(Object(l["C"])(),Object(l["h"])(j,{class:"tw-ml-0",key:t.id},{default:Object(l["T"])((()=>[Object(l["k"])(Object(l["O"])(e.format(t.startDate))+" - "+Object(l["O"])(e.format(t.endDate)),1)])),_:2},1024)))),128))])),_:2},1032,["props"])])),"body-cell-icon":Object(l["T"])((t=>[Object(l["l"])(m,{key:"icon",props:t},{default:Object(l["T"])((()=>[Object(l["l"])(u,{class:"q-mr-sm",name:"edit",color:"teal",style:{"font-size":"20px",cursor:"pointer"},onClick:a=>e.edit(t.row)},null,8,["onClick"]),Object(l["l"])(u,{name:"delete",color:"negative",style:{"font-size":"20px",cursor:"pointer"},onClick:a=>e.remove(t.row)},null,8,["onClick"])])),_:2},1032,["props"])])),_:1},8,["rows","columns","loading","pagination","onRequest"])])),_:1})}var c=a("8c6b"),r=a("6c02"),i=a("1840"),b=a("a92b"),u=a("7b9e"),d=a("b3fe"),O=a("749b"),m=a("5c8a"),j=a("97be");const p=[{name:"type",label:"Type",align:"left",field:e=>{var t;return null===(t=e.type)||void 0===t?void 0:t.name}},{name:"name",label:"Name",field:"name",align:"left"},{name:"destination",label:"Destination",align:"left",field:e=>{var t;return null===(t=e.destination)||void 0===t?void 0:t.name}},{name:"address",label:"Address",align:"left",field:"address"},{name:"email",label:"Email",field:"email",align:"left"},{name:"phone",label:"Phone",field:"phone",align:"left"},{name:"features",label:"Features",align:"left"},{name:"rooms",label:"Rooms",align:"left"},{name:"seasons",label:"Seasons",align:"left"},{name:"icon",label:"",field:"",align:"right"}];var g=Object(l["m"])({setup(){const e=Object(r["d"])(),t=Object(d["a"])();let{list:a,items:l,sortBy:o,variablesListQuery:s}=Object(c["a"])(),{pagination:n,loading:g,search:f}=a();const{mutate:w,onError:v,onDone:h}=Object(i["d"])(b["deleteHouseMutation"],(()=>({update:(e,{data:{deleteHouse:{house:{id:t}}}})=>{let a=e.readQuery({query:b["listHouseQuery"],variables:s.value});a&&(l.value=a.listHouses.collection.filter((e=>e.id!=t)),e.writeQuery({query:b["listHouseQuery"],data:{listHouses:{collection:l.value}},variables:s.value}))}})));return v((e=>{Object(u["b"])(e)})),h((()=>{Object(u["c"])({message:"The house have been deleted."})})),{items:l,columns:p,loading:g,pagination:n,router:e,deleteHouse:w,search:f,truncate:O["a"],format:j["a"],onRequest(e){const{page:a,rowsPerPage:l,sortBy:s,descending:c}=e.pagination;n.value.descending!=c?c?o.value&&"ASC"==o.value[0].name&&(o.value=[{name:"DESC"}]):o.value||(o.value=[{name:"ASC"}]):n.value.page==a&&n.value.descending==c==1&&l==n.value.rowsPerPage&&(o.value=null),l!=n.value.rowsPerPage&&t.localStorage.set("houseRowsPerPage",l),n.value.page=n.value.rowsPerPage!=l?1:a,n.value.rowsPerPage=0==l?1e5:l,n.value.sortBy=s,n.value.descending=c},edit(t){const{item:a}=Object(c["a"])();a.value=Object(m["a"])(t),e.push({name:"EditHouse",params:{id:t._id}})},remove(e){t.dialog({title:"Confirm",message:"Would you like to delete this house?",cancel:!0,persistent:!0}).onOk((()=>{w({input:{id:e.id}})}))}}}}),f=a("9989"),w=a("eaac"),v=a("2c91"),h=a("0016"),y=a("db86"),T=a("05c0"),k=a("b047"),C=a("eebe"),q=a.n(C);g.render=n;t["default"]=g;q()(g,"components",{QPage:f["a"],QTable:w["a"],QSpace:v["a"],QIcon:h["a"],QTd:y["a"],QTooltip:T["a"],QChip:k["a"]})}}]);