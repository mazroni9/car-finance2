const fs = require('fs');
const path = require('path');

// Read the SQL schema files
const schemaFiles = [
  'sql/car_finance_schema.sql',
  'sql/car_showcase_schema.sql',
  'sql/installment_rules_schema.sql',
  'sql/dealer_wallets_schema.sql',
  'sql/settlements_schema.sql',
  'sql/check_mazbrothers.sql'
];

console.log('Database setup script');
console.log('=====================');

// Read and combine all schema files
let combinedSchema = '';

schemaFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`Reading: ${file}`);
    const content = fs.readFileSync(filePath, 'utf8');
    combinedSchema += `\n-- ${file}\n`;
    combinedSchema += content;
    combinedSchema += '\n';
  } else {
    console.log(`Warning: File not found: ${file}`);
  }
});

// Write combined schema to a single file
const outputPath = path.join(__dirname, '..', 'sql', 'combined_schema.sql');
fs.writeFileSync(outputPath, combinedSchema);

console.log(`\nCombined schema written to: ${outputPath}`);
console.log('Total files processed:', schemaFiles.length);
console.log('\nTo apply the schema to your database:');
console.log('1. Copy the content of sql/combined_schema.sql');
console.log('2. Run it in your Supabase SQL editor');
console.log('3. Or use the Supabase CLI: supabase db reset'); 