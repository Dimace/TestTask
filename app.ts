const Vue = require('vue')
const server = require('express')()
const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync('game.html', 'utf-8')
})

server.get('*', (req, res) => {
  const app = new Vue({
    data: {
      num: 5
    },
    template: `<h1>MINESWEEPER<h1>`
  })

  renderer.renderToString(app, (err, html) => {
     console.log(html) // будет выведен код всей страницы, с подставленным кодом приложения.
     res.end(html)
  })
})

server.listen(3000)