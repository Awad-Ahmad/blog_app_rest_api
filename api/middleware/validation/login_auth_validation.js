const Joi = require("joi");

exports.loginAuthValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });
  const { error, result } = schema.validate(
    {
      email: req.body.email,
      password: req.body.password,
    },
    { abortEarly: false }
  );
  console.log(error);
  if (error) {
    if (error.details.length > 1) {
      res.status(422).json({
        error: " email and password are not allowed to be null",
      });
    } else {
      switch (error.details[0].context.key) {
        case "email":
          res.status(422).json({ error: error.details[0].message });
          break;
        case "password":
          res.status(422).json({ error: error.details[0].message });
          break;
        default:
          res.status(500).json({ error: "An error ocurred" });
      }
    }
  }
  else
  {

 return next();

}};
