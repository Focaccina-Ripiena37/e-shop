# Test manuale per verificare il soft delete
# Esegui con: rails runner test_soft_delete.rb

puts "\n=== TEST SOFT DELETE ==="

# 1. Crea un prodotto di test
product = Product.create!(
  title: "Test Product for Soft Delete",
  price: 99.99,
  original_price: 99.99,
  sale: false
)
puts "\n✓ Prodotto creato: #{product.title} (ID: #{product.id})"

# 2. Verifica che sia visibile
all_products = Product.all.count
puts "✓ Prodotti visibili: #{all_products}"

# 3. Soft delete
product.destroy
puts "\n✓ Prodotto soft deleted (deleted_at: #{product.deleted_at})"

# 4. Verifica che non sia più visibile
visible_after_delete = Product.all.count
puts "✓ Prodotti visibili dopo delete: #{visible_after_delete}"

# 5. Verifica che esista ancora nel database
with_deleted = Product.with_deleted.count
puts "✓ Prodotti totali (inclusi deleted): #{with_deleted}"

# 6. Solo prodotti cancellati
only_deleted = Product.only_deleted.count
puts "✓ Solo prodotti cancellati: #{only_deleted}"

# 7. Ripristina il prodotto
product.restore
puts "\n✓ Prodotto ripristinato (deleted_at: #{product.deleted_at.inspect})"

# 8. Verifica che sia di nuovo visibile
visible_after_restore = Product.all.count
puts "✓ Prodotti visibili dopo restore: #{visible_after_restore}"

# 9. Cleanup - cancella veramente per non sporcare il DB
Product.with_deleted.find(product.id).update_column(:deleted_at, Time.current)
Product.with_deleted.find(product.id).delete
puts "\n✓ Prodotto di test rimosso dal database"

puts "\n=== TEST COMPLETATO CON SUCCESSO! ===\n"
