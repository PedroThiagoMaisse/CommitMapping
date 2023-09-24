// A ideia é aqui é fazer (futuramente) a verificação de qual o console e linguagem que está rodando, e escolher as opções certas par ao modelo de setDate

async function getSetDateModel(date) {
    try {
        let month = date.getMonth() + 1
        if (month < 10) { month = String('0') + String(month) }
    
        let year = String(date.getFullYear()).slice(2)
   
        return `date ${date.getDate()}-${month}-${year}`
    }

    catch (err) {
        return 'echo error in date'
    }
}

async function getCurrentDate() {
    var datetime = new Date()
    return datetime
}



export{getSetDateModel, getCurrentDate}