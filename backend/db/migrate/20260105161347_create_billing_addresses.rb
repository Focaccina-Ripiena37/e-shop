class CreateBillingAddresses < ActiveRecord::Migration[8.1]
  def change
    create_table :billing_addresses do |t|
      t.references :order, null: false, foreign_key: true, index: { unique: true }
      t.string :full_name, null: false
      t.string :street, null: false
      t.string :city, null: false
      t.string :zip, null: false
      t.string :country, null: false
      t.string :vat_number

      t.timestamps
    end
  end
end
