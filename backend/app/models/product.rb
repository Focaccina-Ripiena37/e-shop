class Product < ApplicationRecord
  belongs_to :category, optional: true
  has_many :product_tags, dependent: :destroy
  has_many :tags, through: :product_tags
  has_many :cart_items
  has_many :order_items

  validates :title, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :original_price, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true

  serialize :images, coder: JSON

  # Soft delete: show only non-deleted products
  default_scope { where(deleted_at: nil) }
  
  # Scope to include deleted products (for admin/history)
  scope :with_deleted, -> { unscope(where: :deleted_at) }
  scope :only_deleted, -> { unscope(where: :deleted_at).where.not(deleted_at: nil) }

  # Override destroy for soft delete
  def destroy
    update(deleted_at: Time.current)
  end

  # Restore deleted product
  def restore
    update(deleted_at: nil)
  end

  # Check if product is deleted
  def deleted?
    deleted_at.present?
  end

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
      'deletedAt' => deleted_at&.iso8601,
      'categoryId' => category_id&.to_s,
      'category' => category&.as_json,
      'tags' => tags.map(&:as_json)
    }
  end
end
