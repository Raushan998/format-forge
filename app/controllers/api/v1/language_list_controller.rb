module Api
  module V1
    class LanguageListController < ApplicationController
        def index
            if params[:lang] == 'output'
                render json: {language_list: Constants::LanguageConstants::GOOGLE_LANGUAGE_CODES }, status: :ok
            else
                render json: {error: "undefined params."}, status: :unprocessable_entity
            end
        end
    end
  end
end