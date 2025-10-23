insert into users (id, email)
values
  ('00000000-0000-0000-0000-000000000001','demo@example.com')
on conflict (id) do nothing;

-- Indian products with INR prices, realistic brands, and product images
insert into products (id, title, description, category, brand, price, tags, popularity, image_url) values
  ('10000000-0000-0000-0000-000000000001','ACME Wireless Headphones Pro','Premium over-ear wireless headphones with active noise cancellation and 20-hour battery life','Electronics','ACME',3499, array['audio','wireless','headphones','premium'], 92, '/placeholder.svg?height=160&width=320'),
  ('10000000-0000-0000-0000-000000000002','boAt Rockerz 450 Bluetooth Headphones','Premium wireless headphones with 40-hour battery life and ANC','Electronics','boAt',2499, array['audio','wireless','headphones'], 85, '/placeholder.svg?height=160&width=320'),
  ('10000000-0000-0000-0000-000000000003','Logitech MX Master 3S Mouse','Advanced wireless mouse with precision scrolling and customizable buttons','Electronics','Logitech',7999, array['mouse','wireless','productivity'], 88, '/placeholder.svg?height=160&width=320'),
  ('10000000-0000-0000-0000-000000000004','Mi Power Bank 20000mAh','Fast charging power bank with dual USB ports and 18W output','Electronics','Mi',1999, array['power','battery','portable'], 90, '/placeholder.svg?height=160&width=320'),
  ('10000000-0000-0000-0000-000000000005','Noise ColorFit Pulse 2 Smartwatch','AMOLED display smartwatch with 100+ watch faces and health tracking','Electronics','Noise',2799, array['watch','fitness','wearable'], 78, '/placeholder.svg?height=160&width=320'),
  ('10000000-0000-0000-0000-000000000006','Campus Drift Sneakers','Comfortable casual sneakers for everyday wear with premium cushioning','Fashion','Campus',1299, array['shoes','casual','sneakers'], 72, '/placeholder.svg?height=160&width=320'),
  ('10000000-0000-0000-0000-000000000007','Puma Active T-Shirt','Breathable cotton blend sports t-shirt with moisture-wicking technology','Fashion','Puma',1199, array['clothing','sports','tshirt'], 68, '/placeholder.svg?height=160&width=320'),
  ('10000000-0000-0000-0000-000000000008','Realme Buds Wireless 2 Neo','Lightweight wireless earbuds with 20-hour battery and fast charging','Electronics','Realme',1399, array['audio','wireless','earbuds'], 82, '/placeholder.svg?height=160&width=320'),
  ('10000000-0000-0000-0000-000000000009','Fastrack Reflex Play Smartwatch','Sports smartwatch with 100+ sports modes and 7-day battery','Electronics','Fastrack',4999, array['watch','sports','wearable'], 75, '/placeholder.svg?height=160&width=320'),
  ('10000000-0000-0000-0000-000000000010','Mi Backpack Pro','Durable laptop backpack with multiple compartments and USB charging port','Fashion','Mi',2499, array['backpack','travel','storage'], 80, '/placeholder.svg?height=160&width=320'),
  ('10000000-0000-0000-0000-000000000011','Noise Evolve 2 Smartwatch','Premium smartwatch with SpO2 monitoring and always-on display','Electronics','Noise',3999, array['watch','health','wearable'], 76, '/placeholder.svg?height=160&width=320'),
  ('10000000-0000-0000-0000-000000000012','ACME Studio Headphones','Professional-grade studio headphones with flat frequency response','Electronics','ACME',5999, array['audio','professional','headphones','studio'], 89, '/placeholder.svg?height=160&width=320')
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
