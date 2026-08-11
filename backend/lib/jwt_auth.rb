# Centralized JWT signing/verification used by the hand-rolled API auth flow.
# Secret resolution keeps dev/prod simple: env var first, Rails credentials as fallback.
module JwtAuth
  EXPIRATION = 24.hours

  def self.secret
    ENV.fetch("JWT_SECRET_KEY", nil) ||
      Rails.application.credentials.jwt_secret_key ||
      Rails.application.credentials.secret_key_base
  end

  def self.encode(user)
    payload = {
      user_id: user.id,
      jti: SecureRandom.uuid,
      exp: EXPIRATION.from_now.to_i
    }
    JWT.encode(payload, secret, "HS256")
  end

  def self.decode(token)
    JWT.decode(token, secret, true, algorithm: "HS256").first
  end
end
