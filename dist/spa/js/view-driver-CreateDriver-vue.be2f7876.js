(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[18],{"53e9":function(e,t,a){"use strict";a.r(t);var r=a("7a23");const n=Object(r["l"])("div",{class:"text-subtitle1"},"New Driver",-1);function i(e,t,a,i,c,o){const l=Object(r["K"])("FormDriver"),u=Object(r["K"])("q-page");return Object(r["C"])(),Object(r["h"])(u,{padding:""},{default:Object(r["T"])((()=>[n,Object(r["l"])(l,{onSubmit:e.onSubmit,onCancel:e.cancel,loading:e.loading},null,8,["onSubmit","onCancel","loading"])])),_:1})}var c=a("58a2"),o=a("6cf1"),l=a("1840"),u=a("53bf"),s=a("6c02"),v=a("7b9e"),b=Object(r["m"])({setup(){const{item:e,variablesListQuery:t}=Object(o["a"])();e.value={};const{mutate:a,loading:r,onError:n,onDone:i}=Object(l["d"])(u["createDriverMutation"],(()=>({update:(a,{data:{createDriver:{driver:r}}})=>{const n=Object.assign(Object.assign({},r),e.value),i=a.readQuery({query:u["listDriverQuery"],variables:t.value});a.writeQuery({query:u["listDriverQuery"],data:{listDrivers:{collection:[...(null===i||void 0===i?void 0:i.listDrivers.collection)||[],n]}},variables:t.value})}}))),c=Object(s["d"])();i((()=>{c.push({name:"ListDriver"})})),n((e=>{Object(v["b"])(e)}));const b=()=>{"string"===typeof e.value.pax&&(e.value.pax=parseInt(e.value.pax)),a({input:e.value})};return{loading:r,cancel(){e.value={},c.push({name:"ListDriver"})},onSubmit:b}},components:{FormDriver:c["default"]}}),d=a("9989"),p=a("eebe"),j=a.n(p);b.render=i;t["default"]=b;j()(b,"components",{QPage:d["a"]})}}]);