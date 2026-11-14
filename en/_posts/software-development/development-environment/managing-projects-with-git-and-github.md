---
title: Managing Projects with Git and GitHub
translation_id: git-github-projects
source_digest: bfda926693ef1cba9b3d1f0444aad16c247d62b7787ad14b782a94d50e8460e6
tags:
  - Git
  - GitHub
  - GitHub Actions
  - Git LFS
categories:
  - Software Development
  - Development Environment
sections: {"organising-a-repository": "整理仓库", "what-belongs-in-the-readme": "readme-应该写些什么", "explain-usage-and-contributions": "说明使用和贡献方式", "exclude-files-that-dont-belong-in-history": "排除不需要提交的文件", "create-a-branch-for-the-change": "为改动创建分支", "bring-in-changes-from-main": "同步主分支的改动", "organise-changes-into-commits": "把改动整理成提交", "open-and-merge-a-pull-request": "提交-pr-并完成合并", "choose-a-merge-method": "选择合并方式", "clean-up-after-the-merge": "合并后的分支清理", "automating-checks-and-releases-with-github-actions": "用-github-actions-自动检查和发布", "add-a-check-workflow": "添加检查工作流", "caches-artifacts-and-releases": "缓存-产物与发布", "protect-main": "保护主分支", "contributing-through-a-fork": "通过-fork-参与其他项目", "managing-large-files-with-git-lfs": "用-git-lfs-管理大文件", "tagging-a-version": "标记版本", "undoing-changes": "撤销改动"}
---

Git records versions. GitHub hosts repositories and provides a place to discuss issues and review code. Knowing how to use both is a basic development skill. Pushing code is only one step. A typical change also raises questions about branches, commits, review, automated checks and release. This post follows one change through that process.

<!-- more -->

## Organising a repository

### What belongs in the README?

When you open a project for the first time, you want to know what it does, what’s working so far, and how to run it. A README should answer those questions up front, then point you to the docs for more detail.

A useful order is introduction, demo, main features, installation or startup, contributing and licence. For a graphical application, one real screenshot often conveys more than a long feature list. Include the prerequisites and commands someone needs to install dependencies and run it.

