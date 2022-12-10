# Pooley

[![Test](https://github.com/gund/pooley/actions/workflows/test.yml/badge.svg)](https://github.com/gund/pooley/actions/workflows/test.yml)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

> Generic pool implementation that works with Webworkers, Promises, etc.

| Package                                  | NPM                                                                                                                    | Description                                                            |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [@pooley/core](/packages/core)           | [![@pooley/core](https://badge.fury.io/js/@pooley%2Fcore.svg)](https://badge.fury.io/js/@pooley%2Fcore)                | Generic pool implementation that works with Webworkers, Promises, etc. |
| [@pooley/promise](/packages/promise)     | [![@pooley/promise](https://badge.fury.io/js/@pooley%2Fpromise.svg)](https://badge.fury.io/js/@pooley%2Fpromise)       | Implements Promise-based processor for @pooley/core                    |
| [@pooley/webworker](/packages/webworker) | [![@pooley/webworker](https://badge.fury.io/js/@pooley%2Fwebworker.svg)](https://badge.fury.io/js/@pooley%2Fwebworker) | Implements Webworker-based processor for @pooley/core                  |
| [@pooley/queues](/packages/queues)       | [![@pooley/queues](https://badge.fury.io/js/@pooley%2Fqueues.svg)](https://badge.fury.io/js/@pooley%2Fqueues)          | Implements different queues for @pooley/core                           |
| [@pooley/scalers](/packages/scalers)     | [![@pooley/scalers](https://badge.fury.io/js/@pooley%2Fscalers.svg)](https://badge.fury.io/js/@pooley%2Fscalers)       | Implements different scalers for @pooley/core                          |

---

## Build

Run `nx build package` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test package` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.
