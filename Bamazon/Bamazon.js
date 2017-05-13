var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3000,

  // Your username
  user: "root",

  // Your password
  password: "ilovepon1",
  database: "BamazonDB"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

var runSearch = function() {
  inquirer.prompt({
    name: "action",
    type: "list",
    message: "What would you like to search?",
    choices: ["Find item", "Product search",
      "Department search", "Search by price", "See what's in stock"]
  }).then(function(answer) {

    switch (answer.action) {
      case "Find item":
        item_idSearch();
        break;

      case "Product search":
        product_nameSearch();
        break;

      case "Department search":
        department_nameSearch();
        break;

      case "Search by price":
        priceSearch();
        break;

      case "See what's in stock":
        stock_quantitySearch();
        break;
    }
  });
};

var item_idSearch = function() {
  inquirer.prompt({
    name: "item",
    type: "input",
    message: "What item would you like to search for?"
  }).then(function(answer) {
    var query = "SELECT position, item, FROM products ?";
    connection.query(query, { item: answer.item }, function(err, res) {
      for (var i = 0; i < res.length; i++) {
        console.log("Position: " + res[i].position + " || item: " + res[i].item);
      }
      runSearch();
    });
  });
};

var product_nameSearch = function() {
  var query = "SELECT product name FROM product by position(*) > 1";
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].product_name);
    }
    runSearch();
  });
};

var priceSearch = function() {
  inquirer.prompt([{
    name: "start",
    type: "input",
    message: "Enter starting position: ",
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
  }, {
    name: "end",
    type: "input",
    message: "Enter ending position: ",
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
  }]).then(function(answer) {
    var query = "SELECT price from product";
    connection.query(query, [answer.start, answer.end], function(err, res) {
      for (var i = 0; i < res.length; i++) {
        console.log("Position: " + res[i].position);
      }
      runSearch();
    });
  });
};

var stock_quantitySearch = function() {
  inquirer.prompt({
    name: "stock quantity",
    type: "input",
    message: "how much stock is left?"
  }).then(function(answer) {
    console.log(answer.song);
    connection.query("SELECT * FROM product ?", { stock_quantity: answer.stock_quantity }, function(err, res) {
      console.log("Position: " + res[0].position + " || stock quantity: ");
      runSearch();
    });
  });
};
