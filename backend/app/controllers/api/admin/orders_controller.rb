class Api::Admin::OrdersController < ApplicationController
  before_action :authenticate_user!
  before_action :require_admin!
  before_action :set_order, only: [ :update ]

  # GET /api/admin/orders
  def index
    orders = Order.includes(:billing_address, :user, order_items: :product).order(created_at: :desc)
    render json: orders.as_json(
      include: {
        billing_address: {},
        user: { only: [ :id, :email, :active ] },
        order_items: {
          include: :product
        }
      }
    )
  end

  # PUT /api/admin/orders/:id
  def update
    if @order.update(order_params)
      render json: @order
    else
      render_errors(@order)
    end
  end

  private

  def set_order
    @order = Order.find(params[:id])
  end

  def order_params
    params.require(:order).permit(:status)
  end
end
