// this is aliased in webpack config based on server/client build
import * as web3 from './web3';
import LRU from 'lru-cache';

const cache = LRU({
  max: 600000,
  maxAge: 1000 * 60 * 60 // 1 hour
});

const api = web3;
const logRequests = true;//!!process.env.DEBUG_API

function fetch(child) {
  logRequests && console.log(`fetching ${child}...`)
  const cache = api.cachedItems
  if (cache && cache.has(child)) {
    logRequests && console.log(`cache hit for ${child}.`)
    return Promise.resolve(cache.get(child))
  } else {
    return new Promise((resolve, reject) => {
      api.child(child).once('value', snapshot => {
        const val = snapshot.val()
        // mark the timestamp when this item is cached
        if (val) val.__lastUpdated = Date.now()
        cache && cache.set(child, val)
        logRequests && console.log(`fetched ${child}.`)
        resolve(val)
      }, reject)
    })
  }
}

export function fetchIdsByType(type) {
  return api.fetchList(type);
}

export function fetchItem(id) {
  if (cache && cache.has(id)) {
    logRequests && console.log(`cache hit for ${id}.`)
    return Promise.resolve(cache.get(id))
  } else {
    return api.fetchItem(id).then((item) => {
      cache && cache.set(id, item);
      logRequests && console.log(`fetched ${id}.`)
      return item;
    });
  }
}

export function fetchItems(ids) {
  return Promise.all(ids.map(id => fetchItem(id)))
}

export function fetchUser(id) {
  return fetch(`user/${id}`)
}

export function watchList(type, cb) {
  let first = true
  const ref = api.child(`${type}stories`)
  const handler = snapshot => {
    if (first) {
      first = false
    } else {
      cb(snapshot.val())
    }
  }
  ref.on('value', handler)
  return () => {
    ref.off('value', handler)
  }
}