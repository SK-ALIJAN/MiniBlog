const moment = require("moment");

const customMiddleware = async (req, res, next) => {
  if (req?.session?.token) {
    res.locals.name = req.session.name;
    res.locals.email = req.session.email;
    res.locals.profile_image = req.session.profile_image ? `/uploads/profile/${req.session.profile_image}` : '/assets/images/no_user_image.png';
    res.locals.moment = moment

    next();
  } else {
    req.session.destroy();
    res.redirect("/admin/auth/login");
  }
};

module.exports = customMiddleware