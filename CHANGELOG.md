# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.5.1](https://github.com/merkle-open/env-linter/compare/v0.5.0...v0.5.1) (2021-08-30)

## [0.5.0](https://github.com/merkle-open/env-linter/compare/v0.4.0...v0.5.0) (2021-08-14)

### Features

- **hooks:** add support for husky v6 ([32d9ab5](https://github.com/merkle-open/env-linter/commit/32d9ab541db7228b01f3477c2454a424c1bedcf1))
- **hooks:** adjust detection of hooks for husky 7 ([e0570df](https://github.com/merkle-open/env-linter/commit/e0570dfd44a4582f850b067847813f12984c4f4e))
- **log-messages:** show npm version in wrong npm version log message ([a58df21](https://github.com/merkle-open/env-linter/commit/a58df2176adc86d5d4cfcebb2146311d2fee42da))
- **log-messages:** show why is this link next to the warnings ([f94fa41](https://github.com/merkle-open/env-linter/commit/f94fa4194951f3a1ec004fbd69aad6b792ce32e1))
- **security:** add option to check for secure node version ([902ba3b](https://github.com/merkle-open/env-linter/commit/902ba3b31aa59eceedf755084ee598434a4d8106))
- **security:** Check for higher minor security version inside used major version; adjust error and success messages; adjust security tests; ([9504086](https://github.com/merkle-open/env-linter/commit/95040865f43a9eb71401efcd0099a23aac0d1af6))
- **security:** Create security check based on lts; add test; ([86096b7](https://github.com/merkle-open/env-linter/commit/86096b7d7150bd49fe1f2ce5e42bded58dde792a))

### Bug Fixes

- **hooks:** change detection of husky 6 hooks ([f57c732](https://github.com/merkle-open/env-linter/commit/f57c732ebf978aa49e708d290286322a0f41251c))

## [0.4.0](https://github.com/merkle-open/env-linter/compare/v0.2.1...v0.4.0) (2020-09-17)

### Features

- **lts:** add node LTS version check ([5c12c84](https://github.com/merkle-open/env-linter/commit/5c12c8401e6ad773fed95f6b5f472a4d7c07a36a), [87a14cf](https://github.com/merkle-open/env-linter/commit/87a14cf400772556b27d32c9f5b5b6706c371331))

### [0.3.2](https://github.com/merkle-open/env-linter/compare/v0.2.1...v0.3.2) (2020-07-09)

### Bug Fixes

- **hooks-installed:** allow detection of hooks from anywhere in the repository ([ecc7805](https://github.com/merkle-open/env-linter/commit/ecc780559ac462b499ad17146a9a50ed50f72f06))

### [0.3.1](https://github.com/merkle-open/env-linter/compare/v0.2.1...v0.3.1) (2020-06-22)

### Bug Fixes

- **install:** remove env-linter post-install since it is causing issues on install ([7ea513b](https://github.com/merkle-open/env-linter/commit/7ea513bcb0d4ae27ec6675b95cd97431ae65bc91))

## [0.3.0](https://github.com/merkle-open/env-linter/compare/v0.2.1...v0.3.0) (2020-06-22)

### Features

- **env-var:** add environment variable ENV_LINTER_SKIP to skip all env-linter checks ([5eb4548](https://github.com/merkle-open/env-linter/commit/5eb4548a26e4e705b7087c8141ea7acbe0ac399a))

### Bug Fixes

- **ci:** prevent version checks on CI environments ([a54563f](https://github.com/merkle-open/env-linter/commit/a54563f44cd5ad3f02d0b9d9fe3825fa423e32c9))

### [0.2.1](https://github.com/merkle-open/env-linter/compare/v0.2.0...v0.2.1) (2020-06-10)

### Bug Fixes

- use safer method to detect ci environments ([13ef8d6](https://github.com/merkle-open/env-linter/commit/13ef8d6ebd9943392d4e6b428dd7bcd794c82c86))
- update dependencies ([c4d3ef9](https://github.com/merkle-open/env-linter/commit/9743b87f5a9d78385a34e3d26a6bb34173483d51))

## 0.2.0 (2020-05-31)

### Features

- add depencencies-exact-version option with support for mono-repos ([15b347a](https://github.com/merkle-open/env-linter/commit/15b347a8632b5657d4ef4fa80675d7fcc4038514), [8d767b9](https://github.com/merkle-open/env-linter/commit/8d767b91858259e94ea4f6daccba7dac5cf01143), [7463682](https://github.com/merkle-open/env-linter/commit/7463682abbbbf6b0856565c2dbd27917ac8e7743), [468a706](https://github.com/merkle-open/env-linter/commit/468a7064d3a1b1110626f01cffe11d221afb383f), [c7d3c59](https://github.com/merkle-open/env-linter/commit/c7d3c59d24aebf7c3029f48d8cb4ceb9f73832e5), [c01a9e9](https://github.com/merkle-open/env-linter/commit/c01a9e98a8e84acd32c8f74bb6785bcac89f3ce7))
- update dependencies ([c4d3ef9](https://github.com/merkle-open/env-linter/commit/c4d3ef9da9fd5432d439549af5c81760c892b388))

## 0.1.1 (2020-02-02)

### Bug Fixes

- allow newer npm versions ([f71e340](https://github.com/merkle-open/env-linter/commit/f71e340b50d1731b6c37fdb0ae1c4bd8d23ff68e))
- fix travis-badge url ([f58cdf0](https://github.com/merkle-open/env-linter/commit/f58cdf038cff9cb90e83e959d4342c857f15321f))
- update error-log for hooks-installed check ([808c20f](https://github.com/merkle-open/env-linter/commit/808c20fe7a3f3710cdd1f8f110dc8af0f92b5cc0))

## 0.1.0 (2020-01-15)

### Features

- add versions checker ([ea0ab14](https://github.com/merkle-open/env-linter/commit/ea0ab146a6824fd59ed121302852391ccc6c615d), [c48cb82](https://github.com/merkle-open/env-linter/commit/c48cb82e03b3b833407f415328bae9d12a39a57c), [d30c284](https://github.com/merkle-open/env-linter/commit/d30c28432ac946bafb37cbc8339959d8c87e9e8e), [9930bee](https://github.com/merkle-open/env-linter/commit/9930beed4250770b322a05adcc33f7a4711a0d0c), [9cefd4b](https://github.com/merkle-open/env-linter/commit/9cefd4bfdfd6f0721e63140ec11165d5bcb1e931))
- add save-exact checker ([3bc48ba](https://github.com/merkle-open/env-linter/commit/3bc48badc459fc55eb71251f228fabbcd82b1eef))
- add hooks-installed checker ([fe26eb3](https://github.com/merkle-open/env-linter/commit/fe26eb3d8b9106502417eb1d5cd5905efe6dd369))
