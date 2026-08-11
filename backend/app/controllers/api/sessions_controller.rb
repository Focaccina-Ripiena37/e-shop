# Hand-rolled JWT login/logout for the JSON API (Devise is used for password hashing).
class Api::SessionsController < ApplicationController
  # POST /api/login
  def create
    user = User.find_by(email: sign_in_params[:email])

    if user && user.valid_password?(sign_in_params[:password])
      unless user.active?
        return render json: { error: "Account is deactivated" }, status: :forbidden
      end

      render json: {
        message: "Logged in successfully",
        user: user,
        token: JwtAuth.encode(user)
      }, status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  # DELETE /api/logout - revokes the current token
  def destroy
    token = request.headers["Authorization"]&.split(" ")&.last

    payload = begin
      JwtAuth.decode(token)
    rescue JWT::DecodeError
      nil
    end

    if payload
      JwtDenylist.find_or_create_by!(jti: payload["jti"]) do |entry|
        entry.exp = Time.at(payload["exp"])
      end
    end

    head :no_content
  end

  private

  def sign_in_params
    params.require(:user).permit(:email, :password)
  end
end
