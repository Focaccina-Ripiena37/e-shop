class Product < ApplicationRecord
  belongs_to :category, optional: true
  has_many :product_tags, dependent: :destroy
  has_many :tags, through: :product_tags

  validates :title, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :original_price, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true

  serialize :images, coder: JSON

  # Override as_json for Angular-compatible format
  def as_json(options = {})
    {
      'id' => id.to_s,
      'title' => title,
      'description' => description,
      'price' => price,
      'originalPrice' => original_price,
      'sale' => sale,
      'thumbnail' => thumbnail,
      'images' => images || [],
      'createdAt' => created_at&.iso8601,
      'categoryId' => category_id&.to_s,
      'category' => category&.as_json,
      'tags' => tags.map(&:as_json)
    }
  end
end
