const fs = require('fs');
const path = require('path');

// Read the SQL schema files
const schemaFiles = [
  'sql/car_finance_schema.sql',
  'sql/car_showcase_schema.sql',
  'sql/installment_rules_schema.sql',
  'sql/dealer_wallets_schema.sql',
  'sql/settlements_schema.sql'
];

console.log('Database setup script');
console.log('===================');
console.log('');
console.log('This script will help you set up your database schema.');
console.log('');
console.log('To set up your database:');
console.log('');
console.log('1. Go to your Supabase dashboard');
console.log('2. Navigate to the SQL Editor');
console.log('3. Run the following SQL files in order:');
console.log('');

schemaFiles.forEach((file, index) => {
  if (fs.existsSync(file)) {
    console.log(`${index + 1}. ${file}`);
  }
});

console.log('');
console.log('Or you can run all files at once by copying the contents of each file');
console.log('and pasting them into the Supabase SQL Editor.');
console.log('');
console.log('After running the schema files, your database will be ready to use.');
console.log('');
console.log('Note: Make sure your Supabase project is properly configured with the');
console.log('environment variables in your .env.local file or vercel.json.'); 