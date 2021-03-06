const db = require("./db/index.js");

const getMenuItems = (id) => {
  const queryString =
        (`SELECT menu_items.*,
      categories.name
  FROM menu_items
  JOIN categories ON category_id = categories.id
  WHERE category_id = $1`, [id]);

  return db.query(queryString, queryParams).then((res) => res.rows);
};
exports.getMenuItems = getMenuItems;

const addToCart = (order) => {
  return new Promise((res, rej) => {
    const existingCartQuery = ` SELECT * FROM order_items WHERE order_id = $1` [
      order.id
    ];
    db.query(existingCartQuery).then((res) => {
      if (res.length <= 0) {
        const queryString =
                    (` INTO order_items
                      (menu_item_id, order_id, customer_id, quantity)
                       VALUES
                      ($1, $2, $3, $4);`, [
                      order.menu_item_id,
                      order.order_id,
                      order.customer_id,
                      order.quantity,
                    ]);
        db.query(queryString).then((result) => {
          return res(result.rows);
        });
      } else {
        newQuantity = res.rows[0].quantity + 1;
        const updateQuery = (`
              update order_items set quantity = $1
              where order_item.id = $2
                `, [
          newQuantity,
          res.row[0].id
        ]);
        db.query(updateQuery).then(

        );
      }
    });
  });
};
exports.addToCart = addToCart;

const totalPrice = (id) => {
  const queryString =
        (`
  SELECT (SUM(price)/100)
  FROM menu_items
    JOIN order_items ON menu_item_id = menu_items.id
  WHERE order_id = $1
  GROUP BY order_id;`, [id]);
  return db.query(queryString).then((res) => res.rows);
};
exports.totalPrice = totalPrice;

const placeOrder = (id) => {
  const queryString =
        (`
  INSERT INTO orders
    (id, customer_id, order_date)
  VALUES
    ($1, $2, $3) returning * ;`, [id]);
  return db.query(queryString).then((res) => res.rows);
};
exports.placeOrder = placeOrder;

const gstCalc = (id) => {
  const queryString =
        (`SELECT ROUND(((SUM(price)*.05)/100), 2)
  FROM menu_items
    JOIN order_items ON menu_item_id = menu_items.id
  WHERE order_id = $1
  GROUP BY menu_items.name;`, [id]);
  return db.query(queryString).then((res) => res.rows);
};
exports.gstCalc = gstCalc;

const pstCalc = (id) => {
  const queryString =
        (`SELECT ROUND(((SUM(price)*.07)/100), 2)
  FROM menu_items
    JOIN order_items ON menu_item_id = menu_items.id
  WHERE order_id = $1
  GROUP BY menu_items.name;`, [id]);
  return db.query(queryString).then((res) => res.rows);
};
exports.gstCalc = pstCalc;
