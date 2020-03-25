import start from './lib/server'
const forceReset = process.argv.some((arg) => arg === '--force')
start(forceReset)
