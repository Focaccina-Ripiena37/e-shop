# Database seeds - Product catalog with Categories and Tags
puts "Seeding database..."

# Clear existing data (for clean reset)
puts "Clearing existing data..."
OrderItem.destroy_all
Order.destroy_all
CartItem.destroy_all
Cart.destroy_all
ProductTag.destroy_all
Product.destroy_all
Tag.destroy_all
Category.destroy_all

# Create Categories
puts "Creating categories..."
categories = {}
[ 'Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports & Outdoors' ].each do |name|
  categories[name] = Category.create!(name: name)
end
puts "Created #{Category.count} categories"

# Create Tags
puts "Creating tags..."
tag_names = [
  # Electronics
  'laptop', 'smartphone', 'apple', 'wireless', 'audio', 'wearable', 'fitness',
  'gaming', 'nvidia', 'gpu', 'cpu', 'amd', 'pc-case', 'rgb',
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
    title: 'Apple 2024 MacBook Pro',
    description: 'Apple MacBook Pro 2024 Laptop with M4 Pro chip, 14-core CPU and 20-core GPU; 16.2-inch Liquid Retina XDR display, 24GB unified storage, 512GB SSD storage; Space Black color',
    price: 2499.00,
    original_price: 2499.00,
    sale: false,
    thumbnail: 'https://m.media-amazon.com/images/I/61j26WkzavL._AC_SL1500_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/61j26WkzavL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/61LYZuPm94L._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/81s5m7q6OIL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/618SZiGilDL._AC_SL1500_.jpg'
    ]
  },
  categories['Electronics'],
  [ tags['laptop'], tags['apple'] ]
)

create_product_with_tags(
  {
    title: 'iPhone 15 Pro 128GB',
    description: 'Smartphone with A17 Pro chip, 48MP camera, titanium design.',
    price: 600.00,
    original_price: 600.00,
    sale: false,
    thumbnail: 'https://m.media-amazon.com/images/I/81NDDPNpt4L._AC_SL1500_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/81NDDPNpt4L._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/81er5wuPUqL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/61lQJACyNRL._AC_SL1500_.jpg'
    ]
  },
  categories['Electronics'],
  [ tags['smartphone'], tags['apple'] ]
)

create_product_with_tags(
  {
    title: 'Wireless Bluetooth Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30h battery life.',
    price: 199.00,
    original_price: 249.00,
    sale: true,
    thumbnail: 'https://m.media-amazon.com/images/I/51f7KKP25PL._AC_SL1000_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/51f7KKP25PL._AC_SL1000_.jpg',
      'https://m.media-amazon.com/images/I/61j+d6wLCEL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/61Ym4SBP7zL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/615c64LJhBL._AC_SL1500_.jpg'
    ]
  },
  categories['Electronics'],
  [ tags['audio'], tags['wireless'] ]
)

create_product_with_tags(
  {
    title: 'Smart Watch Pro',
    description: 'Fitness tracker with heart rate monitor, GPS, sleep tracking, 7-day battery.',
    price: 299.00,
    original_price: 349.00,
    sale: true,
    thumbnail: 'https://m.media-amazon.com/images/I/71qMhhNEdSL._AC_SL1500_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/71qMhhNEdSL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71LqoZu8E1L._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/81eUTWvBcVL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71lEfIrJT8L._AC_SL1500_.jpg'
    ]
  },
  categories['Electronics'],
  [ tags['wearable'], tags['fitness'] ]
)

create_product_with_tags(
  {
    title: 'Gaming Laptop',
    description: 'Acer Nitro V 16 AI PC Portatile IA, Notebook Gaming, NVIDIA GeForce RTX 5070 8 GB, Processore Ryzen™ AI 9 365, Ram 32 GB DDR5, 1024 GB SSD, Display 16" WQXGA IPS 180 Hz, Copilot+ PC, Windows 11 Home',
    price: 1499.00,
    original_price: 1599.00,
    sale: true,
    thumbnail: 'https://m.media-amazon.com/images/I/71wAWDX8PGL._AC_SL1500_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/71wAWDX8PGL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/712RaXrST9L._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/81h-GR13-CL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/61aQA7IviWL._AC_SL1500_.jpg'
    ]
  },
  categories['Electronics'],
  [ tags['laptop'], tags['gaming'], tags['nvidia'] ]
)

