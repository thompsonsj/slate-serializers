# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## 1.0.0 (2023-07-19)


### ⚠ BREAKING CHANGES

* **slatetodom:** apply markTransforms on Slate JSON properties (#66)

### Features

* ***to*:** handle html entities appropriately ([#22](https://github.com/thompsonsj/slate-serializers/issues/22)) ([2cd5ce1](https://github.com/thompsonsj/slate-serializers/commit/2cd5ce1b52c2c974c139dbb38a297ce31231283b))
* ***to*:** html manipulation capabilities ([#19](https://github.com/thompsonsj/slate-serializers/issues/19)) ([341cf32](https://github.com/thompsonsj/slate-serializers/commit/341cf325a763cf6066311bd183dbbf0db5d580bf))
* **config:** extract and make customizable ([#10](https://github.com/thompsonsj/slate-serializers/issues/10)) ([2ea995e](https://github.com/thompsonsj/slate-serializers/commit/2ea995e2ccee3b98ae9b4b98c06ccef71594bab8))
* **defaulttag:** replace enforceTopLevelPTags ([#13](https://github.com/thompsonsj/slate-serializers/issues/13)) ([e144e03](https://github.com/thompsonsj/slate-serializers/commit/e144e03e02001f90454deb76a0b71acf2261ac66))
* **htmltoslate:** process whitespace depending on context ([#18](https://github.com/thompsonsj/slate-serializers/issues/18)) ([0c9feac](https://github.com/thompsonsj/slate-serializers/commit/0c9feac90e460573859bed678c2428c125b49556))
* **htmltoslate:** support line breaks ([#6](https://github.com/thompsonsj/slate-serializers/issues/6)) ([fe98bfb](https://github.com/thompsonsj/slate-serializers/commit/fe98bfbc24bd4ff9025f70b08f16f8994ac9247f))
* **serializers:** htmlToSlate and slateToHtml ([#1](https://github.com/thompsonsj/slate-serializers/issues/1)) ([bc58250](https://github.com/thompsonsj/slate-serializers/commit/bc5825060f40723e9fb575dc97ba7b132f9710a4))
* **serializers:** support more HTML tags ([#2](https://github.com/thompsonsj/slate-serializers/issues/2)) ([84a09a8](https://github.com/thompsonsj/slate-serializers/commit/84a09a8ba81e4e69131cf45b442dda4c3b0397f7))
* **slatetodom:** add encodeBreakingEntities option ([#57](https://github.com/thompsonsj/slate-serializers/issues/57)) ([f5c85d7](https://github.com/thompsonsj/slate-serializers/commit/f5c85d7c71ca75d5906f3f924d4fa37610894bb6))
* **slatetohtml:** control html entity encoding ([#17](https://github.com/thompsonsj/slate-serializers/issues/17)) ([1f660b3](https://github.com/thompsonsj/slate-serializers/commit/1f660b3bf172bab29168fe52ff103f3b0d00d70c))
* **slatetohtml:** convert line breaks to br tags ([#33](https://github.com/thompsonsj/slate-serializers/issues/33)) ([fe080fb](https://github.com/thompsonsj/slate-serializers/commit/fe080fbde907f01a0e3a389ddc82bbe13cb4581d))
* **slatetohtml:** improve text tag support ([#3](https://github.com/thompsonsj/slate-serializers/issues/3)) ([44d45b6](https://github.com/thompsonsj/slate-serializers/commit/44d45b682ef34bd7ff87a1c6605565fe897f0afd))
* **slatetohtml:** mark transforms ([#63](https://github.com/thompsonsj/slate-serializers/issues/63)) ([c67d785](https://github.com/thompsonsj/slate-serializers/commit/c67d7850f3d2a990be06c75a26fc4512b9bdc6cb))
* **slatetohtml:** support newtab links ([#5](https://github.com/thompsonsj/slate-serializers/issues/5)) ([ef8d004](https://github.com/thompsonsj/slate-serializers/commit/ef8d004a101f69e7999c59dab4f5f68b3dd5435d))
* **slatetoreact:** add serializer ([#55](https://github.com/thompsonsj/slate-serializers/issues/55)) ([8b59a7e](https://github.com/thompsonsj/slate-serializers/commit/8b59a7ef2382a5f3113476b0017a8244a60e539a))
* **src:** export a type for elementTransform fns ([#71](https://github.com/thompsonsj/slate-serializers/issues/71)) ([033d0b4](https://github.com/thompsonsj/slate-serializers/commit/033d0b4c577adbcd064012b3a762d4e047e90fd7))
* support custom attributes ([#7](https://github.com/thompsonsj/slate-serializers/issues/7)) ([2192b0e](https://github.com/thompsonsj/slate-serializers/commit/2192b0ea5c972d12901ac2ebfc4e35120408f46e))
* version management, better exports and types ([c8f049a](https://github.com/thompsonsj/slate-serializers/commit/c8f049ad24b4fefa07b71f091d202dd6e72ce10b))


### Bug Fixes

* error when parsing empty or self-closing tags ([#23](https://github.com/thompsonsj/slate-serializers/issues/23)) ([8adb74b](https://github.com/thompsonsj/slate-serializers/commit/8adb74b238c501d4f64c4274a710c6aa9cec0f26))
* **html-to-slate:** trim whitespace that precedes a block element ([#38](https://github.com/thompsonsj/slate-serializers/issues/38)) ([74f3d24](https://github.com/thompsonsj/slate-serializers/commit/74f3d24ce7dda16279b349502626dec481bdb21c))
* **htmltoslate:** call to gatherTextMarkAttributes using default config ([#77](https://github.com/thompsonsj/slate-serializers/issues/77)) ([2afc34f](https://github.com/thompsonsj/slate-serializers/commit/2afc34fcbd038793b3d986501c63328e4ae62b9a))
* **htmltoslate:** ensure empty children have a text node ([#21](https://github.com/thompsonsj/slate-serializers/issues/21)) ([59ac5b9](https://github.com/thompsonsj/slate-serializers/commit/59ac5b9e61a1ad3018c8013bbfbad4a20b86b43b))
* **htmltoslate:** htmlToSlate function add return type ([#43](https://github.com/thompsonsj/slate-serializers/issues/43)) ([#45](https://github.com/thompsonsj/slate-serializers/issues/45)) ([9ee52a5](https://github.com/thompsonsj/slate-serializers/commit/9ee52a584e3f374b26ea0bb1ba6df3d7b5b25fb4))
* **htmltoslate:** shadowed variable ([#42](https://github.com/thompsonsj/slate-serializers/issues/42)) ([aa7ee16](https://github.com/thompsonsj/slate-serializers/commit/aa7ee163ae5099e6f33d69060ff373d581c443ea))
* lint and format ([#58](https://github.com/thompsonsj/slate-serializers/issues/58)) ([329a43b](https://github.com/thompsonsj/slate-serializers/commit/329a43bc94a1c3538769003e166955b9f4bee8c2))
* **package.json:** downgrade htmlparser2 for Webpack 4 compatibility ([#49](https://github.com/thompsonsj/slate-serializers/issues/49)) ([47bc3b0](https://github.com/thompsonsj/slate-serializers/commit/47bc3b05d20a0671ac10147f9dab67ac14b9c549))
* **package.json:** move css-select dependency ([#60](https://github.com/thompsonsj/slate-serializers/issues/60)) ([06ddd57](https://github.com/thompsonsj/slate-serializers/commit/06ddd57dc586aa0b372f85193e863ce9e5209c05))
* **readme.md:** apply corrections ([#11](https://github.com/thompsonsj/slate-serializers/issues/11)) ([e12d933](https://github.com/thompsonsj/slate-serializers/commit/e12d9339c2bac12cb781109ea61372c73b2d962b))
* **slatetodom:** parseDocument argument type ([#50](https://github.com/thompsonsj/slate-serializers/issues/50)) ([db8d566](https://github.com/thompsonsj/slate-serializers/commit/db8d566a5fe2a3a64dab05f89de0c86b1e65ecd6))
* **slatetohtml:** do not add an empty style attribute ([#20](https://github.com/thompsonsj/slate-serializers/issues/20)) ([a303806](https://github.com/thompsonsj/slate-serializers/commit/a303806e2baaf99536a716dca1763e2ba8270c49))
* **slatetohtml:** do not escape html entities ([#16](https://github.com/thompsonsj/slate-serializers/issues/16)) ([4d25706](https://github.com/thompsonsj/slate-serializers/commit/4d2570634eeff3b04629c49e65009385249a99a7))
* **slatetohtml:** return an empty document if no Slate object ([#51](https://github.com/thompsonsj/slate-serializers/issues/51)) ([42a1e7a](https://github.com/thompsonsj/slate-serializers/commit/42a1e7a3646a1cb4d94801d842fbe872d9d356b8))
* **src:** folder capitalisation ([#47](https://github.com/thompsonsj/slate-serializers/issues/47)) ([90a61e4](https://github.com/thompsonsj/slate-serializers/commit/90a61e44d1801cd71d45d694885c29339ad32a3f))
* **src:** remove unused directories ([#48](https://github.com/thompsonsj/slate-serializers/issues/48)) ([4717128](https://github.com/thompsonsj/slate-serializers/commit/4717128bb2e1478e90b25f2592edd6e60a306eb2))
* **update-html:** import ([2ae2af8](https://github.com/thompsonsj/slate-serializers/commit/2ae2af8503703661abaae5378b5d3ee01613e917))


### Reverts

* Revert "refactor(config): extend all config from a sensible default (#26)" (#27) ([e253c4e](https://github.com/thompsonsj/slate-serializers/commit/e253c4e66c1adeac872052cbb6435892b25c19aa)), closes [#26](https://github.com/thompsonsj/slate-serializers/issues/26) [#27](https://github.com/thompsonsj/slate-serializers/issues/27)


### Styles

* lint and format ([#68](https://github.com/thompsonsj/slate-serializers/issues/68)) ([e800aba](https://github.com/thompsonsj/slate-serializers/commit/e800abad1b14c5ced2592cbb2bcd2f4e95aea753))


### Code Refactoring

* migrate to nx integrated monorepo ([#81](https://github.com/thompsonsj/slate-serializers/issues/81)) ([e089f7c](https://github.com/thompsonsj/slate-serializers/commit/e089f7cfc6e4616f209189807404ae84bc691eba))
* **slatetodom:** apply markTransforms on Slate JSON properties ([#66](https://github.com/thompsonsj/slate-serializers/issues/66)) ([4dd110f](https://github.com/thompsonsj/slate-serializers/commit/4dd110f99e75f0d8a30a8d040481d5fa65ff93f9))

## [0.4.1](https://github.com/thompsonsj/slate-serializers/compare/v0.4.0...v0.4.1) (2023-07-13)


### Bug Fixes

* **htmltoslate:** call to gatherTextMarkAttributes using default config ([#77](https://github.com/thompsonsj/slate-serializers/issues/77)) ([2afc34f](https://github.com/thompsonsj/slate-serializers/commit/2afc34fcbd038793b3d986501c63328e4ae62b9a))

## [0.4.0](https://github.com/thompsonsj/slate-serializers/compare/v0.3.0...v0.4.0) (2023-06-25)


### Features

* **src:** export a type for elementTransform fns ([#71](https://github.com/thompsonsj/slate-serializers/issues/71)) ([033d0b4](https://github.com/thompsonsj/slate-serializers/commit/033d0b4c577adbcd064012b3a762d4e047e90fd7))

## [0.3.0](https://github.com/thompsonsj/slate-serializers/compare/v0.2.0...v0.3.0) (2023-06-25)


### Features

* **slatetoreact:** add serializer ([#55](https://github.com/thompsonsj/slate-serializers/issues/55)) ([8b59a7e](https://github.com/thompsonsj/slate-serializers/commit/8b59a7ef2382a5f3113476b0017a8244a60e539a))

## [0.2.0](https://github.com/thompsonsj/slate-serializers/compare/v0.1.0...v0.2.0) (2023-06-18)


### ⚠ BREAKING CHANGES

* **slatetodom:** apply markTransforms on Slate JSON properties ([#66](https://github.com/thompsonsj/slate-serializers/issues/66))

### Code Refactoring

* **slatetodom:** apply markTransforms on Slate JSON properties ([#66](https://github.com/thompsonsj/slate-serializers/issues/66)) ([4dd110f](https://github.com/thompsonsj/slate-serializers/commit/4dd110f99e75f0d8a30a8d040481d5fa65ff93f9))


### Styles

* lint and format ([#68](https://github.com/thompsonsj/slate-serializers/issues/68)) ([e800aba](https://github.com/thompsonsj/slate-serializers/commit/e800abad1b14c5ced2592cbb2bcd2f4e95aea753))

## [0.1.0](https://github.com/thompsonsj/slate-serializers/compare/v0.0.33...v0.1.0) (2023-06-03)


### Features

* **slatetohtml:** mark transforms ([#63](https://github.com/thompsonsj/slate-serializers/issues/63)) ([c67d785](https://github.com/thompsonsj/slate-serializers/commit/c67d7850f3d2a990be06c75a26fc4512b9bdc6cb))

### [0.0.33](https://github.com/thompsonsj/slate-serializers/compare/v0.0.32...v0.0.33) (2023-05-28)


### Bug Fixes

* **package.json:** move css-select dependency ([#60](https://github.com/thompsonsj/slate-serializers/issues/60)) ([06ddd57](https://github.com/thompsonsj/slate-serializers/commit/06ddd57dc586aa0b372f85193e863ce9e5209c05))

### [0.0.32](https://github.com/thompsonsj/slate-serializers/compare/v0.0.31...v0.0.32) (2023-04-24)


### Features

* **slatetodom:** add encodeBreakingEntities option ([#57](https://github.com/thompsonsj/slate-serializers/issues/57)) ([f5c85d7](https://github.com/thompsonsj/slate-serializers/commit/f5c85d7c71ca75d5906f3f924d4fa37610894bb6))


### Bug Fixes

* lint and format ([#58](https://github.com/thompsonsj/slate-serializers/issues/58)) ([329a43b](https://github.com/thompsonsj/slate-serializers/commit/329a43bc94a1c3538769003e166955b9f4bee8c2))

### [0.0.31](https://github.com/thompsonsj/slate-serializers/compare/v0.0.30...v0.0.31) (2023-03-27)

### [0.0.30](https://github.com/thompsonsj/slate-serializers/compare/v0.0.29...v0.0.30) (2023-03-08)


### Bug Fixes

* **slatetodom:** parseDocument argument type ([#50](https://github.com/thompsonsj/slate-serializers/issues/50)) ([db8d566](https://github.com/thompsonsj/slate-serializers/commit/db8d566a5fe2a3a64dab05f89de0c86b1e65ecd6))
* **slatetohtml:** return an empty document if no Slate object ([#51](https://github.com/thompsonsj/slate-serializers/issues/51)) ([42a1e7a](https://github.com/thompsonsj/slate-serializers/commit/42a1e7a3646a1cb4d94801d842fbe872d9d356b8))

### [0.0.29](https://github.com/thompsonsj/slate-serializers/compare/v0.0.28...v0.0.29) (2023-02-21)


### Bug Fixes

* **package.json:** downgrade htmlparser2 for Webpack 4 compatibility ([#49](https://github.com/thompsonsj/slate-serializers/issues/49)) ([47bc3b0](https://github.com/thompsonsj/slate-serializers/commit/47bc3b05d20a0671ac10147f9dab67ac14b9c549))

### [0.0.28](https://github.com/thompsonsj/slate-serializers/compare/v0.0.27...v0.0.28) (2023-02-21)


### Bug Fixes

* **htmltoslate:** htmlToSlate function add return type ([#43](https://github.com/thompsonsj/slate-serializers/issues/43)) ([#45](https://github.com/thompsonsj/slate-serializers/issues/45)) ([9ee52a5](https://github.com/thompsonsj/slate-serializers/commit/9ee52a584e3f374b26ea0bb1ba6df3d7b5b25fb4))
* **src:** folder capitalisation ([#47](https://github.com/thompsonsj/slate-serializers/issues/47)) ([90a61e4](https://github.com/thompsonsj/slate-serializers/commit/90a61e44d1801cd71d45d694885c29339ad32a3f))
* **src:** remove unused directories ([#48](https://github.com/thompsonsj/slate-serializers/issues/48)) ([4717128](https://github.com/thompsonsj/slate-serializers/commit/4717128bb2e1478e90b25f2592edd6e60a306eb2))

### [0.0.27](https://github.com/thompsonsj/slate-serializers/compare/v0.0.26...v0.0.27) (2023-02-13)


### Bug Fixes

* **htmltoslate:** shadowed variable ([#42](https://github.com/thompsonsj/slate-serializers/issues/42)) ([aa7ee16](https://github.com/thompsonsj/slate-serializers/commit/aa7ee163ae5099e6f33d69060ff373d581c443ea))

### [0.0.26](https://github.com/thompsonsj/slate-serializers/compare/v0.0.25...v0.0.26) (2023-02-13)


### Bug Fixes

* **html-to-slate:** trim whitespace that precedes a block element ([#38](https://github.com/thompsonsj/slate-serializers/issues/38)) ([74f3d24](https://github.com/thompsonsj/slate-serializers/commit/74f3d24ce7dda16279b349502626dec481bdb21c))

### [0.0.25](https://github.com/thompsonsj/slate-serializers/compare/v0.0.23...v0.0.25) (2023-01-24)


### Features

* **slatetohtml:** convert line breaks to br tags ([#33](https://github.com/thompsonsj/slate-serializers/issues/33)) ([fe080fb](https://github.com/thompsonsj/slate-serializers/commit/fe080fbde907f01a0e3a389ddc82bbe13cb4581d))

### [0.0.24](https://github.com/thompsonsj/slate-serializers/compare/v0.0.23...v0.0.24) (2023-01-19)

### [0.0.23](https://github.com/thompsonsj/slate-serializers/compare/v0.0.22...v0.0.23) (2023-01-18)

### [0.0.22](https://github.com/thompsonsj/slate-serializers/compare/v0.0.20...v0.0.22) (2022-12-16)


### Bug Fixes

* error when parsing empty or self-closing tags ([#23](https://github.com/thompsonsj/slate-serializers/issues/23)) ([8adb74b](https://github.com/thompsonsj/slate-serializers/commit/8adb74b238c501d4f64c4274a710c6aa9cec0f26))

### [0.0.21](https://github.com/thompsonsj/slate-serializers/compare/v0.0.20...v0.0.21) (2022-12-16)

### [0.0.20](https://github.com/thompsonsj/slate-serializers/compare/v0.0.19...v0.0.20) (2022-12-09)

### [0.0.19](https://github.com/thompsonsj/slate-serializers/compare/v0.0.18...v0.0.19) (2022-12-09)


### Features

* ***to*:** handle html entities appropriately ([#22](https://github.com/thompsonsj/slate-serializers/issues/22)) ([2cd5ce1](https://github.com/thompsonsj/slate-serializers/commit/2cd5ce1b52c2c974c139dbb38a297ce31231283b))

### [0.0.18](https://github.com/thompsonsj/slate-serializers/compare/v0.0.17...v0.0.18) (2022-12-07)


### Bug Fixes

* **htmltoslate:** ensure empty children have a text node ([#21](https://github.com/thompsonsj/slate-serializers/issues/21)) ([59ac5b9](https://github.com/thompsonsj/slate-serializers/commit/59ac5b9e61a1ad3018c8013bbfbad4a20b86b43b))

### [0.0.17](https://github.com/thompsonsj/slate-serializers/compare/v0.0.16...v0.0.17) (2022-12-06)


### Bug Fixes

* **slatetohtml:** do not add an empty style attribute ([#20](https://github.com/thompsonsj/slate-serializers/issues/20)) ([a303806](https://github.com/thompsonsj/slate-serializers/commit/a303806e2baaf99536a716dca1763e2ba8270c49))

### [0.0.16](https://github.com/thompsonsj/slate-serializers/compare/v0.0.15...v0.0.16) (2022-12-06)


### Bug Fixes

* **update-html:** import ([2ae2af8](https://github.com/thompsonsj/slate-serializers/commit/2ae2af8503703661abaae5378b5d3ee01613e917))

### [0.0.15](https://github.com/thompsonsj/slate-serializers/compare/v0.0.14...v0.0.15) (2022-12-06)


### Features

* ***to*:** html manipulation capabilities ([#19](https://github.com/thompsonsj/slate-serializers/issues/19)) ([341cf32](https://github.com/thompsonsj/slate-serializers/commit/341cf325a763cf6066311bd183dbbf0db5d580bf))

### [0.0.14](https://github.com/thompsonsj/slate-serializers/compare/v0.0.13...v0.0.14) (2022-12-03)


### Features

* **htmltoslate:** process whitespace depending on context ([#18](https://github.com/thompsonsj/slate-serializers/issues/18)) ([0c9feac](https://github.com/thompsonsj/slate-serializers/commit/0c9feac90e460573859bed678c2428c125b49556))

### [0.0.13](https://github.com/thompsonsj/slate-serializers/compare/v0.0.12...v0.0.13) (2022-11-29)


### Features

* **slatetohtml:** control html entity encoding ([#17](https://github.com/thompsonsj/slate-serializers/issues/17)) ([1f660b3](https://github.com/thompsonsj/slate-serializers/commit/1f660b3bf172bab29168fe52ff103f3b0d00d70c))

### [0.0.12](https://github.com/thompsonsj/slate-serializers/compare/v0.0.11...v0.0.12) (2022-11-28)


### Bug Fixes

* **slatetohtml:** do not escape html entities ([#16](https://github.com/thompsonsj/slate-serializers/issues/16)) ([4d25706](https://github.com/thompsonsj/slate-serializers/commit/4d2570634eeff3b04629c49e65009385249a99a7))

### [0.0.11](https://github.com/thompsonsj/slate-serializers/compare/v0.0.10...v0.0.11) (2022-11-28)


### Features

* **defaulttag:** replace enforceTopLevelPTags ([#13](https://github.com/thompsonsj/slate-serializers/issues/13)) ([e144e03](https://github.com/thompsonsj/slate-serializers/commit/e144e03e02001f90454deb76a0b71acf2261ac66))


### Bug Fixes

* **readme.md:** apply corrections ([#11](https://github.com/thompsonsj/slate-serializers/issues/11)) ([e12d933](https://github.com/thompsonsj/slate-serializers/commit/e12d9339c2bac12cb781109ea61372c73b2d962b))

### [0.0.10](https://github.com/thompsonsj/slate-serializers/compare/v0.0.9...v0.0.10) (2022-11-28)


### Features

* **config:** extract and make customizable ([#10](https://github.com/thompsonsj/slate-serializers/issues/10)) ([2ea995e](https://github.com/thompsonsj/slate-serializers/commit/2ea995e2ccee3b98ae9b4b98c06ccef71594bab8))

### [0.0.9](https://github.com/thompsonsj/slate-serializers/compare/v0.0.7...v0.0.9) (2022-11-27)


### Features

* **htmltoslate:** support line breaks ([#6](https://github.com/thompsonsj/slate-serializers/issues/6)) ([fe98bfb](https://github.com/thompsonsj/slate-serializers/commit/fe98bfbc24bd4ff9025f70b08f16f8994ac9247f))
* **slatetohtml:** support newtab links ([#5](https://github.com/thompsonsj/slate-serializers/issues/5)) ([ef8d004](https://github.com/thompsonsj/slate-serializers/commit/ef8d004a101f69e7999c59dab4f5f68b3dd5435d))
* support custom attributes ([#7](https://github.com/thompsonsj/slate-serializers/issues/7)) ([2192b0e](https://github.com/thompsonsj/slate-serializers/commit/2192b0ea5c972d12901ac2ebfc4e35120408f46e))

### [0.0.8](https://github.com/thompsonsj/slate-serializers/compare/v0.0.7...v0.0.8) (2022-11-25)


### Features

* **htmltoslate:** support line breaks ([#6](https://github.com/thompsonsj/slate-serializers/issues/6)) ([fe98bfb](https://github.com/thompsonsj/slate-serializers/commit/fe98bfbc24bd4ff9025f70b08f16f8994ac9247f))
* **slatetohtml:** support newtab links ([#5](https://github.com/thompsonsj/slate-serializers/issues/5)) ([ef8d004](https://github.com/thompsonsj/slate-serializers/commit/ef8d004a101f69e7999c59dab4f5f68b3dd5435d))
* support custom attributes ([#7](https://github.com/thompsonsj/slate-serializers/issues/7)) ([2192b0e](https://github.com/thompsonsj/slate-serializers/commit/2192b0ea5c972d12901ac2ebfc4e35120408f46e))

### [0.0.7](https://github.com/thompsonsj/slate-serializers/compare/v0.0.5...v0.0.7) (2022-11-25)


### Features

* **slatetohtml:** improve text tag support ([#3](https://github.com/thompsonsj/slate-serializers/issues/3)) ([44d45b6](https://github.com/thompsonsj/slate-serializers/commit/44d45b682ef34bd7ff87a1c6605565fe897f0afd))

### [0.0.6](https://github.com/thompsonsj/slate-serializers/compare/v0.0.5...v0.0.6) (2022-11-24)

### [0.0.5](https://github.com/thompsonsj/slate-serializers/compare/v0.0.3...v0.0.5) (2022-11-24)


### Features

* **serializers:** support more HTML tags ([#2](https://github.com/thompsonsj/slate-serializers/issues/2)) ([84a09a8](https://github.com/thompsonsj/slate-serializers/commit/84a09a8ba81e4e69131cf45b442dda4c3b0397f7))

### [0.0.4](https://github.com/thompsonsj/slate-serializers/compare/v0.0.3...v0.0.4) (2022-11-24)


### Features

* **serializers:** support more HTML tags ([#2](https://github.com/thompsonsj/slate-serializers/issues/2)) ([84a09a8](https://github.com/thompsonsj/slate-serializers/commit/84a09a8ba81e4e69131cf45b442dda4c3b0397f7))

### [0.0.3](https://github.com/thompsonsj/slate-serializers/compare/v0.0.2...v0.0.3) (2022-11-23)

### 0.0.2 (2022-11-23)


### Features

* **serializers:** htmlToSlate and slateToHtml ([#1](https://github.com/thompsonsj/slate-serializers/issues/1)) ([bc58250](https://github.com/thompsonsj/slate-serializers/commit/bc5825060f40723e9fb575dc97ba7b132f9710a4))
