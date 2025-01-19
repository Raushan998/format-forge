module Api
    module V1
        class ImagesController < ApplicationController
            skip_before_action :verify_authenticity_token, only: [:image_compressor]
            def image_compressor
                @compressor = MiniMagick::Images::CompressorService.new(image_params[:file])
                result = @compressor.compress(image_params[:options])
                render json: { data: result }, status: :ok
            rescue StandardError => e
                render json: { error: e.message }, status: :unprocessable_entity
            end

            private
            def image_params
                params.require(:image).permit(
                    :file,
                    options: {}
                )
            end
        end
    end
end
