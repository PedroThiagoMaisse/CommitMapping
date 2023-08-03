#!/usr/bin/env node
import { getAllProjectsURLs, getLogsFromUrls, transformLogs, getSetEnvs } from './controllers/controller.js'
import {danger} from './services/test.js'

async function main() {
    // await getSetEnvs()

    danger()

    // const urls = await getAllProjectsURLs()

    // const logs = await getLogsFromUrls(urls)

    // const JSONLogs = await transformLogs(logs)
   
}

main()