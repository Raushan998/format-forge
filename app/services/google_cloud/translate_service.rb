require "google/cloud/translate/v2"
module GoogleCloud
    class TranslateService
        def initialize
            @translate_api = ::Google::Cloud::Translate::V2.new(key: api_key)
        end
        def translate_text(text, options = {})
            lang_code = options.to_h.symbolize_keys[:target_lang]
            result = @translate_api.translate(text, to: lang_code)
            result
        end

        private
        def api_key
            ENV['GOOGLE_CLOUD_TRANSLATE_API_KEY']
        end
    end
end
