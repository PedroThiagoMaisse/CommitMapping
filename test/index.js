// Import things and more things and more things and more things

// A function called by Test / IsTest
// That returns a errors and break everything when there is an error
async function main() {
    // Generate a new log type to analyse the 3 at the same time?
    // No, actually that would be bad (i think)

    const x = testArchiveGenerationAndLookUp()
    const y = testCrawlAndGitFilesSeparation()
    const z = testCloneGitAndGetCommits()

    Promise.all(x,y,z)

    const a = compareResults(x,y,z)
}

async function testArchiveGenerationAndLookUp() {

    const path = process.env.COMMITPATH + '/temp/test/'

    if (await existFile(path)) { await deleteFolder(path, { recursive: true, force: true }) }

    await createFolder(path)
    
    // look for it after this
}

async function testCloneGitAndGetCommits() {
}

async function testCrawlAndGitFilesSeparation() {

}

async function compareResults() {

}
// Dont push