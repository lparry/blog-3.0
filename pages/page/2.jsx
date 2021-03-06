import React from "react"
import BlogPostSummary from "../../components/BlogPostSummary"
import Link from "../../components/Link"
import NextLink from "../../components/NextLink"
import PreviousLink from "../../components/PreviousLink"
import ClearFix from "../../components/ClearFix"

const pageData = {}

export default () => (
  <div>
    {
      pageData.blogPosts && pageData.blogPosts.map((props, index) => (
        <BlogPostSummary
          key={index}
          {...props}
          content={require(`../blog/${props.file}`).intro}
        />
      ))
    }
    <ClearFix />
    <PreviousLink to={pageData.previousPage} />
    <NextLink to={pageData.nextPage} />
  </div>
)
