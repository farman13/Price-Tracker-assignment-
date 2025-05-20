import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths';
import viteAuditLog from 'vite-auditlog';
import babelMacros from 'vite-plugin-babel-macros';

export default defineConfig({
    // depending on your application, base can also be "/"
    plugins: [
        babelMacros(),
        {
            name: 'treat-js-files-as-jsx',
            async transform(code, id) {
                if (!id.match(/src\/.*\.js$/)) return null;
                return transformWithEsbuild(code, id, {
                    loader: 'js',
                    jsx: 'automatic',
                });
            },
        },
        react(),
        viteAuditLog(),
        viteTsconfigPaths()
    ],
    // define: {
    //     'process.env': {},
    // },
    server: {
        // this ensures that the browser opens upon server start
        open: true,
        // this sets a default port to 3000  
        port: 8000,
        host: "127.0.0.1",
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
            }
        },
    }
})