let m = /<([A-z-]+)[^>]*>[^<>]*<\/\1>|<([A-z-]+)[^>]*\/>/ig
let get_idpl = /\[\^[0-9]+\^\]/g
let rn = /(\r|\n)/g
let get_id = /[0-9]+/
let htmlTag = /<(([A-z-]+)[^>]*)>([^<]*)<\/\2>|<(([A-z-]+)[^>]*)\/>/

export function buildMap(str) {

    console.time("buildMap")

    let idMap = {}
    let id = 0
    let flag = true
    let local_str = str.replace(rn, "")
    while (flag) {
        let match_falg = false
        local_str = local_str.replace(m, (...args) => {
            match_falg = true
            let len = args.length
            if (len < 4) {
                flag = false
            } else {
                let match_tag = args[0]
                id++
                idMap[id] = match_tag
                return `[^${id}^]`
            }
        })
        if (!match_falg) flag = false
    }

    function parseContent(contentStr) {
        const children = []

        const textNodes = contentStr.split(get_idpl) || []
        const idPls = contentStr.match(get_idpl) || []

        const maxLen = Math.max(textNodes.length, idPls.length)

        for (let i = 0; i < maxLen; i++) {
            let textNode = textNodes[i]
            let idPl = idPls[i]
            if (textNode && textNode.trim()) {
                textNode = textNode.trim()
                if (textNode) {
                    children.push({
                        type: "text",
                        text: textNode
                    })
                }
            }
            if (idPl) {
                let id = idPl.match(get_id)[0]
                let [_, attrs, tagName, content,closeAttrs,closeTagName] = idMap[id].match(htmlTag) || []
                if (tagName || closeTagName) {
                    children.push({
                        type: "node",
                        attrs:attrs || closeAttrs,
                        tagName:tagName || closeTagName,
                        children: content ? parseContent(content) : []
                    })
                } else {
                    console.warn("标签解析失败:", idMap[id].match(htmlTag))
                }
            }
        }

        return children
    }

    let r = parseContent(local_str)
    console.timeEnd("buildMap")
    return r
}