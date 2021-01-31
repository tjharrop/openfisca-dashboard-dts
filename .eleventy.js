module.exports = function (eleventyConfig) {

  eleventyConfig.addPassthroughCopy("_src/assets/**/*.js");
  eleventyConfig.addPassthroughCopy("_src/assets/**/*.css");
  eleventyConfig.addPassthroughCopy("_src/assets/themes/");

  return {
    dir: {
      input: '_src/',
      output: 'docs/',
      layouts: '_includes/',
      data: '_data/',
      includes: '_includes/'
    }
  }
}
