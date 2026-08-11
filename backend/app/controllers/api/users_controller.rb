class Api::UsersController < ApplicationController
  before_action :authenticate_user!

  # GET /api/users/me - Get current user profile
  def me
    render json: current_user
  end

  # PATCH /api/users/me - Update current user profile
  def update
    if current_user.update(user_params)
      render json: current_user
    else
      render_errors(current_user)
    end
  end

  # DELETE /api/users/me - Deactivate current user account (soft delete)
  def destroy
    if current_user.deactivate!
      render json: { message: "Account successfully deactivated" }, status: :ok
    else
      render_errors(current_user)
    end
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :date_of_birth, :gender, :street, :city, :zip, :country)
  end
end
