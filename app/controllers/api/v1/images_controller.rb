module Api
    module V1
        class ImagesController < ApplicationController
            def image_compressor
                @compressor = MiniMagick::Images::CompressorService.new(image_params[:file])
                result = @compressor.compress(image_params[:options])
                render json: { data: result }, status: :ok
            rescue StandardError => e
                render json: { error: e.message }, status: :unprocessable_entity
            end

            def image_translator
                options = image_params[:options]
                file = image_params[:file]

                if file.blank?
                  render json: { error: 'File Not Present' }, status: :unprocessable_entity
                  return
                end

                begin
                  @temp_file = MiniMagick::Images::PreprocessorService.new(file).process
                  extracted_text = GoogleCloud::ExtractTextService.new(@temp_file).extract_text
                  translated_text = GoogleCloud::TranslateService.new.translate_text(extracted_text, options)
                  result = ConvertTxtService.new(translated_text).convert

                  if result[:success]
                    send_file(
                      result[:file_path],
                      filename: result[:filename],
                      type: result[:content_type],
                      disposition: 'attachment'
                    )
                  else
                    render json: { error: result[:error] }, status: :unprocessable_entity
                  end
                rescue StandardError => e
                  logger.error("Image translation failed: #{e.message}")
                  render json: { error: e.message }, status: :unprocessable_entity
                end
            end

            def convert_to_svg
              image = params[:image]
              conversion_type = params[:type]

              unless image.content_type.start_with?('image/')
                render json: { error: 'Invalid file type' }, status: :unprocessable_entity
                return
              end

              service = ImageToSvgService.new(image)
              begin
                svg_data = if conversion_type == 'vector'
                              service.vectorize_image
                else
                              service.image_based_svg
                end

                send_data svg_data, type: 'image/svg+xml', disposition: 'attachment'
              rescue => e
                render json: { error: e.message }, status: :unprocessable_entity
              end
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
