# tao-core-libs

TAO Frontent Core Libraries

## Available scripts in the project:

- `npm run build`: put libraries in AMD format into `dist` directory
- `npm run build:watch`: put libraries in AMD format into `dist` directory and watch for changes
- `npm run lint` : verify coding rules

## Shared libraries from npm

Defined libraries shared between the `@oat-sa` world using this repository `peerDependencies`

## Shared libraries from sources

* Library should be in `src` in ES6 format.
* Libraries are built with `rollup` to AMD format into `dist` directory.
