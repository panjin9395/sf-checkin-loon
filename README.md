# 顺丰签到 Loon 插件

利用 Loon 拦截顺丰 App 流量，在每次打开会员/积分页面时抓取实时 cookie 并自动签到，绕开 cookie 20 分钟过期的问题。

## 使用方法

1. Loon → 配置 → 插件 → 添加插件，导入：
   `https://raw.githubusercontent.com/panjin9395/sf-checkin-loon/main/sf.plugin`
2. 确保 Loon 的 MITM 已开启并信任证书，hostname 含 `mcs-mimp-web.sf-express.com`
3. 打开顺丰 App，进入「会员 / 积分 / 签到」页面，脚本自动触发签到
4. 签到结果通过 Loon 通知推送

## 原理

- `signature` = `md5("wwesldfs29aniversaryvdld29&timestamp={ts}&sysCode=MCS-MIMP-CORE")`
- `sw8` = 复刻 App 内 H5 的链路追踪头（base64 + UUID 拼接）
- 每天只签一次（`$persistentStore` 记录日期去重）

## 文件

- `sf_checkin.js` — 签到主脚本（含内联 MD5 实现）
- `sf.plugin` — Loon 插件配置
