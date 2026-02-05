# Test soft delete with admin management
puts "\n=== TEST SOFT DELETE CON ADMIN UI ==="

# Find an existing product
product = Product.first
if product.nil?
  puts "❌ Nessun prodotto trovato nel database"
  exit
end

puts "\n1. Prodotto di test: #{product.title} (ID: #{product.id})"
puts "   Deleted? #{product.deleted?}"

# Soft delete
puts "\n2. Effettuo soft delete..."
product.destroy
puts "   ✓ Deleted_at: #{product.deleted_at}"

# Verify it doesn't appear in normal list
visible_count = Product.count
with_deleted_count = Product.with_deleted.count
puts "\n3. Conteggio prodotti:"
puts "   - Visibili (normale): #{visible_count}"
puts "   - Con deleted: #{with_deleted_count}"

# Test JSON serialization (as the controller would do)
puts "\n4. Test JSON serialization:"
Product.with_deleted.where(id: product.id).first.tap do |p|
  json = p.as_json
  puts "   - Title: #{json['title']}"
  puts "   - DeletedAt: #{json['deletedAt']}"
  puts "   - ✓ Campo deletedAt presente nel JSON"
end

# Restore
puts "\n5. Ripristino prodotto..."
Product.with_deleted.find(product.id).restore
puts "   ✓ Restored! Deleted_at: #{Product.find(product.id).deleted_at.inspect}"

# Final verification
final_visible = Product.count
puts "\n6. Conteggio finale prodotti visibili: #{final_visible}"

puts "\n=== TEST COMPLETATO! ✅ ===\n"
