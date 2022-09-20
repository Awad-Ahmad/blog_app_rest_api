const { model } = require("mongoose");
function p(model){}
(model)=>{

}
let paginatedResponse = (model) => /////// =>this mean  return for single line if it is multi line we should write =>{ some operators return value }
   async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    if (limit < (await model.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }
    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec();
      console.log(results);
      res.paginatedResponse = results;
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


module.exports = { paginatedResponse };
