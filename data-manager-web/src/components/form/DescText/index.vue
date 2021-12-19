<template>
    <p :style="{'color':color,'text-align':textAlign}">
        {{ modelValue }}
    </p>
</template>

<script>
export default {
  name: 'DescText',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#000000'
    },
    textAlign: {
      type: String,
      default: 'left'
    }
  },
  methods: {}
}
</script>
