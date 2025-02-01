# app/services/pdf_compressor_service.rb

require 'tempfile'

class PdfCompressorService
  class CompressionError < StandardError; end

  def initialize(input_file, percentage)
    @input_file = input_file.path
    @percentage = percentage.to_i.clamp(1, 100)
    @original_size = File.size(@input_file)
    @target_size = (@original_size * (@percentage / 100.0)).to_i
  end

  def compress
    validate_inputs(@input_file, @percentage)

    begin
      doc = HexaPDF::Document.open(@input_file)

      compression_options.each do |key, value|
        doc.config[key] = value
      end

      tempfile = Tempfile.new(['compressed', '.pdf'])
      doc.write(tempfile.path)
      
      self.class.validate_output(tempfile.path)
      new_size = File.size(tempfile.path)

      if new_size > @target_size
        tempfile.close!
        return compress_with_ghostscript(@input_file)
      end

      tempfile.rewind
      tempfile
    rescue => e
      raise CompressionError, "PDF compression failed: #{e.message}"
    end
  end

  private

  def validate_inputs(input_path, percentage)
    raise ArgumentError, "Percentage must be between 1-100" unless (1..100).cover?(percentage)
    raise ArgumentError, "Input file not found" unless File.exist?(input_path)
  end

  def compression_options
    quality = calculate_quality(@percentage)

    {
      'image.jpeg.quality' => quality,
      'image.optimize' => true,
      'image.downsample' => true,
      'image.resample' => true,
      'image.max_resolution' => calculate_max_resolution(@percentage),
      'compress.pages' => true,
      'compress.streams' => true,
      'compress.objects' => true,
      'compress.cross_reference_streams' => true,
      'font.subset' => true,
      'optimize' => true
    }
  end

  def calculate_quality(percentage)
    case percentage
    when 1..20 then 30 
    when 21..50 then 50
    else 80 
    end
  end

  def calculate_max_resolution(percentage)
    case percentage
    when 1..20 then [50, 50]  
    when 21..50 then [100, 100] 
    else [150, 150] 
    end
  end

  def compress_with_ghostscript(input_file)
    tempfile = Tempfile.new(['compressed', '.pdf'])
    
    command = [
      'gs', '-sDEVICE=pdfwrite',
      '-dCompatibilityLevel=1.4',
      "-dPDFSETTINGS=#{ghostscript_quality_setting}",
      '-dNOPAUSE', '-dQUIET', '-dBATCH',
      "-sOutputFile=#{tempfile.path}",
      input_file
    ].join(' ')

    success = system(command)

    if success && File.exist?(tempfile.path)
      tempfile.rewind
      tempfile
    else
      tempfile.close!
      raise CompressionError, "Ghostscript compression failed"
    end
  end

  def ghostscript_quality_setting
    case @percentage
    when 1..20 then '/screen'
    when 21..50 then '/ebook'  
    else '/printer'
    end
  end

  def self.validate_output(output_path)
    raise "Output file not created" unless File.exist?(output_path)
    raise "Output file is empty" if File.zero?(output_path)

    begin
      HexaPDF::Document.open(output_path)
    rescue
      raise "Output file is not a valid PDF"
    end
  end
end