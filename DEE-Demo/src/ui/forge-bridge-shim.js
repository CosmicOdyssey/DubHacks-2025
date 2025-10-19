// Forge Bridge shim for Custom UI
// Bundle this file into static/ui/forge-bridge-shim.js
import { invoke, requestJira, view } from '@forge/bridge';

window.Forge = {
  invoke,
  requestJira,
  view,
  getContext: () => view.getContext(), // convenience alias
};

console.log('Forge Bridge shim loaded successfully');
