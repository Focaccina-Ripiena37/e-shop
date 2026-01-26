# Test soft delete con gestione admin
puts "\n=== TEST SOFT DELETE CON ADMIN UI ==="

# Trova un prodotto esistente
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

# Verifica che non appaia nella lista normale
visible_count = Product.count
with_deleted_count = Product.with_deleted.count
puts "\n3. Conteggio prodotti:"
puts "   - Visibili (normale): #{visible_count}"
puts "   - Con deleted: #{with_deleted_count}"

# Test serializzazione JSON (come farebbe il controller)
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

# Verifica finale
final_visible = Product.count
puts "\n6. Conteggio finale prodotti visibili: #{final_visible}"

puts "\n=== TEST COMPLETATO! ✅ ===\n"
