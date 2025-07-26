-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create dealer wallets table
CREATE TABLE IF NOT EXISTS dealer_wallets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    dealer_id UUID REFERENCES users(id),
    balance DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create dealer transactions table
CREATE TABLE IF NOT EXISTS dealer_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    wallet_id UUID REFERENCES dealer_wallets(id),
    amount DECIMAL(12,2) NOT NULL,
    type TEXT CHECK (type IN ('credit', 'debit')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for dealer_wallets
CREATE TRIGGER update_dealer_wallets_updated_at
    BEFORE UPDATE ON dealer_wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to update wallet balance
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'credit' THEN
        UPDATE dealer_wallets
        SET balance = balance + NEW.amount
        WHERE id = NEW.wallet_id;
    ELSIF NEW.type = 'debit' THEN
        UPDATE dealer_wallets
        SET balance = balance - NEW.amount
        WHERE id = NEW.wallet_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic balance update
CREATE TRIGGER update_wallet_balance_on_transaction
    AFTER INSERT ON dealer_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_wallet_balance();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dealer_wallets_dealer_id ON dealer_wallets(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_transactions_wallet_id ON dealer_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_dealer_transactions_created_at ON dealer_transactions(created_at); 