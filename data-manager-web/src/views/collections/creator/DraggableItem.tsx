// @ts-ignore
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import render from '@/components/render/render'
import { h,resolveComponent } from "vue";
const components = {
  itemBtns(h: any, currentItem: any, index: any, list: any) {
    const { onActiveItem,onDeleteItem,onCopyItem } = (this as any).$attrs;
    console.log((this as any).$attrs);
    return [
      <span
        class="drawing-item-copy"
        title="复制"
        onClick={(event) => {
          onCopyItem(currentItem,list);
          event.stopPropagation();
        }}
      >
        <i class="el-icon-copy-document" />
      </span>,
      <span
        class="drawing-item-delete"
        title="删除"
        onClick={(event) => {
          onDeleteItem(index,list);
          event.stopPropagation();
        }}
      >
        <i class="el-icon-delete" />
      </span>,
    ];
  },
};
const layouts = {
  colFormItem(h: any, currentItem: any, index: any, list: any) {
    const { onActiveItem,onDeleteItem,onCopyItem } = (this as any).$attrs;
    console.log((this as any).$attrs);
    // console.log();
    const config = currentItem.__config__;
    const child = renderChildren.apply(this,(arguments as any));
    let className =
      (this as any).activeId === config.formId
        ? "drawing-item active-from-item"
        : "drawing-item";
    if ((this as any).formConf.unFocusedComponentBorder) className += " unfocus-bordered";
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
    if (config.showLabel === false) labelWidth = "0";
    return (
      <el-col
        span={config.span}
        class={className}
        onclick={(event: Event) => {
          onActiveItem(currentItem);
          event.stopPropagation();
        }}
      >
        <el-form-item
          label-width={labelWidth}
          label={config.showLabel ? config.label : ""}
          required={config.required}
        >
          <render key={config.renderKey} conf={currentItem}>
            {child}
          </render>
        </el-form-item>
        {components.itemBtns.apply(this, (arguments as any))}
      </el-col>
    );
  },
  rowFormItem(h: any, currentItem: any, index: any, list: any) {
    const { onActiveItem,onDeleteItem,onCopyItem } = (this as any).$attrs;
    const config = currentItem.__config__;
    const className =
      (this as any).activeId === config.formId
        ? "drawing-row-item active-from-item"
        : "drawing-row-item";
    let child = renderChildren.apply(this,(arguments as any));
    if (currentItem.type === "flex") {
      child = (
        <el-row
          type={currentItem.type}
          justify={currentItem.justify}
          align={currentItem.align}
        >
          {child}
        </el-row>
      );
    }
    if (config.isCard) {
      return (
        <el-col span={config.span}>
          <el-card onclick={(event: Event) => {
            // alert(12);
            onActiveItem(currentItem);
            event.stopPropagation();
          }} class={className}>
            <span class="component-name">{config.componentName}</span>
            <draggable
              list={config.children || []}
              animation={340}
              group="componentsGroup"
              class="drag-wrapper"
            >
              {child}
            </draggable>
            {components.itemBtns.apply(this, (arguments as any))}
          </el-card>
        </el-col>
      );
    }
    return (
      <el-col span={config.span}>
        <el-row
          gutter={config.gutter}
          class={className}
          onclick={(event: Event) => {
            // alert(12);
            onActiveItem(currentItem);
            event.stopPropagation();
          }}
        >
          <span class="component-name">{config.componentName}</span>
          <draggable
            list={config.children || []}
            animation={340}
            group="componentsGroup"
            class="drag-wrapper"
          >
            {child}
          </draggable>
          {components.itemBtns.apply(this, (arguments as any))}
        </el-row>
      </el-col>
    );
  },
  raw(h: any, currentItem: any, index: any, list: any) {
    const config = currentItem.__config__;
    const child = renderChildren.apply(this, (arguments as any));
    return (
      <render
        key={config.renderKey}
        conf={currentItem}
        onInput={(event: Event) => {
          config.defaultValue = event;
        }}
      >
        {child}
      </render>
    );
  },
}

function renderChildren(h: any, currentItem: any, index: any, list: any) {
  const config = currentItem.__config__;
  if (!Array.isArray(config.children)) return null;
  return config.children.map((el: any, i: number) => {
    const layout = (layouts as any)[el.__config__.layout] as any;
    if (layout) {
      // @ts-ignore
      return layout.call(this, h, el, i, config.children);
    }
    // @ts-ignore
    return layoutIsNotFound.call(this);
  });
}
function layoutIsNotFound() {
  // @ts-ignore
  throw new Error(`没有与${(this as any).currentItem.__config__.layout}匹配的layout`);
}
export default {
  components: {
    render,
    draggable,
  },
  props: ["currentItem","index","drawingList","activeId","formConf"],
  emits: ['update:modelValue'],
  render() {
    const layout: any = (layouts as any)[(this as any).currentItem.__config__.layout];
    if (layout) {
      return layout.call(this,h,(this as any).currentItem,(this as any).index,(this as any).drawingList);
    }
    return layoutIsNotFound.call(this);
  },
};
