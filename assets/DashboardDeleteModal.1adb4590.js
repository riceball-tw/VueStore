import{r as l,o as a,l as i,w as r,b as t,y as d,e as n,c as _,t as m,f as b,z as f}from"./index.6237c208.js";const u={class:"modal-box text-center w-full"},h={class:"text-3xl font-bold mb-8"},p={class:"mb-8"},k={class:"text-xl"},v={key:0,class:"not-italic font-bold"},x={class:"modal-action justify-center"},y=["onClick"],C=["onClick"],j={inheritAttrs:!1},w=Object.assign(j,{__name:"DashboardDeleteModal",props:{dashboardItem:{type:Object,default(){return{}}}},emits:["confirm"],setup(s){return(e,B)=>{const c=l("vue-final-modal");return a(),i(c,f({classes:"flex justify-center items-center"},e.$attrs),{default:r(({close:o})=>[t("div",u,[t("div",h,[d(e.$slots,"title")]),t("div",p,[t("p",k,[n(" \u78BA\u5B9A\u8981\u522A\u9664"),s.dashboardItem?(a(),_("em",v,m(s.dashboardItem.title),1)):b("",!0),n("\u9805\u76EE\uFF1F ")])]),t("div",x,[t("button",{class:"btn btn-outline",type:"button",onClick:$=>o()},"\u53D6\u6D88",8,y),t("button",{class:"btn btn-error",onClick:()=>{o(),e.$emit("confirm")}}," \u78BA\u5B9A ",8,C)])])]),_:3},16)}}});export{w as _};