CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT,
  access_token TEXT,
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount NUMERIC,
  date DATE,
  category TEXT,
  description TEXT
);

CREATE TABLE holdings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  symbol TEXT,
  shares NUMERIC,
  value NUMERIC
);
