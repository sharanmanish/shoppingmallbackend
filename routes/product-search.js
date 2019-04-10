const router = require('express').Router();
const algolia = require('../algolia');

const algoliasearch = require('algoliasearch');
const client = algoliasearch(algolia.appId, algolia.apiKey);

const index = client.initIndex(algolia.indexName);

router.get('/', (req, res, next) => {
  if (req.query.query) {
    index.search({
      query: req.query.query,
      page: req.query.page
    }, (err, content) => {
      res.json({
        success: true,
        message: "Here is your search",
        status: 200,
        content: content,
        search_result: req.query.query
      });
    });
  }
});

module.exports = router;