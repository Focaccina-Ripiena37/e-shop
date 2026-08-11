class Api::CartController < ApplicationController
  before_action :authenticate_user!

  # Handle common errors (record not found, failed validations, etc.)
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity

  # GET /api/cart
  def show
    cart = current_user.cart!

    render json: {
      cart: cart,
      items: cart.cart_items.includes(:product).map do |item|
        {
          id: item.id,
          product: item.product,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.quantity * item.unit_price
        }
      end,
      total: cart.subtotal
    }
  end

  # POST /api/cart/items
  def add_item
    cart = current_user.cart!
    product = Product.find(params[:product_id])

    # Check if product already in cart
    cart_item = cart.cart_items.find_by(product_id: product.id)

    if cart_item
      cart_item.update!(quantity: cart_item.quantity + quantity_param)
    else
      cart.cart_items.create!(product: product, quantity: quantity_param, unit_price: product.price)
    end

    render json: { message: "Product added to cart", cart_item: cart_item }, status: :created
  end

  # PATCH /api/cart/items/:id
  def update_item
    cart_item = current_user.cart!.cart_items.find(params[:id])
    cart_item.update!(quantity: quantity_param)

    render json: { message: "Cart item updated", cart_item: cart_item }
  end

  # DELETE /api/cart/items/:id
  def remove_item
    cart_item = current_user.cart!.cart_items.find(params[:id])
    cart_item.destroy!

    render json: { message: "Cart item removed" }
  end

  private

  def quantity_param
    params[:quantity].to_i
  end

  def not_found(exception)
    render json: { error: exception.message }, status: :not_found
  end

  def unprocessable_entity(exception)
    render json: { error: exception.message }, status: :unprocessable_entity
  end
end
