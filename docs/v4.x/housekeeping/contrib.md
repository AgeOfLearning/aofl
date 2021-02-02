# Contributing to Aofl JS

We welcome anyone to contribute to our source code to make Aofl JS even better than it is
today! Before contributing please familiarize yourself with our guidelines:

- [Code of Conduct](#code-of-conduct)
- [Questions and Support](#questions-bugs-features)
- [Bug Reporting](#bug-and-issue-reporting)
- [Feature Requests](#feature-requests)
- [Documentation](#doc-fixes)
- [Commit Guidelines](#git-commit-guidelines)
- [Commit Format](#commit-message-format)
- [Issue Submission Guidelines](#issue-submission-guidelines)
- [Pull Request Guidelines](#pull-request-submission-guidelines)

## Code of Conduct

Before contributing please read and follow our [Code of Conduct](https://github.com/ageoflearning/aofl/blob/master/CODE_OF_CONDUCT.md) and read our [Coding Rules](v2.x/housekeeping/coding-standards)
that adds a few exceptions to [Google's JavaScript Style Guide](https://google.github.io/styleguide/javascriptguide.xml). To ensure consistency throughout the source code keep these rules in mind as you are working.

## Questions, Bugs, Features

### Questions and General Support

Do not open issues for general support questions as we want to keep GitHub issues for bug reports
and feature requests. Instead please direct all general support questions to [TBD]

We will close all issues that are requests for general support and redirect people here.

### Bug and Issue Reporting

If you find a bug in the source code, you can help us by submitting an issue to our
[GitHub Repository](https://github.com/ageoflearning/aofl). Even better, you can submit a pull request with a fix.

**Please see the [Submission Guidelines](#issue-submission-guidelines) below.**

### Feature Requests

You can request a new feature by submitting an issue to our [GitHub Repository](https://github.com/ageoflearning/aofl).

- **Major Changes** should be discussed first in a [GitHub issue](https://github.com/AgeOfLearning/aofl/issues) that outlines the changes and benefits of the feature.
- **Small Changes** can be submitted to the [GitHub Repository](https://github.com/AgeOfLearning/aofl/pulls) as a pull request.

### Doc Fixes

If you have a suggestion for the documentation, you can open an issue and outline the problem
or improvement you have or you can create the doc fix yourself!

For large fixes, please build and test the documentation before submitting the PR to be sure you
haven't accidentally introduced any layout or formatting issues.

## Git Commit Guidelines

We have very precise rules over how our git commit messages can be formatted.
This leads to **more readable messages** that are easy to follow when looking
through the **project history**. But also, we use the git commit messages to
**generate the change log**.

### Commit Message format

Follow [keep a changelog guidelines](https://keepachangelog.com/en/1.0.0/#how).

> Types of changes
>
> - `Added` Added for new features.
> - `Changed` for changes in existing functionality.
> - `Deprecated` for soon-to-be removed features.
> - `Removed` for now removed features.
> - `Fixed` for any bug fixes.
> - `Security` in case of vulnerabilities.
> ```
> ## [unreleased]
>
> ### [Added]
> ### [Changed]
> ### [Deprecated]
> ### [Removed]
> ### [Fixed]
> ### [Security]
> ```

## Issue Submission Guidelines

Before you submit your issue search the archive, maybe your question was already answered.

If your issue appears to be a bug, and hasn't been reported, open a new issue. Help us to maximize
the effort we can spend fixing issues and adding new features by not reporting duplicate issues.

Follow the format defined in [ISSUE_TEMPLATE.md](https://github.com/AgeOfLearning/aofl/blob/master/ISSUE_TEMPLATE.md) when creating issues.

## Pull Request Submission Guidelines

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
- Commit your changes using a descriptive commit message that follows our [commit guidelines](#git-commit-guidelines)

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
