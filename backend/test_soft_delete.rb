# Manual test to verify soft delete
# Run with: rails runner test_soft_delete.rb

puts "\n=== TEST SOFT DELETE ==="

# 1. Create a test product
product = Product.create!(
  title: "Test Product for Soft Delete",
  price: 99.99,
  original_price: 99.99,
  sale: false
)
puts "\n✓ Prodotto creato: #{product.title} (ID: #{product.id})"

# 2. Verify it's visible
all_products = Product.all.count
puts "✓ Prodotti visibili: #{all_products}"

# 3. Soft delete
product.destroy
puts "\n✓ Prodotto soft deleted (deleted_at: #{product.deleted_at})"

# 4. Verify it's no longer visible
visible_after_delete = Product.all.count
puts "✓ Prodotti visibili dopo delete: #{visible_after_delete}"

# 5. Verify it still exists in database
with_deleted = Product.with_deleted.count
puts "✓ Prodotti totali (inclusi deleted): #{with_deleted}"

# 6. Only deleted products
only_deleted = Product.only_deleted.count
puts "✓ Solo prodotti cancellati: #{only_deleted}"

# 7. Restore the product
product.restore
puts "\n✓ Prodotto ripristinato (deleted_at: #{product.deleted_at.inspect})"

# 8. Verify it's visible again
visible_after_restore = Product.all.count
puts "✓ Prodotti visibili dopo restore: #{visible_after_restore}"

# 9. Cleanup - really delete to not pollute the DB
Product.with_deleted.find(product.id).update_column(:deleted_at, Time.current)
Product.with_deleted.find(product.id).delete
puts "\n✓ Prodotto di test rimosso dal database"

puts "\n=== TEST COMPLETATO CON SUCCESSO! ===\n"
