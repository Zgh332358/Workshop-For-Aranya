# Workshop-For-Aranya

> 一个为 [Project Airi](https://airi.moeru.ai) 量身打造的赛博朋克风新手引导面板，让第一次接触 Airi 的朋友在五个步骤里完成从「API 配置」到「身躯降临」的全流程上手。

**线上访问：** https://zgh332358.github.io/Workshop-For-Aranya/

---

## 1. 它解决什么问题

Project Airi 是一个本地化、可定制的 VTuber / AI 伴侣方案，但配置链路涉及 API 服务、人格卡、TTS、记忆库、Live2D / VRM 五个环节，对新用户而言**操作面太广、上下文太散**：

- 文档里的每一项都正确，但合在一起没人告诉你"先做哪个"
- 设置页右侧每打开一项菜单，新人就要回到文档里查"这个字段是干嘛的"
- 没完成一项就配置下一项，结果常常是配到第三步发现第一步漏了

**Workshop-For-Aranya 把这五步装进一个左右分屏的引导界面**：左侧是带定位指示和勾选清单的五节点导览，右侧直接嵌入真实的 `airi.moeru.ai/settings`。看一步、做一步、勾一步，不用切窗口。

---

## 2. 目标用户

| 角色 | 痛点 | 本项目提供的价值 |
| --- | --- | --- |
| **第一次接触 Airi 的新人** | "我不知道从哪开始" | 一条线性五步路径，每步都有定位提示 |
| **教学者 / 工作坊主持人** | "得反复演示同样几步" | 一个可分发链接，学员自助跟做 |
| **Airi 上游贡献者** | "想看新人到底卡在哪" | 可以观察学员在哪一节点反复停留 |

---

## 3. 核心功能

- **五节点引导（NODE 1–5）**：灵魂注入 (API) → 人格重塑 (Character) → 声音唤醒 (TTS) → 记忆编织 (Memory) → 身躯降临 (Live2D / VRM)
- **节点级勾选清单**：每个节点 3 项 checklist，全选 15 项即代表配置完整，进度条实时同步
- **嵌入式设置页**：右侧 iframe 直接载入 `airi.moeru.ai/settings`，看左练右
- **新标签页兜底入口**：当 iframe 因第三方 Cookie / frame 限制无法显示时，黄色 `OPEN IN NEW TAB` 按钮一键直跳
- **节点内交互模拟**：API 密钥校验、角色卡拖拽预览、记忆颗粒度滑块——帮助理解每个配置项背后的概念

---

## 4. 快速上手

### 给学员

1. 打开 https://zgh332358.github.io/Workshop-For-Aranya/
2. 从左侧 NODE 1 开始，按定位提示在右侧 iframe 里完成对应配置
3. 每完成一步勾选 checklist；进度条 100% 即配置完成

### 给主持人 / 二次分发者

```bash
git clone git@github.com:Zgh332358/Workshop-For-Aranya.git
cd Workshop-For-Aranya
npx serve .          # 任意静态服务器即可
```

需要修改文案、节点顺序、品牌色，全部在 `index.html` 里搜索对应节点 ID 后直接编辑。

---

## 5. 项目结构

```
Workshop-For-Aranya/
├── index.html      # 单页结构：左侧引导 / 右侧 iframe
├── style.css       # 赛博面板样式（cyber-panel clip-path、滚动条）
├── console.js      # 节点切换、清单进度、模拟器交互
├── assets/         # Airi 角色立绘
└── README.md
```

零构建、纯静态，依赖三个 CDN：Tailwind、Google Fonts (Orbitron / JetBrains Mono)、Lucide Icons。

---

## 6. 路线图

| 优先级 | 项目 | 说明 |
| --- | --- | --- |
| P0 | 移动端布局 | 当前 1024px 以下会改为纵向滚动，但右侧 iframe 高度仍偏挤 |
| P1 | i18n | 中 / 英 / 日 三语切换，配合 Airi 国际社群 |
| P1 | 进度持久化 | 用 `localStorage` 记住已勾选项，刷新不丢 |
| P2 | 完成度证书 | 全部 15 项勾选后生成可分享的截图卡 |
| P2 | 节点 6: 部署 / 打包 | 加一节"如何把配置好的 Airi 跑起来" |

---

## 7. 已知限制

- **嵌入加载概率失败**：`airi.moeru.ai/settings` 是单页应用且需要登录态，浏览器把它视为第三方上下文时会拦截 Cookie，导致 iframe 卡在加载。**这是预期行为**——为此提供了"在新标签页打开"的兜底按钮，体验依旧完整。
- **节点内模拟器是教学占位**：API 测试、卡片解析等都是前端模拟，不会真的调用 Airi 后端。真正的配置请在右侧 iframe / 新标签页中完成。

---

## 8. 致谢

- 上游产品：[Project Airi (airi.moeru.ai)](https://airi.moeru.ai)
- 角色立绘：Airi VTuber illustration
- 项目命名献给 **Aranya**——这套引导最初就是为你写的。

---

## 9. License

MIT — 自由 fork、改名、二次分发，给自己社群里的新人也搭一个属于你们的 Workshop。
