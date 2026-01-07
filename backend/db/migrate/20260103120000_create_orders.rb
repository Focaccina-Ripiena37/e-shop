class CreateOrders < ActiveRecord::Migration[7.1]
  def change
    create_table :orders do |t|
      t.references :user, null: false, foreign_key: true
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :email, null: false
      t.string :street, null: false
      t.string :city, null: false
      t.string :zip, null: false
      t.decimal :total, precision: 10, scale: 2, null: false, default: 0
      t.string :status, null: false, default: 'pending'

      t.timestamps
    end
  end
end
