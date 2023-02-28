import{m as v,E,r as U,o as _,l as A,w as B,b as t,y as S,h as j,B as c,C as p,D as z,z as F,G as H,q as M,c as f,F as k,g as N,t as i,p as T,a as P,$ as b}from"./index.6237c208.js";import{_ as L}from"./AppPagination.97510628.js";import{_ as V}from"./DashboardDeleteModal.1adb4590.js";const Q={class:"modal-box w-full max-w-none p-8"},R={class:"text-3xl font-bold mb-8"},W=["onSubmit"],G={class:"form-control w-full"},I=t("label",{for:"createAt",class:"label"},[t("span",{class:"label-text"},"\u5275\u5EFA\u65E5\u671F")],-1),J={class:"form-control w-full"},K=t("label",{for:"userName",class:"label"},[t("span",{class:"label-text"},"\u806F\u7D61\u4EBA")],-1),X={class:"form-control w-full"},Y=t("label",{for:"userTel",class:"label"},[t("span",{class:"label-text"},"\u96FB\u8A71")],-1),tt={class:"form-control w-full"},et=t("label",{for:"userEmail",class:"label"},[t("span",{class:"label-text"},"\u96FB\u5B50\u4FE1\u7BB1")],-1),lt={class:"form-control w-full"},st=t("label",{for:"total",class:"label"},[t("span",{class:"label-text"},"\u61C9\u4ED8\u91D1\u984D")],-1),ot={class:"input-group"},nt=t("span",null,"\u5143",-1),at={class:"form-control w-full"},it={for:"isEnabled",class:"label"},ut=t("span",{class:"label-text"},"\u662F\u5426\u4ED8\u6B3E",-1),rt={class:"modal-action flex flex-wrap gap-4"},dt=t("button",{class:"btn btn-primary btn-wide",form:"couponModal",type:"submit"},"\u78BA\u8A8D",-1),ct=["onClick"],pt={__name:"OrderModal",props:{order:{type:Object,default(){return{}}}},emits:["confirm","cancel"],setup(w,{emit:u}){const l=v({...w.order});l.value.create_at&&(l.value.create_at=E(l.value.create_at,"-"));function r(){const a={...l.value};a.create_at=H(l.value.create_at),u("confirm",a)}return(a,o)=>{const h=U("vue-final-modal");return _(),A(h,F(a.$attrs,{classes:"flex justify-center items-center"}),{default:B(({close:m})=>[t("div",Q,[t("div",R,[S(a.$slots,"title")]),t("form",{id:"couponModal",onSubmit:j(()=>{m(),r()},["prevent"])},[t("div",G,[I,c(t("input",{id:"createAt","onUpdate:modelValue":o[0]||(o[0]=n=>l.value.create_at=n),type:"date",class:"input input-bordered w-full",placeholder:"\u8ACB\u8F38\u5165\u8A02\u55AE\u5275\u5EFA\u65E5\u671F\u2026\u2026",required:""},null,512),[[p,l.value.create_at]])]),t("div",J,[K,c(t("input",{id:"userName","onUpdate:modelValue":o[1]||(o[1]=n=>l.value.user.name=n),class:"input input-bordered w-full",type:"text",placeholder:"\u8ACB\u8F38\u5165\u540D\u7A31\u2026\u2026",required:""},null,512),[[p,l.value.user.name]])]),t("div",X,[Y,c(t("input",{id:"userTel","onUpdate:modelValue":o[2]||(o[2]=n=>l.value.user.tel=n),class:"input input-bordered w-full",type:"tel",placeholder:"\u8ACB\u8F38\u5165\u96FB\u8A71\u2026\u2026",required:""},null,512),[[p,l.value.user.tel]])]),t("div",tt,[et,c(t("input",{id:"userEmail","onUpdate:modelValue":o[3]||(o[3]=n=>l.value.user.email=n),class:"input input-bordered w-full",type:"email",placeholder:"\u8ACB\u8F38\u5165\u96FB\u5B50\u4FE1\u7BB1\u2026\u2026",required:""},null,512),[[p,l.value.user.email]])]),t("div",lt,[st,t("div",ot,[c(t("input",{id:"total","onUpdate:modelValue":o[4]||(o[4]=n=>l.value.total=n),class:"input input-bordered w-full",min:"0",type:"number",placeholder:"\u8ACB\u8F38\u5165\u61C9\u4ED8\u91D1\u984D\u2026\u2026",required:""},null,512),[[p,l.value.total,void 0,{number:!0}]]),nt])]),t("div",at,[t("label",it,[ut,c(t("input",{id:"isEnabled","onUpdate:modelValue":o[5]||(o[5]=n=>l.value.is_paid=n),class:"toggle toggle-success",type:"checkbox","true-value":!0,"false-value":!1},null,512),[[z,l.value.is_paid]])])])],40,W),t("div",rt,[dt,t("button",{class:"btn",onClick:n=>m()},"\u53D6\u6D88",8,ct)])])]),_:3},16)}}},mt={class:"flex justify-between w-full mb-8"},_t=t("h1",{class:"text-4xl font-bold"},"\u5F8C\u53F0\u8A02\u55AE\u8CC7\u8A0A",-1),ht={class:"overflow-x-auto w-full"},ft={class:"table table-zebra w-full"},bt=t("thead",{class:"sticky top-0 z-20"},[t("tr",null,[t("th",null,"\u7D22\u5F15"),t("th",null,"\u8A02\u55AE\u7DE8\u865F"),t("th",null,"\u8A02\u55AE\u65E5\u671F"),t("th",null,"\u806F\u7D61\u4EBA / \u96FB\u8A71"),t("th",null,"\u96FB\u5B50\u90F5\u4EF6"),t("th",null,"\u61C9\u4ED8\u91D1\u984D"),t("th",null,"\u8A02\u55AE\u72C0\u614B"),t("th",null,"\u884C\u52D5")])],-1),vt={class:"btn-group"},wt=["onClick"],gt=t("svg",{title:"\u7DE8\u8F2F",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",height:"24",width:"24"},[t("path",{d:"M5 19h1.4l8.625-8.625-1.4-1.4L5 17.6ZM19.3 8.925l-4.25-4.2 1.4-1.4q.575-.575 1.413-.575.837 0 1.412.575l1.4 1.4q.575.575.6 1.388.025.812-.55 1.387ZM17.85 10.4 7.25 21H3v-4.25l10.6-10.6Zm-3.525-.725-.7-.7 1.4 1.4Z"})],-1),$t=[gt],xt=["onClick"],yt=t("svg",{title:"\u522A\u9664",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",height:"24",width:"24"},[t("path",{d:"M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10ZM9 17h2V8H9Zm4 0h2V8h-2ZM7 6v13Z"})],-1),Ct=[yt],qt={__name:"dashboardOrders",setup(w){const u=M("axiosWithAuth"),g=M("$loading"),l=v([]),r=v({});function a(s=1){const d=g.show();u({method:"get",url:`/admin/orders?page=${s}`}).then(e=>{l.value=e.data.orders,r.value=e.data.pagination}).finally(()=>{d.hide()})}function o(s){u({method:"delete",url:`/admin/order/${s}`}).then(()=>{a()})}function h(s){b.show({component:V,bind:{dashboardItem:{title:s.id}},on:{confirm(){o(s.id)}},slots:{title:"\u522A\u9664\u8A02\u55AE"}})}function m(s){u({method:"put",url:`/admin/order/${s.data.id}`,data:{...s}}).then(()=>{a()})}function n(s){b.show({component:pt,bind:{order:{...s}},on:{confirm(d){const e={data:{...d}};m(e)}},slots:{title:"\u7DE8\u8F2F\u8A02\u55AE"}})}function q(s){a(s)}function O(){u({method:"delete",url:"/admin/orders/all"}).then(()=>{a()})}function Z(){b.show({component:V,on:{confirm(){O()}},slots:{title:"\u522A\u9664\u7522\u54C1"}})}return a(),(s,d)=>(_(),f(k,null,[t("div",mt,[_t,t("button",{class:"btn btn-error",onClick:d[0]||(d[0]=e=>Z())},"\u522A\u9664\u5168\u90E8\u8A02\u55AE")]),t("div",ht,[t("table",ft,[bt,t("tbody",null,[(_(!0),f(k,null,N(l.value,(e,$)=>{var x,y,C;return _(),f("tr",{key:e.id},[t("th",null,i(r.value.current_page===1?$+1:$+1+r.value.current_page*10-10),1),t("td",null,i(e.id),1),t("td",null,i(s.$unitFilters.toReadableDate(e.create_at)),1),t("td",null,i((x=e==null?void 0:e.user)==null?void 0:x.name)+" / "+i((y=e==null?void 0:e.user)==null?void 0:y.tel),1),t("td",null,i((C=e==null?void 0:e.user)==null?void 0:C.email),1),t("td",null,i(s.$unitFilters.currency(e.total)),1),t("td",{class:T(e.is_paid?"text-success":"text-error")},i(e.is_paid?"\u5DF2\u4ED8\u6B3E":"\u672A\u4ED8\u6B3E"),3),t("td",null,[t("div",vt,[t("button",{class:"btn btn-outline btn-square",onClick:D=>n(e)},$t,8,wt),t("button",{class:"btn btn-outline btn-square -ml-px hover:btn-error",onClick:D=>h(e)},Ct,8,xt)])])])}),128))])])]),P(L,{pages:r.value,onPaginationChange:q},null,8,["pages"])],64))}};export{qt as default};