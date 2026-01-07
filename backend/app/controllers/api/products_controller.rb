class Api::ProductsController < ApplicationController
  # GET /api/products
  # Optional filters: ?category_id=X&tag_ids[]=1&tag_ids[]=2
  def index
    @products = Product.includes(:category, :tags).order(created_at: :desc)

    # Filter by category
    if params[:category_id].present?
      @products = @products.where(category_id: params[:category_id])
    end

    # Filter by tags (products that have ANY of the specified tags)
    if params[:tag_ids].present?
      @products = @products.joins(:tags).where(tags: { id: params[:tag_ids] }).distinct
    end

    render json: @products
  end

  # GET /api/products/:id
  def show
    @product = Product.includes(:category, :tags).find(params[:id])
    render json: @product
  end
end
