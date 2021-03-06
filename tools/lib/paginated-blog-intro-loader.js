import glob from "glob"
import path, { join } from "path"
import generatePagesData from "./generatePagesData"
import config from "../../config"

module.exports = function blogLoader(source) {
  this.cacheable()
  const target = this.target
  const callback = this.async()

  const paginationPage = path.basename(this.resource, ".jsx")
  const paginationPageNo = paginationPage === "index" ? 1 : parseInt(paginationPage, 10)

  if (target === "node") {
    source = source.replace("import 'babel/polyfill';", "") // eslint-disable-line no-param-reassign
  }

  glob("**/*.{js,jsx}", { cwd: join(__dirname, "../../pages/blog") }, (err, files) => {
    if (err) {
      return callback(err)
    }

    const pagesData = generatePagesData(files)

    const paginationPages = pagesData.slice((paginationPageNo - 1) * config.perPage, paginationPageNo * config.perPage)
    const lastPageNo = Math.ceil(pagesData.length / config.perPage)
    const nextPage = paginationPageNo < lastPageNo ? `/page/${paginationPageNo + 1}` : null
    const previousPage = paginationPageNo > 2 ? `/page/${paginationPageNo - 1}` :
        (paginationPageNo === 2 ? "/" : null)

    const pageData = {
      blogPosts: paginationPages,
      pageNo: paginationPageNo,
      nextPage,
      previousPage,
      lastPageNo,
    }

    if (pagesData.length) {
      return callback(null,
                      source.replace(" pageData = {}", ` pageData = ${JSON.stringify(pageData)}`))
    }

    return callback(new Error("Cannot find any blog pages."))
  })
}
