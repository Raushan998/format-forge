module Tesseract
    class OcrProcessorService
        def initialize(image)
            @image = image.path.to_s
        end

        def extract_text(options={})
           lang_code= options.to_h.symbolize_keys[:current_lang]
           text = ::RTesseract.new(@image, lang: lang_code).to_s
           text
        rescue StandardError => e
            Rails.logger.error e.message
            raise e
        end
    end
end