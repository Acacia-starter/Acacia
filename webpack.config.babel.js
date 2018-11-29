
const svgoLoader = {
  loader: 'svgo-loader',
  options: {
    plugins: [{
      cleanupAttrs: true
    }, {
      removeDoctype: true
    }, {
      removeXMLProcInst: true
    }, {
      removeComments: true
    }, {
      removeMetadata: true
    }, {
      removeTitle: true
    }, {
      removeDesc: true
    }, {
      removeUselessDefs: true
    }, {
      removeEditorsNSData: true
    }, {
      removeEmptyAttrs: true
    }, {
      removeHiddenElems: true
    }, {
      removeEmptyText: true
    }, {
      removeEmptyContainers: true
    }, {
      removeViewBox: false
    }, {
      cleanUpEnableBackground: true
    }, {
      convertStyleToAttrs: true
    }, {
      convertColors: true
    }, {
      convertPathData: true
    }, {
      convertTransform: true
    }, {
      removeUnknownsAndDefaults: true
    }, {
      removeNonInheritableGroupAttrs: true
    }, {
      removeUselessStrokeAndFill: true
    }, {
      removeUnusedNS: true
    }, {
      cleanupIDs: true
    }, {
      cleanupNumericValues: true
    }, {
      moveElemsAttrsToGroup: true
    }, {
      moveGroupAttrsToElems: true
    }, {
      collapseGroups: true
    }, {
      removeRasterImages: false
    }, {
      mergePaths: true
    }, {
      convertShapeToPath: true
    }, {
      sortAttrs: true
    }, {
      transformsWithOnePath: false
    }, {
      removeDimensions: true
    }, {
      removeAttrs: { attrs: '(stroke|fill)' }
    }]
  }
}

WebpackConfig
  .addRule({
    test: /.svg$/,
    exclude: /sprite\/.*\.svg$/,
    use: [svgoLoader]
  })

if (akaruConfig.svgSprite.active) {
  WebpackConfig.addRule({
    test: /sprite\/.*\.svg$/,
    use: [{
      loader: SvgSpriteHtmlWebpackPlugin.getLoader()
    }, svgoLoader]
  })
}

if (akaruConfig.svgSprite.active) {
  WebpackConfig.addPlugin(new SvgSpriteHtmlWebpackPlugin({
    generateSymbolId: (svgFilePath, svgHash, svgContent) => {
      return path.parse(svgFilePath).name
    }
  }))
}
