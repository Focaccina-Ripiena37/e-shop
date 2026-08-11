class Api::Admin::TagsController < ApplicationController
  before_action :authenticate_user!
  before_action :require_admin!
  before_action :set_tag, only: [ :destroy ]

  # POST /api/admin/tags
  def create
    tag = Tag.new(tag_params)

    if tag.save
      render json: tag, status: :created
    else
      render_errors(tag)
    end
  end

  # DELETE /api/admin/tags/:id
  def destroy
    @tag.destroy
    head :no_content
  end

  private

  def set_tag
    @tag = Tag.find(params[:id])
  end

  def tag_params
    params.require(:tag).permit(:name)
  end
end
