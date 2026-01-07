# Database seeds - Product catalog with Categories and Tags
puts "Seeding database..."

# Clear existing data (for clean reset)
puts "Clearing existing data..."
ProductTag.destroy_all
Product.destroy_all
Tag.destroy_all
Category.destroy_all

# Create Categories
puts "Creating categories..."
categories = {}
['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports & Outdoors'].each do |name|
  categories[name] = Category.create!(name: name)
end
puts "Created #{Category.count} categories"

# Create Tags
puts "Creating tags..."
tag_names = [
  # Electronics
  'laptop', 'smartphone', 'apple', 'wireless', 'audio', 'wearable', 'fitness',
  # Clothing
  'jacket', 'shoes', 'tshirt', 'denim', 'running', 'organic',
  # Books
  'book', 'programming', 'self-help', 'fantasy', 'history', 'science', 'classic',
  # Home & Kitchen
  'home', 'kitchen', 'coffee', 'cookware', 'lighting', 'design', 'cleaning', 'robot', 'wellness', 'aromatherapy',
  # Sports & Outdoors
  'sports', 'outdoor', 'camping', 'cycling', 'bike', 'yoga', 'weights'
]
tags = {}
tag_names.each do |name|
  tags[name] = Tag.create!(name: name)
end
puts "Created #{Tag.count} tags"

# Helper method to create product with tags
def create_product_with_tags(attrs, category, tag_objects)
  product = Product.create!(attrs.merge(category: category))
  tag_objects.each do |tag|
    ProductTag.create!(product: product, tag: tag)
  end
  product
end

# Electronics
puts "Creating Electronics products..."
create_product_with_tags(
  {
    title: 'MacBook Pro 16"',
    description: 'Professional laptop with M3 Pro chip, 18GB RAM, 512GB SSD.',
    price: 2499.00,
    original_price: 2499.00,
    sale: false,
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800'
    ]
  },
  categories['Electronics'],
  [tags['laptop'], tags['apple']]
)

create_product_with_tags(
  {
    title: 'iPhone 15 Pro',
    description: 'Smartphone with A17 Pro chip, 48MP camera, titanium design.',
    price: 1099.00,
    original_price: 1199.00,
    sale: true,
    thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800',
      'https://images.unsplash.com/photo-1592286927505-1def25115558?w=800'
    ]
  },
  categories['Electronics'],
  [tags['smartphone'], tags['apple']]
)

create_product_with_tags(
  {
    title: 'Wireless Bluetooth Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30h battery life.',
    price: 199.00,
    original_price: 249.00,
    sale: true,
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800'
    ]
  },
  categories['Electronics'],
  [tags['audio'], tags['wireless']]
)

create_product_with_tags(
  {
    title: 'Smart Watch Pro',
    description: 'Fitness tracker with heart rate monitor, GPS, sleep tracking, 7-day battery.',
    price: 299.00,
    original_price: 349.00,
    sale: true,
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800'
    ]
  },
  categories['Electronics'],
  [tags['wearable'], tags['fitness']]
)

puts "Created 4 Electronics products"

# Clothing
puts "Creating Clothing products..."
create_product_with_tags(
  {
    title: 'Denim Jacket Vintage',
    description: '100% cotton denim jacket, regular fit, stone washed.',
    price: 89.99,
    original_price: 89.99,
    sale: false,
    thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800'
    ]
  },
  categories['Clothing'],
  [tags['jacket'], tags['denim']]
)

create_product_with_tags(
  {
    title: 'Running Sneakers Pro',
    description: 'Advanced cushioning, breathable upper, ultra-grip sole.',
    price: 129.00,
    original_price: 149.00,
    sale: true,
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800'
    ]
  },
  categories['Clothing'],
  [tags['shoes'], tags['running']]
)

create_product_with_tags(
  {
    title: 'Organic Cotton T-Shirt',
    description: 'Certified organic cotton tee, comfortable fit.',
    price: 29.99,
    original_price: 29.99,
    sale: false,
    thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800'
    ]
  },
  categories['Clothing'],
  [tags['tshirt'], tags['organic']]
)

puts "Created 3 Clothing products"

# Books
puts "Creating Books..."
create_product_with_tags(
  {
    title: 'Clean Code - Robert Martin',
    description: 'Complete guide to writing clean, maintainable code. Software development best practices.',
    price: 42.99,
    original_price: 42.99,
    sale: false,
    thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
    images: [
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800'
    ]
  },
  categories['Books'],
  [tags['book'], tags['programming']]
)

create_product_with_tags(
  {
    title: 'Atomic Habits - James Clear',
    description: 'How to build good habits and break bad ones. Practical method for change.',
    price: 24.99,
    original_price: 24.99,
    sale: false,
    thumbnail: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800'
    ]
  },
  categories['Books'],
  [tags['book'], tags['self-help']]
)

create_product_with_tags(
  {
    title: 'The Lord of the Rings - Tolkien',
    description: 'Complete edition of the beloved fantasy trilogy. With maps and appendices.',
    price: 39.99,
    original_price: 49.99,
    sale: true,
    thumbnail: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=500',
    images: [
      'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=800',
      'https://images.unsplash.com/photo-1506466010722-395aa2bef877?w=800'
    ]
  },
  categories['Books'],
  [tags['book'], tags['fantasy'], tags['classic']]
)

