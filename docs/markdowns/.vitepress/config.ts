import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    ssr: {
      noExternal: ['devextreme']
    }
  },
  title: 'vue labs',
  description: 'a docs site for vue-labs repository',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/jett.png',

    sidebar: [
      {
        text: 'Devextreme Labs',
        items: [
          { text: 'Made for ❤️ 坑坑', link: 'home' },
          { text: '安装配置', link: 'install' },
          {
            text: 'Form',
            items: [
              { text: '代理组件', link: '/form/proxyComponents' },
              { text: 'form-container', link: '/form/formContainer' },
              { text: 'form-popup-container', link: '/form/formPopupContainer' },
              { text: 'useForm', link: '/form/useForm' },
              { text: '最佳实践', link: '/form/bestPractice' },
              { text: 'RoadMap', link: '/form/roadmap' }
            ]
          }
        ]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/gutsyy/vue-labs' }]
  }
})
