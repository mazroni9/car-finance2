const fs = require('fs');
const path = require('path');

// Function to fix import paths
function fixImports(directory) {
  const files = fs.readdirSync(directory, { withFileTypes: true });
  
  files.forEach(file => {
    const fullPath = path.join(directory, file.name);
    
    if (file.isDirectory()) {
      fixImports(fullPath);
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      // Fix @/lib/services/supabase imports
      if (content.includes('@/lib/services/supabase')) {
        content = content.replace(/from ['"]@\/lib\/services\/supabase['"]/g, 'from \'../../../../lib/services/supabase\'');
        changed = true;
      }
      
      // Fix @/components imports
      if (content.includes('@/components/')) {
        content = content.replace(/from ['"]@\/components\/([^'"]+)['"]/g, 'from \'../../../../components/$1\'');
        changed = true;
      }
      
      // Fix @/types imports
      if (content.includes('@/types/')) {
        content = content.replace(/from ['"]@\/types\/([^'"]+)['"]/g, 'from \'../../../../types/$1\'');
        changed = true;
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Fixed imports in: ${fullPath}`);
      }
    }
  });
}

// Start fixing from src/app directory
fixImports('./src/app');
console.log('Import paths fixed!'); 