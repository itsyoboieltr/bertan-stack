<h1 align="center">
  BERTAN stack
</h1>

The `BERTAN` stack:

- [Bun](https://bun.sh)
- [Elysia](https://elysiajs.com)
- [React](https://react.dev/)
- [TanStack Router](https://tanstack.com/router)

## Creating a project

Create a new project

```bash
bun create itsyoboieltr/bertan-stack
```

Optionally specify a name for the destination folder. If no destination is specified, the name `bertan-stack` will be used.

```bash
bun create itsyoboieltr/bertan-stack my-app
```

Bun will perform the following steps:

- Download the `template`
- Copy all template files into the `destination folder`
- Install dependencies with `bun i`.
- Initialize a fresh Git repo. Opt out with the `--no-git` flag.

## Getting started

### To install dependencies:

```bash
bun install
```

### Developing

Start the `development server` with:

```bash
bun dev
```

### Building

Build for `production` by running the following command:

```bash
bun run build
```

### Running

Run in `production` by running the following command:

```bash
bun start
```

## Deployment (work in progress)

...
