import { ActionService } from "./action.service";
import { GlobalStateService } from "./global-state.service";

export { Action } from './decorators/action.decorator'
export { Effect } from './decorators/effect.decorator'
export { Reducer } from './decorators/reducer.decorator'
export { StoreAware, StoreAwareOptions, StoreAwareComponent } from './decorators/store-aware.decorator'
export { StoreDependencyService, mockStoreDependencyService } from './store-dependency.service';
export { StoreService } from './store.service';
export { EffectUtil } from './util/effect.util';
export { ActionUtil } from './util/action.util';
export { EffectStatus } from './models/effect-status.model'

const enableDebugState = GlobalStateService.enableDebugInfo;
const disableDebugState = GlobalStateService.disableDebugInfo;
const enableDebugActions = ActionService.enableDebugInfo;
const disableDebugActions = ActionService.disableDebugInfo;

export const stateManagementTools = {
  enableDebugState,
  enableDebugActions,
  disableDebugActions,
  disableDebugState,
};
