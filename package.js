Package.describe({
  name: 'dburles:conduit',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use([
    'ecmascript',
    'tracker',
    'reactive-var'
  ], 'client');
  api.addFiles('conduit.js', 'client');
  api.export('conduit', 'client');
});
