class Api::CategoriesController < ApplicationController
  # GET /api/categories
  def index
    @categories = Category.order(:name)
    render json: @categories
  end
end
