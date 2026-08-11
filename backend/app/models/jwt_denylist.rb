class JwtDenylist < ApplicationRecord
  validates :jti, presence: true, uniqueness: true

  # True when a JWT identifier was revoked via logout
  def self.denylisted?(jti)
    exists?(jti: jti)
  end
end
