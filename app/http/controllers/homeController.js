const Menu = require("../../models/menu");

function homeController() {
  return {
    // Read
    async index(req, res) {
      const foods = await Menu.findAll();
      return res.render("home", { foods: foods });
    },
  };
}

module.exports = homeController;