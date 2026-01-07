class Category < ApplicationRecord
  has_many :products

  validates :name, presence: true, uniqueness: true

  def as_json(options = {})
    {
      'id' => id.to_s,
      'name' => name
    }
  end
end
