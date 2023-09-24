#!/usr/bin/env node
import { getAllProjectsURLs, getLogsFromUrls, transformLogs, commitToGit } from './controllers/controller.js'
import { die, born, isOn } from './controllers/phaser.js';
import { wrapper } from './services/functions.js';
import { parse } from './services/parser.js'
import chalk from 'chalk';


async function main() {
    await born()
    const urls = await wrapper(getAllProjectsURLs)
    console.log(process.platform)
    const logs = await wrapper(getLogsFromUrls, urls)
    const JSONLogs = await wrapper(transformLogs, logs)
    await wrapper(commitToGit, JSONLogs)

    await die()
}


main()
