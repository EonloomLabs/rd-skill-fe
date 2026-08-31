rd-skills Website PRD

版本：1.0
产品类型：Open Source Developer Tool Website
核心目标：解释 rd-skills 是什么、为什么存在、如何工作，并把访问者转化为 GitHub 用户和实际安装用户。

1. 产品定义

产品名称

rd-skills

官方产品类别

Engineering Control Plane for AI Coding Agents

推荐一句话定位

Engineering control plane for AI coding agents.

扩展定位

Turn AI coding from code generation into bounded, evidence-driven engineering.

中文理解

让 AI Coding Agent 不只是“写代码”，而是在明确的任务边界、专业知识、验证证据和独立 Review 约束下完成工程工作。

这个网站不是：

Skill 文档仓库
README Viewer
AI Agent Marketplace
IDE
在线 Coding Agent
Skill 安装平台

这个网站是：

rd-skills 的产品官网
架构可视化入口
Skill Discovery 入口
Quickstart 入口
GitHub 项目的产品化表达

2. 网站核心问题

当前 GitHub 项目存在典型的基础设施项目传播问题：

第一，理解门槛高。

用户第一次看到：

Professional Skill
Foundation Skill
Domain Skill
Engineering Brief
Task Contract
Evidence Ledger
Review Boundary
Execution Level

很难立即理解这些概念之间的关系。

第二，价值容易被误解。

用户可能把 rd-skills 理解成：

一堆 Prompt
一堆 SKILL.md
Agent Skill Collection
Claude Code / Codex 的配置包

实际上它更接近：

Task Router
Engineering Knowledge System
Agent Role Model
Assurance Controller
Evidence-driven Completion Protocol

组成的 Engineering Control Plane。

第三，GitHub README 更适合已经产生兴趣的人，而不是第一次发现产品的人。

因此官网最重要的任务不是“展示全部信息”，而是：

在 30 秒内让用户理解：

为什么普通 Coding Agent 不够。

rd-skills 增加了什么。

一次任务如何经过 rd-skills。

为什么这会让 AI Coding 更可靠。

3. 产品目标

P0 目标

用户进入首页 10 秒内理解：

rd-skills 是 AI Coding Agent 的 Engineering Control Plane。

用户 30 秒内理解：

Request
→ Control
→ Professional Skill
→ Targeted Expertise
→ Task
→ Validation
→ Review
→ Evidence
→ Closure

用户 2 分钟内能够找到：

Architecture
Skills
Quickstart
GitHub

用户最终能够执行：

安装 rd-skills
运行 doctor
提交第一个 engineering-control-plane task。

4. 非目标

第一阶段不做：

用户账户
云端 Agent
在线代码执行
Skill 在线安装
Skill 上传
社区 Marketplace
Prompt Playground
项目管理 Dashboard
复杂 Backend
数据库

网站首先是 Documentation-driven Product Website。

5. 核心用户

用户 A：AI Native Developer

正在使用：

Codex
Claude Code
Copilot
Cline
OpenAI API Agent

痛点：

Coding Agent 可以写代码，但复杂任务容易：

误判 Scope
过度修改
错误抽象
遗漏 Failure Case
缺乏独立 Review
验证不足
Claim 与 Evidence 不一致

他们是最核心目标用户。

用户 B：Agent Infrastructure Engineer

正在构建：

Coding Agent
Agent Harness
Agent Workflow
Multi-Agent System
Agent Skill Framework

关注：

Context Engineering
Routing
Skill Selection
Agent Role Separation
Evidence
Evaluation
Assurance

这类用户会深入阅读 Architecture。

用户 C：Engineering Manager / Tech Lead

关注：

如何控制 AI Coding 的工程风险。

更关注：

Boundaries
Review
Validation
Evidence
Quality Gates
Traceability

用户 D：Skill Author

希望：

创建 Professional / Foundation / Domain Skill。

关注：

Skill architecture
Registry
Authoring Standard
Validation
Professionalism

6. 网站信息架构

推荐一级导航：

Product
Architecture
Skills
Quickstart
Docs
GitHub

右侧：

Search
Light / Dark
GitHub

建议路由：

/

产品首页

/architecture

完整系统架构

/skills

Skill Explorer

/skills/[slug]

单 Skill 页面

/quickstart

安装和第一个任务

/docs

不重新复制整个文档体系。

作为 Documentation Gateway，链接到：

Quickstart
Installation
Usage
Validation
Build Profiles
Skill Authoring
Marketplace Catalog
GitHub Docs