In my [DungeonTavern README](https://github.com/zixu0779/DungeonTavern/blob/main/README.zh-CN.md), I start with the project and documentation links, show the actual scene, then cover features and startup. Long design notes can live in separate documents. Relative links to files and screenshots continue to work when readers switch branches or download the source.

![DungeonTavern’s introduction, documentation links and scene preview](https://res.cloudinary.com/sycamore/image/upload/v1792696402/Typora/2026/05/git-github-readme-overview.png)

### Explain usage and contributions

The licence describes permitted uses. A `CONTRIBUTING.md` can explain environment setup, validation and contribution submission. Link both from the README. Templates make these reports more consistent. An issue template can ask for reproduction steps. A pull request template can ask what changed and how the contributor checked it.

### Exclude files that don’t belong in history

Use `.gitignore` to exclude files you don’t want under version control. A Node.js project might ignore installed dependencies, build products and local configuration:

```gitignore
node_modules/
dist/
.env
.env.*
!.env.example
```

Keep only variable names and dummy values in `.env.example`. Whether to track `dist/` depends on distribution: some repositories intentionally version their built output.

Adding an already tracked file to `.gitignore` won’t untrack it. To remove it from the index and keep the local copy:

```bash
git rm --cached .env
```

Old commits still contain it. Revoke or rotate a secret that was committed.

## Create a branch for the change

Check for unfinished local changes first, then create the working branch from an up-to-date main branch. The example assumes a main branch named `main` and a remote named `origin`:

```bash
git status
git switch main
git pull --ff-only origin main
git switch -c fix/category-wrap
```

`--ff-only` stops if local and remote histories have diverged. That gives you a chance to inspect both sides. Use a name that describes the change, such as `fix/category-wrap` or `feat/search`. Keep a release script edit separate from a category layout fix so each can be reviewed, reverted and located in history independently. Short-lived branches suit many small projects; version branches become useful when maintaining multiple release lines.

### Bring in changes from main

Commit your work in progress or stash it. Once the working tree and index are clean, fetch:

```bash
git fetch origin
```

Choose one of these approaches according to the project’s conventions:

```bash
# 在当前工作分支中合入主分支
git merge origin/main

# 或者，把当前工作分支的提交重放到新的主分支之后
git rebase origin/main
```

A merge preserves the existing commits and can join diverged histories with a merge commit. A rebase replays changes on a new base and gives the replayed commits new IDs.

| Situation | Approach | Reason |
| --- | --- | --- |
| Others share the branch or work on top of it | Prefer a merge | Their existing commit IDs remain valid. |
| The work is entirely local | A rebase is reasonable | Nobody else depends on the old IDs. |
| The branch was pushed but only you use it | Follow the repository convention | Updating the remote after a rebase usually requires a force push. Check who depends on it first. |
| The target requires linear history | Use a compatible rebase, squash or fast-forward | A merge commit would violate the rule; a fast-forward creates none. |

Coordinate before rewriting shared history. Don’t rewrite a public main branch simply to sync your work. [Choosing a PR merge method](#choose-a-merge-method) below concerns a later step.

![Commit relationships after merging or rebasing](https://res.cloudinary.com/sycamore/image/upload/v1792696402/Typora/2026/05/git-github-merge-rebase.png)

Resolve conflicts in the files, then mark them resolved with `git add`. Complete the merge commit or run `git rebase --continue` as appropriate. To abandon the operation, use `git merge --abort` or `git rebase --abort`. Restore stashed changes with `git stash pop`; restoring can itself cause conflicts. Run the relevant checks even after a clean textual merge.

## Organise changes into commits

Inspect the changes before committing:

```bash
git status
git diff
git add -p
git diff --cached
```

`git diff` shows unstaged changes and `git diff --cached` shows what the next commit will contain. Stage selected hunks with `git add -p`; add new files separately after checking status.

Implementation, tests and documentation can belong in one commit when they accomplish one thing. Splitting mechanically by file makes less sense than separating unrelated formatting, debugging files and behaviour changes. Mixing those together makes reverting the functional change much harder.

For a public project, English commit messages can help contributors who speak other languages. Follow existing language conventions. Git itself doesn’t require English. Describe the effect of the change, with context where needed:

```text
Fix wrapping of long category titles on mobile

Allow titles to wrap within the text column instead of moving
below the date.
```

Once you’ve checked the staged changes, run `git commit` and enter the message in your editor. A subject like the one above tells you what changed when you browse the history. An entry like `update` or `fix bug` leaves you guessing. The [Git project’s contribution guidelines](https://github.com/git/git/blob/master/Documentation/SubmittingPatches) also ask contributors to group changes logically and explain why they made them.

Prefixes such as `feat:` and `fix:` are a team convention and can help generate release notes. Use them if they suit the project. What matters is that the messages are clear and consistent within the repository.

---

If you’ve just committed and discover a related change you left out, stage it and run the following while the commit is still unshared:

```bash
git commit --amend
```

Amending changes the commit ID. If others already depend on it, adding a follow-up commit is usually easier than rewriting history just to tidy up the message.

## Open and merge a pull request

Push the working branch and establish its upstream:

```bash
git push -u origin fix/category-wrap
```

Open a PR against the intended base. Explain the problem, the change and how you verified it. Here’s an example description:

```markdown
## 改动
修复手机端分类长标题换行后挤开日期的问题。

## 验证
- 检查长标题和短标题的排列。
- 检查桌面与窄屏下的分类跳转。

Closes #42
```

Only list checks actually performed. Verify that `Closes #42` points to the issue this change resolves. Use a draft PR to discuss an unfinished approach. Review existing behaviour and edge cases as well as the new code. Push follow-up fixes to the same branch; the PR updates automatically. The [VS Code contribution guide](https://github.com/microsoft/vscode/wiki/How-to-Contribute) asks contributors to keep PRs focused and avoid unrelated formatting, which makes changes easier to review.

### Choose a merge method

[Syncing the working branch during development](#bring-in-changes-from-main) and deciding what history lands on main are distinct decisions. A branch rebased locally can still be squash-merged. A branch kept current with merge commits can also be squashed.

| GitHub option | Result on the target | When it fits |
| --- | --- | --- |
| Create a merge commit | Keeps the branch commits and adds a merge commit | The full branch relationship is worth retaining. |
| Squash and merge | Records the PR as one new commit | Many small fixes together form a single change. |
| Rebase and merge | Replays the commits individually, with new IDs and no merge commit | The separate commits already tell the intended story. |

Follow the project’s convention.

### Clean up after the merge

After confirming the merge, remove the remote working branch if appropriate and update local main. A squash of commits A, B and C produces a new S on main. A merge commit keeps A, B and C and joins them with M.

`git branch -d` checks ancestry against the tracked upstream, or against the current branch if there’s no upstream. It doesn’t compare resulting content. A squash-merged branch can therefore report `not fully merged`. Confirm the PR landed and that the working branch has no later unmerged commits. Only then, if needed:

```bash
git switch main
git branch -D fix/category-wrap
```

Capital `-D` skips the ancestry check. Removing the local branch reference doesn’t undo the squash commit.

## Automating checks and releases with GitHub Actions

Running a PR’s build and tests automatically gives reviewers a result and a log for every update.

### CI/CD

**Continuous integration** means integrating code frequently and running automated builds and tests to catch problems early. For example, a project can build and run its tests on each PR. **Continuous delivery** also prepares a releasable package, with release potentially left to a person. **Continuous deployment** sends passing changes to production without that final approval.

These are workflows made up of concrete operations such as testing, building, uploading and deploying. GitHub Actions can orchestrate them, and can also perform unrelated repository tasks such as applying labels.

### Add a check workflow

Store workflows under `.github/workflows/`. Events such as pushes, PR changes and manual dispatch trigger workflows. Each workflow contains one or more jobs. Each job runs on a runner, and its steps run commands or invoke actions in order. Use `needs` to express dependencies between jobs.

For this example the project uses Node.js 24, has a committed `package-lock.json`, and defines CI-compatible `test` and `build` scripts in `package.json`. Create `.github/workflows/ci.yml`:

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

This workflow only checks the application. It runs on PR updates and checks main after a merge. For manual dispatch the workflow must already exist on the default branch. `npm ci` installs from the lockfile. If there’s no test script, substitute the project’s actual check command. When strict action pinning is required, use a verified full commit SHA.

In Actions, open a run and find the first failing step. Its context distinguishes dependency installation, test and build failures. This [actual OneDrop CI run](https://github.com/zixu0779/OneDrop/actions/runs/37260378409/job/111606161262) includes formatting, TypeScript compilation, tests and two build targets:

![Steps in a successful OneDrop CI run](https://res.cloudinary.com/sycamore/image/upload/v1792696403/Typora/2026/05/git-github-onedrop-ci-dark.png)

### Caches, artifacts and releases

`cache: npm` reuses npm’s package cache, not `node_modules`; the workflow still runs `npm ci`. Artifacts preserve results such as installers or test reports for later jobs or downloads.

A separate release workflow might trigger from a tag, a published release or manual dispatch. Deployment environment protections can require approval where the repository and plan support them. The check example needs only `contents: read`. Grant additional permissions only to jobs that need them. Put tokens in Secrets. External fork PRs have restrictions on tokens and secrets: avoid executing untrusted PR code in a privileged `pull_request_target` context.

## Protect main

GitHub offers classic branch protections and rulesets. Multiple rulesets can apply alongside existing protections. The table uses the English labels from Rulesets. The classic branch protection page groups and names its options slightly differently.

| Rule | Purpose |
| --- | --- |
| Require a pull request before merging | Route changes through a PR. |
| Require status checks to pass | Require named checks such as CI. |
| Required approvals | Set the approval count within the PR rule. |
| Block force pushes | Protect existing history. |
| Restrict deletions | Protect the branch from deletion. |

**Require linear history** rules out merge commits on the target. Select compatible squash or rebase merges. See [GitHub’s ruleset reference](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets).

Run a workflow at least once before selecting its check name. Path filters or conditional jobs can otherwise leave a PR waiting for a check that never appears. For a solo project, avoid requiring approvals nobody can give; larger projects can add reviewers or code owners. Also check plan availability and who can bypass a rule.

## Contributing through a fork

With write access, push a working branch to the project. Otherwise fork the project on GitHub, clone your fork locally and propose changes upstream. Forking creates a hosting relationship; cloning downloads a repository.

After cloning your fork, `origin` generally points to it. Add a remote for the original project, commonly called `upstream`. These names are conventions. Replace OWNER and REPOSITORY with the original project’s owner and name. If upstream already exists, verify its URL instead of adding it again.

```bash
git remote -v
git remote add upstream https://github.com/OWNER/REPOSITORY.git
```

Here main follows upstream and personal changes stay on working branches. Handle uncommitted work first, then sync:

```bash
git fetch origin
git fetch upstream
git switch main
git merge --ff-only origin/main
git merge --ff-only upstream/main
git push origin main
git switch -c fix/category-wrap
```

Both fast-forward checks can stop on divergence between local main, your fork and the original repository. Inspect the unique commits and decide what to keep before merging or rebasing. A force push would rewrite history without answering that question.

Create a working branch, make the change, push to your fork’s origin and open the PR against the branch requested by the project.

![Local checkout, origin and upstream in a fork workflow](https://res.cloudinary.com/sycamore/image/upload/v1792696404/Typora/2026/05/git-github-fork-remotes.png)

Read the contribution guide for the target branch, tests and whether an issue discussion is expected first.

## Managing large files with Git LFS

Images, models and audio sources may need versioning alongside code. Git LFS stores small pointers in Git and keeps the contents in LFS storage. GitHub rejects ordinary Git files over 100 MiB. Consider LFS for required versioned binaries, ignore build caches and put downloadable release installers in Releases.

Once you’ve installed Git LFS, initialise it in the repository and add a tracking rule. Here’s an example for PSD files that ordinary Git hasn’t tracked yet:

```bash
git lfs install
git lfs track "*.psd"
git add .gitattributes
git add assets/example.psd
git commit -m "Track PSD assets with Git LFS"
git lfs ls-files
```

`git lfs track` writes the rule to `.gitattributes`. Commit that file so collaborators use the same rules. Check `git lfs ls-files` to confirm the files are managed by LFS. Collaborators need Git LFS too. If a checkout contains only pointer text, run `git lfs pull`.

Adding a tracking rule doesn’t shrink existing history. Migrating old binaries rewrites commits: back up, define the scope and coordinate with collaborators before doing so. Check the account’s storage and download allowances as well.

## Tagging a version

After confirming the exact release commit, create and push an annotated tag:

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

A GitHub Release builds on a tag with release notes and downloadable assets. Document visible changes, fixes and upgrade requirements. Attach built installers separately; an automatically generated source archive isn’t the compiled application.

## Undoing changes

Run `git status` and `git diff` first to see which changes you want to keep.

| Situation | Command | Effect |
| --- | --- | --- |
| Reselect staged changes | `git restore --staged path/to/file` | Keeps working-tree edits. |
| Discard unwanted unstaged changes to a tracked file | `git restore path/to/file` | Restores the index version and discards those edits. |
| Reorganise the most recent unshared commit | `git reset --soft HEAD~1` | Removes the commit from the branch tip while retaining staged changes. |
| Undo an ordinary commit on a shared branch | `git revert COMMIT` | Adds an inverse commit and preserves history. |

The default mixed reset also resets the index but keeps working-tree changes. A hard reset overwrites affected working-tree changes too. Reverts can conflict; reverting a merge requires deciding which parent is the mainline. Fixes and reversions on public branches can go through the same branch, PR and check process.
