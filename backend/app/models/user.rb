class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist
  
  # When a user is deleted, also delete their cart
  has_one :cart, dependent: :destroy
  has_many :orders, dependent: :nullify  # Preserve orders when user is deactivated

  # Scope to filter only active users
  scope :active, -> { where(active: true) }

  # Override active_for_authentication to prevent inactive users from logging in
  def active_for_authentication?
    super && active?
  end

  # Custom message for inactive users
  def inactive_message
    active? ? super : :account_deactivated
  end

  # Soft delete - deactivate account instead of destroying
  def deactivate!
    update(active: false)
  end
end
