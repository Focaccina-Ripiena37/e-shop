class Order < ApplicationRecord
  belongs_to :user, optional: true  # Allow orders without user after account deactivation
  has_many :order_items, dependent: :destroy
  has_one :billing_address, dependent: :destroy

  STATUSES = %w[pending processing shipped delivered cancelled paid].freeze
  PAYMENT_METHODS = %w[credit_card].freeze
  SHIPPING_TYPES = %w[standard premium].freeze

  validates :status, inclusion: { in: STATUSES }
  validates :payment_method, presence: true, inclusion: { in: PAYMENT_METHODS }
  validates :shipping_type, presence: true, inclusion: { in: SHIPPING_TYPES }
  validates :shipping_cost, presence: true, numericality: { greater_than_or_equal_to: 0 }

  validates :first_name, :last_name, :email, :street, :city, :zip, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :zip, format: { with: /\A[0-9]{5}\z/, message: "must be 5 digits" }
  validates :total, numericality: { greater_than: 0 }

  # Card validation
  validates :card_brand, presence: true, inclusion: { in: %w[Visa Mastercard] }
  validates :card_last4, presence: true, format: { with: /\A[0-9]{4}\z/, message: "must be 4 digits" }

  accepts_nested_attributes_for :billing_address
end
