class AddPaymentFieldsToOrders < ActiveRecord::Migration[8.1]
  def change
    add_column :orders, :payment_method, :string
    add_column :orders, :card_brand, :string
    add_column :orders, :card_last4, :string
  end
end
