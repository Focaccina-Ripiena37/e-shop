# Handles signup, returns a JWT if created, otherwise validation errors.
class Api::RegistrationsController < ApplicationController
  wrap_parameters false

  # POST /api/signup
  def create
    user = User.new(sign_up_params)

    if user.save
      render json: {
        user: user,
        token: JwtAuth.encode(user)
      }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(
      :email, :password, :password_confirmation,
      :first_name, :last_name, :date_of_birth, :gender,
      :street, :city, :zip, :country
    )
  end
end
