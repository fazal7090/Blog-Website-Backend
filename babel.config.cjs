module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }]
  ]
};
// this file is cjs so that Node may know to treat this file as commonjs syntax