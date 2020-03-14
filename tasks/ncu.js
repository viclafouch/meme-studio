const ncu = require('npm-check-updates');

ncu.run({
    // Any command-line option can be specified here.
    // These are set by default:
    packageFile: './package.json',
    jsonUpgraded: true,
    packageManager: 'npm',
    silent: true
}).then((upgraded) => {
    console.log('Root dependencies to upgrade:', upgraded);
});

ncu.run({
    // Any command-line option can be specified here.
    // These are set by default:
    packageFile: './src/client/package.json',
    jsonUpgraded: true,
    packageManager: 'npm',
    silent: true
}).then((upgraded) => {
    console.log('Client dependencies to upgrade:', upgraded);
});