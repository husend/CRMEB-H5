webpackJsonp([56],{ncqS:function(e,r,s){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var t=s("DMPO"),n=(s("Qwh1"),{name:"ProductConSwiper",components:{swiper:t.swiper,swiperSlide:t.swiperSlide},props:{imgUrls:{type:Array,default:function(){return[]}}},data:function(){var e=this;return{currents:1,ProductConSwiper:{autoplay:{disableOnInteraction:!1,delay:2e3},loop:!0,speed:1e3,observer:!0,observeParents:!0,on:{slideChangeTransitionStart:function(){e.currents=this.realIndex+1}}}}},mounted:function(){},methods:{}}),i={render:function(){var e=this,r=e.$createElement,s=e._self._c||r;return s("div",{staticClass:"slider-banner product-bg"},[e.imgUrls.length>0?s("swiper",{staticClass:"swiper-wrapper",attrs:{options:e.ProductConSwiper}},e._l(e.imgUrls,function(e){return s("swiperSlide",{key:e,ref:"goodSwiper",refInFor:!0,staticClass:"swiper-slide"},[s("img",{staticClass:"slide-image",attrs:{src:e}})])}),1):e._e(),e._v(" "),s("div",{staticClass:"pages"},[e._v(e._s(e.currents||1)+"/"+e._s(e.imgUrls.length||1))])],1)},staticRenderFns:[]},a=s("C7Lr")(n,i,!1,null,null,null);r.default=a.exports}});
//# sourceMappingURL=56.05f76c2434cdba46acc1.js.map