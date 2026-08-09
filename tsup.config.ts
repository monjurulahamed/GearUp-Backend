import {defineConfig} from "tsup"
export default defineConfig ({
    entry:['sec/erver.ts'],
    format:["esm"],
    target: ["ES2020"],
    platform: "node",
    bundle:true,
    outDir:"dist",
    banner:{
        js:/* js */ `
        import {createRequire} from "module";
        const require = createRequire(import.mata.url);
        `
    }

})