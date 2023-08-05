import { promisify } from 'util'
import fs from 'fs'
import { exec } from 'child_process'

const execute = promisify(exec)
const deleteFolder = promisify(fs.rm)
const existFile = promisify(fs.exists)
const _createFolder = promisify(fs.mkdir)
const _createFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const readFolder = promisify(fs.readdir)

export {execute, deleteFolder, _createFile, existFile, readFile, readFolder, _createFolder}