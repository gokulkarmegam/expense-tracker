const ghpages = require('gh-pages')

ghpages.publish('dist', {
  branch: 'gh-pages',
  repo: 'https://github.com/gokulkarmegam/expense-tracker.git',
  dotfiles: true
}, (err) => {
  if (err) console.error(err)
  else console.log('Published to GitHub Pages')
})