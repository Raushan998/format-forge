module MiniMagick
  module Images
    class PreprocessorService
      attr_reader :image_path

      def initialize(image_path)
        @image_path = image_path
      end

      def process
        temp_file = Tempfile.new(['preprocessed', '.tiff'])
        begin
          image = ::MiniMagick::Image.open(@image_path)
          
          image.combine_options do |cmd|
            cmd.colorspace 'Gray' 
            cmd.threshold '50%'
            cmd.density '300' 
          end

          image.write temp_file.path
          temp_file
        rescue StandardError => e
          temp_file.close!
          raise "Image preprocessing failed: #{e.message}"
        end
      end
    end
  end
end