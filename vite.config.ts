import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@headlessui/react',
        '@heroicons/react',
        '@hookform/resolvers',
        '@radix-ui/react-alert-dialog',
        '@radix-ui/react-checkbox',
        '@radix-ui/react-collapsible',
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-label',
        '@radix-ui/react-popover',
        '@radix-ui/react-radio-group',
        '@radix-ui/react-select',
        '@radix-ui/react-slot',
        '@radix-ui/react-tabs',
        '@radix-ui/react-tooltip',
        '@tanstack/react-table',
        '@tanstack/react-virtual',
        '@uiw/react-md-editor',
        'class-variance-authority',
        'clsx',
        'date-fns',
        'katex',
        'lucide-react',
        'react-day-picker',
        'react-hook-form',
        'react-markdown',
        'rehype-katex',
        'remark-gfm',
        'remark-math',
        'tailwind-merge',
        'zod',
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
})
