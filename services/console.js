async function getSetDateModel(date) {
    let month = date.getMonth() + 1
    if (month < 10) { month = String('0') + String(month) }
    let year = String(date.getFullYear())

    const commitDate = `${year}-${month}-${date.getDate()}t12:00:00`

    return {
        GIT_AUTHOR_DATE: commitDate,
        GIT_COMMITTER_DATE:  commitDate
    }
}



export{getSetDateModel}