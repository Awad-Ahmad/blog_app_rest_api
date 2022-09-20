const Joi = require("joi");
exports.authValidation = (req, res, next) => {
  const schema = Joi.object({
    userName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
  });
  const { userName, email } = req.body;
  console.log(req.body.userName);
  const { error, value } = schema.validate(
    {
      userName: req.body.userName,
      email: req.body.email,
    },
    { abortEarly: false }
  );
  console.log(value);

  if (error) {
    if (error.details.length > 1) {
      console.log("error");
      return res
        .status(422)
        .json({ error: "the username and email cannot be empty" });
    } else {
      switch (error.details[0].context.key) {
        case "userName":
          res.status(422).json({ error: error.details[0].message });
          break;
        case "email":
          res.status(422).json({ error: error.details[0].message });
          break;
        default:
          res.status(500).json({ error: "An error occurred" });
      }
    }
  } else {
    return next();
  }
  console.log(error);
};
