class Api::TagsController < ApplicationController
  # GET /api/tags
  def index
    @tags = Tag.order(:name)
    render json: @tags
  end
end
