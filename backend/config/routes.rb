Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  # API routes
  namespace :api do
    resources :products, only: [:index, :show]
    resources :categories, only: [:index]
    resources :tags, only: [:index]
    resources :orders, only: [:index, :show, :create]

  # User profile
  get 'users/me', to: 'users#me'
  patch 'users/me', to: 'users#update'
  delete 'users/me', to: 'users#destroy'

  # Cart routes
  get 'cart', to: 'cart#show'
  post 'cart/items', to: 'cart#add_item'
  patch 'cart/items/:id', to: 'cart#update_item'
  delete 'cart/items/:id', to: 'cart#remove_item'

  # Auth routes
  devise_for :users, skip: [:all], path: '', path_names: {
    sign_in: 'login',
    sign_out: 'logout',
    registration: 'signup'
  },
  controllers: {
    sessions: 'api/sessions',
    registrations: 'api/registrations'
  }

  devise_scope :user do
    post 'login', to: 'sessions#create'
    delete 'logout', to: 'sessions#destroy'
    post 'signup', to: 'registrations#create'
  end

  # Admin routes
  namespace :admin do
    resources :products, only: [:index, :create, :update, :destroy] do
      member do
        post :restore
      end
    end
    resources :orders, only: [:index, :update]
    resources :tags, only: [:create, :destroy]
  end

  end
end
