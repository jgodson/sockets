function getQueryParams() {
  var url = window.location.href;
  if (url.indexOf("?") > -1) {
    var queries = url.split("?");
    queries = queries[1].split("&");
    var queryObj = {};
    queries.forEach(function (query) {
      query = query.split("=");
      queryObj[decodeURIComponent(query[0])] = decodeURIComponent(
        query[1].replace(/\+/g, " ")
      );
    });
    return queryObj;
  }
  return undefined;
}
