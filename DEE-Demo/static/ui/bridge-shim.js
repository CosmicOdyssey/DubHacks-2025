// Forge Bridge shim - exposes @forge/bridge as window.Forge
// This allows non-bundled code to use Forge Bridge API
import { invoke, getContext, requestJira } from '@forge/bridge';

window.Forge = { invoke, getContext, requestJira };

console.log('Forge Bridge shim loaded successfully');
