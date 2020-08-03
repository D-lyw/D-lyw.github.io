import React from "react"
import { Link } from "gatsby"

import { rhythm, scale } from "../utils/typography"
import styles from "../styles/layout.module.less"
import Logo from "../assert/logo.svg"
import { Carousel } from "antd"
import { words } from "../utils/words"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`

  const header = (
    <>
      <Link className={styles.headerLogo}>
        <Logo style={{ width: "65px", height: "65px" }} />
      </Link>
      <div className={styles.headerDescription}>
        <h1>D-lyw</h1>
        <h2>读书思考敲代码</h2>
        <ul className={styles.headerNav}>
          <li>
            <Link to="/">首页</Link>
          </li>
          <li>
            <Link>生活</Link>
          </li>
          <li>
            <Link>技术</Link>
          </li>
          <li>
            <Link to="/about">关于</Link>
          </li>
          {/* <li>
            <Link>RSS</Link>
          </li> */}
        </ul>
      </div>
    </>
  )
  return (
    <>
      <div className={styles.wrapper}>
        <header className={styles.layoutHeader}>{header}</header>
        <main className={styles.articleList}>{children}</main>
      </div>
      <Carousel
        autoplay={true}
        dots={false}
        autoplaySpeed={10000}
        speed={1000}
        easing={"ease-in"}
        className={styles.carouselWrapper}
        effect={"fade"}
      >
        {words.map(({ value, source, link }, index) => {
          return value ? (
            <div key={index}>
              <span className={styles.wordsString}>
                {link ? <Link to={link}>{value}</Link> : value}
              </span>
              <span className={styles.wordsSource}>-- {source}</span>
            </div>
          ) : null
        })}
      </Carousel>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.org">Gatsby</a>, D-lyw' Blog
      </footer>
    </>
  )
}

export default Layout
