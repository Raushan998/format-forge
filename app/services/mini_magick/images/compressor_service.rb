module MiniMagick
    module Images
        class CompressorService
            def initialize(image)
                @image = ::MiniMagick::Image.open(image)
                @original_size = File.size(image)
            end

            def compress(data = {})
                data = data.to_h.symbolize_keys
                
                options = {
                    format: data[:format],
                    quality: data[:quality].to_i,
                    resize_percentage: data[:resize_percentage].to_i
                }

                @image.strip if options[:strip_metadata]

                if options[:resize_percentage] < 100
                    new_width = (@image.width * options[:resize_percentage] / 100.0).to_i
                    new_height = (@image.height * options[:resize_percentage] / 100.0).to_i
                    @image.resize "#{new_width}x#{new_height}"
                end

                @image.format options[:format]
                @image.colors options[:colors] if options[:colors]

                case options[:format].downcase
                when 'jpg', 'jpeg'
                    @image.quality options[:quality]
                    @image.sampling_factor options[:sampling_factor] if options[:sampling_factor]
                    @image.interlace 'Plane'
                when 'png'
                    @image.quality options[:quality]
                when 'webp'
                    @image.quality options[:quality]
                end

                processed_blob = nil
                Tempfile.create(['processed', ".#{options[:format]}"]) do |tempfile|
                    begin
                        @image.write(tempfile.path)
                        processed_blob = File.read(tempfile.path)
                    rescue => e
                        raise "Processing error: #{e.message}"
                    end
                end

                final_size = processed_blob.size
                {
                    image_data: Base64.strict_encode64(processed_blob),
                    content_type: "image/#{options[:format]}",
                    original_size: format_size(@original_size),
                    compressed_size: format_size(final_size),
                    dimensions: "#{@image.width}x#{@image.height}",
                    format: options[:format],
                    quality: options[:quality]
                }
            end

            def dimensions
                [@image.width, @image.height]
            end

            def format_size(bytes)
                return '0 Bytes' if bytes <= 0
                
                units = ['Bytes', 'KB', 'MB', 'GB', 'TB']
                index = (Math.log(bytes) / Math.log(1024)).to_i
                index = units.size - 1 if index >= units.size # Cap to the largest unit
                size_in_unit = bytes.to_f / (1024**index)
                "#{size_in_unit.round(2)} #{units[index]}"
            end  
        end
    end
end
