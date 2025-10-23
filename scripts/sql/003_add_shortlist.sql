-- Create shortlist table for saving favorite recommendations
CREATE TABLE IF NOT EXISTS shortlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_shortlist_user_id ON shortlist(user_id);
CREATE INDEX IF NOT EXISTS idx_shortlist_product_id ON shortlist(product_id);
