import React from "react"
import { Link } from "gatsby"

import { rhythm, scale } from "../utils/typography"
import styles from "../styles/layout.module.less"
const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`

  const header = (
    <>
      <Link className={styles.headerLogo}>
        <img
          src="https://tsb2blog.com/usr/uploads/2020/07/1084504593.png"
          alt="logo"
        ></img>
      </Link>
      <div className={styles.headerDescription}>
        <h1>D-lyw</h1>
        <h2>读书思考敲代码</h2>
        <ul className={styles.headerNav}>
          <li>
            <Link>首页</Link>
          </li>
          <li>
            <Link>生活</Link>
          </li>
          <li>
            <Link>技术</Link>
          </li>
          <li>
            <Link>关于</Link>
          </li>
          <li>
            <Link>RSS</Link>
          </li>
        </ul>
      </div>
    </>
  )
  return (
    <>
      <div className={styles.wrapper}>
        <header>{header}</header>
        <main className={styles.articleList}>{children}</main>
      </div>{" "}
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.org">Gatsby</a>, D-lyw' Blog
      </footer>
    </>
  )
}

export default Layout
