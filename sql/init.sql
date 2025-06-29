CREATE TABLE finance_data (
  id SERIAL PRIMARY KEY,
  price INTEGER,
  quantity INTEGER,
  down INTEGER,
  last INTEGER,
  installment INTEGER,
  income INTEGER,
  cost INTEGER,
  test INTEGER,
  warranty INTEGER,
  tracking INTEGER,
  resale INTEGER
);

INSERT INTO finance_data (price, quantity, down, last, installment, income, cost, test, warranty, tracking, resale)
VALUES
(20000, 10, 2000, 0, 2117, 21167, 200000, 3000, 500, 250, 25400),
(25000, 10, 2500, 0, 2646, 26458, 250000, 3000, 500, 250, 31750),
(30000, 5, 3000, 3000, 3100, 15500, 150000, 1500, 250, 125, 37200);