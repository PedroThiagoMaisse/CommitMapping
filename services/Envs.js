async function setEnvironmentVariable(obj) {

    for (const [key, value] of Object.entries(obj)) {
        process.env[key] = value
    }

}

export {setEnvironmentVariable}