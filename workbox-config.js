module.exports = {
    "globDirectory": "build/",
    "globPatterns": [
      "js/**/*.js",
      "style/**/*.css",
      "images/**/*.jpg",
      "images/**/*.svg",
      "pages/offline.html",
      "pages/404.html"
    ],

    "swSrc": "src/sw.js",
    "swDest": "build/sw.js",
    
    "globIgnores": [
      "../workbox-config.js"
    ]
  };