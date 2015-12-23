Package.describe({
  name: 'dburles:tracker-emitter',
  version: '0.0.1',
  summary: 'React to and emit events from a computation',
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
  api.addFiles('tracker-emitter.js', 'client');
});
