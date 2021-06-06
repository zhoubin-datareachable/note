module.exports = {
  base: "/docs/",
  title: '我的笔记',
  themeConfig: {
    nav: [{
        text: '前端',
        items: [{
            text: 'CSS',
            link: '/css/'
          },
          {
            text: 'JavaScrip',
            link: '/javascrip/'
          },
          {
            text: 'TypeScrip',
            link: '/typescrip/'
          },
          {
            text: 'React',
            link: '/react/'
          },
          {
            text: 'Hook',
            link: '/hook/'
          },
          {
            text: 'Vue',
            link: '/vue/'
          },
          {
            text: 'Vue3',
            link: '/vue3/'
          },
          {
            text: 'webpack',
            link: '/webpack/'
          }
        ]
      }, {
        text: '后端',
        items: [{
            text: 'Java',
            link: '/java/'
          },
          {
            text: 'Mysql',
            link: '/mysql/'
          },
          {
            text: 'Node',
            link: '/node/'
          },
          {
            text: 'J2EE',
            link: '/j2ee/'
          },
          {
            text: 'SSM',
            link: '/ssm/'
          },
        ]
      },
      {
        text: '随记',
        link: '/efficiency/1.常用网站'
      },
      {
        text: '收藏',
        link: '/collection/1.立即执行函数'
      }
    ],
    sidebar: {
      '/efficiency/': [
        '1.常用网站',
      ],
      '/vue/': [
        '',
        'comp',
        'router',
        'vuex'
      ],
      '/javascrip/': [
        '',
        '异步函数',
        '集合引用类型',
        '对象_类',
        '函数',
        'canvas',
        'dom',
        'bom',
        '模块化规范',
        '手写常用函数'
      ],
      '/typescrip/': [
        '',
        '基础',
        '进阶',
      ],
      '/react/': [
        '',
        'router',
        'redux',
        'ext'
      ],
      '/hook/': [
        ''
      ],
      '/node/': [
        '',
        'express',
        'mongodb',
        'mongoose'
      ],
      '/css/': [
        '',
        '元素权重',
        '盒子模型',
        '背景处理',
        '浮动布局',
        '定位布局',
        '弹性布局',
        '媒体查询',
        '响应式布局',
        '动画',
        '文本控制',
      ],
      '/vue3/': [
        '',
        '常用组合API',
        '其他组合API',
        '手写组合API',
        '新组件'
      ],
      '/webpack/': [
        '',
        '开发环境配置',
        '生产环境配置',
        '优化环境配置'
      ],
      '/mysql/': [
        '',
        '提高'
      ],
      '/java/': [
        '',
        'File类',
        'IO流',
        '集合',
        'JDBC',
        '反射和注解',
        '继承',
        '抽象类',
        '多态',
        '接口',
        'final关键字',
        '内部类',
        '权限修饰符',
        '网络编程',
        '异常',
        '引用类型',
        '多线程'
      ],
      '/j2ee/': [
        '',
        '过滤器',
        '监听器',
        'jsp'
      ],
      '/ssm/': [
        '',
        'spring',
        'springmvc',
        'ssm'
      ]
    }
  }
}