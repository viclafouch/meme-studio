import * as path from 'path'
import * as fs from 'fs'

const IS_DEV = process.env.NODE_ENV !== 'production'

const packageJsonPath = path.join(process.cwd(), 'package.json')
const rawPackageJson = fs.readFileSync(packageJsonPath).toString()
const PackageJson = JSON.parse(rawPackageJson)
const { version: VERSION } = PackageJson

const SERVER_PORT: number = JSON.parse(process.env.PORT || '3000')

export { IS_DEV, VERSION, SERVER_PORT }
