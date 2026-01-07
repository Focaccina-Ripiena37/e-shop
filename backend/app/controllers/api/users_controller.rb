class Api::UsersController < ApplicationController
  before_action :authenticate_user!

  # GET /api/users/me - Get current user profile
  def me
    render json: current_user.as_json(
      only: [:id, :email, :first_name, :last_name, :date_of_birth, :gender, :street, :city, :zip, :country, :admin]
    )
  end

  # PATCH /api/users/me - Update current user profile
  def update
    if current_user.update(user_params)
      render json: current_user.as_json(
        only: [:id, :email, :first_name, :last_name, :date_of_birth, :gender, :street, :city, :zip, :country, :admin]
      )
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/users/me - Deactivate current user account (soft delete)
  def destroy
    if current_user.deactivate!
      render json: { message: 'Account successfully deactivated' }, status: :ok
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :date_of_birth, :gender, :street, :city, :zip, :country)
  end
end
