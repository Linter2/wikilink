import "./style.css"

const WIKIPEDIA_SEARCH_PREFIX = "https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&format=json&redirects=resolve&origin=*&search="
// const SEARCH_ENTITIES_PREFIX = "https://www.wikidata.org/w/api.php?action=wbsearchentities&language=en&format=json&origin=*&search="
const SEARCH_ENTITIES_PREFIX = "https://en.wikipedia.org/w/api.php?action=query&ppprop=wikibase_item&prop=pageprops&origin=*&format=json&titles="

const GET_OFFICIAL_SITE_PREFIX = "https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P856&format=json&origin=*&entity="

const params = new URLSearchParams(document.location.search)
const statusDiv = document.getElementById("status")!
const adviceDiv = document.getElementById("advice")!

const query = params.get("query")

processQuery(query!)

async function processQuery(query: string) {
    if (query === null) {
        statusDiv.textContent = `No query in URL parameters`
        adviceDiv.style.display = "block"
        return
    }
    
    const results = await (await fetch(WIKIPEDIA_SEARCH_PREFIX + query)).json()
    const pages = results[1]
    console.log(pages)

    const entityIdRes = await (await fetch(SEARCH_ENTITIES_PREFIX + pages[0])).json()
    console.log(entityIdRes)
    const entityId = (Object.values(entityIdRes.query.pages) as any[])[0].pageprops.wikibase_item


    const site: any[] | undefined = (await (await fetch(GET_OFFICIAL_SITE_PREFIX + entityId)).json())
        .claims.P856

    if (site === undefined || site.length === 0) {
        statusDiv.textContent = `No official sites found for '${query}'`
        return
    }

    const finalSite = site.find(s => s.rank === "preferred") ?? site[0]
    // const finalSite = preferred ;
    
    console.log(finalSite)

    const newURL = finalSite.mainsnak.datavalue.value
    window.location.replace(newURL)
}

