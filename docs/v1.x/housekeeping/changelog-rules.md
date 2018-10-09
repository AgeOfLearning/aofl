# Changelog Rules

> ## What is a changelog?
>
> A changelog is a file which contains a curated, chronologically ordered list of notable changes for each version of a project.
>
> ## Why keep a changelog?
>
> To make it easier for users and contributors to see precisely what notable changes have been made between each release (or version) of the project.

-- [keep a changelog](https://keepachangelog.com/en/1.0.0/)

Please review [keep a changelog](https://keepachangelog.com/en/1.0.0/) as it does a great job of defining the requirements for generating a changelog. This document outlines a process to make this process easier.

## Changelog based on git commits

All the information needed to generate a changelog is already captured in the code and commit messages. However, it is not easy to get a list of changes between each version by tracing git history. By having a git branching and merging stategy we can make collection of changes easy.

## Git rebase and squash

1.  Developers should cut a new branch from each feature or bugfix in the project.
1.  They can work on their branch and make multiple commits with short messages.
1.  When they are ready to submit their changes for release they should rebase and squash their commits against the branch they cut from
1.  While rebasing generate a well formatted commit message, as described below, based on the smaller commits along the way

This strategy esures that ...

1.  We summarize our changes as we develop features
1.  We keep a clean and flat git history
1.  Each change corresponds to a single commit and can easily be reverted

```bash
$ get checkout -b <feature-branch> <base-branch> # chechout feature branch
$ git add . # stage changes
$ git commit -m "implemented feature" # commit changes with a descriptive message
$ git rebase -i <base-branch> # rebase and squash commits against base-branch and generate the changelog for changes on the feature branch
$ git push -f origin <feature-branch> # push your changes. Now we can $ git merge feature-branch into base-branch
```

## Commit Message format

Each commit message should list all performance improvements, feature changes,
and bugfixes.

```
feature-branch-name

Performance:
  - component name:
    - list of performance improvements

Features:
  - component name:
    - list of new features

Bugfixes:
  - component name:
    - list of bugfixes
```

## Sample CHANGELOG.md

> # changelog - Project A
>
> ## v1.0.0-alpha.2 (11-09-2016)
>
> Features:
>
> - User Profile
>   - Implemented add user modal
> - Replaced textareas with wysiwyg
> - Added API documentation
>
> Bugfixes:
>
> - Relative application path support
>
> ---
>
> ## v1.0.0-alpha.1 (08-03-2016)
>
> Features:
>
> - User Profile
>   - Added user profile page
>
> ---

## Simple Demo

### Starting point

```
$ git lg --all
* fe60284 - (HEAD -> master) Initial commit (49 seconds ago) <Arian Khosravi>
```

_As you see we have 1 commit in our repo_

### Developing a new feature

```bash
$ git checkout -b user-profiles master
Switched to a new branch 'user-profiles'

# make changes and commit feature

$ git lg --all
* 24ceaa6 - (HEAD -> user-profiles) bugfixes (5 seconds ago) <Arian Khosravi>
* c25374f - Added user profile page (2 minutes ago) <Arian Khosravi>
* fe60284 - (master) Initial commit (8 minutes ago) <Arian Khosravi>
```

- We cut a new branch and made 2 commits

### Rebase

1.  Rebase against base branch

```bash
$ git rebase -i master
```

2.  Choose a commit to squash. _In general leave the first line unchanged and change pick to s on all other lines_

```bash
pick c25374f Added user profile page
pick 24ceaa6 bugfixes # change to `s` to squash commit

# Rebase fe60284..24ceaa6 onto fe60284 (2 commands)
#
# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# x, exec = run command (the rest of the line) using shell
# d, drop = remove commit
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
```

3.  Update the commit message

default message

```bash
# This is a combination of 2 commits.
# This is the 1st commit message:

Added user profile page

# This is the commit message #2:

bugfixes

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Date:      Mon Aug 6 11:32:36 2018 -0700
#
# interactive rebase in progress; onto fe60284
# Last commands done (2 commands done):
#    pick c25374f Added user profile page
#    s 24ceaa6 bugfixes
# No commands remaining.
# You are currently rebasing branch 'user-profiles' on 'fe60284'.
#
# Changes to be committed:
#       new file:   userProfile.js
#
```

updated message

```bash
user-profiles

Features:
- User Profile
  - Added user profile page
```

### Git tree after rebasing

```bash
git lg --all
* 49a7cdf - (HEAD -> user-profiles) Added user profile page (4 minutes ago) <Arian Khosravi>
* fe60284 - (master) Initial commit (15 minutes ago) <Arian Khosravi>
```

### merge into master

```bash
$ git log # read the commit message and update CHANGELOG.md
$ git commit -am "updated changelog"
$ git rebase -i master # squash the changelog commit

$ git checkout master
Switched to branch 'master'

$ git merge user-profiles
Updating fe60284..49a7cdf
Fast-forward
 user-profile.js | 1 +
 CHANGELOG.md | 1 +
 2 file changed, 2 insertion(+)
 create mode 100644 userProfile.js

$ git tag -a v1.0.0-alpha.1 # create a tag for the version and use the changlog entry for this version as the message

$ git branch -D user-profiles # delete source banch
Deleted branch user-profiles (was 49a7cdf).

$ git lg --all
* 49a7cdf - (HEAD -> master, tag: v1.0.0-alpha.1) Added user profile page (13 minutes ago) <Arian Khosravi>
* fe60284 - Initial commit (24 minutes ago) <Arian Khosravi>
```
