import { defineComponent } from 'vue'
import css from './index.module.scss'

export default defineComponent({
  name: 'LoginWrapper',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  setup (props, ctx) {
    return () => (
      <div class={css['login-wrapper']}>
        {props.title ? (
          <div class='login-header'>
            <h2 class='login-title'>{props.title}</h2>
          </div>
        ) : ''}
        <div class='login-container'>
          {ctx.slots.default && ctx.slots.default()}
        </div>
      </div>
    )
  }
})