create_product_with_tags(
  {
    title: 'GeForce RTX 5080',
    description: 'ASUS PRIME NVIDIA GeForce RTX 5080 OC Edition, Video card 16 GB GDDR7, 256 Bit, PCIe 5.0, 1 HDMI, 3 DisplayPort',
    price: 1099.00,
    original_price: 1099.00,
    sale: false,
    thumbnail: 'https://m.media-amazon.com/images/I/81cPV47HNyL._AC_SL1500_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/81cPV47HNyL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71Yo7Yctt7L._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/81Pb5MSYc2L._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/81yICr30ETL._AC_SL1500_.jpg'
    ]
  },
  categories['Electronics'],
  [ tags['gpu'], tags['nvidia'], tags['gaming'] ]
)

create_product_with_tags(
  {
    title: 'AMD RYZEN™ 7 9800X3D',
    description: 'AMD RYZEN™ 7 9800X3D 8 Core/16 Thread Unlocked, Zen 5 Architecture, 104 MB Cache, 120W TDP, Up to 5.2 GHz Boost Frequency, Socket AM5, Cooler Not Included',
    price: 399.00,
    original_price: 399.00,
    sale: false,
    thumbnail: 'https://m.media-amazon.com/images/I/71aHvYUgX1L._AC_SL1500_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/71aHvYUgX1L._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/715fCWT5GgL._AC_SL1500_.jpg'
    ]
  },
  categories['Electronics'],
  [ tags['cpu'], tags['amd'], tags['gaming'] ]
)

create_product_with_tags(
  {
    title: 'ASUS Prime AP202 ARGB',
    description: 'ASUS Prime AP202 ARGB, mATX Case, Tool-Free Panels, Support for 360mm Heatsinks, 420mm Graphics Cards and 200mm Power Supplies, 3 Integrated ARGB Fans, USB-C Port, Black',
    price: 120.00,
    original_price: 139.00,
    sale: true,
    thumbnail: 'https://m.media-amazon.com/images/I/81SLMACl6SL._AC_SL1500_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/81SLMACl6SL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/81Bn-hWMJhL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/817HWf4ZT6L._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/81J511nyHsL._AC_SL1500_.jpg'
    ]
  },
  categories['Electronics'],
  [ tags['pc-case'], tags['rgb'], tags['gaming'] ]
)

puts "Created 8 Electronics products"

# Clothing
puts "Creating Clothing products..."
create_product_with_tags(
  {
    title: 'Denim Jacket Vintage',
    description: '100% cotton denim jacket, regular fit, stone washed.',
    price: 89.99,
    original_price: 89.99,
    sale: false,
    thumbnail: 'https://m.media-amazon.com/images/I/81CT2qSz0wL._AC_SY741_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/81CT2qSz0wL._AC_SY741_.jpg',
      'https://m.media-amazon.com/images/I/811104XjrCL._AC_SY741_.jpg',
      'https://m.media-amazon.com/images/I/81Z4YErK59L._AC_SX679_.jpg',
      'https://m.media-amazon.com/images/I/91B9HHv+jrL._AC_SX679_.jpg',
      'https://m.media-amazon.com/images/I/91xX6YTz8yL._AC_SX679_.jpg',
      'https://m.media-amazon.com/images/I/A18yZ2T9h0L._AC_SX679_.jpg'
    ]
  },
  categories['Clothing'],
  [ tags['jacket'], tags['denim'] ]
)

create_product_with_tags(
  {
    title: 'Running Sneakers Pro',
    description: 'Advanced cushioning, breathable upper, ultra-grip sole.',
    price: 129.00,
    original_price: 149.00,
    sale: true,
    thumbnail: 'https://m.media-amazon.com/images/I/71qEpTPmmyL._AC_SX575_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/71qEpTPmmyL._AC_SX575_.jpg',
      'https://m.media-amazon.com/images/I/615MbPG2fQL._AC_SY575_.jpg',
      'https://m.media-amazon.com/images/I/71H1hzptj5L._AC_SX575_.jpg',
      'https://m.media-amazon.com/images/I/71MoYbgjXeL._AC_SX575_.jpg'
    ]
  },
  categories['Clothing'],
  [ tags['shoes'], tags['running'] ]
)

