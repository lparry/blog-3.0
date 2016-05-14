/**
 * React Static Boilerplate
 * https://github.com/koistya/react-static-boilerplate
 * Copyright (c) Konstantin Tarkus (@koistya) | MIT license
 */

import glob from "glob"
import { join } from "path"

export default function(source) {
  this.cacheable()
  const target = this.target
  const callback = this.async()

  if (target === "node") {
    source = source.replace("import 'babel/polyfill';", "") // eslint-disable-line no-param-reassign
  }

  glob("**/*.{js,jsx}", { cwd: join(__dirname, "../../pages/blog") }, (err, files) => {
    if (err) {
      return callback(err)
    }

    const pages = files.map(file => {
      let path = file

      if (path.endsWith(".js")) {
        path = path.substr(0, path.length - 3)
      } else if (path.endsWith(".jsx")) {
        path = path.substr(0, path.length - 4)
      }
      return path
    })


    if (pages.length) {
      const pagesData = pages.map((page) => {
        return {
          page: page,
          title: "foo" + page,
        }
      })
      return callback(null, source.replace(" blogPages = []", (" blogPages = " + JSON.stringify(pagesData))))
    }

    return callback(new Error("Cannot find any blog pages."))
  })
}
