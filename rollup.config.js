// import { rollup } from "rollup";
// import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
// import dts from "rollup-plugin-dts";
// import { generateDtsBundle } from "dts-bundle-generator";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/cjs/index.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/esm/index.js",
      format: "esm",
      sourcemap: true,
      // plugins: [terser(), typescript()],
    },
  ],
  plugins: [
    // nodeResolve(),
    commonjs(),
    typescript({
      declaration: false,
      // declarationDir: "types",
    }),
    terser(),
    // {
    //   // Include the lib directory in the bundle
    //   resolve: {
    //     extensions: [".ts", ".js"],
    //     modules: ["src"],
    //   },
    // },
    // dts({
    //   dtsBundle: true,
    // }),
    // generateDtsBundle(
    //   [
    //     {
    //       filePath: "src/index.ts",
    //       output: { noBanner: true },
    //       outFile: "dist/types.d.ts",
    //     },
    //   ]
    //   // output: "dist/types.d.ts",
    // ),
  ],

  // This will export the types
  // dts: {
  //   output: "dist/index.d.ts",
  // },
};