7. 首页结构

7.1 Navigation

左侧：

rd-skills

中间：

Product
Architecture
Skills
Quickstart
Docs

右侧：

GitHub

7.2 Hero

Eyebrow

ENGINEERING CONTROL PLANE FOR AI CODING AGENTS

Headline

Make coding agents work like an engineering system.

Subheadline

rd-skills routes every task to the right professional judgment, loads deep expertise only when needed, separates implementation from review, and requires current evidence before completion.

Primary CTA

Get Started

Secondary CTA

View on GitHub

下方增加一个 Terminal / Control Plane 动态展示：

User Request

“Add retry support to payment settlement without changing its public API.”

然后网站自动演示：

Classify
Direct / Analyzed

Primary Professional
backend-change-builder

Layer 3
idempotency-retry-design
transaction-consistency

Task Agent
Implement

Validation
Targeted tests

Review Agent
Independent review

Evidence
Fresh

Closure
Completed

7.3 Social Proof / System Facts

不要做传统 SaaS Logo Wall。

使用系统指标：

4
Agent Roles

3
Runtime Knowledge Layers

1
Primary Professional per Task

0–3
JIT Layer 3 Skills

5
Supported Host Families

数字必须从项目 Registry / Build Artifact 获取，而不是散落硬编码。

7.4 Problem Section

标题：

Coding is not engineering.

左右对照。

左侧：

Typical Coding Agent

Prompt
→ Search
→ Edit
→ Test
→ Done

潜在问题：

Unclear ownership
Scope drift
Premature abstraction
Insufficient validation
Self-review bias
Stale evidence
Unverified completion

右侧：

rd-skills

Intent
→ Decision Boundary
→ Professional Owner
→ Targeted Expertise
→ Bounded Implementation
→ Validation
→ Independent Review
→ Evidence-backed Closure

核心文案：

The problem is not whether an AI can write code.

The problem is whether it knows what should change, who owns the decision, what must remain invariant, when evidence is insufficient, and what actually proves the work is complete.

7.5 Core Model

标题：

Three systems. One engineering task.

展示三个大型交互 Card。

Decision Boundary

定义：

Path
Authority
Scope
Acceptance
Task Contract
Stop Conditions

Expertise Injection

定义：

Primary Professional
Foundation
Domain
Targeted References

Assurance Controller

定义：

Execution Level
Validation
Evidence Freshness
Review Boundary
Closure

三个模块汇聚到：

Engineering Task

7.6 How It Works

标题：

One request. A controlled engineering path.

使用横向 Timeline。

Step 01

Request

用户描述目标。

Step 02

Classify Once

选择：

Direct
Analyzed

Step 03

Authority

Direct Task Contract

或者：

Engineering Brief

Step 04

Professional Owner

每个 Task 正好一个 Primary Professional。

Step 05

JIT Expertise

根据实际 Evidence 加载最多必要的 Foundation / Domain / References。

Step 06

Execute + Validate

Task Agent 在边界内修改并执行 targeted validation。

Step 07

Independent Review

Review Agent 独立检查实际改动。

Step 08

Evidence-backed Closure

只有当前 Evidence 覆盖 Completion Claim 才允许 Completed。

7.7 Six-plane Architecture

标题：

A control plane, not another agent runtime.

使用六层纵向架构图：

Authority Plane

Core Contract
Direct Task Contract
Engineering Brief
Task Contract
Completion

Knowledge Plane

Control
Professional
Foundation
Domain
Targeted References

Role Plane

Main
Analysis
Task
Review

Assurance Plane

Execution Level
Validation
Evidence Ledger
Review Boundary
Scoped Freshness

Host Adapter Plane

Codex
Claude
Copilot
Cline
OpenAI API

Build / QA Plane

Registry
Build
Validation
Routing Evals
Professional Evals
Release Evidence

特别强调：

These are responsibility planes, not six sequential workflow stages.

7.8 Agent Roles

标题：

Separation of responsibility by design.

四张卡片。

Main Control Agent

Route
Dispatch
Schedule
Close

原则：

Control only.
Does not implement.

Analysis Agent

Read
Inspect
Resolve ambiguity
Produce Engineering Brief

Task Agent

Implement
Validate
Stay inside Task Contract

Review Agent

Independent review
Report findings
Does not silently repair its own findings

中间用箭头显示：

Main
↓
Analysis
↓
Task
↓
Review
↓
Closure

但同时注明：

This is not always a fixed linear pipeline.

7.9 Skill Architecture

标题：

