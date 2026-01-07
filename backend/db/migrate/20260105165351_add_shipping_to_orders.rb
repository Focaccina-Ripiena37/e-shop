class AddShippingToOrders < ActiveRecord::Migration[8.1]
  def change
    add_column :orders, :shipping_type, :string, null: false, default: 'standard'
    add_column :orders, :shipping_cost, :decimal, precision: 10, scale: 2, null: false, default: 3.99
  end
end
