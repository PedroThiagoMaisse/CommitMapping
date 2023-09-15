#!/usr/bin/env node
import { getAllProjectsURLs, getLogsFromUrls, transformLogs, commitToGit } from './controllers/controller.js'
import { die, born } from './controllers/phaser.js';

async function main() {
    await born()

    const urls = await getAllProjectsURLs()

    const logs = await getLogsFromUrls(urls)

    const JSONLogs = await transformLogs(logs)

    await commitToGit(JSONLogs)

    await die()
}


main()
