import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import createAutoImport from './auto-import'
import createComponents from './components'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'

import UnoCSS from 'unocss/vite'

export default function createVitePlugins(viteEnv, isBuild = false) {
    const vitePlugins = [vue(),UnoCSS(),vueJsx({})]
    vitePlugins.push(createAutoImport())
    vitePlugins.push(createComponents())
	vitePlugins.push(createSetupExtend())
    vitePlugins.push(createSvgIcon(isBuild))
	isBuild && vitePlugins.push(...createCompression(viteEnv))
    return vitePlugins
}
