# 顺丰签到 Loon 插件

利用 Loon 拦截顺丰 App 流量，在每次打开会员/积分页面时抓取实时 cookie，自动完成**签到 + 全部每日任务 + 领取奖励**，绕开 cookie 20 分钟过期的问题。

## 使用方法

1. Loon → 配置 → 插件 → 添加插件，导入：
   `https://raw.githubusercontent.com/panjin9395/sf-checkin-loon/main/sf.plugin`
2. 确保 Loon 的 MITM 已开启并信任证书，hostname 含 `mcs-mimp-web.sf-express.com`
3. 打开顺丰 App，进入「会员 / 积分 / 签到」页面，脚本自动触发
4. 结果通过 Loon 通知推送，格式：`签到状态 + 任务 X/Y + 领奖结果 + 完成的任务名`

## 功能

每次触发自动执行：
1. **签到** — 领每日签到积分（连签累计）
2. **查询每日任务** — 拉取当天全部任务
3. **完成任务** — 逐个调 `finishTask`（间隔 1.5 秒，模拟真人）
4. **领取奖励** — 调 `fetchTasksReward` 领回任务积分

实测 17/17 任务全部可自动完成（含「去微博」「打开百度地图」等）。

## 原理

- `signature` = `md5("wwesldfs29aniversaryvdld29&timestamp={ts}&sysCode=MCS-MIMP-CORE")`
- `sw8` = 复刻 App 内 H5 的链路追踪头（base64 + UUID 拼接）
- 任务列表字段：`obj.taskTitleLevels`，每项含 `taskCode`，`buttonContent="去完成"` 表示未做
- 10 分钟限流（`$persistentStore`），防止 App 内翻页反复触发刷屏

## 文件

- `sf_checkin.js` — 主脚本（含内联 MD5 实现 + 签到 + 任务）
- `sf.plugin` — Loon 插件配置
