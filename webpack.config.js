module.exports = {
    entry: ['whatwg-fetch', './src/app.js'],
    output: {
        filename: './dist/bundle.js'
    },
     watch: true
}