create_product_with_tags(
  {
    title: 'Organic Cotton T-Shirt',
    description: 'Certified organic cotton tee, comfortable fit.',
    price: 29.99,
    original_price: 29.99,
    sale: false,
    thumbnail: 'https://m.media-amazon.com/images/I/61onAWYNTUL._AC_SX522_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/61onAWYNTUL._AC_SX522_.jpg',
      'https://m.media-amazon.com/images/I/71ogjryujsL._AC_SY550_.jpg',
      'https://m.media-amazon.com/images/I/41iMjikb3cL._AC_.jpg'
    ]
  },
  categories['Clothing'],
  [ tags['tshirt'], tags['organic'] ]
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
    thumbnail: 'https://m.media-amazon.com/images/I/81Rnac2Fq+L._SL1500_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/81Rnac2Fq+L._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71A3pbWeF0L._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71LCi6lP1RL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71ZyVB54MRL._SL1500_.jpg'
    ]
  },
  categories['Books'],
  [ tags['book'], tags['programming'] ]
)

create_product_with_tags(
  {
    title: 'Atomic Habits - James Clear',
    description: 'How to build good habits and break bad ones. Practical method for change.',
    price: 24.99,
    original_price: 24.99,
    sale: false,
    thumbnail: 'https://m.media-amazon.com/images/I/81kg51XRc1L._SL1500_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/81kg51XRc1L._SL1500_.jpg'
    ]
  },
  categories['Books'],
  [ tags['book'], tags['self-help'] ]
)

create_product_with_tags(
  {
    title: 'The Lord of the Rings - Tolkien',
    description: 'Complete edition of the beloved fantasy trilogy. With maps and appendices.',
    price: 39.99,
    original_price: 49.99,
    sale: true,
    thumbnail: 'https://m.media-amazon.com/images/I/61m29vX9IKL._SL1169_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/61m29vX9IKL._SL1169_.jpg',
      'https://m.media-amazon.com/images/I/81MQBzDw6ZL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/81uRF7s+XmL._SL1500_.jpg'
    ]
  },
  categories['Books'],
  [ tags['book'], tags['fantasy'], tags['classic'] ]
)

create_product_with_tags(
  {
    title: 'Sapiens - Yuval Noah Harari',
    description: 'A brief history of humankind. International bestseller about our past.',
    price: 22.99,
    original_price: 22.99,
    sale: false,
    thumbnail: 'https://m.media-amazon.com/images/I/71JvpJ2dMZL._SL1300_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/71JvpJ2dMZL._SL1300_.jpg',
      'https://m.media-amazon.com/images/I/61hbZIc4HlL._SL1080_.jpg'
    ]
  },
  categories['Books'],
  [ tags['book'], tags['history'], tags['science'] ]
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
    thumbnail: 'https://m.media-amazon.com/images/I/61oaZO8l8SL._AC_SL1080_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/61oaZO8l8SL._AC_SL1080_.jpg',
      'https://m.media-amazon.com/images/I/712E8-x1WBL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/51hA-6x4pYL._AC_.jpg'
    ]
  },
  categories['Home & Kitchen'],
  [ tags['home'], tags['kitchen'], tags['coffee'] ]
)

create_product_with_tags(
  {
    title: 'Non-Stick Cookware Set',
    description: '5-piece set with premium non-stick coating, suitable for all cooktops including induction.',
    price: 159.00,
    original_price: 159.00,
    sale: false,
    thumbnail: 'https://m.media-amazon.com/images/I/91-nS2vR-nL._AC_SL1500_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/91-nS2vR-nL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/91FkLQkIdRL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/81Qh7HNYWdL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/91dvpLBvkML._AC_SL1500_.jpg'
    ]
  },
  categories['Home & Kitchen'],
  [ tags['home'], tags['kitchen'], tags['cookware'] ]
)

create_product_with_tags(
  {
    title: 'LED Design Lamp',
    description: 'Desk lamp with touch dimmer, 3 color temperatures, adjustable arm. Minimalist design.',
    price: 79.99,
    original_price: 79.99,
    sale: false,
    thumbnail: 'https://m.media-amazon.com/images/I/614ieVb3YPL._AC_SL1500_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/614ieVb3YPL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71CLgbNmSwL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71Vtf0f8GbL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71WSobmdSiL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/51x-k3NRU1L._AC_.jpg'
    ]
  },
  categories['Home & Kitchen'],
  [ tags['home'], tags['lighting'], tags['design'] ]
)

