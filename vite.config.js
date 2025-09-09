import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const isGh = process.env.VITE_TARGET === 'gh'

export default defineConfig({
  plugins: [react()],
  base: isGh ? '/React_Task_Spa/' : '/',
})
