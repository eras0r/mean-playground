/**
 * Error message being used if the desired document was not found.
 * @type {string}
 */
var documentNotFoundError = 'Document not found';

/**
 * Handles the not found error.
 */
module.exports.handleNotFoundError = function handleNotFoundError(err, res, next) {
  if (err.message === documentNotFoundError) {
    res.status(404);
    res.end();
  }
  else {
    // pass all other errors
    next(err);
  }
};

/**
 * Mongoose plugin which will throw an error when findOne is called and no such record was found (instead of simply returning null).
 * @param schema the mongoose schema to be operated on.
 */
module.exports.plugin = function plugin(schema) {

  /**
   * Post handle for findOne(). Will also be troggered for findById().
   */
  schema.post('findOne', function (res, next) {
    if (!res) {
      return next(new Error(documentNotFoundError));
    }
    return next();
  });

};
