var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("table").table;
require("dotenv").config();

var pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "bamazon"
});

var app = () => {
  pool.getConnection((err, conn) => {
    if (err) throw err;

    conn.query("SELECT * FROM products", (err, res) => {
      if (err) throw err;
      var results = [];
      results.push(["ID", "Product", "Price"]);
      res.forEach(row => {
        results.push([row.item_id, row.product_name, row.price]);
      });
      console.log(table(results));
    });

    inquirer
      .prompt([
        {
          type: "number",
          name: "pickId",
          message: "What is the ID of the product you would like to buy?"
        },
        {
          type: "number",
          name: "pickUnits",
          message: "How many units of the product would you like to buy?"
        }
      ])
      .then(res => {
        var productId = res.pickId;
        var productUnits = res.pickUnits;
        conn.query("SELECT stock_quantity, price FROM products WHERE item_id = ?", productId, (err, res) => {
          if (err) throw err;
          var stock = res[0].stock_quantity;
          var price = res[0].price;

          if (stock > 0) {
            conn.query(
              "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
              [stock - productUnits, productId],
              (err, res) => {
                conn.destroy();
                if (err) throw err;
                var cost = price * productUnits;
                return console.log(`The total cost of your order is: $${cost}`);
              }
            );
          } else {
            return console.log("Insufficient quantity!");
          }
        });
      });
  });
};

app();