create_product_with_tags(
  {
    title: 'Robot Vacuum Cleaner',
    description: 'Smart mapping robot vacuum, app control, 120 min autonomy, auto-empty station.',
    price: 399.00,
    original_price: 449.00,
    sale: true,
    thumbnail: 'https://m.media-amazon.com/images/I/51hQKU+yOxL._AC_SL1000_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/51hQKU+yOxL._AC_SL1000_.jpg',
      'https://m.media-amazon.com/images/I/71PgN6BZOCL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/51bgM5OjdVL._AC_SL1000_.jpg',
      'https://m.media-amazon.com/images/I/61w5CO1UFLL._AC_SL1000_.jpg',
      'https://m.media-amazon.com/images/I/51ChkiSEdcL._AC_SL1000_.jpg'
    ]
  },
  categories['Home & Kitchen'],
  [ tags['home'], tags['cleaning'], tags['robot'] ]
)

create_product_with_tags(
  {
    title: 'Ultrasonic Aroma Diffuser',
    description: 'Essential oil diffuser with multicolor LED, programmable timer, 300ml capacity.',
    price: 49.99,
    original_price: 49.99,
    sale: false,
    thumbnail: 'https://m.media-amazon.com/images/I/81HjaJLadYL._AC_SL1500_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/81HjaJLadYL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/81uoK-GPY0L._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/81UfO681h2L._AC_SL1500_.jpg'
    ]
  },
  categories['Home & Kitchen'],
  [ tags['home'], tags['wellness'], tags['aromatherapy'] ]
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
    thumbnail: 'https://m.media-amazon.com/images/I/71sAIDQFBxL._AC_SL1500_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/71sAIDQFBxL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/61-3dQEsKyL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/613quZZUsHL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/61extMuj0fL._AC_SL1500_.jpg'
    ]
  },
  categories['Sports & Outdoors'],
  [ tags['sports'], tags['outdoor'], tags['camping'] ]
)

create_product_with_tags(
  {
    title: 'Mountain Bike 29"',
    description: 'MTB with aluminum frame, 120mm front suspension, Shimano 21-speed shifter.',
    price: 699.00,
    original_price: 799.00,
    sale: true,
    thumbnail: 'https://m.media-amazon.com/images/I/71R0CS4+AcL._AC_SL1500_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/71R0CS4+AcL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71QjwDGu70L._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/713y457cz2L._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71rOKiub7FL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71cKjPC9usL._AC_SL1500_.jpg'
    ]
  },
  categories['Sports & Outdoors'],
  [ tags['sports'], tags['cycling'], tags['bike'] ]
)

create_product_with_tags(
  {
    title: 'Premium Yoga Mat',
    description: 'Eco-friendly TPE mat, 6mm thickness, non-slip, alignment guides. Includes bag.',
    price: 39.99,
    original_price: 39.99,
    sale: false,
    thumbnail: 'https://m.media-amazon.com/images/I/81gb1BwV-LL._AC_SL1500_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/81gb1BwV-LL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/710l-QsDJpL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/910VjBNpgKL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/91FBFYUOpHL._AC_SL1500_.jpg'
    ]
  },
  categories['Sports & Outdoors'],
  [ tags['sports'], tags['yoga'], tags['fitness'] ]
)

create_product_with_tags(
  {
    title: 'Adjustable Dumbbells 20kg',
    description: 'Adjustable dumbbell set from 2.5kg to 20kg per hand, quick-lock system, stand included.',
    price: 249.00,
    original_price: 249.00,
    sale: false,
    thumbnail: 'https://m.media-amazon.com/images/I/71VKdoPX8eL._AC_SL1500_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/71VKdoPX8eL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71c6YdylZvL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71xGQI3ZoZL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71rLbv5UcuL._AC_SL1500_.jpg'
    ]
  },
  categories['Sports & Outdoors'],
  [ tags['sports'], tags['fitness'], tags['weights'] ]
)

puts "Created 4 Sports & Outdoors products"

puts "\nSeeding completed!"
puts "Total categories: #{Category.count}"
puts "Total tags: #{Tag.count}"
puts "Total products: #{Product.count}"
puts "Total product-tag associations: #{ProductTag.count}"

# Users
puts "\nCreating users..."

