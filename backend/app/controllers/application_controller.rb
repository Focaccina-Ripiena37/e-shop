class ApplicationController < ActionController::API
  # Simple JWT-based authentication method for API controllers: checks for Authorization header, decodes token, sets current_user.
  def authenticate_user!
    header = request.headers['Authorization']
    token = header.split(' ').last if header
    
    begin
      decoded = JWT.decode(token, Rails.application.credentials.secret_key_base).first
      @current_user = User.find(decoded['user_id'])
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      render json: { error: 'Unauthorized' }, status: :unauthorized
      return
    end
  end
  
  # Accessor for current_user
  def current_user
    @current_user
  end

  # Verify admin user
  def require_admin!
    return if current_user&.admin?

    render json: { error: 'Access denied. Admin privileges required.' }, status: :forbidden
    return
  end
end