# Contributing to AoflJS

We welcome anyone to contribute to our source code to make AoflJS even better than it is
today! Before contributing please familiarize yourself with our guidelines:

- [Code of Conduct](#coc)
- [Questions and Support](#question)
- [Bug Reporting](#issue)
- [Feature Requests](#feature)
- [Documentation](#docs)
- [Commit Guidelines](#commit-guidelines)
- [Commit Format](#commit-format)
- [Issue Submission Guidelines](#submit)
- [Pull Request Guidelines](#submit-pr)

## <a name="coc"></a> Code of Conduct

Before contributing please read and follow our [Code of Conduct][coc] and read our [Coding Rules][coding-rules]
that adds a few exceptions to [Google's JavaScript Style Guide][google-coding-rules]. To ensure consistency throughout the source code keep these rules in mind as you are working.

## <a name="requests"></a> Questions, Bugs, Features

### <a name="question"></a> Questions and General Support

Do not open issues for general support questions as we want to keep GitHub issues for bug reports
and feature requests. Instead please direct all general support questions to [TBD]

We will close all issues that are requests for general support and redirect people here.

### <a name="issue"></a> Bug and Issue Reporting

If you find a bug in the source code, you can help us by submitting an issue to our
[GitHub Repository][github]. Even better, you can submit a pull request with a fix.

**Please see the [Submission Guidelines](#submit) below.**

### <a name="feature"></a> Feature Requests

You can request a new feature by submitting an issue to our [GitHub Repository][github-issues].

- **Major Changes** should be discussed first in a [GitHub issue][github-issues] that outlines the changes and benefits of the feature.
- **Small Changes** can be submitted to the [GitHub Repository][github] as a pull request.

### <a name="docs"></a> Doc Fixes

If you have a suggestion for the documentation, you can open an issue and outline the problem
or improvement you have or you can create the doc fix yourself!

For large fixes, please build and test the documentation before submitting the PR to be sure you
haven't accidentally introduced any layout or formatting issues.

## <a name="commit-guidelines"></a> Git Commit Guidelines

We have very precise rules over how our git commit messages can be formatted.
This leads to **more readable messages** that are easy to follow when looking
through the **project history**. But also, we use the git commit messages to
**generate the change log**.

### <a name="commit-format"></a> Commit Message format

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

## <a name="submit"></a> Issue Submission Guidelines

Before you submit your issue search the archive, maybe your question was already answered.

If your issue appears to be a bug, and hasn't been reported, open a new issue. Help us to maximize
the effort we can spend fixing issues and adding new features by not reporting duplicate issues.

Provide as many of the following to ensure a faster response:

- **Overview of the Issue** - if an error is being thrown a non-minified stack trace helps
- **Motivation for or Use Case** - explain why this is a bug for you
- **AoflJS Version(s)** - is it a regression?
- **Browsers and Operating System** - is this a problem with all browsers or only specific ones?
- **Reproduce the Error** - provide a live example (using [Plunker][plunker] or
  [JSFiddle][jsfiddle]) or a set of steps to recreate the bug.
- **Related Issues** - has a similar issue been reported before?
- **Suggest a Fix** - if you can't fix the bug yourself, perhaps you can point to what might be
  causing the problem (line of code or commit)

## <a name="submit-pr"></a> Pull Request Submission Guidelines

Before you submit your pull request consider the following guidelines:

- Search for an similar open or closed pull requests before beginning
- Fork the repo
- Make your changes in a new git branch:

  ```shell
  git checkout -b my-branch
  ```

- Create your patch commit.
- [Squash your commits.](https://davidwalsh.name/squash-commits-git)
- Follow our [Coding Rules][coding-rules].
- Commit your changes using a descriptive commit message that follows our [commit guidelines](#commit-guidelines)

That's it! Thank you for your contribution!

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes
from the main (upstream) repository:

- Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

  ```shell
  git push origin --delete my-branch
  ```

- Check out the master branch:

  ```shell
  git checkout master -f
  ```

- Delete the local branch:

  ```shell
  git branch -D my-branch
  ```

- Update your master with the latest upstream version:

  ```shell
  git pull --ff upstream master
  ```

[coc]: https://google.com
[coding-rules]: http://cms.aofl.com/admintool_style_guide/cms/0.1/#/coding-style-guide_com_en/
[github-issues]: https://google.com
[github-new-issue]: https://google.com
[github]: https://google.com
[google-coding-rules]: https://google.github.io/styleguide/javascriptguide.xml
[jsfiddle]: http://jsfiddle.net/
[plunker]: http://plnkr.co/edit
