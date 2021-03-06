// shoutout to the best person on the internet
// https://stackoverflow.com/questions/64833803/parcel-and-rc-table-breaks-on-production-build

const fs = require('fs')

const MARKER = 'CHANGE_CONTENT_HASH'

for (const file of ['BodyContext.js', 'ResizeContext.js', 'TableContext.js']) {
    const filePath = require.resolve(`rc-table/es/context/${file}`)
    const content = fs.readFileSync(filePath).toString()
    if (content.includes(MARKER)) {
        continue
    }
    const newContent = content + `\nfunction ${MARKER} () { return ${Math.random()} }`
    fs.writeFileSync(filePath, newContent)
}
