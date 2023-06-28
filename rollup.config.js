import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';

const sharedPlugins = [
  nodeResolve({
    browser: true,
    preferBuiltins: false
  }),
  commonjs(),
  nodePolyfills(),
  typescript({
    declaration: false,
  }),
  json(),
  terser(),
]

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      commonjs(),
      nodePolyfills(),
      typescript({
        declaration: false,
      }),
      terser(),
    ],
    external: ["axios", "@auth0/auth0-spa-js", "jwt-decode", "crypto-hash", "jwk-to-pem", "permawebjs/wallet", "jsrsasign"],
  },
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/othent.module.min.js",
        format: "esm",
        sourcemap: false,
      },
    ],
    plugins: sharedPlugins,
    external: [],
  }, 
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/othent.min.js",
        name: "othent",
        format: "iife",
        sourcemap: false,
      },
    ],
    plugins: sharedPlugins,
    external: [],
  }
];
