module.exports = {
    theme: 'reco',
    base: '/blog/',
    title: 'L\'s Blog',
    head:[
        ['link',{rel:'icon',href:'/favicon.ico'}]
    ],
    description: '日常折腾笔记',
    themeConfig: {
        type: 'blog',
        authorAvatar: '/ava.png',
        repo: 'https://github.com/edgelone',
        repoLabel: 'My GitHub',
        nav: [
            {
                text: 'Home', link: '/'
            }
        ],
        // sidebar: [
        //     ['/', '首页'],
        //     ['/blog/knowledge.md','知识梳理'],
        //     ['/blog/team_city.md','TeamCity使用入门']
        // ],
        blogConfig: {
            category: {
              location: 2,     // 在导航栏菜单中所占的位置，默认2
              text: 'Category' // 默认文案 “分类”
            },
            tag: {
              location: 3,     // 在导航栏菜单中所占的位置，默认3
              text: 'Tag'      // 默认文案 “标签”
            }
          },
          friendLink: [
            {
                title: 'vuepress-theme-reco',
                desc: 'A simple and beautiful vuepress Blog & Doc theme.',
                logo: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
                link: 'https://vuepress-theme-reco.recoluan.com'
            },
            {
                title: '酷壳-CollShell',
                desc: '陈皓大大的博客',
                logo: "https://coolshell.cn/coolshell_logo.png",
                link: 'https://coolshell.cn'

            }
          ]
    }
}