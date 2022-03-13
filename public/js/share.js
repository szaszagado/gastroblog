const twitter = document.querySelector('.twitter')

const pageUrl = location.href
const message = 'Oszd meg ezt a receptet az ismerőseiddel, tuti tetszeni fog nekik is! :)'
const twitterApi = 'https://twitter.com/intent/tweet?text=${pageUrl}.${message}'

twitter.addEventListener('click', () => {
    window.open(url = twitterApi, target = 'blank')
})
