type CacheItem = {
    accessed: number,
    value: string
}

const CACHE_TIMEOUT = 86400 * 1000;
// const CACHE_TIMEOUT = 1000

export class Cache {
    store: Map<string, CacheItem> = new Map()

    static read() {
        let instance = new Cache()
        const str = localStorage.getItem("cache")

        if (str === null)
            return instance

        instance.store = new Map(JSON.parse(str))

        return instance
    }

    pruneAndWrite() {
        this.prune()
        localStorage.setItem("cache", JSON.stringify(Array.from(this.store.entries())))
    }

    getItem(query: string): string | null {
        const result = this.store.get(query)
        if (result === undefined)
            return null

        result.accessed = Date.now()
        return result.value
    }

    putItem(key: string, value: string) {
        this.store.set(key, {
            accessed: Date.now(),
            value
        })
    }

    prune() {
        const lastKeepTime = Date.now() - CACHE_TIMEOUT

        let toDelete = Array.from(this.store.entries())
            .filter(([_, y]) => y.accessed < lastKeepTime)

        for (const [x, _] of toDelete) {
            this.store.delete(x)
        }
    }
}
