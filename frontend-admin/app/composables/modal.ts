import type {Component} from "vue";
import type {ComponentProps} from "vue-component-type-helpers";

export const useModal = <T extends Component>(component: T, props?: ComponentProps<T>) =>{
  const modal = useOverlay().create(component, {props, destroyOnClose: true});
  return modal.open(props);
}
