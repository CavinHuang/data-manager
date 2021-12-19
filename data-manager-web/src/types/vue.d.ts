import { ComponentInternalInstance } from 'vue'

export interface CurrentInstanceInterface extends ComponentInternalInstance {
  $api?: any;
}

declare module 'swiper/vue' {
  import _Vue from 'vue'
  export class Swiper extends _Vue {}
  export class SwiperSlide extends _Vue {}
}
