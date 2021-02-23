---
title: 欢迎使用 LMUI
layout: lmui-webapp
thanks:
  - ['MDUI', 'https://www.mdui.org/design/layout/structure.html#app-bar-figure-caption-6']
  - ['MUI-CSS', 'https://muicss.com']
---

LMUI 是一个为 Jekyll 打造的轻量级 Material Design 模板界面。

## 宗旨

* 实现效果尽可能使用 CSS 和更少的元素嵌套
* 实现效果尽可能少用 JavaScript

## 兼容性

* CSS 3（使用 SCSS 生成）
* ECMAScript 5.1
* Primer（Github Pages 默认 Markdown 主题）

## 各框架效果差异

|                                  | LMUI       | MUI-CSS    |
| -------------------------------- | ---------- | ---------- |
| 标题栏示例DOM数量                | 3 ~ 4      | 11         |
| 导航栏示例DOM数量[^nav-dom-calc] | 7+3a+7b+3c | 9+5a+9b+3c |
| 标题栏中使用带图片的左侧边栏按钮 | 是         | 否         |
| 标题栏中的其他功能按钮           | 暂未实现   | 是         |
| 在禁用 JavaScript 时收展侧边栏   | 是         | 否         |
| 侧边栏宽度                       | 最大320px  | 200px      |
| 侧边栏展开动画                   | 是         | 是         |
| 侧边栏收起动画                   | 是         | 否         |
| 展开侧边栏后，下层界面变暗       | 是         | 是         |
| 侧边栏收展时，下层界面有过渡动画 | 是         | 否         |

[^nav-dom-calc]: 固定元素数 + 一层元素数a + 可展开元素数b + 二层元素数c



## 页面和Markdown文章高级选项

通过在 Markdown 文件中放入以下 YAML 头即可打破默认布局。

### icon

参数用法等同于 HTML img 元素中的 src 属性。

当出现此选项时，会给左上角的菜单按钮添加图标。

### feature

#### global-custom

如果检测到这个标签，那么将会允许以纯 HTML 模式撰写文章。

以瑞兽谷在线工具为例，此选项用于需要大量 JavaScript 交互的场景。

#### immersive

如果检测到这个标签，那么标题栏会变为透明背景，并且文章的顶部边距为零。

以瑞兽谷首页为例，此选项用于需要放置主题头图的场景。

## 参考

以下是 LMUI 在设计时所参考的内容，包含对部分代码的完全引用。

* MDUI：https://www.mdui.org/design/layout/structure.html#app-bar-figure-caption-6
* MUI-CSS：https://muicss.com/
