module Api
    module V1
        class ImagesController < ApplicationController
            skip_before_action :verify_authenticity_token, only: [:image_translator]
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
                begin
                  raise ArgumentError, "File Not Present" if file.blank?
                  @temp_file = MiniMagick::Images::PreprocessorService.new(file).process
                  extracted_text = Tesseract::OcrProcessorService.new(@temp_file).extract_text(options)
                  translated_text = GoogleCloud::TranslateService.new.translate_text(extracted_text, options)
                  render json: {text: translated_text}, status: :ok
                  result = Puppeteer::TextToPdfService.new(translated_text).convert
                  if result[:success]
                    send_file(
                      result[:pdf_path],
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
