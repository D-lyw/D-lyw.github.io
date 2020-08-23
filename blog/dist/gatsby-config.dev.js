"use strict";

module.exports = {
  siteMetadata: {
    title: "D-lyw' Blog",
    author: {
      name: "D-lyw",
      summary: "\u8BFB\u4E66\u601D\u8003\u6572\u4EE3\u7801\uFF01"
    },
    description: "D-lyw \u4E2A\u4EBA\u535A\u5BA2\uFF0C\u9605\u8BFB\u3001\u601D\u8003\u3001\u5199\u4F5C\u3001\u6572\u4EE3\u7801\uFF01",
    siteUrl: "https://dlyw.top",
    social: {// twitter: `kylemathews`,
    }
  },
  plugins: [{
    resolve: "gatsby-source-filesystem",
    options: {
      path: "".concat(__dirname, "/content/blog"),
      name: "blog"
    }
  }, {
    resolve: "gatsby-source-filesystem",
    options: {
      path: "".concat(__dirname, "/content/assets"),
      name: "assets"
    }
  }, {
    resolve: "gatsby-transformer-remark",
    options: {
      plugins: [{
        resolve: "gatsby-remark-images",
        options: {
          maxWidth: 590
        }
      }, {
        resolve: "gatsby-remark-responsive-iframe",
        options: {
          wrapperStyle: "margin-bottom: 1.0725rem"
        }
      }, "gatsby-remark-prismjs", "gatsby-remark-copy-linked-files", "gatsby-remark-smartypants"]
    }
  }, "gatsby-transformer-sharp", "gatsby-plugin-sharp", {
    resolve: "gatsby-plugin-less",
    options: {
      javascriptEnabled: true // modifyVars: {
      //   // 'primary-color': '#08C78C'
      //   'btn-primary-bg': '#08C78C'
      // }

    }
  }, {
    resolve: "gatsby-plugin-react-svg",
    options: {
      rule: {
        include: "".concat(__dirname, "/src/assert")
      }
    }
  }, {
    resolve: "gatsby-plugin-disqus",
    options: {
      shortname: "https-d-lyw-github-io"
    }
  }, {
    resolve: "gatsby-plugin-google-analytics",
    options: {
      trackingId: "UA-146221372-1"
    }
  }, "gatsby-plugin-feed", {
    resolve: "gatsby-plugin-manifest",
    options: {
      name: "D-lyw \u4E2A\u4EBA\u535A\u5BA2",
      short_name: "D-lyw'Blog",
      start_url: "/",
      background_color: "#f7f7f7",
      theme_color: "#663399",
      display: "minimal-ui",
      icon: "content/assets/logo-icon.png"
    }
  }, "gatsby-plugin-react-helmet", {
    resolve: "gatsby-plugin-typography",
    options: {
      pathToConfigModule: "src/utils/typography"
    }
  } // this (optional) plugin enables Progressive Web App + Offline functionality
  // To learn more, visit: https://gatsby.dev/offline
  // `gatsby-plugin-offline`,
  ]
};