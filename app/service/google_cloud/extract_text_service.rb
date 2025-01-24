require 'json'
require 'google/cloud/vision'

module GoogleCloud
  class ExtractTextService
    attr_reader :file_path, :vision

    def initialize(file)
      @file_path = file
      setup_google_credentials
      @vision = ::Google::Cloud::Vision.image_annotator
    end

    def extract_text
      begin
        response = @vision.text_detection(image: @file_path)

        text_annotation = response.responses.first&.text_annotations&.first
        text_annotation ? text_annotation.description : nil
      rescue StandardError => e
        Rails.logger.error("Error Extracting: #{e.message}")
        raise e
      end
    end

    private

    def setup_google_credentials
        credentials = ENV['GOOGLE_CLOUD_CREDENTIALS']
        ENV['GOOGLE_APPLICATION_CREDENTIALS'] = credentials
    end
  end
end