Expertise without context explosion.

这是整个官网最重要的视觉模块之一。

展示：

Control

Runtime top-level

Professional

Runtime top-level

Exactly one Primary Professional per Task

Foundation

JIT expertise modifier

Domain

JIT domain / platform constraints

再展示真实逻辑：

User Request

↓

Control

↓

Primary Professional

↓

Selector

↓

0–3 Layer 3 Skills

↓

Required References

核心文案：

Do not load every skill.

Load the smallest set of expertise that can materially change the current engineering decision.

7.10 Professional Skills Explorer

标题：

Engineering judgment, organized by decision ownership.

不是：

Java Skill
Python Skill
React Skill

而是：

Backend Change
Frontend Change
Architecture Impact
API Contract
Security
Reliability
Integration
Acceptance Criteria
Engineering Analysis
Code Review
Incident Response
etc.

首页只展示 8–12 个代表 Skill。

提供：

Browse all Skills

7.11 Skill Explorer

独立 /skills 页面。

支持过滤：

All
Professional
Foundation
Domain
Control

支持搜索：

Name
Capability
Trigger
Domain

Skill Card 内容：

Skill Name

Type

Short Description

Role Support

Trigger Signals

Layer 3 Candidates

Source

点击进入 Skill Detail。

8. Skill Detail 页面

/skills/backend-change-builder

页面结构：

Skill Name

backend-change-builder

Type

Professional Skill

Purpose

该 Skill 做什么工程决策。

Use When

trigger_signals

Do Not Use When

anti_trigger_signals

Required Inputs

required_inputs

Output Contract

output_contract

Related Expertise

Layer 3 candidates

References

Targeted References

Supported Roles

role_support

Source

View source on GitHub

注意：

所有数据应来自 Registry 或 source-derived catalog。

禁止手工建立第二套 Skill 数据源。

9. Evidence Section

标题：

Completion is a claim. Evidence makes it believable.

视觉：

Change

↓

Validation

↓

Evidence Ledger

↓

Independent Review

↓

Closure

重点解释四个概念：

Scope

Evidence 证明了什么范围。

Freshness

Evidence 是否发生在最终修改之后。

Proof Limit

Evidence 不能证明什么。

Residual Risk

仍然有哪些风险。

文案：

A green test suite is not automatically proof of correctness.

Evidence must cover the actual claim being made.

10. Execution Level

展示 L1–L5。

不要把它设计成五个 Workflow Step。

明确：

Execution Level = assurance strength

而不是：

Execution Phase

可以设计成 Assurance Scale：

L1
Bounded

L2
Standard

L3
Elevated

L4
High Assurance

L5
Critical

具体名字应最终以 Registry / Docs 为准。

11. Host Compatibility

标题：

One engineering model. Multiple agent hosts.

展示：

Codex

Claude

GitHub Copilot

Cline

OpenAI API

不要宣称所有 Host 功能完全一致。

说明：

rd-skills projects the control model into each host's available capabilities.

12. Quickstart

首页底部加入真实 Terminal。

Step 1

python3 -m pip install .

Step 2

python3 scripts/quickstart.py 
--agent codex 
--scope user 
--profile recommended 
--dry-run

Step 3

python3 scripts/quickstart.py 
--agent codex 
--scope user 
--profile recommended

Step 4

python3 installers/doctor.py 
--agent codex 
--scope user 
--profile recommended

最后：

Submit your first task

/engineering-control-plane

Goal: ...

Acceptance: ...

Allowed scope: ...

Verify: ...

Stop if: ...

CTA：

Read Quickstart

13. Open-source Section

标题：

Built in the open.

展示：

Source
Documentation
Governance
Contributing
Security
Validation
Benchmarks

CTA：

View GitHub

Contribute

14. Footer

rd-skills

Engineering control plane for AI coding agents.

Product
Architecture
Skills
Quickstart

Resources
Documentation
GitHub
Contributing
Governance

Project
Security
Support
License

15. 视觉设计

整体方向：

Developer Infrastructure
AI Engineering
Control System

参考气质：

Linear
Vercel
Stripe Docs
Resend
Tailwind
Raycast

但不要直接模仿任何品牌。

基础视觉：

背景：

Light：
#F7F8FA

Dark：
#090B10

Primary Accent：

Cobalt Blue

Secondary：

Purple

Success：

Muted Green

Warning：

Amber

Danger：

Muted Red

字体：

Inter / Geist 类 Sans

代码：

Geist Mono / JetBrains Mono 类等宽字体。

16. 视觉原则

