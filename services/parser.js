function parse(array) {
    const obj = {}

    for (let index = 0; index < array.length; index++) {
        const element = array[index]
        const next = array[index + 1]

        if (element.includes('--')) {
            try {
                if (!next.includes('--')) {
                    obj[element.slice(2)] = next
                } else { throw('finded')}

            } catch (err) {
                obj[element.slice(2)] = true
            }
        }
    }

    return obj
}


export {parse}