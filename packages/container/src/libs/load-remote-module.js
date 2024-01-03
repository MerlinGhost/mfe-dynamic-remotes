"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRemoteModule = exports.setRemoteDefinitions = exports.setRemoteUrlResolver = void 0;
let resolveRemoteUrl;
function setRemoteUrlResolver(_resolveRemoteUrl) {
  resolveRemoteUrl = _resolveRemoteUrl;
}
exports.setRemoteUrlResolver = setRemoteUrlResolver;
let remoteUrlDefinitions;
function setRemoteDefinitions(definitions) {
  remoteUrlDefinitions = definitions;
}
exports.setRemoteDefinitions = setRemoteDefinitions;
let remoteModuleMap = new Map();
let remoteContainerMap = new Map();
async function loadRemoteModule(remoteName, moduleName) {
  const remoteModuleKey = `${remoteName}:${moduleName}`;
  console.log('[loadRemoteModule][remoteModuleMap]', remoteModuleMap);
  if (remoteModuleMap.has(remoteModuleKey)) {
    return remoteModuleMap.get(remoteModuleKey);
  }
  const container = remoteContainerMap.has(remoteName)
    ? remoteContainerMap.get(remoteName)
    : await loadRemoteContainer(remoteName);
  console.log('[loadRemoteModule][container]', container);
  const factory = await container.get(moduleName);
  const Module = factory();
  remoteModuleMap.set(remoteModuleKey, Module);
  return Module;
}
exports.loadRemoteModule = loadRemoteModule;
function loadModule(url) {
  return Promise.resolve(`${url}`).then(s => __importStar(require(s))); //.then(res => console.log(res));
}
let initialSharingScopeCreated = false;
async function loadRemoteContainer(remoteName) {
  if (!resolveRemoteUrl && !remoteUrlDefinitions) {
    throw new Error('Call setRemoteDefinitions or setRemoteUrlResolver to allow Dynamic Federation to find the remote apps correctly.');
  }
  if (!initialSharingScopeCreated) {
    initialSharingScopeCreated = true;
    await __webpack_init_sharing__('default');
  }
  const remoteUrl = remoteUrlDefinitions
    ? remoteUrlDefinitions[remoteName]
    : await resolveRemoteUrl(remoteName);
  const containerUrl = `${remoteUrl}${remoteUrl.endsWith('/') ? '' : '/'}remoteEntry.js`;
  const container = await loadModule(containerUrl);
  await container?.init(__webpack_share_scopes__.default);
  remoteContainerMap.set(remoteName, container);
  return container;
}
