(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[38],{c777:function(t,e,i){"use strict";i.r(e);var a=i("7a23");const n=Object(a["l"])("div",{class:"text-subtitle1"},"New Notification",-1);function o(t,e,i,o,c,s){const l=Object(a["K"])("FormNotification"),u=Object(a["K"])("q-page");return Object(a["C"])(),Object(a["h"])(u,{padding:""},{default:Object(a["T"])((()=>[n,Object(a["l"])(l,{onSubmit:t.onSubmit,onCancel:t.cancel,loading:t.loading},null,8,["onSubmit","onCancel","loading"])])),_:1})}var c=i("277f"),s=i("ddd6"),l=i("1840"),u=i("3771"),r=i("6c02"),d=i("7b9e"),b=Object(a["m"])({setup(){const{item:t,variablesListQuery:e}=Object(s["a"])();t.value={};const{mutate:i,loading:a,onError:n,onDone:o}=Object(l["d"])(u["createNotificationMutation"],(()=>({update:(i,{data:{createNotification:{notification:a}}})=>{const n=Object.assign(Object.assign({},a),t.value),o=i.readQuery({query:u["listNotificationQuery"],variables:e.value});i.writeQuery({query:u["listNotificationQuery"],data:{listNotifications:{collection:[...(null===o||void 0===o?void 0:o.listNotifications.collection)||[],n]}},variables:e.value})}}))),c=Object(r["d"])();o((()=>{c.push({name:"ListNotification"})})),n((t=>{Object(d["b"])(t)}));const b=()=>{var e;"string"===typeof t.value.days&&(t.value.days=parseInt(t.value.days)),i({input:Object.assign(Object.assign({},t.value),{services:null===(e=t.value.services)||void 0===e?void 0:e.map((t=>t?t.id:null))})})};return{loading:a,cancel(){t.value={},c.push({name:"ListNotification"})},onSubmit:b}},components:{FormNotification:c["default"]}}),v=i("9989"),f=i("eebe"),p=i.n(f);b.render=o;e["default"]=b;p()(b,"components",{QPage:v["a"]})}}]);