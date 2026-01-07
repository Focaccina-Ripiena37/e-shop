# Inherits from Devise, uses JSON format, returns user data on login and confirms on logout.
class Api::SessionsController < Devise::SessionsController
  respond_to :json
  
  def create
    user = User.find_by(email: sign_in_params[:email])
    
    if user && user.valid_password?(sign_in_params[:password])
      # Generate JWT token directly
      payload = { user_id: user.id, exp: 24.hours.from_now.to_i }
      token = JWT.encode(payload, Rails.application.credentials.secret_key_base)
      
      render json: { 
        message: 'Logged in successfully',
        user: user.as_json(
          only: [:id, :email, :admin, :active, :first_name, :last_name,
                 :date_of_birth, :gender, :street, :city, :zip, :country]
        ),
        token: token
      }, status: :ok
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  private
  
  def sign_in_params
    params.require(:user).permit(:email, :password)
  end
  
  def respond_with(resource, _opts = {})
    render json: { user: resource }, status: :ok
  end
  
  def respond_to_on_destroy
    head :no_content
  end
end