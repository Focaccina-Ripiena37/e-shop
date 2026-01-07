# Handles signup, returns user if created successfully, otherwise returns validation errors.
class Api::RegistrationsController < Devise::RegistrationsController
  respond_to :json
  wrap_parameters false

  # Override create to avoid session-based sign_in
  def create
    user = User.new(sign_up_params)
    
    if user.save
      payload = { user_id: user.id, exp: 24.hours.from_now.to_i }
      token = JWT.encode(payload, Rails.application.credentials.secret_key_base)

      render json: {
        user: user.as_json(
          only: [:id, :email, :admin, :active, :first_name, :last_name,
                 :date_of_birth, :gender, :street, :city, :zip, :country]
        ),
        token: token
      }, status: :created
    else
      Rails.logger.error "User validation errors: #{user.errors.full_messages.join(', ')}"
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  # Extract signup params from the request
  def sign_up_params
    params.require(:user).permit(
      :email, :password, :password_confirmation,
      :first_name, :last_name, :date_of_birth, :gender,
      :street, :city, :zip, :country
    )
  end
end