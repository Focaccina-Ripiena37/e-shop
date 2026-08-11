class ApplicationController < ActionController::API
  # Simple JWT-based authentication for API controllers: reads the Authorization
  # header, decodes the token, and sets current_user. Revoked and inactive
  # accounts are rejected regardless of token validity.
  def authenticate_user!
    header = request.headers["Authorization"]
    token = header.split(" ").last if header

    payload = begin
      JwtAuth.decode(token)
    rescue JWT::DecodeError
      nil
    end

    user = payload && User.find_by(id: payload["user_id"])

    if user.nil? || !user.active? || JwtDenylist.denylisted?(payload["jti"])
      render json: { error: "Unauthorized" }, status: :unauthorized
      return
    end

    @current_user = user
  end

  # Accessor for the authenticated user
  def current_user
    @current_user
  end

  # Verify admin user
  def require_admin!
    return if current_user&.admin?

    render json: { error: "Access denied. Admin privileges required." }, status: :forbidden
  end

  # Shared render for failed record validations
  def render_errors(record, status = :unprocessable_entity)
    render json: { errors: record.errors.full_messages }, status: status
  end
end
