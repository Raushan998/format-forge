require 'mini_magick'
require 'base64'
require 'tempfile'

class ImageToSvgService
  attr_reader :image
  MAX_WIDTH = 800  # Maximum width in pixels

  def initialize(image)
    @image = image
  end

  def vectorize_image
    unless system('which potrace > /dev/null 2>&1')
      raise RuntimeError, "Potrace is not installed. Please install potrace first."
    end

    temp_image = Tempfile.new(['input', '.pnm'])
    temp_svg = Tempfile.new(['output', '.svg'])

    begin
      temp_image.binmode
      temp_image.write(image.read)
      temp_image.rewind

      # Process and resize image
      image = MiniMagick::Image.open(temp_image.path)
      resize_image!(image)
      
      image.format 'pnm'
      image.colorspace 'Gray'
      image.write(temp_image.path)

      command = "potrace #{temp_image.path} -s -o #{temp_svg.path} " \
                "--turdsize 2 --alphamax 1 --opttolerance 0.2"

      success = system(command)
      unless success
        raise RuntimeError, "Potrace command failed: #{command}"
      end

      svg_data = File.read(temp_svg.path)
      svg_data
    ensure
      temp_image.close
      temp_image.unlink
      temp_svg.close
      temp_svg.unlink
    end
  end

  def image_based_svg
    processed_image = MiniMagick::Image.read(@image.read)
    resize_image!(processed_image)
    
    base64_image = Base64.strict_encode64(processed_image.to_blob)

    # Create responsive SVG wrapper with embedded image
    svg = <<~SVG.strip
      <?xml version="1.0" encoding="UTF-8" standalone="no"?>
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
           width="100%" height="auto" 
           viewBox="0 0 #{processed_image.width} #{processed_image.height}"
           preserveAspectRatio="xMidYMid meet">
        <image width="100%" height="100%" 
               xlink:href="data:image/#{processed_image.type.downcase};base64,#{base64_image}"/>
      </svg>
    SVG

    svg
  end

  private

  def resize_image!(image)
    original_width = image[:width].to_i
    original_height = image[:height].to_i

    if original_width > MAX_WIDTH
      # Calculate new height maintaining aspect ratio
      new_height = (MAX_WIDTH.to_f / original_width * original_height).to_i
      image.resize "#{MAX_WIDTH}x#{new_height}"
    end

    # Optimize image
    image.strip # Remove metadata
    image.quality '85' # Slightly compress without significant quality loss
  end
end