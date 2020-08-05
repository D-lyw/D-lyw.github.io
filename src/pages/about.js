import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import ChinaMap from "../assert/chinaMap.svg"
import China from "../assert/china.svg"
const About = () => {
  return (
    <Layout>
      <SEO title="关于" />
      <div style={{ padding: "40px" }}>
        <h3>
          <i>This is the about page.</i>
        </h3>
        <h3>But I have't thought about writting something.</h3>
        <br />
        <p style={{ textAlign: "center" }}>
          <b>This is my country, and i love it!</b>
        </p>
        <div style={{ position: "relative" }}>
          <ChinaMap
            style={{
              display: "block",
              margin: "auto",
              width: "400px",
              height: "400px",
            }}
          />
          <China
            style={{
              position: "absolute",
              height: "30px",
              top: "150px",
              right: "155px",
            }}
          />
        </div>
      </div>
    </Layout>
  )
}

export default About
