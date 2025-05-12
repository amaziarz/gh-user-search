## Getting Started

Install packages.
`--legacy-peer-deps` flag is required because some packages do not officialy support React 19 yet:

```bash
npm install --legacy-peer-deps
```

Run the development server:

```bash
npm run dev
```

or build and run the preview server:

```bash
npm run build
npm run preview
```

## Testing

This project uses [Vitest](https://vitest.dev/) as the testing framework. To run tests:

```bash
# Run all tests once
npm test

# Run tests in watch mode during development
npm run test:watch
```
