import{i as o,p as i,d as l,o as r,c as u,b as e,t as _}from"./index.aca42274.js";const d={class:"container mx-auto"},h=["src","alt"],m={class:"prose max-w-none text-center"},p=["innerHTML"],g={__name:"ShopArticle",setup(v){const s=o("axiosWithAuth"),{articleId:n}=i().params,t=l({});async function c(){s({method:"get",url:`/article/${n}`}).then(a=>{t.value=a.data.article})}return c(),(a,x)=>(r(),u("div",d,[e("img",{class:"mx-auto mb-8",src:t.value.image,alt:t.value.title},null,8,h),e("div",m,[e("h1",null,_(t.value.title),1),e("div",{innerHTML:t.value.content},null,8,p)])]))}};export{g as default};