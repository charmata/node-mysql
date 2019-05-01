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

var app = () => {
  showAllItems();
};

var showAllItems = () => {
  connection.connect(err => {
    if (err) throw err;
    connection.query("SELECT * FROM products", (err, res) => {
      if (err) throw err;
      var results = [];
      results.push(["ID", "Product", "Price"]);
      res.forEach(row => {
        results.push([row.item_id, row.product_name, row.price]);
      });
      console.log(table(results));
      connection.end();
    });
  });
};

app();
