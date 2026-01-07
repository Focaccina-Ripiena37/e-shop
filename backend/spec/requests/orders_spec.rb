require 'rails_helper'

RSpec.describe 'Orders API', type: :request do
  let(:user) { User.create!(email: 'test@test.com', password: 'password123') }
  let(:token) { JWT.encode({ user_id: user.id, exp: 24.hours.from_now.to_i }, Rails.application.credentials.secret_key_base) }
  let(:headers) { { 'Authorization' => "Bearer #{token}" } }

  describe 'POST /api/orders' do
    let(:cart) { user.create_cart }
    let(:product) { Product.create!(title: 'Test', price: 10.0) }
    
    before do
      cart.cart_items.create!(product: product, quantity: 2, unit_price: 10.0)
    end

    it 'creates an order from cart' do
      order_params = {
        order: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@test.com',
          street: 'Via Roma 1',
          city: 'Milano',
          zip: '20100',
          payment_method: 'credit_card',
          card_brand: 'Visa',
          card_last4: '1234',
          shipping_type: 'standard',
          shipping_cost: 3.99
        }
      }

      post '/api/orders', params: order_params, headers: headers

      expect(response).to have_http_status(:created)
      expect(cart.reload.cart_items).to be_empty
    end
  end
end