import { supabase, initAuth } from './src/supabaseClient';
import * as localStore from './src/store';

// Run this once to create tables and migrate data
async function migrate() {
  await initAuth();
  console.log('Migrating data (tables must exist)...');

  // Migrate data
  const categories = localStore.getCategories();
  const { error: catUpsert } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'id' });
  if (catUpsert) console.error('Categories upsert error:', catUpsert);
  else console.log('Categories OK:', categories.length);

  const products = localStore.getProducts();
  const { error: prodUpsert } = await supabase
    .from('products')
    .upsert(products, { onConflict: 'id' });
  if (prodUpsert) console.error('Products upsert error:', prodUpsert);
  else console.log('Products OK:', products.length);

  const movements = localStore.getMovements();
  const { error: movUpsert } = await supabase
    .from('movements')
    .upsert(movements, { onConflict: 'id' });
  if (movUpsert) console.error('Movements upsert error:', movUpsert);
  else console.log('Movements OK:', movements.length);

  const descriptions = localStore.getDescriptions();
  const { error: descUpsert } = await supabase
    .from('descriptions')
    .upsert(descriptions, { onConflict: 'id' });
  if (descUpsert) console.error('Descriptions upsert error:', descUpsert);
  else console.log('Descriptions OK:', descriptions.length);

  console.log('Migration complete! Check Supabase dashboard.');
}

(async () => {
  await migrate();
})();