create_product_with_tags(
  {
    title: 'Sapiens - Yuval Noah Harari',
    description: 'A brief history of humankind. International bestseller about our past.',
    price: 22.99,
    original_price: 22.99,
    sale: false,
    thumbnail: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500',
    images: [
      'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800'
    ]
  },
  categories['Books'],
  [tags['book'], tags['history'], tags['science']]
)

puts "Created 4 Books"

# Home & Kitchen
puts "Creating Home & Kitchen products..."
create_product_with_tags(
  {
    title: 'Espresso Coffee Machine',
    description: 'Professional espresso machine, 19 bar pressure, integrated milk frother, 1.8L tank.',
    price: 449.00,
    original_price: 499.00,
    sale: true,
    thumbnail: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'
    ]
  },
  categories['Home & Kitchen'],
  [tags['home'], tags['kitchen'], tags['coffee']]
)

create_product_with_tags(
  {
    title: 'Non-Stick Cookware Set',
    description: '5-piece set with premium non-stick coating, suitable for all cooktops including induction.',
    price: 159.00,
    original_price: 159.00,
    sale: false,
    thumbnail: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500',
    images: [
      'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'
    ]
  },
  categories['Home & Kitchen'],
  [tags['home'], tags['kitchen'], tags['cookware']]
)

create_product_with_tags(
  {
    title: 'LED Design Lamp',
    description: 'Desk lamp with touch dimmer, 3 color temperatures, adjustable arm. Minimalist design.',
    price: 79.99,
    original_price: 79.99,
    sale: false,
    thumbnail: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800'
    ]
  },
  categories['Home & Kitchen'],
  [tags['home'], tags['lighting'], tags['design']]
)

create_product_with_tags(
  {
    title: 'Robot Vacuum Cleaner',
    description: 'Smart mapping robot vacuum, app control, 120 min autonomy, auto-empty station.',
    price: 399.00,
    original_price: 449.00,
    sale: true,
    thumbnail: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500',
    images: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800'
    ]
  },
  categories['Home & Kitchen'],
  [tags['home'], tags['cleaning'], tags['robot']]
)

create_product_with_tags(
  {
    title: 'Ultrasonic Aroma Diffuser',
    description: 'Essential oil diffuser with multicolor LED, programmable timer, 300ml capacity.',
    price: 49.99,
    original_price: 49.99,
    sale: false,
    thumbnail: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800',
      'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=800'
    ]
  },
  categories['Home & Kitchen'],
  [tags['home'], tags['wellness'], tags['aromatherapy']]
)

puts "Created 5 Home & Kitchen products"

# Sports & Outdoors
puts "Creating Sports & Outdoors products..."
create_product_with_tags(
  {
    title: 'Camping Tent 4-Person',
    description: 'Waterproof tent with double layer, integrated mosquito net, quick setup. Weight 4.5kg.',
    price: 189.00,
    original_price: 189.00,
    sale: false,
    thumbnail: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500',
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
      'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800'
    ]
  },
  categories['Sports & Outdoors'],
  [tags['sports'], tags['outdoor'], tags['camping']]
)

create_product_with_tags(
  {
    title: 'Mountain Bike 29"',
    description: 'MTB with aluminum frame, 120mm front suspension, Shimano 21-speed shifter.',
    price: 699.00,
    original_price: 799.00,
    sale: true,
    thumbnail: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500',
    images: [
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800'
    ]
  },
  categories['Sports & Outdoors'],
  [tags['sports'], tags['cycling'], tags['bike']]
)

create_product_with_tags(
  {
    title: 'Premium Yoga Mat',
    description: 'Eco-friendly TPE mat, 6mm thickness, non-slip, alignment guides. Includes bag.',
    price: 39.99,
    original_price: 39.99,
    sale: false,
    thumbnail: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'
    ]
  },
  categories['Sports & Outdoors'],
  [tags['sports'], tags['yoga'], tags['fitness']]
)

create_product_with_tags(
  {
    title: 'Adjustable Dumbbells 20kg',
    description: 'Adjustable dumbbell set from 2.5kg to 20kg per hand, quick-lock system, stand included.',
    price: 249.00,
    original_price: 249.00,
    sale: false,
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500',
    images: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'
    ]
  },
  categories['Sports & Outdoors'],
  [tags['sports'], tags['fitness'], tags['weights']]
)

puts "Created 4 Sports & Outdoors products"

puts "\nSeeding completed!"
puts "Total categories: #{Category.count}"
puts "Total tags: #{Tag.count}"
puts "Total products: #{Product.count}"
puts "Total product-tag associations: #{ProductTag.count}"

# Users
puts "\nCreating users..."
User.find_or_create_by!(email: 'user@test.com') do |u|
  u.password = 'password123'
  u.password_confirmation = 'password123'
end

User.find_or_create_by!(email: 'admin@test.com') do |u|
  u.password = 'password123'
  u.password_confirmation = 'password123'
  u.admin = true
end

puts "Created #{User.count} users"
