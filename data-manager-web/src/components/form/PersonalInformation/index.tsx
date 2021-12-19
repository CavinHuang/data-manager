import { defineComponent } from 'vue'
import style from './style.module.scss'
export default defineComponent({
  name: 'PersonalInformation',
  props: {
    modelValue: {
      type: Object,
      default: () => ({})
    },
    ['onUpdate:modelValue']: {
      type: Function,
      default: null
    }
  },
  setup(props, { slots }) {
    return () => (
      <div class={style['personal-infomation']}>
        {slots.default && slots.default(props.modelValue, props['onUpdate:modelValue'])}
      </div>
    )
  }
})
