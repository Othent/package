import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";

// inputs to process
const input = "src/index.ts"

// outputs to generate
const output = [
    {
        file: "dist/index.js",
        format: "esm",
        sourcemap: true,
    },
]

// plugins to use when processing
const plugins = [
    nodeResolve({
        browser: true,
        preferBuiltins: false,
    }),
    commonjs(),
    typescript({ declaration: false, }),
    json(),
    terser(),
]

// external modules (not to bundle)
const external = [
    "axios",
    "@auth0/auth0-spa-js",
    "jwt-decode",
    "crypto-hash",
    // "jwk-to-pem",
    // "jsrsasign",
    "crypto-js",
    // "buffer",
    "debug",
    "supports-color",
]

export default {
    input,
    output,
    plugins,
    external,
};
