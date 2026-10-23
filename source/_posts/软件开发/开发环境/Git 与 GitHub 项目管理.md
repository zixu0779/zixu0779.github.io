---
title: Git 与 GitHub 项目管理
date: 2026-05-21 21:27:18
updated: 2026-05-21 21:27:18
categories: [["软件开发", "开发环境"]]
tags: ["Git", "GitHub", "GitHub Actions", "CI/CD", "Git LFS"]
---

Git 负责记录版本，GitHub 则提供仓库托管、问题讨论和代码审查。知道如何使用它们是必备的技能。
把代码推上去只是其中一步，后面还会遇到分支怎么分、提交怎么拆、什么时候合并，以及怎样自动检查和发布。
这里，本文将按照进行一次改动并提交到项目中的过程，把这些事情整理一下。

<!-- more -->

## 整理仓库

### README 应该写些什么

打开一个项目，首先需要知道它是做什么的、现在做到了什么程度，以及怎样运行。README 需要先把这几件事说清楚，再提供详细文档的入口。

比较实用的顺序是：项目介绍、效果展示、主要功能、安装或运行方法，最后放贡献方式和许可说明。有界面的项目附一张实际截图，会比一长串功能名称直观。环境要求和启动命令也要留全，让读者能够跟着指导安装依赖并运行项目。

