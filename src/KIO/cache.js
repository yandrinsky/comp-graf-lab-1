const cacheObject = {
    programCache: {},
    setStates: {},
}

export const cache = new Proxy(cacheObject, {
    set(target, p, value, receiver) {
        if(p === 'programCache') {
            target.programCache = value;

            for(let key in target.setStates){
                if(target.programCache[key]){
                    target.setStates[key]?.(target.programCache[key])
                }
            }

        }

        return true;
    }}
)