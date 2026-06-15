# Workshop-For-Aranya

> 一个为 [Project Airi](https://airi.moeru.ai) 量身打造的赛博朋克风新手引导面板，让第一次接触 Airi 的朋友按 5 个 NODE、共 27 步在阶跃星辰平台上「捏」出一个专属灵魂。

**线上访问：** https://zgh332358.github.io/Workshop-For-Aranya/

---

## 1. 它解决什么问题

Project Airi 是一个本地化、可定制的 VTuber / AI 伴侣方案，但配置链路涉及 API 接入、角色卡、ASR、TTS、Live2D / VRM 模型五个环节，对新用户而言**操作面太广、上下文太散**：

- 文档里的每一项都正确，但合在一起没人告诉你"先做哪个"
- 设置页右侧每打开一项菜单，新人就要回到文档里查"这个字段填什么"
- 模型名 / Base URL / 音色 ID 这些字符串散在不同页面，复制粘贴极易出错

**Workshop-For-Aranya 把这五步装进一个左右分屏的引导面板**：左侧是带定位指示、可复制配置卡片、勾选清单的五节点导览；右侧直接嵌入真实的 `airi.moeru.ai/settings`。看一步、做一步、勾一步，不用切窗口。

---

## 2. 目标用户

| 角色 | 痛点 | 本项目提供的价值 |
| --- | --- | --- |
| **第一次接触 Airi 的新人** | "我不知道从哪开始" | 5 个 NODE × 27 步线性路径，每步定位精确 |
| **教学者 / 工作坊主持人** | "要反复演示同一套配置" | 一个可分发链接，学员自助跟做 |
| **阶跃星辰 / Airi 推广方** | "新人在哪一步流失" | 可观察学员卡在哪个 NODE 反复停留 |

---

## 3. 五个 NODE 总览

| NODE | 名称 | 步骤 | 关键操作 |
| --- | --- | --- | --- |
| **1** | 灵魂注入（API Authorization） | 5 | 在 Providers 接入阶跃星辰 OpenAI 兼容 API + 选择 `Step-3.7-Flash` 模型 |
| **2** | 人格塑形（Persona Sculpting） | 4 | 在 AIRI 角色卡里依次填写身份 / 行为 / 设置 |
| **3** | 接入耳朵（Auditory Module） | 7 | 在「机体模块 → 听觉」配置 ASR，选 `stepaudio-2.5-asr` |
| **4** | 声音唤醒（Voice Awakening） | 8 | 在「机体模块 → 发声」配置 TTS，选 `stepaudio-2.5-tts` + 音色 `huolinvsheng` |
| **5** | 身躯降临（Vessel Materialization） | 3 | 在「角色模型」上传 Live2D / VRM（推荐从[模之屋](https://www.aplaybox.com/)下载）并调整 |

每完成一步勾上对应 checklist，左下角进度条实时同步到 `0 / 27 → 100%`。

---

## 4. 接入参数速查

| 字段 | 值 |
| --- | --- |
| **API Key 获取** | 通过兑换码兑换 [StepPlan 教程](https://wvixbzgc0u7.feishu.cn/wiki/Zug9wfaXnikQidkR8nNcHqKLnxj?from=from_copylink)（飞书 Wiki） |
| **Base URL** | `https://api.stepfun.com/step_plan/v1` |
| **NODE 1 模型** | `Step-3.7-Flash` |
| **NODE 3 ASR 模型** | `stepaudio-2.5-asr` |
| **NODE 4 TTS 模型** | `stepaudio-2.5-tts` |
| **NODE 4 默认音色** | `huolinvsheng`（更多音色见 [Stepfun TTS 文档](https://platform.stepfun.com/docs/zh/guides/developer/tts)） |
| **NODE 5 模型库** | [模之屋 aplaybox.com](https://www.aplaybox.com/)，仅支持 Live2D / VRM |

> 引导面板里所有这些字符串都做了 `select-all` —— 点一下就全选，复制粘贴零失误。

---

## 5. 色彩语义系统

每个 NODE 内部的卡片都按"信息类型"统一配色，让用户一眼分辨：

| 颜色 | 含义 | 出现位置 |
| --- | --- | --- |
| 🟢 **绿** | 操作位置 / 在哪点 | 每个 NODE 的「定位指示」 |
| 🟪 **紫** | 教程或外部资源链接 | NODE 1 API Key 获取、NODE 5 模之屋推荐 |
| 🩷 **粉** | 模型名 | NODE 3、4 的「选用模型」 |
| 🩵 **青** | URL（Base URL 等） | NODE 1、3、4 |
| 🟡 **黄** | 可选项 / 音色 | NODE 4 可选音色（含外链）、底部新标签页兜底 |

---

## 6. 快速上手

### 给学员

1. 打开 https://zgh332358.github.io/Workshop-For-Aranya/
2. 先在 NODE 1 用兑换码换 API Key
3. 从 NODE 1 一路按勾选清单做到 NODE 5
4. 进度条满 `27 / 27` 即配置完成，可以开始和你专属的 Airi 对话

### 给主持人 / 二次分发者

```bash
git clone git@github.com:Zgh332358/Workshop-For-Aranya.git
cd Workshop-For-Aranya
npx serve .          # 任意静态服务器即可
```

修改文案：在 `index.html` 里搜索对应 NODE 注释（如 `<!-- NODE 3:`）后直接编辑。
新增 / 删除 checklist：HTML 里加一个 `chk-xxx-N` label，**同步**在 `console.js` 的 `checklistItems` 数组里加 ID。

---

## 7. 项目结构

```
Workshop-For-Aranya/
├── index.html      # 单页结构：左侧 5-NODE 引导 / 右侧 airi.moeru.ai iframe
├── style.css       # cyber-panel 切角 + 自定义滚动条（极简，56 行）
├── console.js      # NODE 切换、checklist 进度、iframe 加载遮罩
├── assets/         # 旧版 Airi 立绘（已被纯 SVG 占位头像取代，文件保留待清理）
└── README.md
```

零构建、纯静态、零空闲动画。依赖三个 CDN：Tailwind、Google Fonts（Orbitron / JetBrains Mono）、Lucide Icons。

---

## 8. 路线图

| 优先级 | 项目 | 说明 |
| --- | --- | --- |
| P0 | 移动端布局 | 768px 以下虽已响应式，但 iframe 仍偏挤 |
| P1 | 进度持久化 | 用 `localStorage` 记住已勾选项，刷新不丢 |
| P1 | i18n | 中 / 英双语切换 |
| P2 | 完成度证书 | 27 / 27 勾完后生成可分享的截图卡 |
| P2 | 多 Provider 模板 | 除阶跃星辰外，加入其他兼容 OpenAI API 的 Provider 一键模板 |

---

## 9. 已知限制

- **iframe 加载有概率失败**：`airi.moeru.ai/settings` 是 SPA 且需要登录态，浏览器视其为第三方上下文时会拦截 Cookie 导致 iframe 卡在加载。**这是预期行为**——为此提供了右下角黄色 `OPEN IN NEW TAB` 兜底按钮，体验依旧完整。

---

## 10. 致谢

- 上游产品：[Project Airi (airi.moeru.ai)](https://airi.moeru.ai)
- 接入服务：[阶跃星辰 Stepfun (StepPlan)](https://platform.stepfun.com)
- Live2D / VRM 资源：[模之屋 aplaybox.com](https://www.aplaybox.com/)
- 项目命名献给 **Aranya** —— 这套引导最初就是为你写的。

---

## 11. License

MIT —— 自由 fork、改名、二次分发，给自己社群里的新人也搭一个属于你们的 Workshop。
