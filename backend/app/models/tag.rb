class Tag < ApplicationRecord
  has_many :product_tags, dependent: :destroy
  has_many :products, through: :product_tags

  validates :name, presence: true, uniqueness: true

  def as_json(options = {})
    {
      "id" => id.to_s,
      "name" => name
    }
  end
end
