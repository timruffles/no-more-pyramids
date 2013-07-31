
function select(from) {
  var promise = Q.defer()
  from.forEach(function(p) { p.then(promise.resolve) })
  return promise
}


Q.async(function*() {

  var streams = [internal,twitter,facebook].map(function(source) {
    var sources = [source.fetchComplete(),source.fetchCache()]
    // race - which do we get first?
    return select(sources)
  });

  // two listeners for a piece of work
  var whole = yield internal
  var meta = yield fetchMeta(metaRequired(internal))

  // sum of work
  for(let stream of streams) yield stream;

  send({
    streams: streams,
    meta: meta
  });

});



