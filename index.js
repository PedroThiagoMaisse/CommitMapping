#!/usr/bin/env node
import { getAllProjectsURLs, getLogsFromUrls, transformLogs, getSetEnvs } from './controllers/controller.js'

async function main() {
    await getSetEnvs()

    // const urls = await getAllProjectsURLs()

    // const logs = await getLogsFromUrls(urls)

    // const JSONLogs = await transformLogs(logs)
   
}

main()