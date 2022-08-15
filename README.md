# Pooley

> Generic pool implementation that works with Webworkers, Promises, etc.

| Package                                  | NPM                                                                  | Description                                                            |
| ---------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [@pooley/core](/packages/core)           | ![@pooley/core](https://img.shields.io/npm/v/@pooley/core)           | Generic pool implementation that works with Webworkers, Promises, etc. |
| [@pooley/promise](/packages/promise)     | ![@pooley/promise](https://img.shields.io/npm/v/@pooley/promise)     | Implements Promise-based processor for @pooley/core                    |
| [@pooley/webworker](/packages/webworker) | ![@pooley/webworker](https://img.shields.io/npm/v/@pooley/webworker) | Implements Webworker-based processor for @pooley/core                  |
| [@pooley/queues](/packages/queues)       | ![@pooley/queues](https://img.shields.io/npm/v/@pooley/queues)       | Implements different queues for @pooley/core                           |
| [@pooley/scalers](/packages/scalers)     | ![@pooley/scalers](https://img.shields.io/npm/v/@pooley/scalers)     | Implements different scalers for @pooley/core                          |

---

## Build

Run `nx build package` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test package` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.