# Admin user
admin = User.find_or_create_by!(email: 'admin@test.com') do |u|
  u.password = 'password123'
  u.password_confirmation = 'password123'
  u.admin = true
end

# Regular users with realistic data
user1 = User.find_or_create_by!(email: 'marco.rossi@email.it') do |u|
  u.password = 'password123'
  u.password_confirmation = 'password123'
  u.admin = false
end

user2 = User.find_or_create_by!(email: 'giulia.bianchi@email.it') do |u|
  u.password = 'password123'
  u.password_confirmation = 'password123'
  u.admin = false
end

user3 = User.find_or_create_by!(email: 'alessandro.ferrari@email.it') do |u|
  u.password = 'password123'
  u.password_confirmation = 'password123'
  u.admin = false
end

# Inactive user (deactivated account)
user4 = User.find_or_create_by!(email: 'stefano.colombo@email.it') do |u|
  u.password = 'password123'
  u.password_confirmation = 'password123'
  u.admin = false
  u.active = false
end

puts "Created #{User.count} users (including #{User.where(active: false).count} inactive)"

# Orders
puts "\nCreating sample orders..."

# Get some products for orders
macbook = Product.find_by(title: 'Apple 2024 MacBook Pro')
iphone = Product.find_by(title: 'iPhone 15 Pro 128GB')
headphones = Product.find_by(title: 'Wireless Bluetooth Headphones')
watch = Product.find_by(title: 'Smart Watch Pro')
gaming_laptop = Product.find_by(title: 'Gaming Laptop')
rtx = Product.find_by(title: 'GeForce RTX 5080')
yoga_mat = Product.find_by(title: 'Premium Yoga Mat')
book = Product.find_by(title: 'Clean Code - Robert Martin')
coffee_machine = Product.find_by(title: 'Espresso Coffee Machine')
bike = Product.find_by(title: 'Mountain Bike 29"')

# Order 1 - Marco Rossi (Delivered)
order1 = Order.create!(
  user: user1,
  status: 'delivered',
  total: headphones.price + watch.price,
  payment_method: 'credit_card',
  shipping_type: 'standard',
  shipping_cost: 5.99,
  first_name: 'Marco',
  last_name: 'Rossi',
  email: 'marco.rossi@email.it',
  street: 'Via Roma 123',
  city: 'Ferrara',
  zip: '44121',
  card_brand: 'Visa',
  card_last4: '4242',
  billing_address_attributes: {
    full_name: 'Marco Rossi',
    street: 'Via Roma 123',
    city: 'Ferrara',
    zip: '44121',
    country: 'Italia'
  }
)
OrderItem.create!(order: order1, product: headphones, quantity: 1, unit_price: headphones.price)
OrderItem.create!(order: order1, product: watch, quantity: 1, unit_price: watch.price)

# Order 2 - Marco Rossi (Shipped)
order2 = Order.create!(
  user: user1,
  status: 'shipped',
  total: book.price * 2 + yoga_mat.price,
  payment_method: 'credit_card',
  shipping_type: 'premium',
  shipping_cost: 9.99,
  first_name: 'Marco',
  last_name: 'Rossi',
  email: 'marco.rossi@email.it',
  street: 'Via Roma 123',
  city: 'Ferrara',
  zip: '44121',
  card_brand: 'Mastercard',
  card_last4: '5555',
  billing_address_attributes: {
    full_name: 'Marco Rossi',
    street: 'Via Roma 123',
    city: 'Ferrara',
    zip: '44121',
    country: 'Italia'
  }
)
OrderItem.create!(order: order2, product: book, quantity: 2, unit_price: book.price)
OrderItem.create!(order: order2, product: yoga_mat, quantity: 1, unit_price: yoga_mat.price)

# Order 3 - Giulia Bianchi (Delivered)
order3 = Order.create!(
  user: user2,
  status: 'delivered',
  total: macbook.price + iphone.price,
  payment_method: 'credit_card',
  shipping_type: 'premium',
  shipping_cost: 9.99,
  first_name: 'Giulia',
  last_name: 'Bianchi',
  email: 'giulia.bianchi@email.it',
  street: 'Corso Ercole I d\'Este 45',
  city: 'Ferrara',
  zip: '44121',
  card_brand: 'Visa',
  card_last4: '1234',
  billing_address_attributes: {
    full_name: 'Giulia Bianchi',
    street: 'Corso Ercole I d\'Este 45',
    city: 'Ferrara',
    zip: '44121',
    country: 'Italia'
  }
)
OrderItem.create!(order: order3, product: macbook, quantity: 1, unit_price: macbook.price)
OrderItem.create!(order: order3, product: iphone, quantity: 1, unit_price: iphone.price)