以我的一个仓库为例（[DungeonTavern](https://github.com/zixu0779/DungeonTavern/blob/main/README.zh-CN.md)），开头先说明项目内容并提供文档入口，接着用场景图展示实际界面，再介绍已有功能。需要运行项目时，可以继续查看后面的启动说明。README 不必把所有设计细节都塞进去，长篇说明可以单独放到文档里，再从这里链接过去。仓库内的文档和图片建议使用相对路径，切换分支或下载源码后也比较方便。

![DungeonTavern README 中的项目介绍、文档入口与场景展示](https://res.cloudinary.com/sycamore/image/upload/v1792502116/Typora/2026/10/20/git-github-readme-overview.png)

### 说明使用和贡献方式

许可证（LICENSE）用来说明项目允许怎样使用；
`CONTRIBUTING.md` 则说明如何准备环境、验证改动和提交贡献。
这两者可以从 README 提供入口，方便使用者和贡献者查找。

如果希望提交问题和 PR 时提供相同的信息，可以再添加 Issue、PR 模板。
例如，Issue 模板可以要求填写复现步骤，PR 模板可以要求说明改动和验证结果。

### 排除不需要提交的文件

`.gitignore` 用来排除不需要跟踪的文件。比如 Node.js 应用中常见的依赖目录、构建结果和本地环境配置：

```gitignore
node_modules/
dist/
.env
.env.*
!.env.example
```

这里的 `.env.example` 为 `.env` 的示例文档，应当只保留变量名称和示例值，实际密码或令牌不要填进去。`dist/` 是否忽略则取决于项目如何分发，有些仓库确实需要跟踪构建结果，不能直接套用。

已经被 Git 跟踪的文件，不会因为后来加入 `.gitignore` 就停止跟踪。如果确认其需要移出版本管理，并保留本地文件，可以执行：

```bash
git rm --cached .env
```

这个命令不会清除历史提交里的内容。如果曾经提交了密钥，仍然需要撤销或轮换密钥，不能只删除当前文件。

## 为改动创建分支

开始修改前，先确认工作区没有未处理的内容，再从更新后的主分支创建工作分支。下面假设主分支叫 `main`，远端叫 `origin`：

```bash
git status
git switch main
git pull --ff-only origin main
git switch -c fix/category-wrap
```

`--ff-only` 只允许快进更新。如果本地和远端已经各自产生了提交，它会停下来，方便先看清分歧再处理。

分支名称能说明改动目的就可以，例如 `fix/category-wrap`、`feat/search`。
一次工作尽量围绕一个问题展开，如果修复分类显示时顺手改了发布脚本，最好把此更改拆出去。这样审查、撤销和查找历史都会容易一些。

对于持续维护主分支的小项目，短期工作分支通常已经够用；需要同时维护多个版本时，再考虑版本分支。

### 同步主分支的改动

工作还没完成，主分支可能已经更新。同步前先提交本地的当前修改，或用 `git stash` 临时保存，确认工作区和暂存区干净后，再获取远端信息：

```bash
git fetch origin
```

然后根据项目约定，选择 merge 或 rebase。下面两条是不同的处理方式，不要依次执行：

```bash
# 在当前工作分支中合入主分支
git merge origin/main

# 或者，把当前工作分支的提交重放到新的主分支之后
git rebase origin/main
```

merge 保留原有提交；分支已经分叉时，会通过合并提交连接两段历史。rebase 则把自己的改动逐个应用到新基点上，对应提交的标识会改变。

选择时主要看两件事：是否需要保留已有提交，以及这些提交有没有被其他人使用。

| 当前情况 | 建议方式 | 原因或限制 |
| --- | --- | --- |
| 多人共同使用工作分支，或别人已经基于这些提交继续开发 | 优先 merge | 保留已有提交标识，协作者不需要因为同步主分支而重新处理自己的历史 |
| 工作分支只在本地，想把改动整理到最新主分支之后 | 可以 rebase | 提交尚未共享，改写不会影响其他人的分支 |
| 工作分支已推送，但只有自己使用 | 按仓库约定选择 | rebase 会改写已推送提交，后续更新远端通常需要强推；确认没有其他人依赖原提交后再使用 |
| 目标分支要求线性历史 | 不能向它推送 merge commit | 可以选择符合规则的 rebase 或 squash；快进合并不会产生 merge commit，不受这一条限制 |

merge 的限制，是仓库约定不允许产生合并提交。rebase 的主要限制则是改写历史：没有与协作者协调好时，不要对共享分支执行，也不要为了同步就重写公共主分支。

后面[选择 PR 合并方式](#选择合并方式)这一节中，也涉及 merge 和 rebase，两处使用的原理相通，但操作的阶段和目标不同。

![Merge 与 Rebase 同步后的提交关系示意](https://res.cloudinary.com/sycamore/image/upload/v1792502125/Typora/2026/10/20/git-github-merge-rebase.png)

遇到冲突时，先修改冲突文件，再用 `git add` 标记已解决。
修复冲突后，merge 可以继续提交；rebase 使用 `git rebase --continue`。
如果想回到本次操作之前，分别使用 `git merge --abort` 或 `git rebase --abort`。

如果前面使用了 `git stash`，同步完成后再用 `git stash pop`，就能恢复本地的修改。用 `stash` 恢复时也可能需要解决冲突。
恢复完成后，最好要运行相关检查，因为文本能合并不代表程序行为一定正确。

## 把改动整理成提交

提交之前，先看自己到底改了什么：

```bash
git status
git diff
git add -p
git diff --cached
```

`git diff` 查看尚未暂存的修改；`git diff --cached` 查看将要提交的内容。`git add -p` 可以按修改块暂存，同一个文件里有两项无关改动时也能分开处理。新建文件则根据 `git status` 的结果单独添加。

一次提交可以包含实现、测试和必要文档，只要它们共同完成同一件事。不需要按文件机械拆分，也不要把调试文件、批量格式化和实际功能混成一包，否则进行回退等操作就会非常麻烦。

面向公开协作的项目，提交说明用英文更方便不同语言的贡献者阅读；如果仓库已有语言约定，就与现有提交保持一致。英文不是 Git 的要求。

提交说明的第一行直接说改了什么，需要解释原因时再补正文。例如：

```text
Fix wrapping of long category titles on mobile

Allow titles to wrap within the text column instead of moving
below the date.
```

确认暂存内容后，执行 `git commit`，在编辑器中填写提交说明。

相比 `update` 或 `fix bug`，这样的说明在历史列表里就能看懂。Git 项目的[贡献规范](https://github.com/git/git/blob/master/Documentation/SubmittingPatches)也强调按逻辑组织改动，并交代修改的理由。

`feat:`、`fix:` 这类前缀可以作为团队约定，也方便配合自动生成版本说明，但不是所有项目都必须使用。重要的是含义明确、同一仓库保持一致。

---
如果刚提交完发现漏了相关修改，而且提交还没有共享，可以补入暂存区后执行：

```bash
git commit --amend
```

这会替换最近一次提交。已经被别人使用的提交，不要仅为了整理说明就随意改写，补一个后续提交往往更省事。

## 提交 PR 并完成合并

改动准备好后，推送工作分支：

```bash
git push -u origin fix/category-wrap
```

在 GitHub 创建 Pull Request，确认目标分支和来源分支，再写清楚问题、改动和验证结果。比如：

```markdown
## 改动
修复手机端分类长标题换行后挤开日期的问题。

## 验证
- 检查长标题和短标题的排列。
- 检查桌面与窄屏下的分类跳转。

Closes #42
```

这是说明格式的示例，验证项要按实际完成的检查填写。使用 `Closes #42` 关联并关闭 Issue 时，也要确认编号对应本次解决的问题。

还没完成但希望先讨论方向，可以创建 Draft PR。
审查时除了代码本身，也应关注是否改变了原有行为、边界情况有没有覆盖，以及说明中的检查是否真实完成。
如果还需要修改，应该继续推送到同一个工作分支，PR 会更新，不必为每轮修改重新开一个。

VS Code 的[贡献指南](https://github.com/microsoft/vscode/wiki/How-to-Contribute)要求 PR 聚焦问题、避免无关格式化。这一点很值得借鉴：改动越集中，审查者越容易判断它是否正确。

### 选择合并方式

前面[同步主分支的改动](#同步主分支的改动)，是在开发过程中更新工作分支。PR 审查完成后，这里决定的是如何把工作分支的结果加入主分支。

本地使用过 rebase，不代表 PR 也必须选择 Rebase and merge；本地通过 merge 同步过主分支，PR 最后也可以 squash。同步方式负责让开发基于最新代码，PR 合并方式决定主分支最终保留怎样的历史。

GitHub 常见的三种合并方式如下：

| 方式 | 合并后的历史 | 适合的情况 |
| --- | --- | --- |
| Create a merge commit | 保留分支提交，并增加合并提交 | 希望保留完整分支关系 |
| Squash and merge | 将 PR 改动合成一个新提交 | 中间提交主要是修修补补，整体是一项改动 |
| Rebase and merge | 将 PR 提交逐个加入目标分支，不增加合并提交 | 提交本身已经整理好，希望保留每一步 |

GitHub 的 Rebase and merge 会为各个提交生成新的标识；Create a merge commit 则保留原提交，另外增加一个合并提交。选择哪一种方式，按仓库约定保持一致即可。

### 合并后的分支清理
确认合并后，可以删除 GitHub 上的工作分支，并更新本地主分支。

这里详细说一下 Squash and merge 和 Create a merge commit 的区别。
squash 会把改动汇总成一个新提交，例如，工作分支有 A、B、C 三次提交，主分支得到的是新的 S，历史中并没有直接包含 A、B、C；而使用 GitHub 的 Create a merge commit 时，主分支会保留 A、B、C，并新增合并提交 M。

使用 `git branch -d` 删除本地分支时，Git 会先检查它是否已合入所跟踪的上游分支；没有设置上游时，则检查是否已合入当前分支。这个判断依据提交的祖先关系，不比较改动内容。
因此，squash 后即使代码已经进入主分支，删除本地分支时仍可能提示 `not fully merged`。

所以，遇到这种提示时，要先核对 PR 是否已经合并，并确认工作分支在此后没有新增未合入的提交。
确认分支中的工作都已保留后，再删除本地分支：

```bash
git switch main
git branch -D fix/category-wrap
```

这里的 `-D` 跳过合并状态检查，删除的是本地分支引用，不会撤销主分支上的 squash 提交。
（注意区分 `-d` 和 `-D`）

## 用 GitHub Actions 自动检查和发布

PR 中反复要做的构建和测试，可以交给 GitHub Actions。这样每次更新代码后都有检查结果，也方便审查者查看失败原因。

### CI/CD

CI/CD 描述的是代码从集成到交付的开发流程，GitHub Actions 则是实现这些流程的自动化平台。

- **CI（Continuous Integration，持续集成）**：频繁集成代码，并通过自动构建、测试等检查尽早发现问题。比如，每次提交 PR 都检查能否构建、测试是否通过。
- **持续交付（Continuous Delivery）**：在检查之后继续完成打包等准备，让版本保持可以发布的状态；是否正式发布，可以由人决定。
- **持续部署（Continuous Deployment）**：将通过检查的改动自动部署到生产环境，流程中不再保留人工批准发布这一步。

它们不是某条固定的命令，也不是几个特定的 action。实际执行的 `npm test`、构建、上传产物和部署命令，才是组成这些流程的具体步骤。

在 Actions 中，把步骤组织成 workflow，再指定何时触发，就能实现相应的 CI/CD 流程。当然 Actions 也可以用于自动添加标签等仓库管理任务，范围不限于 CI/CD。

### 添加检查工作流

工作流文件放在 `.github/workflows/` 下。一个 workflow 可以由 PR、推送或手动操作等事件触发，里面包含一个或多个 job；每个 job 在 runner 上执行，其中的 step 按顺序运行命令或调用 action。不同 job 可以通过 `needs` 设置依赖。

下面以 Node.js 应用为例。
假设项目使用 Node.js 24，已经提交 `package-lock.json`，并且 `package.json` 中有可在 CI 环境运行的 `test` 和 `build` 脚本。
创建 `.github/workflows/ci.yml`：

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: '24'
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
```

这个配置只负责检查，不会发布应用。PR 分支更新时会执行，合入 `main` 后也会检查；`workflow_dispatch` 提供手动触发入口，工作流需先存在于默认分支才能使用这个入口。

`npm ci` 按锁文件安装依赖；没有测试脚本时，将此处替换为项目实际使用的检查命令。
需要严格固定依赖时，可以将 action 固定到经过核对的完整提交 SHA。

进入仓库的 Actions 页面，可以按一次运行查看 job 和 step 日志。排查时先找到失败的步骤，再看报错前后的上下文，确定是安装依赖、测试还是构建出了问题。

下图是我的 [OneDrop](https://github.com/zixu0779/OneDrop/actions/runs/37260378409/job/111606161262) 项目中，一次实际 CI 运行的部分步骤列表，包含格式检查、TypeScript 编译、测试和两个构建目标。它比上面的最小示例多了项目自身需要的检查。

![OneDrop CI 成功运行的任务步骤](https://res.cloudinary.com/sycamore/image/upload/v1792566179/Typora/2026/10/21/git-github-onedrop-ci-dark.png)

### 缓存、产物与发布

上述示例中的 `cache: npm`，用来复用 npm 的依赖缓存，减少重复下载，仍然需要执行 `npm ci`。它不会直接缓存 `node_modules`。

构建出来的安装包、测试报告则属于 artifact，上传后可以供后续任务使用或下载检查。**缓存用于加快执行，产物用于保留执行结果**，两者不要混用。

发布可以另建一个工作流，根据项目选择 tag 推送、Release 发布或手动操作作为入口。
需要人工确认时，可以通过部署环境的保护规则设置审批；具体能力取决于仓库类型和所用方案。

检查工作流只需要读取代码。因此，上述 CI 示例中将权限设为 `contents: read`。只有确实需要写入 Release 或部署的任务才添加相应权限。令牌等敏感配置放到 Secrets，避免写进 YAML。

来自外部 Fork 的 PR 默认受令牌和 Secrets 限制，不应为了让它拿到发布权限就改成高权限执行。尤其不要在 `pull_request_target` 这类拥有目标仓库权限的流程中，直接检出并执行不受信任的 PR 代码。

## 保护主分支

流程确定之后，可以通过仓库规则减少误操作。经典的分支保护规则和 Rulesets 都能约束分支；Rulesets 可以组合多组规则，也能与现有分支保护共同生效。

下面按 GitHub **Rulesets** 中的英文名称说明常用规则；经典分支保护页面的名称和选项组织方式略有不同。

| 规则或选项 | 用途 |
| --- | --- |
| Require a pull request before merging | 要求改动通过 PR 合入目标分支 |
| Require status checks to pass | 要求指定的状态检查通过，例如前面的 CI |
| Required approvals | 位于 PR 规则下，设置合并前需要的批准数量 |
| Block force pushes | 阻止强制推送，保护已有提交历史 |
| Restrict deletions | 限制删除受保护的分支 |

如果还希望主分支不出现 merge commit，可以启用 **Require linear history**。这时 PR 应使用 squash 或 rebase 合并，与前面的合并方式选择对应。规则的具体含义可查阅 [GitHub Rulesets 文档](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)。

设置状态检查时，先让对应工作流实际运行一次，再选择正确的检查名称。
如果检查被路径过滤等条件跳过，还要确认它不会让 PR 一直等待。不要要求一个实际上不会出现的检查。

个人项目可以保留 PR 和 CI 相关的保护规则，不用设置无法完成的审查人数。
多人项目再按需要增加审批或代码负责人审查。
还要结合仓库设置确认功能的可用范围和允许绕过规则的权限，才能判断哪些推送会受到限制。

## 通过 Fork 参与其他项目

有仓库写入权限时，可以直接推送工作分支；没有权限时，通常先 Fork 到自己的账号，再在自己的仓库里修改并提交 PR。
Fork 是 GitHub 上的仓库关系，clone 则是把仓库下载到本地，两者不是同一件事。

clone 自己的 Fork 后，`origin` 通常指向自己的仓库。为了获取原项目的更新，还需要添加一个指向原项目的远端，这里将它命名为 `upstream`。`origin` 和 `upstream` 都是远端名称，不是 Git 强制规定的角色。

下面 URL 中的 `OWNER`、`REPOSITORY`，分别替换为**原项目的所有者名称和仓库名称**，不要填成自己的 Fork。若已经配置过 `upstream`，检查地址正确后即可跳过添加命令。

```bash
git remote -v
git remote add upstream https://github.com/OWNER/REPOSITORY.git
```

接下来同步主分支。这里采用的方式是：`main` 只跟随原项目，自己的修改放在工作分支中。先处理未提交修改，再依次同步自己的远端和原项目：

```bash
git fetch origin
git fetch upstream
git switch main
git merge --ff-only origin/main
git merge --ff-only upstream/main
git push origin main
git switch -c fix/category-wrap
```

两次 `--ff-only` 都要求当前分支能够直接向前更新。如果本地 `main`、Fork 的 `main` 或原项目主分支之间存在各自独有的提交，操作就可能停止。此时先查看分歧中的提交，决定保留哪些改动，再按前面介绍的 merge/rebase 方式处理；强推会改写远端历史，不能用来跳过这个判断。

同步完成后，在新建的工作分支中修改，推送到自己 Fork 的 `origin`，再向原项目要求的目标分支创建 PR。

![Fork 协作中的本地仓库、origin 与 upstream](https://res.cloudinary.com/sycamore/image/upload/v1792502131/Typora/2026/10/20/git-github-fork-remotes.png)

提交前先看原项目的贡献说明，确认目标分支、测试要求以及是否需要先讨论 Issue。
自己的习惯可以调整，但项目已经约定的流程需要遵守。

## 用 Git LFS 管理大文件

源文件中的大图片、模型或音频，可能需要和代码一起维护，但不适合让普通 Git 历史不断积累完整二进制版本。
Git LFS 会让 Git 仓库记录较小的指针文件，实际内容存放在 LFS 存储中，使用时再获取。
GitHub 会拒绝推送超过 100 MiB 的普通 Git 文件；需要跟踪这类文件时，可以使用 Git LFS。

使用 Git LFS 之前，先要区分文件的用途：开发必需、需要跟踪版本的二进制资源可以考虑 LFS；构建缓存通常忽略；供用户下载的安装包则更适合放到 Release。
并不是所有体积大的文件都要加入 LFS。

安装 Git LFS 后，在仓库中初始化并添加规则。下面以**尚未被普通 Git 跟踪**的 PSD 文件为例：

```bash
git lfs install
git lfs track "*.psd"
git add .gitattributes
git add assets/example.psd
git commit -m "Track PSD assets with Git LFS"
git lfs ls-files
```

`git lfs track` 将规则写入 `.gitattributes`，这个文件也要一起提交，协作者才能使用相同的规则。
通过 `git lfs ls-files` 检查目标文件是否已经由 LFS 管理，再继续推送提交。

项目的协作者也需要安装 Git LFS。
如果拿到的文件只有几行指针文本，可以在仓库里执行 `git lfs pull` 获取实际内容。

如果给已经提交过的大文件补一条跟踪规则，不会自动缩小旧历史。
历史迁移会涉及提交改写和协作者同步，应单独备份、确认范围后处理，不要为了清理体积直接在共享仓库里重写。

LFS 的存储和下载额度也需要留意，选择前查看账号当前的计费规则即可。

## 标记版本

tag 用来标记某个版本位置。确认当前提交就是要发布的版本后，可以创建附注标签并单独推送：

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

GitHub Release 基于 tag，再附上版本说明和可下载的文件。
版本说明适合写用户能感知的变化、修复的问题和必要的升级事项，安装包则作为附件提供。
Release 自动生成的源码压缩包不等于已经构建好的程序。

## 撤销改动

撤销前先执行 `git status` 和 `git diff`，确认需要保留哪些内容。下面几个动作的影响并不相同：

| 情况 | 操作 | 结果 |
| --- | --- | --- |
| 文件已暂存，想重新选择提交内容 | `git restore --staged path/to/file` | 取消暂存，保留工作区修改 |
| 确认不要某个已跟踪文件尚未暂存的修改 | `git restore path/to/file` | 用暂存区版本恢复工作区，丢弃这部分修改 |
| 最近一次本地提交尚未共享，想重新组织 | `git reset --soft HEAD~1` | 撤回提交，保留修改在暂存区 |
| 已经合入公共分支，需要撤销一项普通提交 | `git revert COMMIT` | 新增一个反向提交，保留原历史 |

`reset` 不同选项的影响不同：默认的 `--mixed` 会同时重置暂存区，但保留工作区；`--hard` 还会覆盖工作区中的相关修改，使用前需要确认这些修改是否要保留。
`revert` 也可能产生冲突，撤销合并提交还涉及主线选择，需要单独判断。

公共分支上的修复和撤销同样可以通过工作分支、PR 和检查完成。
