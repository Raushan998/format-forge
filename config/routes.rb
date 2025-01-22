Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  root 'converter#index', constraints: ->(request) { !request.xhr? && request.format.html? }
  get '*path', to: 'converter#index', constraints: ->(request) { !request.xhr? && request.format.html? }

  # POST route for conversion
  post '/convert', to: 'converter#convert', as: :convert

  # API namespace routes
  namespace :api do
    namespace :v1 do
      resources :language_list, only: [:index]
      resources :images do
        collection do
          put :image_compressor
          post :image_translator
        end
      end
    end
  end
end
