class Cart < ApplicationRecord
  belongs_to :user
  has_many :cart_items, dependent: :destroy

  # Sum of quantity * unit_price over all items
  def subtotal
    cart_items.sum { |item| item.quantity * item.unit_price }
  end
end