# Order 4 - Giulia Bianchi (Processing)
order4 = Order.create!(
  user: user2,
  status: 'processing',
  total: coffee_machine.price + book.price,
  payment_method: 'credit_card',
  shipping_type: 'standard',
  shipping_cost: 5.99,
  first_name: 'Giulia',
  last_name: 'Bianchi',
  email: 'giulia.bianchi@email.it',
  street: 'Corso Ercole I d\'Este 45',
  city: 'Ferrara',
  zip: '44121',
  card_brand: 'Mastercard',
  card_last4: '9876',
  billing_address_attributes: {
    full_name: 'Giulia Bianchi',
    street: 'Corso Ercole I d\'Este 45',
    city: 'Ferrara',
    zip: '44121',
    country: 'Italia'
  }
)
OrderItem.create!(order: order4, product: coffee_machine, quantity: 1, unit_price: coffee_machine.price)
OrderItem.create!(order: order4, product: book, quantity: 1, unit_price: book.price)

# Order 5 - Alessandro Ferrari (Delivered)
order5 = Order.create!(
  user: user3,
  status: 'delivered',
  total: gaming_laptop.price + rtx.price,
  payment_method: 'credit_card',
  shipping_type: 'premium',
  shipping_cost: 9.99,
  first_name: 'Alessandro',
  last_name: 'Ferrari',
  email: 'alessandro.ferrari@email.it',
  street: 'Via Mazzini 78',
  city: 'Bologna',
  zip: '40121',
  card_brand: 'Visa',
  card_last4: '6789',
  billing_address_attributes: {
    full_name: 'Alessandro Ferrari',
    street: 'Via Mazzini 78',
    city: 'Bologna',
    zip: '40121',
    country: 'Italia'
  }
)
OrderItem.create!(order: order5, product: gaming_laptop, quantity: 1, unit_price: gaming_laptop.price)
OrderItem.create!(order: order5, product: rtx, quantity: 1, unit_price: rtx.price)

# Order 6 - Alessandro Ferrari (Shipped)
order6 = Order.create!(
  user: user3,
  status: 'shipped',
  total: bike.price + headphones.price,
  payment_method: 'credit_card',
  shipping_type: 'standard',
  shipping_cost: 5.99,
  first_name: 'Alessandro',
  last_name: 'Ferrari',
  email: 'alessandro.ferrari@email.it',
  street: 'Via Mazzini 78',
  city: 'Bologna',
  zip: '40121',
  card_brand: 'Mastercard',
  card_last4: '3333',
  billing_address_attributes: {
    full_name: 'Alessandro Ferrari',
    street: 'Via Mazzini 78',
    city: 'Bologna',
    zip: '40121',
    country: 'Italia'
  }
)
OrderItem.create!(order: order6, product: bike, quantity: 1, unit_price: bike.price)
OrderItem.create!(order: order6, product: headphones, quantity: 1, unit_price: headphones.price)

# Order 7 - Stefano Colombo (Delivered - Before account deactivation)
order7 = Order.create!(
  user: user4,
  status: 'delivered',
  total: iphone.price + headphones.price,
  payment_method: 'credit_card',
  shipping_type: 'standard',
  shipping_cost: 5.99,
  first_name: 'Stefano',
  last_name: 'Colombo',
  email: 'stefano.colombo@email.it',
  street: 'Via Garibaldi 56',
  city: 'Milano',
  zip: '20121',
  card_brand: 'Visa',
  card_last4: '8888',
  billing_address_attributes: {
    full_name: 'Stefano Colombo',
    street: 'Via Garibaldi 56',
    city: 'Milano',
    zip: '20121',
    country: 'Italia'
  }
)
OrderItem.create!(order: order7, product: iphone, quantity: 1, unit_price: iphone.price)
OrderItem.create!(order: order7, product: headphones, quantity: 1, unit_price: headphones.price)

puts "Created #{Order.count} orders with #{OrderItem.count} items"
puts "\nSeed completed successfully!"
