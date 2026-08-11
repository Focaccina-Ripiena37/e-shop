class User < ApplicationRecord
  # Minimal devise set: password auth + validations. JWT is hand-rolled via JwtAuth.
  devise :database_authenticatable, :registerable, :validatable

  # When a user is deleted, also delete their cart
  has_one :cart, dependent: :destroy
  has_many :orders, dependent: :nullify  # Preserve orders when user is deactivated

  # Returns the user's cart, creating it on first access
  def cart!
    cart || create_cart
  end

  # Soft delete - deactivate account instead of destroying
  def deactivate!
    update(active: false)
  end

  # API-friendly JSON with only the fields the frontend needs
  def as_json(options = {})
    super(options.merge(
      only: [ :id, :email, :admin, :active, :first_name, :last_name,
             :date_of_birth, :gender, :street, :city, :zip, :country ]
    ))
  end
end
