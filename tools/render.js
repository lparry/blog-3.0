import glob from "glob"
import { join, dirname } from "path"
import React from "react"
import ReactDOM from "react-dom/server"
import Html from "../components/Html"
import task from "./lib/task"
import fs from "./lib/fs"

const isDebug = !(process.argv.includes("--release") || process.argv.includes("-r"))

function getPages() {
  return new Promise((resolve, reject) => {
    glob("**/*.{js,jsx}", { cwd: join(__dirname, "../pages") }, (err, files) => {
      if (err) {
        reject(err)
      } else {
        const result = files.map(file => {
          let path
          let metadata
          path = `/${file.substr(0, file.lastIndexOf("."))}`
          if (file.match(/\d{4,4}-\d\d-\d\d-/)) {
            metadata = require(`../pages/${file}`).metadata
          }
          if (metadata) {
            path = metadata.canonicalPath
          } else {
            if (path === "/index") {
              path = "/"
            } else if (path.endsWith("/index")) {
              path = path.substr(0, path.lastIndexOf("/index"))
            }
          }
          return { path, file }
        })
        resolve(result)
      }
    })
  })
}

async function renderPage(page, component) {
  const data = {
    body: ReactDOM.renderToString(component),
  }
  const file = join(__dirname,
                    "../build",
                    `${page.path}/index.html`)
  const html = `<!doctype html>\n${ReactDOM.renderToStaticMarkup(<Html debug={isDebug} {...data} />)}`
  await fs.mkdir(dirname(file))
  await fs.writeFile(file, html)
}

export default task(async function render() {
  const pages = await getPages()
  const { route } = require("../build/app.node").default // eslint-disable-line global-require
  for (const page of pages) {
    await route(page.path, renderPage.bind(undefined, page))
  }
})