禁止：

AI Robot
大脑图片
宇宙背景
霓虹 Cyberpunk
大量 Gradient
无意义 3D 球体
Stock Photography
Emoji Icon
AI Generated Illustration

优先：

Architecture Diagram
Terminal
Code
Flow
Graph
Cards
Evidence State
System State
Subtle Grid
Typography

17. Animation

Animation 必须解释系统。

不要为了装饰动画。

Hero：

自动播放一次 Task lifecycle。

Architecture：

Hover Plane 时突出相关 Component。

Skill：

从：

Professional

展开：

Foundation
Domain
References

Evidence：

显示：

Unverified
→ Validated
→ Reviewed
→ Completed

所有 animation：

150–400ms 微交互。

支持：

prefers-reduced-motion。

18. 技术方案

Frontend

Next.js App Router

TypeScript

Tailwind CSS

shadcn/ui

Motion

Lucide icons

Rendering

Static-first

Server Components 优先。

Backend

第一阶段不需要 Backend。

Data

创建：

scripts/sync-rd-skills.ts

数据优先级：

Repository Registry

↓

Generated Marketplace Index

↓

Website normalized dataset

不要：

Website manually maintained skill database。

推荐 normalized schema：

Skill

name
slug
type
description
roleSupport
triggerSignals
antiTriggerSignals
requiredInputs
outputContract
layer3Candidates
references
sourcePath

19. GitHub 数据策略

Build-time 获取：

Repository metadata

Skill registry

Marketplace Catalog

Documentation links

动态信息例如：

Stars
Forks

可以客户端或 ISR 获取。

关键产品数据：

Skills Count
Professional Count
Foundation Count
Domain Count

应该 Build-time 从 Registry 计算。

如果 GitHub 不可用：

使用 last-known-good generated snapshot。

构建不能因为 GitHub API 临时错误导致整个官网不可用。

20. SEO

Title

rd-skills — Engineering Control Plane for AI Coding Agents

Description

rd-skills gives AI coding agents explicit task boundaries, professional engineering skills, independent review, targeted validation, and evidence-driven completion.

关键词方向：

AI coding agents

coding agent skills

AI engineering workflow

Codex skills

Claude Code skills

AI code review

agent control plane

agent harness

engineering agents

21. Open Graph

OG 页面不要使用抽象 AI 图片。

使用：

rd-skills

Engineering Control Plane

Request
→ Professional Judgment
→ Evidence
→ Closure

22. Analytics

第一阶段只观察：

Homepage → GitHub CTR

Homepage → Quickstart CTR

Quickstart completion depth

Skills Explorer usage

Skill → GitHub source CTR

Docs CTR

North Star Metric：

Qualified GitHub / Quickstart Conversion

23. 性能要求

Lighthouse：

Performance ≥ 95

Accessibility ≥ 95

Best Practices ≥ 95

SEO ≥ 95

禁止 Hero 使用大型视频。

首屏 JS 最小化。

Diagram 优先 CSS / SVG。

24. Responsive

Desktop：

完整 Architecture Diagram。

Tablet：

分为卡片。

Mobile：

所有横向 Flow 改成纵向 Flow。

Terminal 横向滚动。

Skill Explorer 过滤器改为 Sheet。

25. Accessibility

所有 Flow 不允许只通过颜色表达状态。

Dark / Light contrast 达到 WCAG AA。

Keyboard navigation 完整。

Diagram 提供文本 fallback。

Animation 支持 reduced motion。

26. Acceptance Criteria

首页访问者不阅读 GitHub README，也能回答：

rd-skills 是什么？

它和普通 Skill Collection 有什么区别？

Professional / Foundation / Domain 的关系是什么？

为什么需要独立 Review？

Evidence 为什么重要？

它支持哪些 Agent Host？

如何开始安装？

首页必须：

在 Hero 上直接表达 Engineering Control Plane。

存在完整 How It Works。

存在 Three Core Systems。

存在 Six-plane Architecture。

存在 Skill Architecture。

存在 Agent Roles。

存在 Evidence / Closure。

存在 Quickstart。

存在 GitHub CTA。

27. 最终产品原则

官网必须始终围绕这一条逻辑构建：

User Intent
→ Explicit Boundary
→ Professional Ownership
→ Just-in-time Expertise
→ Bounded Execution
→ Targeted Validation
→ Independent Review
→ Current Evidence
→ Credible Completion

真正卖点不是：

“We have many Skills.”

而是：

“We turn AI coding into a controlled engineering process.”
