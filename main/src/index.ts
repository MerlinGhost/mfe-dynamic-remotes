import("./bootstrap");
import { setRemoteDefinitions } from "./Libs/load-remote-module";
fetch('./module-federation.manifest.json')
.then((res) => res.json ())
.then((definitions) => setRemoteDefinitions(definitions))
.then(() => import('./bootstrap').catch((err) => console.error(err)));
