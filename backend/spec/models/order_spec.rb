require 'rails_helper'

RSpec.describe Order, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:first_name) }
    it { should validate_presence_of(:last_name) }
    it { should validate_presence_of(:email) }
    it { should validate_inclusion_of(:status).in_array(Order::STATUSES) }
    it { should validate_numericality_of(:total).is_greater_than(0) }
    
    it 'validates email format' do
      order = Order.new(email: 'invalid-email')
      expect(order).not_to be_valid
      expect(order.errors[:email]).to include('is invalid')
    end

    it 'validates zip format (5 digits)' do
      order = Order.new(zip: '123')
      expect(order).not_to be_valid
      expect(order.errors[:zip]).to include('must be 5 digits')
    end
  end
end