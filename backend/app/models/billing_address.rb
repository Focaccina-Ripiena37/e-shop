class BillingAddress < ApplicationRecord
  belongs_to :order

  validates :full_name, :street, :city, :zip, :country, presence: true
  validates :zip, format: { with: /\A[0-9A-Za-z\s-]{3,10}\z/, message: "must be valid postal code" }
  validates :country, length: { minimum: 2 }
  validates :vat_number, format: { with: /\A[A-Z0-9]{8,15}\z/, message: "must be valid format" }, allow_blank: true
end
