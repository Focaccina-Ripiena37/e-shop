class Api::OrdersController < ApplicationController
  before_action :authenticate_user!

  def index
    orders = current_user.orders.includes(:billing_address, order_items: :product).order(created_at: :desc)
    render json: orders.as_json(
      include: {
        billing_address: {},
        order_items: {
          include: :product
        }
      }
    )
  end

  def show
    order = current_user.orders.includes(:billing_address, order_items: :product).find(params[:id])
    render json: order.as_json(
      include: {
        billing_address: {},
        order_items: {
          include: :product
        }
      }
    )
  end

  def create
    cart = current_user.cart!

    if cart.cart_items.empty?
      return render json: { error: "Cart is empty" }, status: :unprocessable_entity
    end

    order = current_user.orders.new(order_params)
    order.total = cart.subtotal + order.shipping_cost
    order.status = "pending"

    ActiveRecord::Base.transaction do
      order.save!

      cart.cart_items.each do |cart_item|
        order.order_items.create!(
          product: cart_item.product,
          quantity: cart_item.quantity,
          unit_price: cart_item.unit_price
        )
      end

      cart.cart_items.destroy_all
    end

    render json: order, status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors }, status: :unprocessable_entity
  end

  private

  def order_params
    params.require(:order).permit(
      :first_name, :last_name, :email, :street, :city, :zip,
      :payment_method, :card_brand, :card_last4,
      :shipping_type, :shipping_cost,
      billing_address_attributes: [ :full_name, :street, :city, :zip, :country, :vat_number ]
    )
  end
end
