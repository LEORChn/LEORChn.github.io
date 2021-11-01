---
title: Sandboxie 安装指南
tags: sandboxie install
update: 2021-11-2
---

## 指南测试环境

* Windows 7 x64 SP 1 --- VirtualBox v6.1.18 r142142
* Sandboxie Classic x64 v5.51.4
* Sandboxie Plus x64 v0.9.4

## 组件依赖

可以点击表格中的官方下载，也可以去页面底部使用站长提供的整合下载。

|                                 | Classic | Plus | 下载                                                         |
| ------------------------------- | ------- | ---- | ------------------------------------------------------------ |
| Windows6.1-KB3033929-x64.msu    | 是      | 是   | [46148](https://www.microsoft.com/zh-cn/download/details.aspx?id=46148) |
| Visual C++ Redistributable 2015 | 否      | 是   | [48145](https://www.microsoft.com/zh-cn/download/details.aspx?id=48145) |

* 如果 Sandboxie 在依赖组件之前就已经安装，需要重新打开 Sandboxie 安装包并执行覆盖安装。
  但通常情况来说，不建议这样做。
* 补丁 KB3033929 在安装后需要重启。解决了 Sandboxie 的驱动程序数字签名问题。
* VC++2015 如果是 x64 则建议 x86与x64 两种安装包一同安装。

## 首次启动设置

Plus 版本首次启动时可能为英语界面，此时需要依次点击 `Option` > `Global Settings` > `UI Language: Auto Detection` > `简体中文` > `OK`，然后在任务栏右下角托盘中右击出菜单，点击 Exit 并重新启动就可以了。

## 文件校验

|                                   | CRC32    |
| --------------------------------- | -------- |
| Sandboxie-Classic-x64-v5.51.4.exe | F85F3165 |
| Sandboxie-Plus-x64-v0.9.4.exe     | FE87AE7E |
| vc_redist.x64.v14.0.23026.exe     | CA496CA3 |
| vc_redist.x86.v14.0.23026.exe     | 9D6AE773 |
| Windows6.1-KB3033929-x64.msu      | 51C200C1 |
| 依赖组件打包下载                  | 7358994E |

## 参考和下载

* 官方最新版下载：<https://github.com/sandboxie-plus/Sandboxie/releases>
* 全部整合下载地址（Win 7 x64）：<https://github.com/LEORChn/cdn/releases/tag/Sandboxie>

