insert into users (id, email)
values
  ('00000000-0000-0000-0000-000000000001','demo@example.com')
on conflict (id) do nothing;

-- Indian products with INR prices and realistic brands
insert into products (id, title, description, category, brand, price, tags, popularity, image_url) values
  ('10000000-0000-0000-0000-000000000001','boAt Rockerz 450 Bluetooth Headphones','Premium wireless headphones with 40-hour battery life and ANC','Electronics','boAt',1499, array['audio','wireless','headphones'], 85, null),
  ('10000000-0000-0000-0000-000000000002','Mi Power Bank 20000mAh','Fast charging power bank with dual USB ports','Electronics','Mi',1999, array['power','battery','portable'], 90, null),
  ('10000000-0000-0000-0000-000000000003','Noise ColorFit Pulse 2 Smartwatch','AMOLED display smartwatch with 100+ watch faces','Electronics','Noise',2799, array['watch','fitness','wearable'], 78, null),
  ('10000000-0000-0000-0000-000000000004','Campus Drift Sneakers','Comfortable casual sneakers for everyday wear','Fashion','Campus',1299, array['shoes','casual','sneakers'], 72, null),
  ('10000000-0000-0000-0000-000000000005','Puma Active T-Shirt','Breathable cotton blend sports t-shirt','Fashion','Puma',899, array['clothing','sports','tshirt'], 68, null),
  ('10000000-0000-0000-0000-000000000006','Realme Buds Wireless 2 Neo','Lightweight wireless earbuds with 20-hour battery','Electronics','Realme',1399, array['audio','wireless','earbuds'], 82, null),
  ('10000000-0000-0000-0000-000000000007','Fastrack Reflex Play Smartwatch','Sports smartwatch with 100+ sports modes','Electronics','Fastrack',4999, array['watch','sports','wearable'], 75, null),
  ('10000000-0000-0000-0000-000000000008','boAt Airdopes 141 Earbuds','True wireless earbuds with 6-hour battery','Electronics','boAt',1299, array['audio','wireless','earbuds'], 88, null),
  ('10000000-0000-0000-0000-000000000009','Mi Band 7 Fitness Tracker','Lightweight fitness tracker with 14-day battery','Electronics','Mi',2499, array['fitness','wearable','tracker'], 80, null),
  ('10000000-0000-0000-0000-000000000010','Noise Evolve 2 Smartwatch','Premium smartwatch with SpO2 monitoring','Electronics','Noise',3999, array['watch','health','wearable'], 76, null)
on conflict (id) do nothing;

-- sample interactions for the demo user with Indian products
insert into interactions (user_id, product_id, type)
select '00000000-0000-0000-0000-000000000001', id, 'view'::interaction_type from products where brand in ('boAt','Mi','Noise') limit 6
on conflict do nothing;

insert into interactions (user_id, product_id, type)
values
  ('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','like'),
  ('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000002','cart'),
  ('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000003','view')
on conflict do nothing;
