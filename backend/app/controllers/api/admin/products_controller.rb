class Api::Admin::ProductsController < ApplicationController
  before_action :authenticate_user!
  before_action :require_admin!
  before_action :set_product, only: [:update, :destroy, :restore]

  # GET /api/admin/products (include soft-deleted)
  def index
    products = Product.with_deleted.includes(:category, :tags).order(created_at: :desc)
    render json: products
  end

  # POST /api/admin/products
  def create
    product = Product.new(product_params)

    if product.save
      render json: product, status: :created
    else
      render json: { errors: product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT /api/admin/products/:id
  def update
    if @product.update(product_params)
      render json: @product
    else
      render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/admin/products/:id (Soft delete)
  def destroy
    if @product.destroy
      render json: { message: 'Product soft deleted successfully' }, status: :ok
    else
      render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # POST /api/admin/products/:id/restore
  def restore
    if @product.restore
      render json: @product, status: :ok
    else
      render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_product
    # Include prodotti soft-deleted per operazioni admin
    @product = Product.with_deleted.find(params[:id])
  end

  # Accept camelCase keys coming from the Angular app and normalize them
  def product_params
    permitted = params.require(:product).permit(
      :title,
      :description,
      :price,
      :originalPrice,
      :sale,
      :thumbnail,
      :createdAt,
      :category_id,
      :categoryId,
      images: [],
      tag_ids: []
    )

    # Convert camelCase to snake_case
    permitted[:original_price] = permitted.delete(:originalPrice) if permitted.key?(:originalPrice)
    permitted[:created_at] = permitted.delete(:createdAt) if permitted.key?(:createdAt)
    permitted[:category_id] = permitted.delete(:categoryId) if permitted.key?(:categoryId)
    permitted[:images] ||= []
    permitted[:tag_ids] ||= []
    permitted
  end
end