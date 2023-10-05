#!/usr/bin/env node
import { getAllProjectsURLs, getLogsFromUrls, transformLogs, commitToGit } from './controllers/controller.js'
import { die, born, exitHandler } from './controllers/phaser.js';
import { wrapper } from './functions/wrapper.js';
import { buildText } from './services/translation.js';

async function main() {
    await born()

    buildText('trying', 'pedro', 'bem?', 'josé')

    const urls = await wrapper(getAllProjectsURLs)
    const logs = await wrapper(getLogsFromUrls, urls)
    const JSONLogs = await wrapper(transformLogs, logs)
    await wrapper(commitToGit, JSONLogs)

    await die()
}

process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

main()
