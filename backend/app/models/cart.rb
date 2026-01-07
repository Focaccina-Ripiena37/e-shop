class Cart < ApplicationRecord
  # Each cart belongs to a user and has many cart items
  belongs_to :user
  has_many :cart_items, dependent: :destroy
  has_many :products, through: :cart_items
end
