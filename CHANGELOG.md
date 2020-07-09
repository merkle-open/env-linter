# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.3.2](https://github.com/namics/env-linter/compare/v0.2.1...v0.3.2) (2020-07-09)

### Features

-   **env-var:** add environment variable ENV_LINTER_SKIP to skip all env-linter checks ([5eb4548](https://github.com/namics/env-linter/commit/5eb4548a26e4e705b7087c8141ea7acbe0ac399a))

### Bug Fixes

-   **hooks-installed:** allow detection of hooks from anywhere in the repository ([ecc7805](https://github.com/namics/env-linter/commit/ecc780559ac462b499ad17146a9a50ed50f72f06))
-   **linter:** prevent version checks on CI environments ([a54563f](https://github.com/namics/env-linter/commit/a54563f44cd5ad3f02d0b9d9fe3825fa423e32c9))

### [0.3.1](https://github.com/namics/env-linter/compare/v0.2.1...v0.3.1) (2020-06-22)

### Bug Fixes

-   **install:** remove env-linter post-install since it is causing issues on install ([7ea513b](https://github.com/namics/env-linter/commit/7ea513bcb0d4ae27ec6675b95cd97431ae65bc91))

## [0.3.0](https://github.com/namics/env-linter/compare/v0.2.1...v0.3.0) (2020-06-22)

### Features

-   **env-var:** add environment variable ENV_LINTER_SKIP to skip all env-linter checks ([5eb4548](https://github.com/namics/env-linter/commit/5eb4548a26e4e705b7087c8141ea7acbe0ac399a))

### Bug Fixes

-   **ci:** prevent version checks on CI environments ([a54563f](https://github.com/namics/env-linter/commit/a54563f44cd5ad3f02d0b9d9fe3825fa423e32c9))

### [0.2.1](https://github.com/namics/env-linter/compare/v0.2.0...v0.2.1) (2020-06-10)

### Bug Fixes

-   use safer method to detect ci environments ([13ef8d6](https://github.com/namics/env-linter/commit/13ef8d6ebd9943392d4e6b428dd7bcd794c82c86))
-   update dependencies ([c4d3ef9](https://github.com/namics/env-linter/commit/9743b87f5a9d78385a34e3d26a6bb34173483d51))

## 0.2.0 (2020-05-31)

### Features

-   add depencencies-exact-version option with support for mono-repos ([15b347a](https://github.com/namics/env-linter/commit/15b347a8632b5657d4ef4fa80675d7fcc4038514), [8d767b9](https://github.com/namics/env-linter/commit/8d767b91858259e94ea4f6daccba7dac5cf01143), [7463682](https://github.com/namics/env-linter/commit/7463682abbbbf6b0856565c2dbd27917ac8e7743), [468a706](https://github.com/namics/env-linter/commit/468a7064d3a1b1110626f01cffe11d221afb383f), [c7d3c59](https://github.com/namics/env-linter/commit/c7d3c59d24aebf7c3029f48d8cb4ceb9f73832e5), [c01a9e9](https://github.com/namics/env-linter/commit/c01a9e98a8e84acd32c8f74bb6785bcac89f3ce7))
-   update dependencies ([c4d3ef9](https://github.com/namics/env-linter/commit/c4d3ef9da9fd5432d439549af5c81760c892b388))

## 0.1.1 (2020-02-02)

### Bug Fixes

-   allow newer npm versions ([f71e340](https://github.com/namics/env-linter/commit/f71e340b50d1731b6c37fdb0ae1c4bd8d23ff68e))
-   fix travis-badge url ([f58cdf0](https://github.com/namics/env-linter/commit/f58cdf038cff9cb90e83e959d4342c857f15321f))
-   update error-log for hooks-installed check ([808c20f](https://github.com/namics/env-linter/commit/808c20fe7a3f3710cdd1f8f110dc8af0f92b5cc0))

## 0.1.0 (2020-01-15)

### Features

-   add versions checker ([ea0ab14](https://github.com/namics/env-linter/commit/ea0ab146a6824fd59ed121302852391ccc6c615d), [c48cb82](https://github.com/namics/env-linter/commit/c48cb82e03b3b833407f415328bae9d12a39a57c), [d30c284](https://github.com/namics/env-linter/commit/d30c28432ac946bafb37cbc8339959d8c87e9e8e), [9930bee](https://github.com/namics/env-linter/commit/9930beed4250770b322a05adcc33f7a4711a0d0c), [9cefd4b](https://github.com/namics/env-linter/commit/9cefd4bfdfd6f0721e63140ec11165d5bcb1e931))
-   add save-exact checker ([3bc48ba](https://github.com/namics/env-linter/commit/3bc48badc459fc55eb71251f228fabbcd82b1eef))
-   add hooks-installed checker ([fe26eb3](https://github.com/namics/env-linter/commit/fe26eb3d8b9106502417eb1d5cd5905efe6dd369))
