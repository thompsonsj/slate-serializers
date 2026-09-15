/**
 * Local replacement for `@nx/react/plugins/bundle-rollup`.
 * Only adds UMD globals for React; SVG/url plugins are unused here.
 */
module.exports = function getRollupOptions(options) {
  const extraGlobals = {
    react: 'React',
    'react-dom': 'ReactDOM',
  }

  if (Array.isArray(options.output)) {
    options.output.forEach((o) => {
      o.globals = { ...o.globals, ...extraGlobals }
    })
  } else {
    options.output = {
      ...options.output,
      globals: {
        ...options.output.globals,
        ...extraGlobals,
      },
    }
  }

  return options
}
