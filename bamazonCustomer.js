var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("table").table;
require("dotenv").config();

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "bamazon"
});

var app = function() {
  showAllItems();
};

var showAllItems = function() {
  connection.connect(err => {
    if (err) throw err;
    connection.query("SELECT * FROM products", (err, res) => {
      if (err) throw err;
      var results = [];
      results.push(["Product", "Department", "Price", "In Stock"]);
      res.forEach(row => {
        results.push([row.product_name, row.department_name, row.price, row.stock_quantity]);
      });
      console.log(table(results));
      connection.end();
    });
  });
};

app();
